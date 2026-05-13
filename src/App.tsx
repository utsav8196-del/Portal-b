import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Materials from './pages/Material';
import Labour from './pages/Labour';
import Machinery from './pages/Machinery';
import Settings from './pages/Settings';
import MaterialDetail from './pages/MaterialDetail';
import MachineryDetail from './pages/MachineryDetail';


function AppRoutes() {
  const { isAuth, loading } = useAuth();

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <Routes>
      <Route path="/login" element={!isAuth ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!isAuth ? <Register /> : <Navigate to="/" />} />
      <Route element={isAuth ? <DashboardLayout /> : <Navigate to="/login" />}>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/materials" element={<Materials />} />
        <Route path="/labour" element={<Labour />} />
        <Route path="/machinery" element={<Machinery />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/material/:name" element={<MaterialDetail />} />
        <Route path="/machinery-detail/:name" element={<MachineryDetail />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;