import { createContext, useState } from "react";
import PropTypes from "prop-types";

import useAxiosPublic from "../Hook/useAxiosPublic";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("authUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const axiosSecure = useAxiosPublic();
  const [branch, setBranch] = useState(() => {
    const storedBranch = localStorage.getItem("authBranch");
    return storedBranch || user?.branch || "teaxo";
  });

  const registerUser = async (email, password, name, branch) => {
    setLoading(true);
    try {
      const { data } = await axiosSecure.post("/user/post", {
        email,
        password,
        name,
        branch,
      });
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const response = await axiosSecure.post("/user/login", { email, password });
      const data = response.data;

      setUser(data.user);
      setBranch(data.user.branch);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      localStorage.setItem("authBranch", data.user.branch);
      localStorage.setItem("authToken", data.token);
      
      return data.user;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    setLoading(true);
    try {
      await axiosSecure.post("/user/logout", { email: user.email });
      setUser(null);
      setBranch(user.branch);
      localStorage.removeItem("authUser");
      localStorage.removeItem("authBranch");
      localStorage.removeItem("authToken");
    } catch (error) {
      // You might want to handle logout errors, but per your request, logs are removed.
    } finally {
      setLoading(false);
    }
  };

  const authInfo = {
    user,
    loading,
    branch,
    registerUser,
    loginUser,
    logoutUser,
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;