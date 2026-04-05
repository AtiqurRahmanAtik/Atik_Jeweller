import { useState, useCallback } from "react";
import axios from "axios";
import useAuth from "./useAuth"; // Adjust path if necessary

const BASE_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BASE_URL}/gold-products`;

export const useGoldProducts = () => {
  const { branch } = useAuth();

  const [goldProducts, setGoldProducts] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  const [loading, setLoading] = useState(false);

  // States for Dynamic Dropdowns (Only Categories kept)
  const [categories, setCategories] = useState([]);

  // Fetch Gold Products (Updated to handle category filtering)
  const fetchGoldProducts = useCallback(async (page = 1, limit = 10, categoryId = "") => {
    if (!branch) return;

    try {
      setLoading(true);
      
      // Build query parameters dynamically
      const params = { page, limit };
      
      // If a categoryId is provided, add it to the API request
      if (categoryId) {
        params.category = categoryId; // Note: Ensure 'category' matches the query parameter your backend expects (e.g., ?category=123)
      }

      const res = await axios.get(`${API}/${branch}/get-all`, { params });
      
      setGoldProducts(res.data?.data || []);
      setPagination(res.data?.pagination || { currentPage: page, totalPages: 1, totalItems: res.data?.data?.length || 0 });
    } catch (err) {
      console.error(err);
      setGoldProducts([]);
    } finally {
      setLoading(false);
    }
  }, [branch]);

  // Fetch ONLY Categories
  const fetchFilters = useCallback(async () => {
    if (!branch) return;

    try {
      const catRes = await axios.get(`${BASE_URL}/gold-categories/${branch}/get-all`);
      setCategories(catRes.data?.data || []);
    } catch (err) {
      console.error("Error fetching filters:", err);
    }
  }, [branch]);

  // --- GET SINGLE PRODUCT BY ID ---
  const getGoldProductById = async (id) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/get-id/${id}`);
      return res.data; 
    } catch (err) {
      console.error("Error fetching product by ID:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // CREATE
  const createGoldProduct = async (productData) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API}/post`, { ...productData, branch });
      return res.data;
    } catch (err) {
      console.error(err.response?.data);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // UPDATE
  const updateGoldProduct = async (id, productData) => {
    try {
      setLoading(true);
      await axios.put(`${API}/update/${id}`, { ...productData, branch });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // DELETE
  const deleteGoldProduct = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${API}/delete/${id}`);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    branch,
    goldProducts,
    pagination,
    loading,
    categories,
    fetchGoldProducts,
    fetchFilters,
    getGoldProductById,
    createGoldProduct,
    updateGoldProduct,
    deleteGoldProduct
  };
};