import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Search, Plus, Edit, Trash2, X } from 'lucide-react';
import ProjectDropdown from '../components/ProjectDropdown';

interface Worker {
  _id?: string;
  name: string;
  role: string;
  projectId?: string | { _id: string; name: string } | null;
  project: string | { _id: string; name: string } | null;
  hourlyRate: number;
}

interface Project {
  _id: string;
  name: string;
}

export default function Labour() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState(() => localStorage.getItem('selectedProjectId') || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // Role from localStorage
  const [userRole, setUserRole] = useState<string>(() => {
    return localStorage.getItem('userRole') || 'user';
  });

  const [form, setForm] = useState<Worker>({
    name: '',
    role: '',
    projectId: '',
    project: '',
    hourlyRate: 0,
  });

  const fetchData = async () => {
    try {
      const [workersRes, projectsRes] = await Promise.all([
        axios.get('/api/labour', {
          withCredentials: true,
          params: selectedProjectId ? { projectId: selectedProjectId } : {},
        }),
        axios.get('/api/projects', { withCredentials: true }),
      ]);
      setWorkers(workersRes.data);
      setProjects(projectsRes.data);
    } catch (err) {
      Swal.fire('Error', 'Failed to load data', 'error');
    }
  };

  useEffect(() => {
    fetchData();
    // Listen for role changes across tabs
    const handleStorageChange = () => {
      setUserRole(localStorage.getItem('userRole') || 'user');
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [selectedProjectId]);

  const handleProjectFilterChange = (projectId: string) => {
    setSelectedProjectId(projectId);
    localStorage.setItem('selectedProjectId', projectId);
  };

  const getProjectNameForWorker = (worker: Worker): string => {
    if (worker.projectId && typeof worker.projectId === 'object') return worker.projectId.name;
    if (!worker.project && !worker.projectId) return '';
    if (typeof worker.project === 'object') return worker.project.name;
    const found = projects.find(p => p._id === (worker.projectId || worker.project));
    return found ? found.name : '';
  };

  const filteredWorkers = workers.filter(worker => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const projectName = getProjectNameForWorker(worker);
    return (
      worker.name.toLowerCase().includes(term) ||
      worker.role.toLowerCase().includes(term) ||
      projectName.toLowerCase().includes(term)
    );
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, entriesPerPage]);

  const totalEntries = filteredWorkers.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedWorkers = filteredWorkers.slice(startIndex, startIndex + entriesPerPage);

  const resetForm = () => {
    setForm({ name: '', role: '', projectId: selectedProjectId, project: selectedProjectId, hourlyRate: 0 });
    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (worker: Worker) => {
    const projectId = typeof worker.project === 'object' && worker.project !== null
      ? worker.project._id
      : typeof worker.projectId === 'object' && worker.projectId !== null
        ? worker.projectId._id
        : worker.projectId || worker.project || '';
    setForm({
      name: worker.name,
      role: worker.role || '',
      projectId,
      project: projectId,
      hourlyRate: worker.hourlyRate || 0,
    });
    setEditingId(worker._id || null);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      Swal.fire('Validation Error', 'Name is required', 'warning');
      return;
    }
    if (!form.projectId && !form.project) {
      Swal.fire('Validation Error', 'Project is required', 'warning');
      return;
    }
    try {
      if (editingId) {
        await axios.put(`/api/labour/${editingId}`, { ...form, projectId: form.projectId || form.project }, { withCredentials: true });
        Swal.fire('Success', 'Worker updated', 'success');
      } else {
        await axios.post('/api/labour', { ...form, projectId: form.projectId || form.project }, { withCredentials: true });
        Swal.fire('Success', 'Worker added', 'success');
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (err: any) {
      Swal.fire('Error', err.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: 'Delete worker?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete',
    });
    if (confirm.isConfirmed) {
      try {
        await axios.delete(`/api/labour/${id}`, { withCredentials: true });
        Swal.fire('Deleted', 'Worker has been removed', 'success');
        fetchData();
      } catch (err: any) {
        Swal.fire('Error', err.response?.data?.message || 'Delete failed', 'error');
      }
    }
  };

  const getProjectName = (worker: Worker): string => {
    if (worker.projectId && typeof worker.projectId === 'object') return worker.projectId.name;
    if (!worker.project && !worker.projectId) return '-';
    if (typeof worker.project === 'object') return worker.project.name;
    const found = projects.find(p => p._id === (worker.projectId || worker.project));
    return found ? found.name : 'Unknown';
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Labour Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage workers and their assignments</p>
          </div>
          {userRole === 'admin' && (
            <button
              onClick={openAddModal}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition w-full sm:w-auto"
            >
              <Plus size={18} /> Add Worker
            </button>
          )}
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="whitespace-nowrap">Show</span>
              <select
                className="border rounded px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="whitespace-nowrap">entries</span>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search worker..."
                className="w-full border rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="p-4 border-b border-gray-200 bg-white">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Project</label>
            <ProjectDropdown value={selectedProjectId} onChange={handleProjectFilterChange} />
          </div>

          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full table-auto text-sm border-collapse">
                  <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b border-gray-200 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left">Name</th>
                      <th className="px-4 sm:px-6 py-3 text-left">Role</th>
                      <th className="px-4 sm:px-6 py-3 text-left">Project</th>
                      <th className="px-4 sm:px-6 py-3 text-left">Hourly Rate (₹)</th>
                      {userRole === 'admin' && <th className="px-4 sm:px-6 py-3 text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedWorkers.length === 0 ? (
                      <tr>
                        <td colSpan={userRole === 'admin' ? 5 : 4} className="text-center py-16 text-gray-400">
                          No workers found.
                        </td>
                      </tr>
                    ) : (
                      paginatedWorkers.map((worker) => (
                        <tr key={worker._id} className="hover:bg-gray-50 transition">
                          <td className="px-4 sm:px-6 py-3 font-medium text-gray-900">{worker.name}</td>
                          <td className="px-4 sm:px-6 py-3 text-gray-600">{worker.role || '-'}</td>
                          <td className="px-4 sm:px-6 py-3 text-gray-600">{getProjectName(worker)}</td>
                          <td className="px-4 sm:px-6 py-3 text-gray-600 font-medium">
                            ₹{worker.hourlyRate?.toFixed(2) || '0.00'}
                          </td>
                          {userRole === 'admin' && (
                            <td className="px-4 sm:px-6 py-3 text-right whitespace-nowrap">
                              <button
                                onClick={() => openEditModal(worker)}
                                className="text-blue-600 hover:text-blue-800 mr-2 transition"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(worker._id!)}
                                className="text-red-600 hover:text-red-800 transition"
                              >
                                <Trash2 size={16} />
                              </button>
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
              <div>
                Showing {startIndex + 1} to {Math.min(startIndex + entriesPerPage, totalEntries)} of {totalEntries} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="border px-2 py-1 rounded disabled:opacity-50 bg-white hover:bg-gray-100 transition"
                >
                  ‹
                </button>
                <span className="px-3 py-1 bg-blue-600 text-white rounded">{currentPage}</span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="border px-2 py-1 rounded disabled:opacity-50 bg-white hover:bg-gray-100 transition"
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                {editingId ? 'Edit Worker' : 'Add New Worker'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    placeholder="Enter worker name"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                  <input
                    type="text"
                    placeholder="e.g., Mason, Carpenter"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Project *</label>
                  <ProjectDropdown
                    value={(form.projectId || form.project || '') as string}
                    onChange={(projectId) => setForm({ ...form, projectId, project: projectId })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hourly Rate (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={form.hourlyRate}
                    onChange={(e) => setForm({ ...form, hourlyRate: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition order-2 sm:order-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition order-1 sm:order-2"
                  >
                    {editingId ? 'Update Worker' : 'Save Worker'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
