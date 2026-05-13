import { useEffect, useState } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';
import { Plus, X, Package, Hash, Edit, Trash2 } from 'lucide-react';
import ProjectDropdown from '../components/ProjectDropdown';

interface MaterialEntry {
  Date: string;
  'Supplier Name': string;
  Quantity: number;
  Amount: number;
  projectId?: string;
  projectName?: string;
  _id: string;
}

interface MaterialSummary {
  name: string;
  totalRecords: number;
}

export default function Materials() {
  const [materialSummaries, setMaterialSummaries] = useState<MaterialSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New material modal state
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [newMaterialName, setNewMaterialName] = useState('');
  const [submittingMaterial, setSubmittingMaterial] = useState(false);

  // Edit material modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<MaterialSummary | null>(null);
  const [editMaterialName, setEditMaterialName] = useState('');
  const [submittingEdit, setSubmittingEdit] = useState(false);

  // Add record modal state
  const [showAddRecordModal, setShowAddRecordModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialSummary | null>(null);
  const [submittingRecord, setSubmittingRecord] = useState(false);
  const [recordForm, setRecordForm] = useState({
    projectId: '',
    Date: new Date().toISOString().split('T')[0],
    supplierName: '',
    quantity: '',
    rate: '',
    remarks: '',
  });

  // Fetch materials
  const fetchMaterials = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<Record<string, MaterialEntry[]>>('/api/materials');
      const data = res.data;

      const summaries: MaterialSummary[] = Object.entries(data).map(([name, entries]) => {
        const realEntries = entries.filter((e) => e['Supplier Name'] !== 'Initial Stock');
        return {
          name,
          totalRecords: realEntries.length,
        };
      });
      summaries.sort((a, b) => a.name.localeCompare(b.name));
      setMaterialSummaries(summaries);
    } catch (err: any) {
      console.error('Failed to load materials:', err);
      setError(err?.response?.data?.message || 'Unable to load materials.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // Add new material category
  const handleAddMaterial = async () => {
    const trimmedName = newMaterialName.trim();
    if (!trimmedName) {
      Swal.fire('Validation Error', 'Material name is required', 'warning');
      return;
    }

    let projectId = localStorage.getItem('selectedProjectId');
    if (!projectId) {
      try {
        const projectsRes = await api.get('/api/projects');
        const projects = projectsRes.data;
        if (projects.length === 0) {
          Swal.fire('No Project', 'Please create a project first.', 'warning');
          return;
        }
        projectId = projects[0]._id;
        localStorage.setItem('selectedProjectId', projectId);
      } catch (err) {
        Swal.fire('Error', 'Could not fetch projects.', 'error');
        return;
      }
    }

    setSubmittingMaterial(true);
    try {
      await api.post(
        '/api/materials',
        {
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
        }
      );
      Swal.fire('Success', `Material "${trimmedName}" added.`, 'success');
      setShowAddMaterialModal(false);
      setNewMaterialName('');
      fetchMaterials();
    } catch (err: any) {
      Swal.fire('Error', err.response?.data?.message || 'Failed to add material', 'error');
    } finally {
      setSubmittingMaterial(false);
    }
  };

  // Edit material
  const openEditModal = (material: MaterialSummary) => {
    setEditingMaterial(material);
    setEditMaterialName(material.name);
    setShowEditModal(true);
  };

  const handleEditMaterial = async () => {
    const newName = editMaterialName.trim();
    if (!newName) {
      Swal.fire('Validation Error', 'Material name cannot be empty', 'warning');
      return;
    }
    if (newName === editingMaterial?.name) {
      Swal.fire('Info', 'Name unchanged', 'info');
      setShowEditModal(false);
      return;
    }

    setSubmittingEdit(true);
    try {
      await api.put(
        `/api/materials/material/${encodeURIComponent(editingMaterial!.name)}`,
        { newName }
      );
      Swal.fire('Success', 'Material renamed', 'success');
      setShowEditModal(false);
      fetchMaterials();
    } catch (err: any) {
      Swal.fire('Error', err.response?.data?.message || 'Rename failed', 'error');
    } finally {
      setSubmittingEdit(false);
    }
  };

  // Delete material
  const handleDeleteMaterial = async (material: MaterialSummary) => {
    const confirm = await Swal.fire({
      title: `Delete "${material.name}"?`,
      text: 'This will delete ALL records for this material. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete',
    });
    if (!confirm.isConfirmed) return;

    try {
      await api.delete(`/api/materials/material/${encodeURIComponent(material.name)}`);
      Swal.fire('Deleted', `Material "${material.name}" removed.`, 'success');
      fetchMaterials();
    } catch (err: any) {
      Swal.fire('Error', err.response?.data?.message || 'Delete failed', 'error');
    }
  };

  // Add record for material
  const openAddRecordModal = (material: MaterialSummary) => {
    setSelectedMaterial(material);
    setRecordForm({
      projectId: localStorage.getItem('selectedProjectId') || '',
      Date: new Date().toISOString().split('T')[0],
      supplierName: '',
      quantity: '',
      rate: '',
      remarks: '',
    });
    setShowAddRecordModal(true);
  };

  const handleAddRecord = async () => {
    const quantity = Number(recordForm.quantity);
    const rate = Number(recordForm.rate);

    if (!recordForm.projectId) {
      Swal.fire('Validation Error', 'Project name is required', 'warning');
      return;
    }
    if (!recordForm.Date || !recordForm.supplierName.trim() || quantity <= 0 || rate <= 0) {
      Swal.fire('Validation Error', 'Please fill all required fields correctly', 'warning');
      return;
    }

    setSubmittingRecord(true);
    try {
      await api.post(
        '/api/materials',
        {
          materialName: selectedMaterial!.name,
          projectId: recordForm.projectId,
          entry: {
            projectId: recordForm.projectId,
            Date: recordForm.Date,
            'Supplier Name': recordForm.supplierName.trim(),
            Quantity: quantity,
            Rate: rate,
            Amount: quantity * rate,
            Remarks: recordForm.remarks.trim(),
          },
        }
      );
      Swal.fire('Success', 'Record added successfully', 'success');
      setShowAddRecordModal(false);
      fetchMaterials();
    } catch (err: any) {
      Swal.fire('Error', err.response?.data?.message || 'Failed to add record', 'error');
    } finally {
      setSubmittingRecord(false);
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
        <button onClick={fetchMaterials} className="mt-4 bg-red-600 text-white px-4 py-2 rounded">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Materials</h1>
        <button
          onClick={() => setShowAddMaterialModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm"
        >
          <Plus size={18} />
          New Material
        </button>
      </div>

      {/* Material Cards Grid */}
      {materialSummaries.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No materials found</p>
          <p className="text-gray-400 text-sm mt-1">Click "New Material" to create one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {materialSummaries.map((material) => (
            <div
              key={material.name}
              className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition p-5 flex flex-col"
            >
              {/* Material name and icons row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Package size={20} className="text-blue-500" />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-lg truncate">
                    {material.name}
                  </h3>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={() => openEditModal(material)}
                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Edit material"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteMaterial(material)}
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete material"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Total Records */}
              <div className="flex items-center justify-between text-sm mb-4">
                <span className="text-gray-500 flex items-center gap-1">
                  <Hash size={14} /> Total Records
                </span>
                <span className="font-medium text-gray-700">{material.totalRecords}</span>
              </div>

              {/* Add Record Button */}
              <button
                onClick={() => openAddRecordModal(material)}
                className="mt-auto w-full flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-lg transition"
              >
                <Plus size={16} />
                Add Record
              </button>
            </div>
          ))}
        </div>
      )}

      {/* New Material Modal */}
      {showAddMaterialModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowAddMaterialModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold mb-4">New Material</h2>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Material Name *
              </label>
              <input
                type="text"
                value={newMaterialName}
                onChange={(e) => setNewMaterialName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddMaterial()}
                placeholder="e.g., Cement, Steel, Sand"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowAddMaterialModal(false)} className="border px-4 py-2 rounded-lg">
                Cancel
              </button>
              <button
                onClick={handleAddMaterial}
                disabled={submittingMaterial}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {submittingMaterial ? 'Adding...' : 'Add Material'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Material Modal */}
      {showEditModal && editingMaterial && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold mb-4">Edit Material</h2>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Material Name *
              </label>
              <input
                type="text"
                value={editMaterialName}
                onChange={(e) => setEditMaterialName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleEditMaterial()}
                placeholder="Material name"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowEditModal(false)} className="border px-4 py-2 rounded-lg">
                Cancel
              </button>
              <button
                onClick={handleEditMaterial}
                disabled={submittingEdit}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {submittingEdit ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Record Modal */}
      {showAddRecordModal && selectedMaterial && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setShowAddRecordModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold mb-4">Add Transaction for {selectedMaterial.name}</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Project Name *</label>
                <ProjectDropdown
                  value={recordForm.projectId}
                  onChange={(pid) => setRecordForm({ ...recordForm, projectId: pid })}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Date *</label>
                <input
                  type="date"
                  value={recordForm.Date}
                  onChange={(e) => setRecordForm({ ...recordForm, Date: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Supplier Name *</label>
                <input
                  type="text"
                  value={recordForm.supplierName}
                  onChange={(e) => setRecordForm({ ...recordForm, supplierName: e.target.value })}
                  placeholder="e.g., ABC Traders"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">Quantity *</label>
                  <input
                    type="number"
                    step="any"
                    value={recordForm.quantity}
                    onChange={(e) => setRecordForm({ ...recordForm, quantity: e.target.value })}
                    placeholder="e.g., 100"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">Rate (₹) *</label>
                  <input
                    type="number"
                    step="any"
                    value={recordForm.rate}
                    onChange={(e) => setRecordForm({ ...recordForm, rate: e.target.value })}
                    placeholder="e.g., 500"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Remarks</label>
                <textarea
                  rows={2}
                  value={recordForm.remarks}
                  onChange={(e) => setRecordForm({ ...recordForm, remarks: e.target.value })}
                  placeholder="Optional"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowAddRecordModal(false)} className="border px-4 py-2 rounded-lg">
                Cancel
              </button>
              <button
                onClick={handleAddRecord}
                disabled={submittingRecord}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {submittingRecord ? 'Adding...' : 'Add Record'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}