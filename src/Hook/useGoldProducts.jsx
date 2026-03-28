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

  // States for Dynamic Dropdowns
  const [categories, setCategories] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [metals, setMetals] = useState([]);
  const [purities, setPurities] = useState([]);

  // Fetch Gold Products
  const fetchGoldProducts = useCallback(async (page = 1, limit = 10) => {
    if (!branch) return;
    try {
      setLoading(true);
      const res = await axios.get(`${API}/${branch}/get-all`, {
        params: { page, limit }
      });
      setGoldProducts(res.data?.data || []);
      setPagination(res.data?.pagination || { currentPage: page, totalPages: 1, totalItems: res.data?.data?.length || 0 });
    } catch (err) {
      console.error(err);
      setGoldProducts([]);
    } finally {
      setLoading(false);
    }
  }, [branch]);

  // Fetch All Filters (Categories, Stocks, Metals, Purities) concurrently
  const fetchFilters = useCallback(async () => {
    if (!branch) return;
    try {
      const [catRes, stockRes, metalRes, purityRes] = await Promise.all([
        axios.get(`${BASE_URL}/gold-categories/${branch}/get-all`),
        axios.get(`${BASE_URL}/stock/${branch}/get-all`),
        axios.get(`${BASE_URL}/metaltype/${branch}/get-all`),
        axios.get(`${BASE_URL}/purities/${branch}/get-all`)
      ]);

      setCategories(catRes.data?.data || []);
      setStocks(stockRes.data?.data || []);
      setMetals(metalRes.data?.data || []);
      setPurities(purityRes.data?.data || []);
    } catch (err) {
      console.error("Error fetching filters:", err);
    }
  }, [branch]);

  // --- NEW: GET SINGLE PRODUCT BY ID ---
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
    goldProducts,
    pagination,
    loading,
    categories,
    stocks,
    metals,
    purities,
    fetchGoldProducts,
    fetchFilters,
    getGoldProductById, // Added here
    createGoldProduct,
    updateGoldProduct,
    deleteGoldProduct
  };
};