import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import useAuth from './useAuth';

/**
 * Hook for MetalPrice Module
 * Backend Route: /api/metalPrice
 */
export const useMetalPrice = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const {branch} = useAuth();
  console.log("Branch : ",branch)

  // Load Base URL from environment variables
  const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000/api';
  const ENTITY_URL = `${BASE_URL}/metalPrice`;


  // 1. Fetch Metal Prices (Supports Pagination)
  const fetchMetalPrices = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const response = await axios.get(`${ENTITY_URL}?page=${page}&limit=${limit}`);
      if (response.data.success) {
        setData(response.data.data);
        setPagination(response.data.pagination);
      }
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch metal prices');
    } finally {
      setLoading(false);
    }
  }, [ENTITY_URL]);

  // 2. Create Metal Price (POST /api/metalPrice/post)
  const createPrice = async (payload) => {
    setLoading(true);
    try {
      const response = await axios.post(`${ENTITY_URL}/post`, payload);
      await fetchMetalPrices(pagination.currentPage);
      return { success: true, data: response.data };
    } catch (err) {
      const msg = err.response?.data?.error || 'Create failed';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // 3. Update Metal Price (PUT /api/metalPrice/update/:id)
  const updatePrice = async (id, payload) => {
    setLoading(true);
    try {
      const response = await axios.put(`${ENTITY_URL}/update/${id}`, payload);
      await fetchMetalPrices(pagination.currentPage);
      return { success: true, data: response.data };
    } catch (err) {
      const msg = err.response?.data?.error || 'Update failed';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // 4. Delete Metal Price (DELETE /api/metalPrice/delete/:id)
  const deletePrice = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${ENTITY_URL}/delete/${id}`);
      await fetchMetalPrices(pagination.currentPage);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || 'Delete failed';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetalPrices();
  }, [fetchMetalPrices]);

  return {
    data,
    loading,
    error,
    pagination,
    fetchMetalPrices,
    createPrice,
    updatePrice,
    deletePrice,
  };
};