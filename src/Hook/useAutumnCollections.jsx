// File: src/hooks/useAutumnCollections.js

import { useState, useEffect, useCallback } from 'react';
import useAuth from "./useAuth"; // Assuming you have this hook

const API = `${process.env.REACT_APP_BACKEND_URL}/autumn-collections`;

const useAutumnCollections = (page = 1, limit = 10) => {
    const { branch } = useAuth(); // Extracted branch from useAuth
    
    const [autumnCollections, setAutumnCollections] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAutumnCollections = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch by branch if available, otherwise fetch all
            const endpoint = branch 
                ? `${API}/${branch}/get-all?page=${page}&limit=${limit}`
                : `${API}?page=${page}&limit=${limit}`;

            const response = await fetch(endpoint);
            
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new TypeError("Oops, we haven't got JSON! Check your backend URL.");
            }

            if (!response.ok) throw new Error("Failed to fetch autumn collections");

            const result = await response.json();
            
            if (result.success) {
                setAutumnCollections(result.data);
                setPagination(result.pagination);
            } else {
                throw new Error(result.message || "Error fetching data");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [page, limit, branch]);

    useEffect(() => {
        fetchAutumnCollections();
    }, [fetchAutumnCollections]);

    // GET BY ID
    const getCollectionById = async (id) => {
        try {
            const response = await fetch(`${API}/get-id/${id}`);
            if (!response.ok) {
                if (response.status === 404) throw new Error("AutumnCollection not found");
                throw new Error("Failed to fetch item details");
            }
            const data = await response.json();
            return { success: true, data };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    // CREATE
    const addCollection = async (data) => {
        try {
            const response = await fetch(`${API}/post`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, branch }), // Attach branch automatically
            });
            if (!response.ok) throw new Error("Failed to create item");
            await fetchAutumnCollections(); 
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    // UPDATE
    const updateCollection = async (id, data) => {
        try {
            const response = await fetch(`${API}/update/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, branch }), // Attach branch
            });
            if (!response.ok) throw new Error("Failed to update item");
            await fetchAutumnCollections(); 
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    // DELETE
    const deleteCollection = async (id) => {
        try {
            const response = await fetch(`${API}/delete/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error("Failed to delete item");
            await fetchAutumnCollections(); 
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    return { 
        autumnCollections, 
        pagination, 
        loading, 
        error,
        getCollectionById,
        addCollection, 
        updateCollection, 
        deleteCollection,
        refresh: fetchAutumnCollections 
    };
};

export default useAutumnCollections;