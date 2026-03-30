// File: src/pages/TrendyCollectionDetails/TrendyCollectionDetails.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
    Minus, 
    Plus, 
    Heart, 
    Clock, 
    Facebook, 
    Twitter, 
    Linkedin, 
    Send, 
    Image as ImageIcon // Fallback for Pinterest/other icons
} from 'lucide-react';

// Assuming you have your BASE_URL defined somewhere, or replace it with your actual backend URL
const API = `${process.env.REACT_APP_BACKEND_URL}/trendy-collections`; 

const TrendyCollectionDetails = () => {
    const { id } = useParams();
    
    // States
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);

    // GET BY ID (Your provided integration)
    const getCollectionById = async (productId) => {
        try {
            const response = await fetch(`${API}/get-id/${productId}`);
            if (!response.ok) {
                if (response.status === 404) throw new Error("TrendyCollection not found");
                throw new Error("Failed to fetch item details");
            }
            const data = await response.json();
            return { success: true, data };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    // Fetch data on mount
    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            const result = await getCollectionById(id);
            if (result.success) {
                setProduct(result.data);
            } else {
                setError(result.error);
            }
            setLoading(false);
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    // Quantity Handlers
    const handleIncrease = () => setQuantity(prev => prev + 1);
    const handleDecrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#222]"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex justify-center items-center min-h-[60vh] text-red-500 font-semibold text-lg">
                {error || "Product not found"}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl font-sans text-[#333]">
            <div className="flex flex-col md:flex-row gap-10 md:gap-16">
                
                {/* --- Left Column: Product Image --- */}
                <div className="md:w-1/2 relative bg-[#f9f9f9] border border-gray-200 flex items-center justify-center">
                    <img 
                        src={product.imageUrl} 
                        alt={product.productTitle} 
                        className="w-full h-auto object-cover max-h-[600px]"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/600?text=No+Image' }}
                    />
                    {/* Expand/Zoom Icon (Top Right) */}
                    <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-sm hover:shadow-md transition-shadow">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                    </button>
                </div>

                {/* --- Right Column: Product Details --- */}
                <div className="md:w-1/2 flex flex-col justify-start">
                    
                    {/* Title */}
                    <h1 className="text-[28px] leading-tight font-normal text-gray-800 mb-6">
                        {product.productTitle}
                    </h1>

                    {/* Pricing Breakdown */}
                    <div className="flex flex-col gap-1.5 mb-5 text-[15px] text-gray-600">
                        <p>মূল দাম: {Number(product.originalPrice).toLocaleString()}৳</p>
                        
                        {/* Calculating 5% VAT based on image reference, adjust if you have a real VAT field */}
                        <p>VAT (5%): {Number(product.originalPrice * 0.05).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}৳</p>
                        
                        <p>মজুরি (6%): {Number(product.wages).toLocaleString()}৳</p>
                    </div>

                    {/* Total Price Highlight */}
                    <div className="mb-6">
                        <span className="bg-[#fde68a] text-black px-4 py-1.5 text-lg font-bold inline-block rounded-sm">
                            মোট দাম: {Number(product.totalPrice || product.originalPrice).toLocaleString()}৳
                        </span>
                    </div>

                    {/* Availability */}
                    <div className="mb-6 text-sm">
                        <span className="text-gray-500">Availability: </span>
                        <span className="text-green-600 font-medium">In Stock</span>
                    </div>

                    {/* Cart Actions (Quantity & Add to Cart) */}
                    <div className="flex items-center gap-4 mb-4">
                        {/* Quantity Selector */}
                        <div className="flex items-center border border-gray-300 w-[120px] h-[45px]">
                            <button onClick={handleDecrease} className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
                                <Minus size={14} />
                            </button>
                            <input 
                                type="text" 
                                value={quantity} 
                                readOnly 
                                className="w-10 h-full text-center border-none focus:ring-0 text-sm font-medium"
                            />
                            <button onClick={handleIncrease} className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
                                <Plus size={14} />
                            </button>
                        </div>

                        {/* Add to Cart Button */}
                        <button className="bg-[#222] hover:bg-black text-white text-[13px] font-bold tracking-wider uppercase h-[45px] px-8 transition-colors">
                            Add to Cart
                        </button>
                    </div>

                    {/* Buy It Now Button */}
                    <button className="bg-[#e5e5e5] hover:bg-[#d4d4d4] text-[#222] text-[13px] font-bold tracking-wider uppercase h-[45px] w-[300px] mb-8 transition-colors">
                        Buy It Now
                    </button>

                    {/* Additional Links & Info */}
                    <div className="flex flex-col gap-4 text-sm text-gray-600">
                        
                        <button className="flex items-center gap-2 hover:text-black transition-colors w-max">
                            <Heart size={16} strokeWidth={1.5} />
                            <span>Add to wishlist</span>
                        </button>
                        
                        <div className="flex items-center gap-2">
                            <Clock size={16} strokeWidth={1.5} />
                            <span>Estimated Delivery: {product.estimatedDelivery || "01 April - 05 April"}</span>
                        </div>

                        <div>
                            <span className="text-gray-500">Category: </span>
                            <span className="text-gray-800">{product.category}</span>
                        </div>

                        <div>
                            <span className="text-gray-500">Tags: </span>
                            <span className="text-gray-800">earrings, necklace</span>
                        </div>

                        {/* Social Share Icons */}
                        <div className="flex items-center gap-4 mt-2">
                            <span className="text-gray-500">Share:</span>
                            <div className="flex items-center gap-3 text-gray-800">
                                <a href="#" className="hover:text-black"><Facebook size={15} strokeWidth={2} /></a>
                                <a href="#" className="hover:text-black">
                                    {/* Custom X logo instead of standard twitter bird to match image */}
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                </a>
                                <a href="#" className="hover:text-black"><Linkedin size={15} strokeWidth={2} /></a>
                                <a href="#" className="hover:text-black"><Send size={15} strokeWidth={2} /></a>
                                <a href="#" className="hover:text-black"><ImageIcon size={15} strokeWidth={2} /></a>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default TrendyCollectionDetails;