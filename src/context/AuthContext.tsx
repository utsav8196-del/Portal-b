// // import { createContext, useEffect, useState } from 'react';
// // import axios from 'axios';

// // export const AuthContext = createContext();

// // export const AuthProvider = ({ children }) => {
// //   const [user, setUser] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   const fetchUser = async () => {
// //     try {
// //       const res = await axios.get('/api/auth/me');
// //       setUser(res.data);
// //     } catch (err) {
// //       setUser(null);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchUser();
// //   }, []);

// //   return (
// //     <AuthContext.Provider value={{ user, setUser, loading }}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // };


// import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import axios from 'axios';

// interface AuthContextType {
//     isAuth: boolean;
//     loading: boolean;
//     login: () => void;
//     logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//     const [isAuth, setIsAuth] = useState(false);
//     const [loading, setLoading] = useState(true);

//     const checkAuth = async () => {
//         try {
//             await axios.get('/api/auth/me', { withCredentials: true });
//             setIsAuth(true);
//         } catch {
//             setIsAuth(false);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         checkAuth();
//     }, []);

//     const login = () => setIsAuth(true);
//     const logout = () => setIsAuth(false);

//     return (
//         <AuthContext.Provider value={{ isAuth, loading, login, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (!context) throw new Error('useAuth must be used within AuthProvider');
//     return context;
// };


import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

interface AuthContextType {
  isAuth: boolean;
  loading: boolean;
  userRole: string | null;
  login: (role?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  const checkAuth = async () => {
    try {
      const response = await api.get('/api/auth/me');
      setIsAuth(true);
      const role = response.data.role || 'user';
      setUserRole(role);
      localStorage.setItem('userRole', role);
    } catch {
      setIsAuth(false);
      setUserRole(null);
      localStorage.removeItem('userRole');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (role?: string) => {
    setIsAuth(true);
    const finalRole = role || 'user';
    setUserRole(finalRole);
    localStorage.setItem('userRole', finalRole);
  };

  const logout = () => {
    setIsAuth(false);
    setUserRole(null);
    localStorage.removeItem('userRole');
    // Optionally call backend logout endpoint
    api.post('/api/auth/logout', {}).catch(console.error);
  };

  return (
    <AuthContext.Provider value={{ isAuth, loading, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};