import { useState, useCallback } from "react";
import axios from "axios";
import useAuth from "./useAuth";

const API = `${process.env.REACT_APP_BACKEND_URL}/sales`;

const useSales = () => {
  const { branch } = useAuth();

  const [sales, setSales] = useState([]);
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 10,
  });

  // ✅ Helper to manually clear UI errors
  const clearError = () => setError(null);

  // ✅ Get All Sales (Admin / All Branch)
  const getAllSales = useCallback(async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API}?page=${page}&limit=${limit}`);

      setSales(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, []);



  // ✅ Get Single Sale by ID
  const getSaleById = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API}/get-id/${id}`);
      setSale(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Create Sale
  const createSale = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post(`${API}/post`, data);

      // Optional: update UI instantly by prepending the new sale
      setSales((prev) => [res.data, ...prev]);

      return res.data;
    } catch (err) {
      const errMsg = err.response?.data?.error || err.response?.data || err.message;
      setError(errMsg);
      throw new Error(errMsg); // Throw so the component can stop form submission/modals
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update Sale
  const updateSale = async (id, data) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.put(`${API}/update/${id}`, data);

      // Update local array state
      setSales((prev) =>
        prev.map((item) => (item._id === id ? res.data : item))
      );
      
      // Update single sale state if it's currently loaded
      if (sale && sale._id === id) {
        setSale(res.data);
      }

      return res.data;
    } catch (err) {
      const errMsg = err.response?.data?.error || err.response?.data || err.message;
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete Sale
  const deleteSale = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await axios.delete(`${API}/delete/${id}`);

      // Remove from state locally to avoid needing an immediate refetch
      setSales((prev) => prev.filter((item) => item._id !== id));
      
      // Clear single sale state if we just deleted the one we were looking at
      if (sale && sale._id === id) {
        setSale(null);
      }
    } catch (err) {
      const errMsg = err.response?.data?.error || err.response?.data || err.message;
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return {
    sales,
    sale,
    loading,
    error,
    pagination,

    // functions
    clearError,
    getAllSales,

    getSaleById,
    createSale,
    updateSale,
    deleteSale,
  };
};

export default useSales;