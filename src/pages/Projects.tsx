import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Search, Plus, Edit, Trash2, X, MapPin, Calendar } from 'lucide-react';

interface Project {
  _id: string;
  name: string;
  location: string;
  projectType: string;
  description: string;
  progress: number;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [userRole, setUserRole] = useState<string>(() => localStorage.getItem('userRole') || 'user');

  const [form, setForm] = useState({
    name: '', location: '', projectType: '', description: '', progress: 0, startDate: '', endDate: ''
  });

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/api/projects', { withCredentials: true });
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      Swal.fire('Error', 'Failed to load projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    const handleStorageChange = () => setUserRole(localStorage.getItem('userRole') || 'user');
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const filteredProjects = projects.filter((p) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return p.name.toLowerCase().includes(term) || p.location?.toLowerCase().includes(term) || p.projectType?.toLowerCase().includes(term);
  });

  useEffect(() => { setCurrentPage(1); }, [searchTerm, entriesPerPage]);

  const totalEntries = filteredProjects.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + entriesPerPage);

  const resetForm = () => {
    setForm({ name: '', location: '', projectType: '', description: '', progress: 0, startDate: '', endDate: '' });
    setEditingId(null);
  };

  const openAddModal = () => { resetForm(); setShowModal(true); };
  const openEditModal = (project: Project) => {
    setForm({
      name: project.name, location: project.location || '', projectType: project.projectType || '',
      description: project.description || '', progress: project.progress,
      startDate: project.startDate ? project.startDate.slice(0, 10) : '',
      endDate: project.endDate ? project.endDate.slice(0, 10) : ''
    });
    setEditingId(project._id);
    setShowModal(true);
  };

  const validateDates = (start: string, end: string): boolean => {
    if (!start || !end) return true;
    if (new Date(end) < new Date(start)) {
      Swal.fire('Invalid Dates', 'End date cannot be earlier than start date', 'warning');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { Swal.fire('Validation Error', 'Project name is required', 'warning'); return; }
    if (form.progress < 0 || form.progress > 100) { Swal.fire('Validation Error', 'Progress must be between 0 and 100', 'warning'); return; }
    if (!validateDates(form.startDate, form.endDate)) return;
    try {
      if (editingId) {
        await axios.put(`/api/projects/${editingId}`, form, { withCredentials: true });
        Swal.fire('Success', 'Project updated', 'success');
      } else {
        await axios.post('/api/projects', form, { withCredentials: true });
        Swal.fire('Success', 'Project created', 'success');
      }
      setShowModal(false);
      resetForm();
      fetchProjects();
    } catch (err: any) {
      Swal.fire('Error', err.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({ title: 'Delete project?', text: 'This action cannot be undone', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33' });
    if (confirm.isConfirmed) {
      try {
        await axios.delete(`/api/projects/${id}`, { withCredentials: true });
        Swal.fire('Deleted', 'Project removed', 'success');
        fetchProjects();
      } catch (err: any) {
        Swal.fire('Error', err.response?.data?.message || 'Delete failed', 'error');
      }
    }
  };

  const getStatusBadge = (progress: number) => {
    if (progress === 100) return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>Completed</span>;
    if (progress > 0) return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5 animate-pulse"></span>In Progress</span>;
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700"><span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1.5"></span>Not Started</span>;
  };

  const getProjectTypeBadge = (type?: string) => {
    if (!type) return <span className="text-gray-400 text-xs">—</span>;
    const lower = type.toLowerCase();
    if (lower.includes('residential')) return <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 rounded-full text-xs font-semibold border border-amber-200">{type}</span>;
    if (lower.includes('commercial')) return <span className="px-2.5 py-0.5 bg-blue-50 text-blue-800 rounded-full text-xs font-semibold border border-blue-200">{type}</span>;
    if (lower.includes('industrial')) return <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold border border-gray-300">{type}</span>;
    if (lower.includes('infrastructure')) return <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 rounded-full text-xs font-semibold border border-emerald-200">{type}</span>;
    if (lower.includes('renovation')) return <span className="px-2.5 py-0.5 bg-pink-50 text-pink-800 rounded-full text-xs font-semibold border border-pink-200">{type}</span>;
    return <span className="px-2.5 py-0.5 bg-gray-50 text-gray-700 rounded-full text-xs font-semibold border">{type}</span>;
  };

  const formatTimeline = (project: Project) => {
    const start = project.startDate ? new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
    const end = project.endDate ? new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
    return `${start} - ${end}`;
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div><h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Projects</h1><p className="text-sm text-gray-500 mt-1">Manage all construction projects</p></div>
          {userRole === 'admin' && (
            <button onClick={openAddModal} className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition w-full sm:w-auto">
              <Plus size={18} /> New Project
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Show</span>
              <select className="border rounded px-3 py-1.5 bg-white" value={entriesPerPage} onChange={(e) => setEntriesPerPage(Number(e.target.value))}>
                <option value={5}>5</option><option value={10}>10</option><option value={20}>20</option><option value={50}>50</option>
              </select>
              <span>entries</span>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="text" placeholder="Search project..." className="w-full border rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-blue-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full table-auto text-sm border-collapse">
                  <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b border-gray-200 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left">SR. NO.</th>
                      <th className="px-4 sm:px-6 py-3 text-left">Project Name</th>
                      <th className="px-4 sm:px-6 py-3 text-left">Location</th>
                      <th className="px-4 sm:px-6 py-3 text-left">Project Type</th>
                      <th className="px-4 sm:px-6 py-3 text-left">Timeline</th>
                      <th className="px-4 sm:px-6 py-3 text-left">Status</th>
                      {userRole === 'admin' && <th className="px-4 sm:px-6 py-3 text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedProjects.length === 0 ? (
                      <tr>
                        <td colSpan={userRole === 'admin' ? 7 : 6} className="text-center py-16 text-gray-400">
                          No projects found.
                        </td>
                      </tr>
                    ) : (
                      paginatedProjects.map((project, index) => (
                        <tr key={project._id} className="hover:bg-gray-50 transition">
                          <td className="px-4 sm:px-6 py-3 font-medium text-gray-500 whitespace-nowrap">
                            {startIndex + index + 1}
                          </td>
                          <td className="px-4 sm:px-6 py-3 font-medium text-gray-900">{project.name}</td>
                          <td className="px-4 sm:px-6 py-3">{project.location ? <span className="flex items-center gap-1"><MapPin size={12} />{project.location}</span> : '—'}</td>
                          <td className="px-4 sm:px-6 py-3">{getProjectTypeBadge(project.projectType)}</td>
                          <td className="px-4 sm:px-6 py-3"><span className="flex items-center gap-1"><Calendar size={12} />{formatTimeline(project)}</span></td>
                          <td className="px-4 sm:px-6 py-3">{getStatusBadge(project.progress)}</td>
                          {userRole === 'admin' && (
                            <td className="px-4 sm:px-6 py-3 text-right whitespace-nowrap">
                              <button onClick={() => openEditModal(project)} className="text-blue-600 hover:text-blue-800 mr-2"><Edit size={16} /></button>
                              <button onClick={() => handleDelete(project._id)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {totalEntries > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 border-t border-gray-200 text-sm text-gray-500 bg-gray-50">
              <div>Showing {startIndex + 1} to {Math.min(startIndex + entriesPerPage, totalEntries)} of {totalEntries} results</div>
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="border px-2 py-1 rounded disabled:opacity-50 bg-white hover:bg-gray-100">‹</button>
                <span className="px-3 py-1 bg-blue-600 text-white rounded">{currentPage}</span>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0} className="border px-2 py-1 rounded disabled:opacity-50 bg-white hover:bg-gray-100">›</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Project' : 'New Project'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label>Project Name *</label><input type="text" required className="w-full border rounded-lg px-3 py-2" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label>Location</label><input type="text" className="w-full border rounded-lg px-3 py-2" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} /></div>
                <div><label>Project Type</label><select className="w-full border rounded-lg px-3 py-2" value={form.projectType} onChange={e => setForm({ ...form, projectType: e.target.value })}>
                  <option value="">-- Select --</option><option>Residential</option><option>Commercial</option><option>Industrial</option><option>Infrastructure</option><option>Renovation</option><option>Other</option>
                </select></div>
              </div>
              <div><label>Description</label><textarea rows={3} className="w-full border rounded-lg px-3 py-2" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
              <div><label>Progress (%)</label><input type="number" min="0" max="100" className="w-full border rounded-lg px-3 py-2" value={form.progress} onChange={e => setForm({ ...form, progress: Number(e.target.value) })} /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label>Start Date</label><input type="date" className="w-full border rounded-lg px-3 py-2" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} /></div>
                <div><label>End Date</label><input type="date" className="w-full border rounded-lg px-3 py-2" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} /></div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="border px-4 py-2 rounded-lg">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">{editingId ? 'Update Project' : 'Create Project'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}