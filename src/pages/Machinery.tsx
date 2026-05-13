import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Search, Plus, Edit, Trash2, X } from 'lucide-react';
import ProjectDropdown from '../components/ProjectDropdown';

interface MachineryEntry {
  _id: string;
  projectId?: string | { _id: string; name: string };
  machineryName: string;
  date: string;
  challanNumber: string;
  vehicleNumber: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  remarks: string;
}

export default function Machinery() {
  const [entries, setEntries] = useState<MachineryEntry[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState(() => localStorage.getItem('selectedProjectId') || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [userRole, setUserRole] = useState<string>(
    () => localStorage.getItem('userRole') || 'user'
  );

  const [form, setForm] = useState({
    projectId: '',
    machineryName: '',
    date: new Date().toISOString().slice(0, 10),
    challanNumber: '',
    vehicleNumber: '',
    description: '',
    quantity: 1,
    rate: 0,
    remarks: '',
  });

  const fetchEntries = async () => {
    try {
      const res = await axios.get('/api/machinery', {
        withCredentials: true,
        params: selectedProjectId ? { projectId: selectedProjectId } : {},
      });
      setEntries(res.data);
    } catch (err) {
      Swal.fire('Error', 'Failed to load machinery entries', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();

    const handleStorageChange = () => {
      setUserRole(localStorage.getItem('userRole') || 'user');
    };

    window.addEventListener('storage', handleStorageChange);

    return () =>
      window.removeEventListener('storage', handleStorageChange);
  }, [selectedProjectId]);

  const handleProjectFilterChange = (projectId: string) => {
    setSelectedProjectId(projectId);
    localStorage.setItem('selectedProjectId', projectId);
  };

  const filteredEntries = entries.filter((e) => {
    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();

    return (
      e.machineryName.toLowerCase().includes(term) ||
      e.challanNumber.toLowerCase().includes(term) ||
      e.vehicleNumber.toLowerCase().includes(term)
    );
  });

  // Reset to first page when search or entries per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, entriesPerPage]);

  // Pagination calculations
  const totalEntries = filteredEntries.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedEntries = filteredEntries.slice(startIndex, startIndex + entriesPerPage);

  const resetForm = () => {
    setForm({
      projectId: selectedProjectId,
      machineryName: '',
      date: new Date().toISOString().slice(0, 10),
      challanNumber: '',
      vehicleNumber: '',
      description: '',
      quantity: 1,
      rate: 0,
      remarks: '',
    });

    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (entry: MachineryEntry) => {
    const projectId = typeof entry.projectId === 'object' && entry.projectId !== null
      ? entry.projectId._id
      : entry.projectId || selectedProjectId;
    setForm({
      projectId,
      machineryName: entry.machineryName,
      date: entry.date.slice(0, 10),
      challanNumber: entry.challanNumber,
      vehicleNumber: entry.vehicleNumber,
      description: entry.description,
      quantity: entry.quantity,
      rate: entry.rate,
      remarks: entry.remarks,
    });

    setEditingId(entry._id);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.machineryName.trim() ||
      !form.projectId ||
      !form.challanNumber.trim() ||
      !form.vehicleNumber.trim() ||
      form.quantity <= 0 ||
      form.rate <= 0
    ) {
      Swal.fire(
        'Validation Error',
        'Please fill all required fields correctly',
        'warning'
      );

      return;
    }

    try {
      if (editingId) {
        await axios.put(`/api/machinery/${editingId}`, form, {
          withCredentials: true,
        });

        Swal.fire('Success', 'Entry updated', 'success');
      } else {
        await axios.post('/api/machinery', form, {
          withCredentials: true,
        });

        Swal.fire('Success', 'Entry added', 'success');
      }

      setShowModal(false);
      resetForm();
      fetchEntries();
    } catch (err: any) {
      Swal.fire(
        'Error',
        err.response?.data?.message || 'Operation failed',
        'error'
      );
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: 'Delete entry?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete',
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`/api/machinery/${id}`, {
          withCredentials: true,
        });

        Swal.fire('Deleted', 'Entry removed', 'success');
        fetchEntries();
      } catch (err: any) {
        Swal.fire(
          'Error',
          err.response?.data?.message || 'Delete failed',
          'error'
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
              Machinery Usage Log
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Track every equipment entry with challan, vehicle, and cost details
            </p>
          </div>

          {userRole === 'admin' && (
            <button
              onClick={openAddModal}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition w-full sm:w-auto"
            >
              <Plus size={18} />
              Add Entry
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Show</span>

              <select
                className="border rounded px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>

              <span>entries</span>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />

              <input
                type="text"
                placeholder="Search machinery..."
                className="w-full border rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="max-h-[500px] overflow-y-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left">Machinery</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Challan</th>
                    <th className="px-4 py-3 text-left">Vehicle</th>
                    <th className="px-4 py-3 text-left">Description</th>
                    <th className="px-4 py-3 text-left">Qty</th>
                    <th className="px-4 py-3 text-left">Rate</th>
                    <th className="px-4 py-3 text-left">Amount</th>
                    <th className="px-4 py-3 text-left">Remarks</th>
                    {userRole === 'admin' && (
                      <th className="px-4 py-3 text-right">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedEntries.length === 0 ? (
                    <tr>
                      <td
                        colSpan={userRole === 'admin' ? 10 : 9}
                        className="text-center py-16 text-gray-400"
                      >
                        No entries found.
                      </td>
                    </tr>
                  ) : (
                    paginatedEntries.map((entry) => (
                      <tr key={entry._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium">{entry.machineryName}</td>
                        <td className="px-4 py-3">
                          {new Date(entry.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 font-mono">{entry.challanNumber}</td>
                        <td className="px-4 py-3 font-mono">{entry.vehicleNumber}</td>
                        <td className="px-4 py-3">{entry.description || '-'}</td>
                        <td className="px-4 py-3">{entry.quantity}</td>
                        <td className="px-4 py-3">₹{entry.rate.toFixed(2)}</td>
                        <td className="px-4 py-3 font-semibold">
                          ₹{entry.amount.toFixed(2)}
                        </td>
                        <td className="px-4 py-3">{entry.remarks || '-'}</td>
                        {userRole === 'admin' && (
                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            <button
                              onClick={() => openEditModal(entry)}
                              className="text-blue-600 hover:text-blue-800 mr-2 transition-colors"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(entry._id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
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

          {/* Pagination */}
          {totalEntries > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 border-t border-gray-200 text-sm text-gray-500 bg-gray-50">
              <div>
                Showing {startIndex + 1} to {Math.min(startIndex + entriesPerPage, totalEntries)} of {totalEntries} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="border px-2 py-1 rounded disabled:opacity-50 bg-white hover:bg-gray-100"
                >
                  ‹
                </button>
                <span className="px-3 py-1 bg-blue-600 text-white rounded">
                  {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="border px-2 py-1 rounded disabled:opacity-50 bg-white hover:bg-gray-100"
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>

            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {editingId ? 'Edit Entry' : 'Add New Entry'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                  <div className="sm:col-span-2 min-w-0">
                    <label className="block mb-2 font-medium">
                      Project *
                    </label>
                    <ProjectDropdown
                      value={form.projectId}
                      onChange={(projectId) => setForm({ ...form, projectId })}
                      required
                    />
                  </div>

                  <div className="min-w-0">
                    <label className="block mb-2 font-medium">
                      Machinery Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full min-w-0 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                      value={form.machineryName}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          machineryName: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="min-w-0">
                    <label className="block mb-2 font-medium">Date *</label>
                    <input
                      type="date"
                      required
                      className="w-full min-w-0 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                      value={form.date}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          date: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="min-w-0">
                    <label className="block mb-2 font-medium">
                      Challan Number *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={20}
                      className="w-full min-w-0 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                      value={form.challanNumber}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          challanNumber: e.target.value.toUpperCase(),
                        })
                      }
                    />
                  </div>

                  <div className="min-w-0">
                    <label className="block mb-2 font-medium">
                      Vehicle Number *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={20}
                      className="w-full min-w-0 border rounded-xl px-4 py-3 uppercase outline-none focus:ring-2 focus:ring-blue-500"
                      value={form.vehicleNumber}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          vehicleNumber: e.target.value.toUpperCase(),
                        })
                      }
                    />
                  </div>

                  <div className="sm:col-span-2 min-w-0">
                    <label className="block mb-2 font-medium">Description</label>
                    <input
                      type="text"
                      className="w-full min-w-0 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                      value={form.description}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="min-w-0">
                    <label className="block mb-2 font-medium">Quantity *</label>
                    <input
                      type="number"
                      step="any"
                      required
                      className="w-full min-w-0 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                      value={form.quantity}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          quantity: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  <div className="min-w-0">
                    <label className="block mb-2 font-medium">Rate (₹) *</label>
                    <input
                      type="number"
                      step="any"
                      required
                      className="w-full min-w-0 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                      value={form.rate}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          rate: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  <div className="sm:col-span-2 min-w-0">
                    <label className="block mb-2 font-medium">Remarks</label>
                    <textarea
                      rows={3}
                      className="w-full min-w-0 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      value={form.remarks}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          remarks: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    {editingId ? 'Update Entry' : 'Save Entry'}
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
