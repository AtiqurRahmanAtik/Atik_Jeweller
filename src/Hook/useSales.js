import { useState } from 'react';
import axios from 'axios';

// Adjust this base URL to match your Express server setup
const API_URL = process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/sales` : 'http://localhost:5000/sales';

const useSales = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createSale = async (saleData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${API_URL}/post`, saleData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}` 
                }
            });
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.response?.data?.message || "Failed to create sale";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return { createSale, loading, error };
};

export default useSales;