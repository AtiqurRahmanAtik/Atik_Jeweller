import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { AuthContext } from "../../providers/AuthProvider";

const PrivateRoot = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }

  if (user) {
    if (user.role === "superadmin") {
      return <Navigate to="/admin/" replace />;
    }
    return children;
  }

  return <Navigate to="/" state={{ from: location }} replace />;
};

PrivateRoot.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoot;