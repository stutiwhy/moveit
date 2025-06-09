import { Navigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { session } = UserAuth();

  // If there's no session, redirect to login
  if (!session) {
    return <Navigate to="/" replace />;
  }

  return children; // If user is logged in, render the children (protected route)
};

export default PrivateRoute;
