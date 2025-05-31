import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children, requiredRole }) => {
  const location = useLocation();
  const role = useSelector((state) => state.auth.role);
  if (!role) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (requiredRole && requiredRole !== role ){
    return <Navigate to="/" replace />;
  }

  // 3. If everything is okay, render the child component
  return children;
};

export default PrivateRoute;
