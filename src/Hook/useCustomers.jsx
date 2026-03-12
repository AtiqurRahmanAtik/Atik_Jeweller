import { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import useAuth from "./useAuth";

const API = `${process.env.REACT_APP_BACKEND_URL}/customer`;

export const useCustomers = () => {
  const { branch } = useAuth();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 10,
  });

  // GET Customers
  const fetchCustomers = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);

    try {
      const res = await axios.get(
        `${API}?page=${page}&limit=${limit}&branch=${branch}`
      );

      if (res.data.success) {
        setCustomers(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  }, [branch]);

  // CREATE Customer
  const createCustomer = async (data) => {
    try {
      setLoading(true);

      const payload = {
        ...data,
        branch,
      };

      await axios.post(`${API}/post`, payload);

      toast.success("Customer created successfully");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Create failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // UPDATE Customer
  const updateCustomer = async (id, data) => {
    try {
      setLoading(true);

      const payload = {
        ...data,
        branch,
      };

      await axios.put(`${API}/update/${id}`, payload);

      toast.success("Customer updated successfully");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // DELETE Customer
  const deleteCustomer = async (id) => {
    try {
      await axios.delete(`${API}/delete/${id}`);

      toast.success("Customer deleted successfully");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
      return false;
    }
  };

  return {
    customers,
    loading,
    pagination,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  };
};