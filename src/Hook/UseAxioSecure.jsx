import axios from "axios";
import { AuthContext } from "../providers/AuthProvider";
import { useContext } from "react";

const axiosSecure = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}`,
});

const UseAxiosSecure = () => {
  const { user, branch,clientIP } = useContext(AuthContext);
  const useremail = user?.email || "Unknown User";
  const username = user?.name || "Unknown User";
  const userBranch = branch || "Unknown Branch";
  const userIP = clientIP || "Unknown IP"; 


  axiosSecure.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Attach user data in headers for every request
      config.headers["X-User-Email"] = useremail;
      config.headers["X-User-Name"] = username;
      config.headers["X-User-Branch"] = userBranch;
      config.headers["X-User-IP"] = userIP;

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosSecure.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.error("Unauthorized or Token expired");
      }
      return Promise.reject(error);
    }
  );

  return axiosSecure;
};

export default UseAxiosSecure;
