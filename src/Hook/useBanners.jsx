import { useState, useCallback } from "react";
import axios from "axios";
import useAuth from "./useAuth";

const API = `${process.env.REACT_APP_BACKEND_URL}/banners`;

export const useBanners = () => {
  const { branch } = useAuth();

  const [banners, setBanners] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  // GET ALL BANNERS (No branch filter)
  const fetchAllBanners = useCallback(async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      // Matches backend: /banners/
      const res = await axios.get(`${API}/?page=${page}&limit=${limit}`);
      setBanners(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // GET ALL BY BRANCH
  const fetchBanners = useCallback(async (page = 1, limit = 10) => {
    if (!branch) return;
    try {
      setLoading(true);
      // Matches backend: /banners/:branch/get-all
      const res = await axios.get(`${API}/${branch}/get-all?page=${page}&limit=${limit}`);
      setBanners(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [branch]);

  // CREATE
  const createBanner = async (bannerData) => {
    try {
      setLoading(true);
      // Ensure branch is passed to avoid the 400 validation error
      const payload = {
        ...bannerData,
        branch: bannerData.branch || branch,
      };
      
      const res = await axios.post(`${API}/post`, payload);
      return res.data;
    } catch (err) {
      console.error(err.response?.data || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // UPDATE
  const updateBanner = async (id, bannerData) => {
    try {
      setLoading(true);
      await axios.put(`${API}/update/${id}`, {
        ...bannerData,
        branch: bannerData.branch || branch,
      });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // DELETE
  const deleteBanner = async (id) => {
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
    banners,
    pagination,
    loading,
    fetchAllBanners, // <-- Exported the new function here
    fetchBanners,
    createBanner,
    updateBanner,
    deleteBanner,
  };
};