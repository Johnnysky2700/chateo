// src/Components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const user = localStorage.getItem('currentUser');

  return user ? children : <Navigate to="/VerifyPage" />;
}
