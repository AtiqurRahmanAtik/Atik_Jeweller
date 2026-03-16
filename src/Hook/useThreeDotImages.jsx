import { useState, useCallback } from "react";
import axios from "axios";
import useAuth from "./useAuth";

const API = `${process.env.REACT_APP_BACKEND_URL}/three-dot-images`;

export const useThreeDotImages = () => {
  const { branch } = useAuth();

  const [threeDotImages, setThreeDotImages] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  // GET ALL IMAGES (No branch filter)
  const fetchAllThreeDotImages = useCallback(async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/?page=${page}&limit=${limit}`);
      setThreeDotImages(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // GET ALL BY BRANCH
  const fetchThreeDotImages = useCallback(async (page = 1, limit = 10) => {
    if (!branch) return;
    try {
      setLoading(true);
      const res = await axios.get(`${API}/${branch}/get-all?page=${page}&limit=${limit}`);
      setThreeDotImages(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [branch]);

  // CREATE
  const createThreeDotImage = async (imageData) => {
    try {
      setLoading(true);
      const payload = {
        ...imageData,
        branch: imageData.branch || branch,
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
  const updateThreeDotImage = async (id, imageData) => {
    try {
      setLoading(true);
      await axios.put(`${API}/update/${id}`, {
        ...imageData,
        branch: imageData.branch || branch,
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
  const deleteThreeDotImage = async (id) => {
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
    threeDotImages,
    pagination,
    loading,
    fetchAllThreeDotImages,
    fetchThreeDotImages,
    createThreeDotImage,
    updateThreeDotImage,
    deleteThreeDotImage,
  };
};