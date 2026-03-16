import { useState, useCallback } from "react";
import axios from "axios";
// Assuming you have a useAuth hook to get the logged-in user's branch
import useAuth from "./useAuth"; 

const API = `${process.env.REACT_APP_BACKEND_URL}/web-products`;

export const useWebProducts = () => {
  const { branch } = useAuth();
  
  // --- States ---
  const [webProducts, setWebProducts] = useState([]);
  const [singleProduct, setSingleProduct] = useState(null); // Used for ProductDetails page
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Used for error handling on the frontend

  // --- 1. GET ALL (For Frontend Featured Products Slider) ---
  const fetchAllProducts = useCallback(async (page = 1, limit = 50) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API}/?page=${page}&limit=${limit}`);
      if (res.data.success) {
        setWebProducts(res.data.data);
      }
    } catch (err) {
      console.error("Fetch All Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- 2. GET ALL BY BRANCH (For Admin Table) ---
  const fetchWebProducts = useCallback(async (page = 1, limit = 10) => {
    if (!branch) return;
    try {
      setLoading(true);
      const res = await axios.get(`${API}/${branch}/get-all?page=${page}&limit=${limit}`);
      if (res.data.success) {
        setWebProducts(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error("Fetch Branch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [branch]);

  // --- 3. GET SINGLE PRODUCT (For ProductDetails Page) ---
  const fetchWebProductById = useCallback(async (id) => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      // Fetches using the exact API route from your backend
      const res = await axios.get(`${API}/get-id/${id}`);
      setSingleProduct(res.data);
      return res.data;
    } catch (err) {
      console.error("Fetch Single Error:", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- 4. CREATE (For Admin Panel) ---
  const createWebProduct = async (productData) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API}/post`, { ...productData, branch });
      if (res.status === 201) {
        await fetchWebProducts(pagination.currentPage); // Refresh current page
        return true;
      }
    } catch (err) {
      console.error("Create Error:", err);
      alert("Failed to create product. Please check console.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // --- 5. UPDATE (For Admin Panel) ---
  const updateWebProduct = async (id, productData) => {
    try {
      setLoading(true);
      const res = await axios.put(`${API}/update/${id}`, { ...productData, branch });
      if (res.status === 200) {
        await fetchWebProducts(pagination.currentPage); // Refresh current page
        return true;
      }
    } catch (err) {
      console.error("Update Error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // --- 6. DELETE (For Admin Panel) ---
  const deleteWebProduct = async (id) => {
    try {
      setLoading(true);
      const res = await axios.delete(`${API}/delete/${id}`);
      if (res.status === 200) {
        await fetchWebProducts(pagination.currentPage); // Refresh current page
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
    webProducts,
    products: webProducts, // Alias added so FeaturedProducts doesn't crash
    singleProduct,
    pagination,
    loading,
    error,
    
    // Functions
    fetchAllProducts,
    fetchWebProducts,
    fetchWebProductById,
    createWebProduct,
    updateWebProduct,
    deleteWebProduct
  };
};