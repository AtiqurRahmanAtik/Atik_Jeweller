import { useState, useCallback } from 'react';
import UseAxiosSecure from './UseAxioSecure'; // Adjust path if necessary

export const useHouseKeeper = () => {
  const axiosSecure = UseAxiosSecure();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- GET ALL (Includes Pagination & Branch Filter) ---
  const getAllHouseKeepers = useCallback(async (params) => {
    setLoading(true);
    try {
      // params could be { page: 1, limit: 10, branch: 'Downtown' }
      const { data } = await axiosSecure.get('/housekeeper', { params });
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  // --- GET SUPER ADMIN ALL (Includes Pagination & Search) ---
  const getSuperAdminHouseKeepers = useCallback(async (params) => {
    setLoading(true);
    try {
      // params could be { page: 1, limit: 10, search: 'John' }
      const { data } = await axiosSecure.get('/housekeeper/superadmin/all', { params });
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  // --- GET BY ID ---
  const getHouseKeeperById = useCallback(async (id) => {
    setLoading(true);
    try {
      const { data } = await axiosSecure.get(`/housekeeper/get-id/${id}`);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  // --- CREATE ---
  const createHouseKeeper = async (keeperData) => {
    setLoading(true);
    try {
      const { data } = await axiosSecure.post('/housekeeper/post', keeperData);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // --- UPDATE ---
  const updateHouseKeeper = async (id, updateData) => {
    setLoading(true);
    try {
      const { data } = await axiosSecure.put(`/housekeeper/update/${id}`, updateData);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // --- DELETE ---
  const removeHouseKeeper = async (id) => {
    setLoading(true);
    try {
      await axiosSecure.delete(`/housekeeper/delete/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getAllHouseKeepers,
    getSuperAdminHouseKeepers,
    getHouseKeeperById,
    createHouseKeeper,
    updateHouseKeeper,
    removeHouseKeeper,
  };
};