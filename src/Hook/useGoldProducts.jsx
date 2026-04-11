import { useState, useCallback } from "react";
import axios from "axios";
import useAuth from "./useAuth";

const BASE_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BASE_URL}/gold-products`;

export const useGoldProducts = () => {
  const { branch } = useAuth();

  const [goldProducts, setGoldProducts] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  // ✅ FETCH PRODUCTS WITH SEARCH + CATEGORY
  const fetchGoldProducts = useCallback(
    async ({ page = 1, limit = 10, category = "", search = "" } = {}) => {
      if (!branch) return;

      try {
        setLoading(true);

        const params = {
          page,
          limit,
        };

        // ✅ Add category if exists and is not 'All'
        if (category && category.toLowerCase() !== "all") {
          params.category = category.trim();
        }

        // ✅ Add search if exists
        if (search && search.trim() !== "") {
          params.search = search.trim();
        }

        const res = await axios.get(`${API}/${branch}/get-all`, {
          params,
        });

        setGoldProducts(res.data?.data || []);

        setPagination({
          currentPage: res.data?.pagination?.currentPage || page,
          totalPages: res.data?.pagination?.totalPages || 1,
          totalItems: res.data?.pagination?.totalItems || 0,
        });
      } catch (err) {
        console.error("Fetch Products Error:", err);
        setGoldProducts([]);
      } finally {
        setLoading(false);
      }
    },
    [branch]
  );

  // ✅ FETCH CATEGORY FILTERS
  const fetchFilters = useCallback(async () => {
    if (!branch) return;

    try {
      const res = await axios.get(
        `${BASE_URL}/gold-categories/${branch}/get-all`
      );
      setCategories(res.data?.data || []);
    } catch (err) {
      console.error("Fetch Categories Error:", err);
    }
  }, [branch]);

  // ✅ GET BY ID
  const getGoldProductById = async (id) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/get-id/${id}`);
      return res.data;
    } catch (err) {
      console.error("Get Product Error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ✅ CREATE
  const createGoldProduct = async (productData) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API}/post`, {
        ...productData,
        branch,
      });
      return res.data;
    } catch (err) {
      console.error("Create Error:", err.response?.data);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ✅ UPDATE
  const updateGoldProduct = async (id, productData) => {
    try {
      setLoading(true);
      await axios.put(`${API}/update/${id}`, {
        ...productData,
        branch,
      });
      return true;
    } catch (err) {
      console.error("Update Error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ✅ DELETE
  const deleteGoldProduct = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${API}/delete/${id}`);
      return true;
    } catch (err) {
      console.error("Delete Error:", err);
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
    deleteGoldProduct,
  };
};