import { useState, useCallback } from "react";
import axios from "axios";
import useAuth from "./useAuth";

// Base API URL for Gold Categories
const API = `${process.env.REACT_APP_BACKEND_URL}/gold-categories`;

export const useGoldCategories = () => {

  const { branch } = useAuth();
  
  const [goldCategories, setGoldCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  // GET ALL GOLD CATEGORIES (No branch filter)
  const fetchAllGoldCategories = useCallback(async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      // Matches backend: GET /gold-categories/
      const res = await axios.get(`${API}/?page=${page}&limit=${limit}`);
      setGoldCategories(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error("Fetch All Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // GET ALL BY BRANCH
  const fetchGoldCategories = useCallback(async (page = 1, limit = 10) => {
    if (!branch) return;
    
    try {
      setLoading(true);
      // Matches backend: GET /gold-categories/:branch/get-all
      const res = await axios.get(`${API}/${branch}/get-all?page=${page}&limit=${limit}`);
      setGoldCategories(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [branch]);

  // CREATE
  const createGoldCategory = async (categoryData) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API}/post`, {
        ...categoryData,
        branch: categoryData.branch || branch
      });
      return res.data;
    } catch (err) {
      console.error("Create Error:", err.response?.data);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // UPDATE
  const updateGoldCategory = async (id, categoryData) => {
    try {
      setLoading(true);
      const res = await axios.put(`${API}/update/${id}`, {
        ...categoryData,
        branch: categoryData.branch || branch
      });
      return res.data;
    } catch (err) {
      console.error("Update Error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // DELETE
  const deleteGoldCategory = async (id) => {
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
    goldCategories,
    pagination,
    loading,
    fetchAllGoldCategories,
    fetchGoldCategories,
    createGoldCategory,
    updateGoldCategory,
    deleteGoldCategory
  };
};