import { useState, useCallback } from 'react';
import UseAxiosSecure from './UseAxioSecure';


export const useCompany = () => {
  const axiosSecure = UseAxiosSecure();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- GET ALL ---
  const getAllCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axiosSecure.get('/company');
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  // --- GET BY CITY ---
  const getCompaniesByCity = useCallback(async (city) => {
    setLoading(true);
    try {
      const { data } = await axiosSecure.get(`/company/${city}/get-all`);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  // --- GET BY ID ---
  const getCompanyById = useCallback(async (id) => {
    setLoading(true);
    try {
      const { data } = await axiosSecure.get(`/company/get-id/${id}`);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  // --- CREATE ---
  const createCompany = async (companyData) => {
    setLoading(true);
    try {
      const { data } = await axiosSecure.post('/company/post', companyData);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // --- UPDATE ---
  const updateCompany = async (id, updateData) => {
    setLoading(true);
    try {
      const { data } = await axiosSecure.put(`/company/update/${id}`, updateData);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // --- DELETE ---
  const removeCompany = async (id) => {
    setLoading(true);
    try {
      await axiosSecure.delete(`/company/delete/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- PAGINATION ---
  const getPaginated = useCallback(async (params) => {
    setLoading(true);
    try {
      // params could be { page: 1, limit: 10 }
      const { data } = await axiosSecure.get('/company/paginate', { params });
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  return {
    loading,
    error,
    getAllCompanies,
    getCompaniesByCity,
    getCompanyById,
    createCompany,
    updateCompany,
    removeCompany,
    getPaginated
  };
};