import { useState, useCallback, useEffect } from 'react';
import useAuth from './useAuth';
// IMPORTANT: Adjust this import path to match where your AuthContext is actually located!


// Using environment variable for the base URL
const API = `${process.env.REACT_APP_BACKEND_URL}/two-dot-banners`;

const useTwoDotBanners = () => {
    // Bring in branch from Auth context
    const { branch } = useAuth(); 

    const [banners, setBanners] = useState([]);
    const [pagination, setPagination] = useState({ totalItems: 0, totalPages: 1, currentPage: 1, itemsPerPage: 10 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all banners (paginated)
    const fetchBanners = useCallback(async (page = 1, limit = 10) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API}?page=${page}&limit=${limit}`);
            const data = await response.json();
            if (response.ok) {
                setBanners(data.data);
                setPagination(data.pagination);
            } else {
                throw new Error(data.error || 'Failed to fetch banners');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Get a specific banner by ID
    const getBannerById = async (id) => {
        try {
            const response = await fetch(`${API}/get-id/${id}`);
            const data = await response.json();
            if (response.ok) {
                return { success: true, data };
            } else {
                return { success: false, error: data.message || 'Banner not found' };
            }
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    // Create a new banner
    const addBanner = async (bannerData) => {
        try {
            // Automatically inject the branch from useAuth into the payload
            const payload = { ...bannerData, branch };

            const response = await fetch(`${API}/post`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (response.ok) {
                fetchBanners(pagination.currentPage); // Refresh list
                return { success: true, data };
            }
            return { success: false, error: data.error || 'Failed to create' };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    // Update an existing banner
    const updateBanner = async (id, bannerData) => {
        try {
            // Automatically inject the branch from useAuth into the payload
            const payload = { ...bannerData, branch };

            const response = await fetch(`${API}/update/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (response.ok) {
                fetchBanners(pagination.currentPage); // Refresh list
                return { success: true, data };
            }
            return { success: false, error: data.message || 'Failed to update' };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    // Delete a banner
    const deleteBanner = async (id) => {
        try {
            const response = await fetch(`${API}/delete/${id}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (response.ok) {
                fetchBanners(pagination.currentPage); // Refresh list
                return { success: true };
            }
            return { success: false, error: data.message || 'Failed to delete' };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    // Initial fetch on mount
    useEffect(() => {
        fetchBanners();
    }, [fetchBanners]);

    return {
        banners,
        pagination,
        loading,
        error,
        fetchBanners,
        getBannerById,
        addBanner,
        updateBanner,
        deleteBanner
    };
};

export default useTwoDotBanners;