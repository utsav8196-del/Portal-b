// import { Menu, LogOut, User, Settings, ChevronDown } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import Swal from 'sweetalert2';
// import { useAuth } from '../context/AuthContext';
// import { useEffect, useState, useRef } from 'react';
// import PropTypes from 'prop-types';

// export default function Header({ toggleSidebar }) {
//   const navigate = useNavigate();
//   const { logout } = useAuth();
//   const [userName, setUserName] = useState('');
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get('/api/auth/me', { withCredentials: true });
//         setUserName(res.data.name || res.data.email);
//       } catch {
//         // ignore
//       }
//     };
//     fetchUser();
//   }, []);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleLogout = async () => {
//     try {
//       const result = await Swal.fire({
//         title: 'Logout?',
//         text: 'Are you sure you want to logout?',
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonText: 'Yes, logout',
//         confirmButtonColor: '#d33',
//         cancelButtonColor: '#3085d6',
//       });
//       if (!result.isConfirmed) return;

//       await axios.post('/api/auth/logout', {}, { withCredentials: true });
//       logout();
//       Swal.fire('Logged out!', '', 'success');
//       navigate('/login');
//     } catch (err) {
//       console.error(err);
//       Swal.fire('Error', 'Logout failed. Please try again.', 'error');
//     }
//   };

//   const goToSettings = () => {
//     setDropdownOpen(false);
//     navigate('/settings');
//   };

//   return (
//     <header className="w-full bg-white border-b border-gray-200 px-3 sm:px-4 py-2 sm:py-3 flex justify-between items-center shadow-sm sticky top-0 z-30">
//       {/* Left side: menu button + title */}
//       <div className="flex items-center gap-2 sm:gap-3">
//         <button
//           onClick={toggleSidebar}
//           className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none"
//           aria-label="Toggle sidebar"
//         >
//           <Menu size={24} />
//         </button>
//         <h1 className="font-semibold text-base sm:text-lg text-gray-800 hidden sm:block">
//           Construction Manager
//         </h1>
//         {/* Short title on very small screens */}
//         <h1 className="font-semibold text-base text-gray-800 block sm:hidden">
//           CMgr
//         </h1>
//       </div>

//       {/* Right side: user avatar + dropdown */}
//       <div className="relative" ref={dropdownRef}>
//         {userName && (
//           <button
//             onClick={() => setDropdownOpen(!dropdownOpen)}
//             className="flex items-center gap-1.5 sm:gap-2 focus:outline-none hover:bg-gray-50 px-1.5 sm:px-2 py-1 rounded-lg transition-colors"
//           >
//             <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-100 flex items-center justify-center">
//               <User size={14} className="sm:w-4 sm:h-4 w-3.5 h-3.5 text-blue-600" />
//             </div>
//             <span className="text-xs sm:text-sm text-gray-700 hidden sm:inline">
//               {userName}
//             </span>
//             <ChevronDown
//               size={14}
//               className={`text-gray-500 transition-transform duration-200 hidden sm:block ${
//                 dropdownOpen ? 'rotate-180' : ''
//               }`}
//             />
//           </button>
//         )}

//         {/* Dropdown menu */}
//         {dropdownOpen && (
//           <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
//             <button
//               onClick={goToSettings}
//               className="flex items-center gap-2 w-full px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
//             >
//               <Settings size={14} className="sm:w-4 sm:h-4 w-3.5 h-3.5" />
//               Settings
//             </button>
//             <button
//               onClick={handleLogout}
//               className="flex items-center gap-2 w-full px-3 sm:px-4 py-2 text-xs sm:text-sm text-red-600 hover:bg-gray-100"
//             >
//               <LogOut size={14} className="sm:w-4 sm:h-4 w-3.5 h-3.5" />
//               Logout
//             </button>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// }

// Header.propTypes = {
//   toggleSidebar: PropTypes.func.isRequired,
// };


import { Menu, LogOut, User, Settings, ChevronDown, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';

export default function Header({ toggleSidebar }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [userName, setUserName] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/api/auth/me');
        setUserName(res.data.name || res.data.email);
      } catch {
        // ignore
      }
    };
    fetchUser();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const result = await Swal.fire({
        title: 'Logout?',
        text: 'Are you sure you want to logout?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, logout',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
      });
      if (!result.isConfirmed) return;

      await api.post('/api/auth/logout', {});
      logout();
      Swal.fire('Logged out!', '', 'success');
      navigate('/login');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Logout failed. Please try again.', 'error');
    }
  };

  const goToSettings = () => {
    setDropdownOpen(false);
    navigate('/settings');
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center shadow-sm sticky top-0 z-30">
      {/* Left side: menu button + title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors flex-shrink-0"
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>
        <div className="min-w-0">
          <h1 className="font-bold text-lg sm:text-xl text-gray-900 truncate hidden sm:block">
            Construction Manager
          </h1>
          <h1 className="font-bold text-lg text-gray-900 block sm:hidden">
            Manager
          </h1>
        </div>
      </div>

      {/* Right side: notification + user avatar + dropdown */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          {userName && (
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 focus:outline-none hover:bg-gray-50 px-2 py-1.5 sm:px-3 rounded-lg transition-colors active:bg-gray-100"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-white sm:w-5 sm:h-5" />
              </div>
              <span className="text-sm text-gray-700 font-medium hidden sm:inline max-w-[100px] truncate">
                {userName}
              </span>
              <ChevronDown
                size={16}
                className={`text-gray-500 transition-transform duration-200 hidden sm:block flex-shrink-0 ${dropdownOpen ? 'rotate-180' : ''
                  }`}
              />
            </button>
          )}

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-lg shadow-xl py-2 z-20 border border-gray-200 divide-y divide-gray-100">
              <div className="px-4 py-2 block sm:hidden">
                <p className="font-semibold text-sm text-gray-900">{userName}</p>
              </div>
              <button
                onClick={goToSettings}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                <Settings size={16} className="flex-shrink-0" />
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors"
              >
                <LogOut size={16} className="flex-shrink-0" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
};
