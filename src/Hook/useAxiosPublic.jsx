import axios from "axios";

const axiosPublic = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
