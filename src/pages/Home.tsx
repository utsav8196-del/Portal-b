import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid,
} from 'recharts';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Plus, X, Package } from 'lucide-react';

// TypeScript interfaces
interface Stats {
  totalProjects: number;
  totalWorkers: number;
  averageProgress: number;
  completedProjects?: number;
}

interface Project {
  _id: string;
  name: string;
  progress: number;
  createdAt?: string;
  description?: string;
}

interface MaterialEntry {
  Date: string;
  'Supplier Name': string;
  Quantity: number;
  Amount: number;
}

export default function Home() {
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    totalWorkers: 0,
    averageProgress: 0,
    completedProjects: 0,
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [materialName, setMaterialName] = useState('');
  const [materialSubmitting, setMaterialSubmitting] = useState(false);

  // Cement specific state
  const [cementQuantity, setCementQuantity] = useState<number>(0);
  const [cementLoading, setCementLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, projectsRes, materialsRes] = await Promise.all([
          axios.get('/api/stats', { withCredentials: true }),
          axios.get('/api/projects', { withCredentials: true }),
          axios.get('/api/materials', { withCredentials: true }),
        ]);

        const projectsData = Array.isArray(projectsRes.data) ? projectsRes.data : [];
        setProjects(projectsData);

        const completedCount = projectsData.filter((p: Project) => p.progress === 100).length;
        setStats({
          ...statsRes.data,
          completedProjects: completedCount,
        });

        // Process materials to get cement quantity only
        const materialsData = materialsRes.data as Record<string, MaterialEntry[]>;
        // Find cement entries (case‑insensitive)
        const cementEntries = Object.entries(materialsData).find(
          ([name]) => name.toLowerCase() === 'cement'
        );
        if (cementEntries) {
          const entries = cementEntries[1];
          // Exclude "Initial Stock" entries
          const realEntries = entries.filter(e => e['Supplier Name'] !== 'Initial Stock');
          const totalQuantity = realEntries.reduce((sum, e) => sum + (e.Quantity || 0), 0);
          setCementQuantity(totalQuantity);
        } else {
          setCementQuantity(0);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setError('Unable to load dashboard. Please refresh the page or try again later.');
      } finally {
        setLoading(false);
        setCementLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddMaterial = async () => {
    const trimmedName = materialName.trim();
    if (!trimmedName) {
      Swal.fire('Validation Error', 'Material name is required', 'warning');
      return;
    }
    const projectId = localStorage.getItem('selectedProjectId') || projects[0]?._id || '';
    if (!projectId) {
      Swal.fire('Validation Error', 'Please create a project first', 'warning');
      return;
    }

    setMaterialSubmitting(true);
    try {
      await axios.post('/api/materials', {
        materialName: trimmedName,
        projectId,
        entry: {
          projectId,
          Date: new Date().toISOString().split('T')[0],
          'Supplier Name': 'Initial Stock',
          Quantity: 0,
          Rate: 0,
          Amount: 0,
          Remarks: 'Initial material creation',
        },
      }, { withCredentials: true });

      localStorage.setItem('selectedProjectId', projectId);
      window.dispatchEvent(new Event('storage'));
      setShowAddMaterialModal(false);
      setMaterialName('');
      Swal.fire('Success', 'Material added successfully', 'success');
      
      // Refresh cement quantity after adding material
      setCementLoading(true);
      const materialsRes = await axios.get('/api/materials', { withCredentials: true });
      const materialsData = materialsRes.data as Record<string, MaterialEntry[]>;
      const cementEntries = Object.entries(materialsData).find(
        ([name]) => name.toLowerCase() === 'cement'
      );
      if (cementEntries) {
        const entries = cementEntries[1];
        const realEntries = entries.filter(e => e['Supplier Name'] !== 'Initial Stock');
        const totalQuantity = realEntries.reduce((sum, e) => sum + (e.Quantity || 0), 0);
        setCementQuantity(totalQuantity);
      } else {
        setCementQuantity(0);
      }
      setCementLoading(false);
    } catch (err: any) {
      Swal.fire('Error', err.response?.data?.message || 'Failed to add material', 'error');
      setCementLoading(false);
    } finally {
      setMaterialSubmitting(false);
    }
  };

  // Prepare chart data
  const chartData = projects
    .map((p) => ({ name: p.name, progress: p.progress }))
    .sort((a, b) => b.progress - a.progress);

  // Recent projects
  const recentProjects = [...projects]
    .sort((a, b) => (b.createdAt && a.createdAt ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() : 0))
    .slice(0, 5);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-blue-600">Progress: {payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 text-sm sm:text-base mt-1">Welcome back! Here's your project overview</p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddMaterialModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700 w-full sm:w-auto"
          >
            <Plus size={18} />
            Add Material
          </button>
        </div>
      </div>

      {/* Stats Grid - 4 cards (Average Progress replaced by Cement Unit) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Projects */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Projects</h3>
          <p className="text-2xl sm:text-3xl font-bold text-blue-600 mt-3">{stats.totalProjects}</p>
          <p className="text-xs text-gray-500 mt-2">All projects</p>
        </div>

        {/* Total Workers */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Workers</h3>
          <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-3">{stats.totalWorkers}</p>
          <p className="text-xs text-gray-500 mt-2">Labour count</p>
        </div>

        {/* Cement Unit (replaces Average Progress) */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Cement Unit</h3>
            <Package size={18} className="text-orange-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-orange-600 mt-3">
            {cementLoading ? '…' : cementQuantity.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-gray-500 mt-2">Total quantity (units)</p>
        </div>

        {/* Completed Projects */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Completed Projects</h3>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-600 mt-3">{stats.completedProjects}</p>
          <p className="text-xs text-gray-500 mt-2">100% done</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Project Progress Overview</h2>
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm sm:text-base">No projects yet. Create your first project to see progress.</p>
            <Link to="/projects" className="text-blue-600 hover:text-blue-700 text-sm sm:text-base font-medium mt-4 inline-block">
              Create your first project →
            </Link>
          </div>
        ) : (
          <div className="w-full h-80 sm:h-96 lg:h-96 overflow-x-auto">
            <ResponsiveContainer width="100%" height={chartData.length > 5 ? Math.max(400, chartData.length * 60) : 400}>
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 80, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="progress" fill="url(#gradient)" radius={[0, 8, 8, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.progress === 100 ? '#10b981' : '#3b82f6'}
                    />
                  ))}
                </Bar>
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#60a5fa" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Recent Projects Table */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-5">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">Recent Projects</h2>
          <Link to="/projects" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all →
          </Link>
        </div>
        {recentProjects.length === 0 ? (
          <p className="text-gray-500 text-center py-8 text-sm sm:text-base">No projects to display yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-3 sm:px-4 font-semibold text-gray-700">SR. NO.</th>
                  <th className="text-left py-3 px-3 sm:px-4 font-semibold text-gray-700">Project Name</th>
                  <th className="text-left py-3 px-3 sm:px-4 font-semibold text-gray-700 hidden sm:table-cell">Progress</th>
                  <th className="text-left py-3 px-3 sm:px-4 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentProjects.map((project, index) => (
                  <tr key={project._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-3 sm:px-4 font-medium text-gray-500">{index + 1}</td>
                    <td className="py-4 px-3 sm:px-4 font-medium text-gray-900">
                      <div className="truncate">{project.name}</div>
                    </td>
                    <td className="py-4 px-3 sm:px-4 hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 min-w-fit">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-3 sm:px-4">
                      {project.progress === 100 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          Completed
                        </span>
                      ) : project.progress > 0 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          In Progress
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                          Not Started
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Material Modal */}
      {showAddMaterialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Add Material</h2>
              <button
                type="button"
                onClick={() => setShowAddMaterialModal(false)}
                className="rounded p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Material Name *</label>
                <input
                  type="text"
                  value={materialName}
                  onChange={(event) => setMaterialName(event.target.value)}
                  onKeyDown={(event) => event.key === 'Enter' && handleAddMaterial()}
                  placeholder="e.g., Cement, Steel, Sand"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddMaterialModal(false)}
                className="rounded-lg border px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddMaterial}
                disabled={materialSubmitting}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {materialSubmitting ? 'Adding...' : 'Add Material'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}