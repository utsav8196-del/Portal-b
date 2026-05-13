// import { Link, useLocation } from 'react-router-dom';
// import {
//   Home,
//   FolderKanban,
//   Package,
//   Users,
//   Truck,
//   Settings,
//   ChevronLeft
// } from 'lucide-react';

// export default function Sidebar({ isOpen, setIsOpen, collapsed, setCollapsed }) {
//   const location = useLocation();

//   const navItems = [
//     { name: 'Dashboard', path: '/', icon: Home },
//     { name: 'Projects', path: '/projects', icon: FolderKanban },
//     { name: 'Materials', path: '/materials', icon: Package },
//     { name: 'Labour', path: '/labour', icon: Users },
//     { name: 'Machinery', path: '/machinery', icon: Truck },
//     { name: 'Settings', path: '/settings', icon: Settings },
//   ];

//   return (
//     <>
//       {/* Overlay */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black/40 z-40 lg:hidden"
//           onClick={() => setIsOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <div
//         className={`
//           fixed inset-y-0 left-0 bg-white shadow-lg z-50
//           transition-all duration-300

//           ${collapsed ? 'w-20' : 'w-64'}

//           ${isOpen ? 'translate-x-0' : '-translate-x-full'}
//           lg:translate-x-0
//         `}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between p-4">
//           <h1 className="font-bold text-lg">Manager</h1>
//         </div>

//         {/* Nav */}
//         <nav className="p-2">
//           {navItems.map(item => (
//             <Link
//               key={item.path}
//               to={item.path}
//               onClick={() => setIsOpen(false)} // auto close on mobile
//               className={`
//                 flex items-center gap-3 p-3 rounded-lg mb-2 transition
//                 ${location.pathname === item.path
//                   ? 'bg-blue-100 text-blue-600'
//                   : 'hover:bg-gray-100'}
//               `}
//             >
//               <item.icon size={20} />
//               {!collapsed && <span>{item.name}</span>}
//             </Link>
//           ))}
//         </nav>
//       </div>
//     </>
//   );
// }


// import { Link, useLocation } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import Swal from 'sweetalert2';
// import ProjectDropdown from './ProjectDropdown';
// import {
//   Home,
//   FolderKanban,
//   Package,
//   Users,
//   Truck,
//   Settings,
//   ChevronDown,
//   Plus,
//   Eye,
//   Edit,
//   Trash2,
//   X
// } from 'lucide-react';

// export default function Sidebar({ isOpen, setIsOpen, collapsed, setCollapsed }) {
//   const location = useLocation();
//   const [materialsOpen, setMaterialsOpen] = useState(false);
//   const [materialNames, setMaterialNames] = useState([]);
//   const [viewMaterialName, setViewMaterialName] = useState('');
//   const [viewEntries, setViewEntries] = useState([]);
//   const [viewLoading, setViewLoading] = useState(false);
//   const [showAddRecord, setShowAddRecord] = useState(false);
//   const [recordSubmitting, setRecordSubmitting] = useState(false);
//   const [recordForm, setRecordForm] = useState({
//     projectId: '',
//     Date: new Date().toISOString().split('T')[0],
//     supplierName: '',
//     quantity: '',
//     rate: '',
//     remarks: '',
//   });
//   const [editMaterialName, setEditMaterialName] = useState('');
//   const [editMaterialValue, setEditMaterialValue] = useState('');
//   const [savingEdit, setSavingEdit] = useState(false);

//   const navItems = [
//     { name: 'Dashboard', path: '/', icon: Home },
//     { name: 'Projects', path: '/projects', icon: FolderKanban },
//     { name: 'Materials', path: '/materials', icon: Package },
//     { name: 'Labour', path: '/labour', icon: Users },
//     { name: 'Machinery', path: '/machinery', icon: Truck },
//     { name: 'Settings', path: '/settings', icon: Settings, className: 'bg-red-400 text-red-600' },
//   ];

//   const isActive = (path) => location.pathname === path;

