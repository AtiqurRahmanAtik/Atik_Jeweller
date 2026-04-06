import { useState, useEffect, useCallback } from "react";
import useAuth from "./useAuth";


const API = `${process.env.REACT_APP_BACKEND_URL}/orders`;

export const useOrders = (page = 1, limit = 10) => {

  const { branch } = useAuth(); // Extracted branch from useAuth

  const [orders, setOrders] = useState([]);
  const [singleOrder, setSingleOrder] = useState(null);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- GET ALL ORDERS ---
  const getAllOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/?page=${page}&limit=${limit}`);
      const result = await response.json();
      if (result.success) {
        setOrders(result.data);
        setPagination(result.pagination);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  // --- GET ORDER BY ID ---
  const getOrderById = useCallback(async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await fetch(`${API}/get-id/${id}`);
      const result = await response.json();
      setSingleOrder(result);
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- CREATE ORDER ---
  const createOrder = async (orderData) => {
    setLoading(true);
    try {
      // Auto-inject the branch from Auth context
      const payload = { ...orderData, branch }; 
      const response = await fetch(`${API}/post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      await getAllOrders(); // Refresh list
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // --- UPDATE ORDER ---
  const updateOrder = async (id, orderData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      const result = await response.json();
      await getAllOrders(); // Refresh list
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // --- DELETE ORDER ---
  const deleteOrder = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/delete/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      await getAllOrders(); // Refresh list
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount or page change
  useEffect(() => {
    getAllOrders();
  }, [getAllOrders]);

  return {
    orders,
    singleOrder,
    pagination,
    loading,
    error,
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
  };
};