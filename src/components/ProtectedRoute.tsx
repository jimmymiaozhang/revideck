import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    // You could add a loading spinner here
    return null;
  }

  if (!currentUser) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 