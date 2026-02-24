import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider.jsx";

const useAuth = () => {
  const auth = useContext(AuthContext);
  return auth;
};

export default useAuth;
