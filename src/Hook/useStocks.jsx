import { useState, useCallback } from "react";
import axios from "axios";
import useAuth from "./useAuth"; // Adjust path if necessary

const API = `${process.env.REACT_APP_BACKEND_URL}/stock`;

export const useStocks = () => {

  const { branch } = useAuth();

  const [stocks, setStocks] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  console.log("stocks :", stocks);


  // GET
  const fetchStocks = useCallback(async (page = 1, limit = 10) => {

    if (!branch) return;

    try {

      setLoading(true);

      const res = await axios.get(`${API}/${branch}/get-all?page=${page}&limit=${limit}`);

      setStocks(res.data.data);
      setPagination(res.data.pagination);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);
  
    }

  }, [branch]);

  // CREATE
  const createStock = async (stockData) => {

    try {

      const res = await axios.post(
        `${API}/post`,
        {
          ...stockData,
          branch
        }
      );

      return res.data;

    } catch (err) {

      console.log(err.response?.data);

    }

  };

  // UPDATE
  const updateStock = async (id, stockData) => {

    try {

      setLoading(true);

      await axios.put(`${API}/update/${id}`, {
        ...stockData,
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
  const deleteStock = async (id) => {

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
    stocks,
    pagination,
    loading,
    fetchStocks,
    createStock,
    updateStock,
    deleteStock
  };

};