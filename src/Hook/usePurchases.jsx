import { useState, useCallback } from "react";
import axios from "axios";
import useAuth from "./useAuth";
// Assuming you have a useAuth hook to get the logged-in user's branch


const API = `${process.env.REACT_APP_BACKEND_URL}/purchases`;

export const usePurchases = () => {
    
  const { branch } = useAuth();
  
  // --- States ---
  const [purchases, setPurchases] = useState([]);
  const [singlePurchase, setSinglePurchase] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- 1. GET ALL PURCHASES (Global) ---
  const fetchAllPurchases = useCallback(async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API}/?page=${page}&limit=${limit}`);
      if (res.data.success) {
        setPurchases(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error("Fetch All Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- 2. GET ALL BY BRANCH ---
  const fetchPurchases = useCallback(async (page = 1, limit = 10) => {
    if (!branch) return;
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API}/${branch}/get-all?page=${page}&limit=${limit}`);
      if (res.data.success) {
        setPurchases(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error("Fetch Branch Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [branch]);

  // --- 3. GET SINGLE PURCHASE BY ID ---
  const fetchPurchaseById = useCallback(async (id) => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API}/get-id/${id}`);
      setSinglePurchase(res.data);
      return res.data;
    } catch (err) {
      console.error("Fetch Single Error:", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- 4. CREATE PURCHASE ---
  const createPurchase = async (purchaseData) => {
    try {
      setLoading(true);
      // Ensure branch is attached to the payload if the user didn't explicitly add it
      const res = await axios.post(`${API}/post`, { ...purchaseData, branch });
      if (res.status === 201) {
        await fetchPurchases(pagination.currentPage); // Refresh current page
        return true;
      }
    } catch (err) {
      console.error("Create Error:", err);
      alert("Failed to create purchase. Please check console.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // --- 5. UPDATE PURCHASE ---
  const updatePurchase = async (id, purchaseData) => {
    try {
      setLoading(true);
      const res = await axios.put(`${API}/update/${id}`, { ...purchaseData, branch });
      if (res.status === 200) {
        await fetchPurchases(pagination.currentPage); // Refresh current page
        return true;
      }
    } catch (err) {
      console.error("Update Error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // --- 6. ADD PRODUCT TO EXISTING PURCHASE ---
  const addProductToPurchase = async (id, productData) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API}/add-product/${id}`, productData);
      if (res.status === 200) {
        await fetchPurchases(pagination.currentPage); // Refresh current page
        return true;
      }
    } catch (err) {
      console.error("Add Product Error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // --- 7. DELETE PURCHASE ---
  const deletePurchase = async (id) => {
    try {
      setLoading(true);
      const res = await axios.delete(`${API}/delete/${id}`);
      if (res.status === 200) {
        await fetchPurchases(pagination.currentPage); // Refresh current page
        return true;
      }
    } catch (err) {
      console.error("Delete Error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    // States
    purchases,
    singlePurchase,
    pagination,
    loading,
    error,
    
    // Functions
    fetchAllPurchases,
    fetchPurchases,
    fetchPurchaseById,
    createPurchase,
    updatePurchase,
    addProductToPurchase,
    deletePurchase,
  };
};

export default usePurchases;