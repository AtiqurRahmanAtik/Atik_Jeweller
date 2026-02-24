import { useState, useCallback } from 'react';
import UseAxiosSecure from './UseAxioSecure';

export const useUser = () => {
  const axiosSecure = UseAxiosSecure();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getPaginatedUsers = useCallback(async (params) => {
    setLoading(true);
    try {
      const { data } = await axiosSecure.get('/user', { params });
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  const getUserById = async (id) => {
    setLoading(true);
    try {
      const { data } = await axiosSecure.get(`/user/get-id/${id}`);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id, userData) => {
    setLoading(true);
    try {
      const { data } = await axiosSecure.put(`/user/update/${id}`, userData);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (passwordData) => {
    setLoading(true);
    try {
      const { data } = await axiosSecure.put('/user/change-password', passwordData);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { 
    loading, 
    error, 
    getPaginatedUsers, 
    getUserById, 
    updateUser, 
    changePassword 
  };
};