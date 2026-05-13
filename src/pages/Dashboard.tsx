import { useEffect, useState } from "react";
import api from "../services/api";
import {
  Package,
  AlertCircle,
  FolderKanban,
  TrendingUp,
  CheckCircle2,
  IndianRupee,
  Layers,
} from "lucide-react";

interface Project {
  _id: string;
  name: string;
  progress: number;
}

interface MaterialEntry {
  Date: string;
  "Supplier Name": string;
  Quantity: number;
  Amount: number;
}

const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [materialSummaries, setMaterialSummaries] = useState<{ name: string; totalQuantity: number; totalAmount: number }[]>([]);
  const [materialsLoading, setMaterialsLoading] = useState(true);
  const [materialsError, setMaterialsError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch projects
    api.get("/api/projects")
      .then(res => setProjects(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setProjectsLoading(false));

    // Fetch materials
    api.get("/api/materials")
      .then(res => {
        const data = res.data; // should be grouped object: { "Sand": [...], ... }
        const summaries = Object.entries(data).map(([name, entries]: [string, any]) => {
          const realEntries = entries.filter((e: any) => e["Supplier Name"] !== "Initial Stock");
          const totalQuantity = realEntries.reduce((sum: number, e: any) => sum + (e.Quantity || 0), 0);
          const totalAmount = realEntries.reduce((sum: number, e: any) => sum + (e.Amount || 0), 0);
          return { name, totalQuantity, totalAmount };
        });
        summaries.sort((a, b) => a.name.localeCompare(b.name));
        setMaterialSummaries(summaries);
      })
      .catch(err => setMaterialsError(err?.response?.data?.message || err.message))
      .finally(() => setMaterialsLoading(false));
  }, []);

  const grandTotalQty = materialSummaries.reduce((s, m) => s + m.totalQuantity, 0);
  const grandTotalAmount = materialSummaries.reduce((s, m) => s + m.totalAmount, 0);
  const completedProjects = projects.filter(p => p.progress >= 100).length;
  const avgProgress = projects.length ? Math.round(projects.reduce((s, p) => s + (p.progress || 0), 0) / projects.length) : 0;

  // Helper for stat cards
  const StatCard = ({ label, value, sub, color, icon }: any) => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
        {icon}
      </div>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </div>
  );

  return (
    <div className="space-y-6 p-1">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back! Here's your project overview</p>
      </div>

      {/* Top 4 stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="TOTAL PROJECTS" value={projectsLoading ? "…" : projects.length} sub="All projects" color="text-blue-600" icon={<FolderKanban size={20} className="text-blue-400" />} />
        <StatCard label="TOTAL MATERIALS" value={materialsLoading ? "…" : materialSummaries.length} sub="Unique materials" color="text-emerald-600" icon={<Package size={20} className="text-emerald-400" />} />
        <StatCard label="AVERAGE PROGRESS" value={projectsLoading ? "…" : `${avgProgress}%`} sub="Completion rate" color="text-purple-600" icon={<TrendingUp size={20} className="text-purple-400" />} />
        <StatCard label="COMPLETED PROJECTS" value={projectsLoading ? "…" : completedProjects} sub="100% done" color="text-green-600" icon={<CheckCircle2 size={20} className="text-green-400" />} />
      </div>

      {/* TWO NEW CARDS – TOTAL QUANTITY & VALUE */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <StatCard 
          label="TOTAL MATERIAL QUANTITY" 
          value={materialsLoading ? "…" : grandTotalQty.toLocaleString("en-IN")} 
          sub="Units across all projects" 
          color="text-purple-600" 
          icon={<Layers size={20} className="text-purple-400" />} 
        />
        <StatCard 
          label="TOTAL MATERIAL VALUE" 
          value={materialsLoading ? "…" : `₹${grandTotalAmount.toLocaleString("en-IN")}`} 
          sub="Total spent on materials" 
          color="text-green-600" 
          icon={<IndianRupee size={20} className="text-green-400" />} 
        />
      </div>

      {/* DEBUG INFO – remove after it works */}
      <div className="bg-gray-100 p-2 text-xs rounded">
        Debug: materialsLoading={materialsLoading ? "true" : "false"} | summaries length={materialSummaries.length} | error={materialsError || "none"}
      </div>

      {/* Project progress list (optional) */}
      {!projectsLoading && projects.length > 0 && (
        <div className="bg-white rounded-xl border p-5">
          <h3 className="font-semibold mb-3">Projects</h3>
          {projects.map(p => (
            <div key={p._id} className="mb-2">
              <div className="flex justify-between text-sm">
                <span>{p.name}</span>
                <span>{p.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${p.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;