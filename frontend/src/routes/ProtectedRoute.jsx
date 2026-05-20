import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ soloAdmin = false }) {
  const { token, usuario } = useSelector((s) => s.auth);

  if (!token) return <Navigate to="/login" replace />;
  if (soloAdmin && usuario?.rol !== 'admin') return <Navigate to="/" replace />;

  return <Outlet />;
}