//   const fetchMaterialNames = async () => {
//     try {
//       const res = await axios.get('/api/materials/names', {
//         withCredentials: true,
//       });
//       setMaterialNames(Array.isArray(res.data) ? res.data : []);
//     } catch (err) {
//       setMaterialNames([]);
//     }
//   };

//   useEffect(() => {
//     fetchMaterialNames();
//     window.addEventListener('storage', fetchMaterialNames);
//     return () => window.removeEventListener('storage', fetchMaterialNames);
//   }, [location.pathname, location.search]);

//   const getProjectParams = () => {
//     return {};
//   };

//   const handleViewMaterial = async (materialName) => {
//     setViewMaterialName(materialName);
//     setViewEntries([]);
//     setShowAddRecord(false);
//     setViewLoading(true);
//     try {
//       const res = await axios.get('/api/materials', {
//         withCredentials: true,
//         params: { ...getProjectParams(), materialName },
//       });
//       setViewEntries(res.data?.[materialName] || []);
//     } catch (err) {
//       Swal.fire('Error', 'Could not load material records', 'error');
//       setViewMaterialName('');
//     } finally {
//       setViewLoading(false);
//     }
//   };

//   const refreshViewedMaterial = async () => {
//     if (!viewMaterialName) return;
//     const res = await axios.get('/api/materials', {
//       withCredentials: true,
//       params: { ...getProjectParams(), materialName: viewMaterialName },
//     });
//     setViewEntries(res.data?.[viewMaterialName] || []);
//   };

//   const openAddRecord = () => {
//     setRecordForm({
//       projectId: localStorage.getItem('selectedProjectId') || '',
//       Date: new Date().toISOString().split('T')[0],
//       supplierName: '',
//       quantity: '',
//       rate: '',
//       remarks: '',
//     });
//     setShowAddRecord(true);
//   };

//   const handleAddRecord = async () => {
//     const quantity = Number(recordForm.quantity);
//     const rate = Number(recordForm.rate);
//     if (!recordForm.projectId) {
//       Swal.fire('Validation Error', 'Project name is required', 'warning');
//       return;
//     }
//     if (!recordForm.Date || !recordForm.supplierName.trim() || quantity <= 0 || rate <= 0) {
//       Swal.fire('Validation Error', 'Please fill all required fields correctly', 'warning');
//       return;
//     }

//     setRecordSubmitting(true);
//     try {
//       await axios.post('/api/materials', {
//         materialName: viewMaterialName,
//         projectId: recordForm.projectId,
//         entry: {
//           projectId: recordForm.projectId,
//           Date: recordForm.Date,
//           'Supplier Name': recordForm.supplierName.trim(),
//           Quantity: quantity,
//           Rate: rate,
//           Amount: quantity * rate,
//           Remarks: recordForm.remarks.trim(),
//         },
//       }, { withCredentials: true });
//       await refreshViewedMaterial();
//       await fetchMaterialNames();
//       setShowAddRecord(false);
//       Swal.fire('Success', 'Record added', 'success');
//     } catch (err) {
//       Swal.fire('Error', err.response?.data?.message || 'Failed to add record', 'error');
//     } finally {
//       setRecordSubmitting(false);
//     }
//   };

//   const openEditMaterial = (materialName) => {
//     setEditMaterialName(materialName);
//     setEditMaterialValue(materialName);
//   };

//   const handleSaveMaterialName = async () => {
//     const nextName = editMaterialValue.trim();
//     if (!nextName) {
//       Swal.fire('Validation Error', 'Material name is required', 'warning');
//       return;
//     }
//     setSavingEdit(true);
//     try {
//       await axios.put(
//         `/api/materials/material/${encodeURIComponent(editMaterialName)}`,
//         { newName: nextName, ...getProjectParams() },
//         { withCredentials: true }
//       );
//       setEditMaterialName('');
//       setEditMaterialValue('');
//       await fetchMaterialNames();
//       Swal.fire('Success', 'Material updated', 'success');
//     } catch (err) {
//       Swal.fire('Error', err.response?.data?.message || 'Update failed', 'error');
//     } finally {
//       setSavingEdit(false);
//     }
//   };

