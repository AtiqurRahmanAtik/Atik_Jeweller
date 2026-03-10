import { useState, useCallback } from "react";
import UseAxiosSecure from "./UseAxioSecure";
import useAuth from "./useAuth";

export const useDailyPrice = () => {
  const axiosSecure = UseAxiosSecure();
  const { branch } = useAuth(); 

  // States just like useMetalTypes
  const [dailyPrices, setDailyPrices] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log("dailyPrices :", dailyPrices);

  // GET ALL (with Pagination & Branch)
  const fetchDailyPrices = useCallback(async (page = 1, limit = 10) => {
    if (!branch) return;

    try {
      setLoading(true);
      setError(null);
      
      // Matches your branch specific route
      const res = await axiosSecure.get(`/daily-price/${branch}/get-all?page=${page}&limit=${limit}`);

      setDailyPrices(res.data.data || res.data); 
      setPagination(res.data.pagination || {});
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure, branch]);


  // GET BY ID (Optional, kept just in case you need it)
  const getDailyPriceById = async (id) => {
    try {
      setLoading(true);
      const res = await axiosSecure.get(`/daily-price/get-id/${id}`);
      return res.data;
    } catch (err) {
      console.log(err);
      return null;
    } finally {
      setLoading(false);
    }
  };


  // CREATE
  const createDailyPrice = async (payload) => {
    try {
      setLoading(true);
      const res = await axiosSecure.post("/daily-price/post", {
        ...payload,
        branch // Inject branch automatically
      });
      return res.data;
    } catch (err) {
      console.log(err.response?.data);
      setError(err.response?.data?.message || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };


  // UPDATE
  const updateDailyPrice = async (id, payload) => {
    try {
      setLoading(true);
      await axiosSecure.put(`/daily-price/update/${id}`, {
        ...payload,
        branch
      });
      return true;
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };


  // DELETE
  const removeDailyPrice = async (id) => {
    try {
      setLoading(true);
      await axiosSecure.delete(`/daily-price/delete/${id}`);
      return true;
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };


  return {
    dailyPrices,
    pagination,
    loading,
    error,
    fetchDailyPrices,
    getDailyPriceById,
    createDailyPrice,
    updateDailyPrice,
    removeDailyPrice
  };
};