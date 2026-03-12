import { useState } from 'react';
import axios from 'axios';

const useSales = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createSale = async (saleData) => {
        setLoading(true);
        try {
            // Assumes your backend is running on localhost:5000
            const response = await axios.post('/api/sales/post', saleData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}` // Matches your authenticateToken middleware
                }
            });
            return response.data;
        } catch (err) {
            setError(err.response?.data?.error || "Failed to create sale");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { createSale, loading, error };
};

export default useSales;