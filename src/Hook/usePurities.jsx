import { useState, useCallback } from "react";
import axios from "axios";
import useAuth from "./useAuth";

const API = `${process.env.REACT_APP_BACKEND_URL}/purities`;


export const usePurities = () => {

  const { branch } = useAuth();

  const [purities, setPurities] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);


  console.log("purities :", purities);
  

  // GET
  const fetchPurities = useCallback(async (page = 1, limit = 10) => {

    try {

      setLoading(true);

      const res = await axios.get(`${API}/${branch}/get-all?page=${page}&limit=${limit}`);

      setPurities(res.data.data);
      setPagination(res.data.pagination);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  }, [branch]);


  // CREATE
  const createPurity = async (purityData) => {

    try {

      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/purities/post`,
        {
          ...purityData,
          branch
        }
      );

      return res.data;

    } catch (err) {

      console.log(err.response?.data);

    }

  };


  // UPDATE
  const updatePurity = async (id, purityData) => {

    try {

      setLoading(true);

      await axios.put(`${API}/update/${id}`, {
        ...purityData,
        branch
      });

      return true;

    } catch (err) {

      console.log(err);

      return false;

    } finally {

      setLoading(false);

    }

  };


  // DELETE
  const deletePurity = async (id) => {

    try {

      setLoading(true);

      await axios.delete(`${API}/delete/${id}`);

      return true;

    } catch (err) {

      console.log(err);

      return false;

    } finally {

      setLoading(false);

    }

  };

  return {
    purities,
    pagination,
    loading,
    fetchPurities,
    createPurity,
    updatePurity,
    deletePurity
  };

};