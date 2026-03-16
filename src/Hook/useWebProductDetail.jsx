import { useState, useEffect } from 'react';
import axios from 'axios';

export const useWebProductDetail = (id) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            
            try {
                setLoading(true);
                setError(null);
                
                // Matches your backend route: WebProductRoutes.get("/get-id/:id", getWebProductById);
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/web-products/get-id/${id}`
                );
                
                setProduct(response.data);
            } catch (err) {
                setError(err.response?.data?.message || err.message || "Failed to fetch product details");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    return { product, loading, error };
};