//   const handleDeleteMaterial = async (materialName) => {
//     const confirm = await Swal.fire({
//       title: `Delete "${materialName}"?`,
//       text: 'This will delete all records for this material.',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#d33',
//       confirmButtonText: 'Delete',
//     });
//     if (!confirm.isConfirmed) return;

//     try {
//       await axios.delete(`/api/materials/material/${encodeURIComponent(materialName)}`, {
//         withCredentials: true,
//         params: getProjectParams(),
//       });
//       await fetchMaterialNames();
//       if (viewMaterialName === materialName) {
//         setViewMaterialName('');
//         setViewEntries([]);
//       }
//       Swal.fire('Deleted', 'Material deleted', 'success');
//     } catch (err) {
//       Swal.fire('Error', err.response?.data?.message || 'Delete failed', 'error');
//     }
//   };

//   return (
//     <>
//       {/* Mobile Overlay */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
//           onClick={() => setIsOpen(false)}
//           role="presentation"
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`
//           fixed inset-y-0 left-0 bg-gradient-to-b from-gray-50 to-gray-100 shadow-xl z-50
//           transition-all duration-300 overflow-hidden

//           ${collapsed ? 'w-20' : 'w-64'}

//           ${isOpen ? 'translate-x-0' : '-translate-x-full'}
//           lg:translate-x-0
//         `}
//         role="navigation"
//         aria-label="Main navigation"
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
//           {!collapsed && (
//             <h1 className="font-bold text-lg text-gray-900">Portal</h1>
//           )}
//           <button
//             onClick={() => setIsOpen(false)}
//             className="lg:hidden p-1 rounded-md text-gray-500 hover:bg-gray-200 active:bg-gray-300 transition-colors"
//             aria-label="Close sidebar"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* Navigation */}
//         <nav className="p-2 space-y-1 h-[calc(100vh-80px)] overflow-y-auto">
//           {navItems.map(item => {
//             const active = isActive(item.path);
//             if (item.name === 'Materials') {
//               return (
//                 <div key={item.path}>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setMaterialsOpen((open) => !open);
//                     }}
//                     className={`
//                       w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group
//                       ${active
//                         ? 'bg-blue-600 text-white shadow-md'
//                         : 'text-gray-700 hover:bg-white active:bg-gray-200'
//                       }
//                     `}
//                     aria-expanded={materialsOpen}
//                   >
//                     <item.icon
//                       size={22}
//                       className={`flex-shrink-0 ${active ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`}
//                     />
//                     {!collapsed && (
//                       <>
//                         <span className="font-medium text-sm flex-1 text-left">{item.name}</span>
//                         <ChevronDown size={16} className={`transition-transform ${materialsOpen ? 'rotate-180' : ''}`} />
//                       </>
//                     )}
//                   </button>
//                   {!collapsed && materialsOpen && (
//                     <div className="ml-8 mt-1 mb-2 space-y-1">
//                       {materialNames.length === 0 ? (
//                         <div className="px-3 py-2 text-xs text-gray-400">No materials</div>
//                       ) : (
//                         materialNames.map((name) => (
//                           <div
//                             key={name}
//                             className="flex items-center gap-1 rounded-md px-2 py-1.5 text-sm text-gray-600 hover:bg-white transition"
//                           >
//                             <span className="min-w-0 flex-1 truncate" title={name}>{name}</span>
//                             <button
//                               type="button"
//                               onClick={() => handleViewMaterial(name)}
//                               className="p-1 rounded text-blue-600 hover:bg-blue-50"
//                               title="View"
//                               aria-label={`View ${name}`}
//                             >
//                               <Eye size={14} />
//                             </button>
//                             <button
//                               type="button"
//                               onClick={() => openEditMaterial(name)}
//                               className="p-1 rounded text-green-600 hover:bg-green-50"
//                               title="Edit"
//                               aria-label={`Edit ${name}`}
//                             >
//                               <Edit size={14} />
//                             </button>
//                             <button
//                               type="button"
//                               onClick={() => handleDeleteMaterial(name)}
//                               className="p-1 rounded text-red-600 hover:bg-red-50"
//                               title="Delete"
//                               aria-label={`Delete ${name}`}
//                             >
//                               <Trash2 size={14} />
//                             </button>
//                           </div>
//                         ))
//                       )}
//                     </div>
//                   )}
//                 </div>
//               );
//             }
//             return (
//               <Link
//                 key={item.path}
//                 to={item.path}
//                 onClick={() => setIsOpen(false)}
//                 className={`
//                   flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group
//                   ${active
//                     ? 'bg-blue-600 text-white shadow-md'
//                     : 'text-gray-700 hover:bg-white active:bg-gray-200'
//                   }
//                 `}
//                 aria-current={active ? 'page' : undefined}
//               >
//                 <item.icon
//                   size={22}
//                   className={`flex-shrink-0 ${active
//                       ? 'text-white'
//                       : 'text-gray-500 group-hover:text-gray-700'
//                     }`}
//                 />
//                 {!collapsed && (
//                   <span className="font-medium text-sm">{item.name}</span>
//                 )}
//               </Link>
//             );
//           })}
//         </nav>
//       </aside>

