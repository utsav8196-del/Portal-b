import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  Truck,
  IndianRupee,
  Hash,
  SortAsc,
  SortDesc,
  Plus,
  X,
} from 'lucide-react';
import Swal from 'sweetalert2';
import ProjectDropdown from '../components/ProjectDropdown';

export default function MachineryDetail() {
  const { name } = useParams();
  const decodedName = decodeURIComponent(name);

  const [allEntries, setAllEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('latest');
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // Form state
  const [recordForm, setRecordForm] = useState({
    projectId: '',
    date: new Date().toISOString().split('T')[0],
    challanNumber: '',
    vehicleNumber: '',
    description: '',
    quantity: '',
    rate: '',
    remarks: '',
  });

  const fetchMachineryEntries = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/machinery', { withCredentials: true });
      const filtered = res.data.filter((entry) => entry.machineryName === decodedName);
      setAllEntries(filtered);
    } catch (err) {
      console.error(err);
      setError('Failed to load machinery details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachineryEntries();
  }, [decodedName]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-IN');
  };

  const parseDate = (dateStr) => {
    if (!dateStr) return new Date(0);
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? new Date(0) : date;
  };

  // Sort entries
  const sortedEntries = useMemo(() => {
    const sorted = [...allEntries];
    sorted.sort((a, b) => {
      const timeA = parseDate(a.date).getTime();
      const timeB = parseDate(b.date).getTime();
      return sortOrder === 'latest' ? timeB - timeA : timeA - timeB;
    });
    return sorted;
  }, [allEntries, sortOrder]);

  // Pagination
  const totalEntries = sortedEntries.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedEntries = sortedEntries.slice(startIndex, startIndex + entriesPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [entriesPerPage]);

  // Summary
  const summary = useMemo(() => {
    const totalEntriesCount = sortedEntries.length;
    const totalQuantity = sortedEntries.reduce((sum, e) => sum + (Number(e.quantity) || 0), 0);
    const totalAmount = sortedEntries.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    return { totalEntries: totalEntriesCount, totalQuantity, totalAmount };
  }, [sortedEntries]);

  const resetForm = () => {
    setRecordForm({
      projectId: localStorage.getItem('selectedProjectId') || '',
      date: new Date().toISOString().split('T')[0],
      challanNumber: '',
      vehicleNumber: '',
      description: '',
      quantity: '',
      rate: '',
      remarks: '',
    });
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleAddRecord = async () => {
    const quantity = Number(recordForm.quantity);
    const rate = Number(recordForm.rate);

    if (!recordForm.projectId) {
      Swal.fire('Validation Error', 'Project name is required', 'warning');
      return;
    }
    if (!recordForm.date || !recordForm.challanNumber.trim() || !recordForm.vehicleNumber.trim()) {
      Swal.fire('Validation Error', 'Date, Challan Number and Vehicle Number are required', 'warning');
      return;
    }
    if (quantity <= 0 || rate <= 0) {
      Swal.fire('Validation Error', 'Quantity and Rate must be greater than zero', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(
        '/api/machinery',
        {
          projectId: recordForm.projectId,
          machineryName: decodedName,
          date: recordForm.date,
          challanNumber: recordForm.challanNumber.trim(),
          vehicleNumber: recordForm.vehicleNumber.trim(),
          description: recordForm.description.trim(),
          quantity,
          rate,
          remarks: recordForm.remarks.trim(),
        },
        { withCredentials: true }
      );
      Swal.fire('Success', 'Machinery record added successfully', 'success');
      setShowAddModal(false);
      fetchMachineryEntries();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Failed to add record', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">{error}</p>
        <Link to="/machinery" className="mt-4 inline-block text-blue-600 hover:underline">
          ← Back to Machinery
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/machinery" className="p-2 rounded-full hover:bg-gray-100 transition">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{decodedName}</h1>
            <p className="text-gray-600 text-sm mt-1">Machinery usage details</p>
          </div>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition"
        >
          <Plus size={18} />
          Add Record
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-500 uppercase">Total Entries</h3>
            <Hash size={18} className="text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">{summary.totalEntries}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-500 uppercase">Total Quantity</h3>
            <Truck size={18} className="text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-purple-600 mt-2">{summary.totalQuantity.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-500 uppercase">Total Amount</h3>
            <IndianRupee size={18} className="text-green-400" />
          </div>
          <p className="text-2xl font-bold text-green-600 mt-2">₹{summary.totalAmount.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Usage History Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Top bar with entries per page and result summary */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Show</span>
            <select
              className="border rounded px-3 py-1.5 bg-white"
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>
          <div className="text-sm text-gray-500">
            {totalEntries > 0 && (
              <>Showing {startIndex + 1} to {Math.min(startIndex + entriesPerPage, totalEntries)} of {totalEntries} results</>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          {paginatedEntries.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              No machinery entries found.
              <button onClick={openAddModal} className="ml-2 text-blue-600 underline">
                Add one now
              </button>
            </div>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-3">
                    <button
                      onClick={() => setSortOrder(sortOrder === 'latest' ? 'oldest' : 'latest')}
                      className="flex items-center gap-2 font-semibold hover:text-blue-600 transition"
                    >
                      Date
                      {sortOrder === 'latest' ? <SortDesc size={16} className="text-blue-600" /> : <SortAsc size={16} className="text-blue-600" />}
                    </button>
                  </th>
                  <th className="px-6 py-3">Project Name</th>
                  <th className="px-6 py-3">Challan No.</th>
                  <th className="px-6 py-3">Vehicle No.</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3">Qty</th>
                  <th className="px-6 py-3">Rate (₹)</th>
                  <th className="px-6 py-3">Amount (₹)</th>
                  <th className="px-6 py-3">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedEntries.map((entry) => {
                  const projectName =
                    typeof entry.projectId === 'object' && entry.projectId?.name
                      ? entry.projectId.name
                      : entry.projectId || '-';
                  return (
                    <tr key={entry._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3">{formatDate(entry.date)}</td>
                      <td className="px-6 py-3">{projectName}</td>
                      <td className="px-6 py-3">{entry.challanNumber}</td>
                      <td className="px-6 py-3">{entry.vehicleNumber}</td>
                      <td className="px-6 py-3">{entry.description || '-'}</td>
                      <td className="px-6 py-3">{entry.quantity}</td>
                      <td className="px-6 py-3">₹{Number(entry.rate || 0).toLocaleString('en-IN')}</td>
                      <td className="px-6 py-3 font-medium">₹{Number(entry.amount || 0).toLocaleString('en-IN')}</td>
                      <td className="px-6 py-3">{entry.remarks || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
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
              <span className="px-3 py-1 bg-blue-600 text-white rounded">{currentPage}</span>
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

      {/* Add Record Modal (unchanged) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Add Machinery Record</h2>
              <button onClick={() => setShowAddModal(false)} className="rounded p-2 text-gray-500 hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Project Name *</label>
                <ProjectDropdown value={recordForm.projectId} onChange={(pid) => setRecordForm({ ...recordForm, projectId: pid })} required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Date *</label>
                <input type="date" value={recordForm.date} onChange={(e) => setRecordForm({ ...recordForm, date: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2.5" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">Challan Number *</label>
                  <input type="text" value={recordForm.challanNumber} onChange={(e) => setRecordForm({ ...recordForm, challanNumber: e.target.value })} placeholder="e.g., CH-12345" className="w-full rounded-lg border border-gray-300 px-3 py-2.5" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">Vehicle Number *</label>
                  <input type="text" value={recordForm.vehicleNumber} onChange={(e) => setRecordForm({ ...recordForm, vehicleNumber: e.target.value })} placeholder="e.g., MH-01-AB-1234" className="w-full rounded-lg border border-gray-300 px-3 py-2.5" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Description</label>
                <input type="text" value={recordForm.description} onChange={(e) => setRecordForm({ ...recordForm, description: e.target.value })} placeholder="Optional details" className="w-full rounded-lg border border-gray-300 px-3 py-2.5" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">Quantity *</label>
                  <input type="number" step="any" value={recordForm.quantity} onChange={(e) => setRecordForm({ ...recordForm, quantity: e.target.value })} placeholder="e.g., 10" className="w-full rounded-lg border border-gray-300 px-3 py-2.5" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">Rate (₹) *</label>
                  <input type="number" step="any" value={recordForm.rate} onChange={(e) => setRecordForm({ ...recordForm, rate: e.target.value })} placeholder="e.g., 1500" className="w-full rounded-lg border border-gray-300 px-3 py-2.5" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Remarks</label>
                <textarea rows={2} value={recordForm.remarks} onChange={(e) => setRecordForm({ ...recordForm, remarks: e.target.value })} placeholder="Optional notes" className="w-full rounded-lg border border-gray-300 px-3 py-2.5" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowAddModal(false)} className="border px-4 py-2 rounded-lg">Cancel</button>
              <button onClick={handleAddRecord} disabled={submitting} className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50">
                {submitting ? 'Adding...' : 'Add Record'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}