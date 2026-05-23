import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { isAdminUser } from "../utils/isAdmin";

const AdminRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!userInfo) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdminUser(userInfo)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