//       {viewMaterialName && (
//         <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
//           <div className="w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-xl bg-white shadow-xl">
//             <div className="flex items-center justify-between border-b bg-blue-50 p-4">
//               <h2 className="text-lg font-bold text-gray-800">{viewMaterialName} Records</h2>
//               <div className="flex items-center gap-2">
//                 <button
//                   type="button"
//                   onClick={openAddRecord}
//                   className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
//                 >
//                   <Plus size={16} />
//                   Add New Record
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setViewMaterialName('')}
//                   className="rounded p-2 text-gray-500 hover:bg-gray-200"
//                   aria-label="Close records"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>
//             </div>
//             <div className="max-h-[65vh] overflow-auto p-4">
//               {showAddRecord && (
//                 <div className="mb-4 rounded-lg border border-blue-100 bg-blue-50 p-4">
//                   <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
//                     <div>
//                       <label className="mb-1 block text-sm font-semibold text-gray-700">Project Name *</label>
//                       <ProjectDropdown
//                         value={recordForm.projectId}
//                         onChange={(projectId) => setRecordForm({ ...recordForm, projectId })}
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label className="mb-1 block text-sm font-semibold text-gray-700">Date *</label>
//                       <input
//                         type="date"
//                         value={recordForm.Date}
//                         onChange={(event) => setRecordForm({ ...recordForm, Date: event.target.value })}
//                         className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
//                       />
//                     </div>
//                     <div>
//                       <label className="mb-1 block text-sm font-semibold text-gray-700">Supplier Name *</label>
//                       <input
//                         type="text"
//                         value={recordForm.supplierName}
//                         onChange={(event) => setRecordForm({ ...recordForm, supplierName: event.target.value })}
//                         className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
//                       />
//                     </div>
//                     <div>
//                       <label className="mb-1 block text-sm font-semibold text-gray-700">Quantity *</label>
//                       <input
//                         type="number"
//                         step="any"
//                         value={recordForm.quantity}
//                         onChange={(event) => setRecordForm({ ...recordForm, quantity: event.target.value })}
//                         className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
//                       />
//                     </div>
//                     <div>
//                       <label className="mb-1 block text-sm font-semibold text-gray-700">Rate *</label>
//                       <input
//                         type="number"
//                         step="any"
//                         value={recordForm.rate}
//                         onChange={(event) => setRecordForm({ ...recordForm, rate: event.target.value })}
//                         className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
//                       />
//                     </div>
//                     <div>
//                       <label className="mb-1 block text-sm font-semibold text-gray-700">Remarks</label>
//                       <input
//                         type="text"
//                         value={recordForm.remarks}
//                         onChange={(event) => setRecordForm({ ...recordForm, remarks: event.target.value })}
//                         className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
//                       />
//                     </div>
//                   </div>
//                   <div className="mt-4 flex justify-end gap-2">
//                     <button
//                       type="button"
//                       onClick={() => setShowAddRecord(false)}
//                       className="rounded-lg border px-4 py-2 text-sm text-gray-700 hover:bg-white"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="button"
//                       onClick={handleAddRecord}
//                       disabled={recordSubmitting}
//                       className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
//                     >
//                       {recordSubmitting ? 'Saving...' : 'Save Record'}
//                     </button>
//                   </div>
//                 </div>
//               )}
//               {viewLoading ? (
//                 <p className="py-10 text-center text-gray-500">Loading...</p>
//               ) : viewEntries.length === 0 ? (
//                 <p className="py-10 text-center text-gray-500">No records found.</p>
//               ) : (
//                 <table className="min-w-full text-sm">
//                   <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
//                     <tr>
//                       <th className="px-3 py-2">Date</th>
//                       <th className="px-3 py-2">Project Name</th>
//                       <th className="px-3 py-2">Supplier</th>
//                       <th className="px-3 py-2">Quantity</th>
//                       <th className="px-3 py-2">Rate</th>
//                       <th className="px-3 py-2">Amount</th>
//                       <th className="px-3 py-2">Remarks</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-100">
//                     {viewEntries.map((entry) => (
//                       <tr key={entry._id} className="hover:bg-gray-50">
//                         <td className="px-3 py-2">{entry.Date}</td>
//                         <td className="px-3 py-2">{entry.projectName || '-'}</td>
//                         <td className="px-3 py-2">{entry['Supplier Name']}</td>
//                         <td className="px-3 py-2">{entry.Quantity}</td>
//                         <td className="px-3 py-2">{entry.Rate}</td>
//                         <td className="px-3 py-2">{entry.Amount}</td>
//                         <td className="px-3 py-2">{entry.Remarks || '-'}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {editMaterialName && (
//         <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
//           <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
//             <div className="mb-4 flex items-center justify-between">
//               <h2 className="text-lg font-bold text-gray-800">Edit Material</h2>
//               <button
//                 type="button"
//                 onClick={() => setEditMaterialName('')}
//                 className="rounded p-2 text-gray-500 hover:bg-gray-100"
//                 aria-label="Close edit"
//               >
//                 <X size={20} />
//               </button>
//             </div>
//             <label className="mb-2 block text-sm font-semibold text-gray-700">Material Name</label>
//             <input
//               type="text"
//               value={editMaterialValue}
//               onChange={(event) => setEditMaterialValue(event.target.value)}
//               className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               autoFocus
//             />
//             <div className="mt-6 flex justify-end gap-3">
//               <button
//                 type="button"
//                 onClick={() => setEditMaterialName('')}
//                 className="rounded-lg border px-4 py-2 text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={handleSaveMaterialName}
//                 disabled={savingEdit}
//                 className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
//               >
//                 {savingEdit ? 'Saving...' : 'Update'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';
import {
  Home,
  FolderKanban,
  Package,
  Users,
  Truck,
  Settings,
  ChevronDown,
  X,
} from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen, collapsed, setCollapsed }) {
  const location = useLocation();
  const navigate = useNavigate();

  // ---------- Materials state ----------
  const [materialsOpen, setMaterialsOpen] = useState(false);
  const [materialNames, setMaterialNames] = useState([]);

  // ---------- Machinery state ----------
  const [machineryOpen, setMachineryOpen] = useState(false);
  const [machineryNames, setMachineryNames] = useState([]);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Materials', path: '/materials', icon: Package },
    { name: 'Labour', path: '/labour', icon: Users },
    { name: 'Machinery', path: '/machinery', icon: Truck },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

  // Fetch material names
  const fetchMaterialNames = async () => {
    try {
      const res = await api.get('/api/materials/names');
      setMaterialNames(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setMaterialNames([]);
    }
  };

  // Fetch distinct machinery names
  const fetchMachineryNames = async () => {
    try {
      const res = await api.get('/api/machinery');
      const entries = res.data;
      const uniqueNames = [...new Set(entries.map((e) => e.machineryName))].sort();
      setMachineryNames(uniqueNames);
    } catch (err) {
      setMachineryNames([]);
    }
  };

  useEffect(() => {
    fetchMaterialNames();
    fetchMachineryNames();
    window.addEventListener('storage', () => {
      fetchMaterialNames();
      fetchMachineryNames();
    });
    return () => window.removeEventListener('storage', () => {});
  }, [location.pathname]);

  // Navigate to material detail page
  const handleViewMaterial = (materialName) => {
    navigate(`/material/${encodeURIComponent(materialName)}`);
    if (window.innerWidth < 1024) setIsOpen(false);
  };

  // Navigate to machinery detail page
  const handleViewMachinery = (machineryName) => {
    navigate(`/machinery-detail/${encodeURIComponent(machineryName)}`);
    if (window.innerWidth < 1024) setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          role="presentation"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 bg-gradient-to-b from-gray-50 to-gray-100 shadow-xl z-50
          transition-all duration-300 overflow-hidden

          ${collapsed ? 'w-20' : 'w-64'}

          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          {!collapsed && <h1 className="font-bold text-lg text-gray-900">Portal</h1>}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1 rounded-md text-gray-500 hover:bg-gray-200 active:bg-gray-300 transition-colors"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-2 space-y-1 h-[calc(100vh-80px)] overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.path);
            if (item.name === 'Materials') {
              return (
                <div key={item.path}>
                  <button
                    type="button"
                    onClick={() => setMaterialsOpen((open) => !open)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group
                      ${
                        active
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-white active:bg-gray-200'
                      }
                    `}
                    aria-expanded={materialsOpen}
                  >
                    <item.icon
                      size={22}
                      className={`flex-shrink-0 ${
                        active ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                      }`}
                    />
                    {!collapsed && (
                      <>
                        <span className="font-medium text-sm flex-1 text-left">{item.name}</span>
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${materialsOpen ? 'rotate-180' : ''}`}
                        />
                      </>
                    )}
                  </button>
                  {!collapsed && materialsOpen && (
                    <div className="ml-8 mt-1 mb-2 space-y-1">
                      {materialNames.length === 0 ? (
                        <div className="px-3 py-2 text-xs text-gray-400">No materials</div>
                      ) : (
                        materialNames.map((name) => (
                          <button
                            key={name}
                            onClick={() => handleViewMaterial(name)}
                            className="w-full text-left px-3 py-1.5 text-sm text-gray-600 rounded-md hover:bg-white transition truncate"
                            title={name}
                          >
                            {name}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            }

            if (item.name === 'Machinery') {
              return (
                <div key={item.path}>
                  <button
                    type="button"
                    onClick={() => setMachineryOpen((open) => !open)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group
                      ${
                        active
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-white active:bg-gray-200'
                      }
                    `}
                    aria-expanded={machineryOpen}
                  >
                    <item.icon
                      size={22}
                      className={`flex-shrink-0 ${
                        active ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                      }`}
                    />
                    {!collapsed && (
                      <>
                        <span className="font-medium text-sm flex-1 text-left">{item.name}</span>
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${machineryOpen ? 'rotate-180' : ''}`}
                        />
                      </>
                    )}
                  </button>
                  {!collapsed && machineryOpen && (
                    <div className="ml-8 mt-1 mb-2 space-y-1">
                      {machineryNames.length === 0 ? (
                        <div className="px-3 py-2 text-xs text-gray-400">No machinery</div>
                      ) : (
                        machineryNames.map((name) => (
                          <button
                            key={name}
                            onClick={() => handleViewMachinery(name)}
                            className="w-full text-left px-3 py-1.5 text-sm text-gray-600 rounded-md hover:bg-white transition truncate"
                            title={name}
                          >
                            {name}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            }

            // Normal nav item
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group
                  ${
                    active
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-white active:bg-gray-200'
                  }
                `}
                aria-current={active ? 'page' : undefined}
              >
                <item.icon
                  size={22}
                  className={`flex-shrink-0 ${
                    active ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                  }`}
                />
                {!collapsed && <span className="font-medium text-sm">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}