import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWebProducts } from '../../Hook/useWebProducts'; 
import { 
    ChevronLeft, Heart, Clock, Loader2, Maximize2, 
    Facebook, Twitter, Linkedin, Send, Pin 
} from 'lucide-react';

// Swiper imports for Related Products
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';



const ProductDetails = () => {
    // 1. Get the dynamic ID from the URL
    const { id } = useParams();
    const navigate = useNavigate();
    
    // 2. Extract state and fetch functions from the unified hook
    const { 
        singleProduct: product, 
        webProducts: allProducts, // Fetch all products to filter for related ones
        loading, 
        error, 
        fetchWebProductById,
        fetchAllProducts 
    } = useWebProducts();

    // State for the quantity selector
    const [quantity, setQuantity] = useState(1);

    // Trigger the API calls when the page loads or the ID changes
    useEffect(() => {
        if (id) {
            fetchWebProductById(id);
            // Scroll to top when navigating between related products
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [id, fetchWebProductById]);

    // Fetch all products once to populate the Related Products slider
    useEffect(() => {
        fetchAllProducts(1, 50);
    }, [fetchAllProducts]);

    // Handlers for the Quantity Selector
    const handleDecrement = () => {
        if (quantity > 1) setQuantity(prev => prev - 1);
    };

    const handleIncrement = () => {
        if (product && quantity < product.quantity) setQuantity(prev => prev + 1);
    };

    // --- Show Loading Spinner ---
    if (loading && !product) {
        return (
            <div className="flex h-screen items-center justify-center bg-white">
                <Loader2 className="animate-spin text-[#d4af37]" size={48} />
            </div>
        );
    }

    // --- Show Error or Not Found ---
    if (error || !product) {
        return (
            <div className="flex flex-col h-screen items-center justify-center bg-white text-center px-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Product Not Found</h2>
                <p className="text-gray-500 mb-6">{error || "The product you are looking for does not exist."}</p>
                <button 
                    onClick={() => navigate('/')} 
                    className="bg-[#222] text-white px-6 py-3 text-sm font-semibold uppercase tracking-wider hover:bg-black transition"
                >
                    Return to Homepage
                </button>
            </div>
        );
    }

    // Calculate VAT for the breakdown visually
    const vatAmount = product.originalPrice ? Math.round(product.originalPrice * 0.05) : 0;

    // Filter for Related Products (Same category, excluding current product)
    const relatedProducts = (allProducts || []).filter(
        p => p.category === product.category && p._id !== product._id
    );

    
    
    // --- Show the Product UI ---
    return (
        <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-white min-h-screen font-sans">
            
            {/* Top Back Button */}
            <button 
                onClick={() => navigate(-1)} 
                className="flex items-center text-gray-500 hover:text-black mb-6 transition"
            >
                <ChevronLeft size={24} strokeWidth={1.5} />
            </button>

            {/* --- Top Section: Image & Main Details --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
                
                {/* Left Side: Product Image */}
                <div className="relative w-full aspect-square bg-[#f9f9f9] flex items-center justify-center group overflow-hidden border border-gray-100">
                    <img 
                        src={product.imageUrl} 
                        alt={product.title} 
                        className="w-full h-full object-cover object-center"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/600x600?text=No+Image'; }}
                    />
                    {/* Expand Icon */}
                    <button className="absolute top-4 right-4 bg-white p-2.5 rounded-full shadow-sm text-gray-600 hover:text-black transition">
                        <Maximize2 size={18} strokeWidth={2} />
                    </button>
                </div>

                {/* Right Side: Product Details */}
                <div className="flex flex-col pt-2 lg:pl-4">
                    
                    {/* Title */}
                    <h1 className="text-3xl font-medium text-gray-800 mb-5">
                        {product.title}
                    </h1>
                    
                    {/* Price Breakdown */}
                    <div className="space-y-1 mb-6">
                        <p className="text-[13px] text-gray-500">
                            মূল দাম: {Number(product.originalPrice).toLocaleString('en-IN')}৳
                        </p>
                        <p className="text-[13px] text-gray-500">
                            VAT (5%): {vatAmount.toLocaleString('en-IN')}৳
                        </p>
                        <p className="text-[13px] text-gray-500">
                            মজুরি (6%): {Number(product.wages).toLocaleString('en-IN')}৳
                        </p>
                        
                        {/* Highlighted Total Price */}
                        <div className="inline-block bg-[#fde047] px-3 py-1.5 mt-3">
                            <span className="text-gray-900 font-semibold text-sm">
                                মোট দাম: <span className="font-bold text-lg ml-1">{Number(product.totalPrice).toLocaleString('en-IN')}৳</span>
                            </span>
                        </div>
                    </div>

                    {/* Stock Status */}
                    <p className="text-[13px] mb-5">
                        <span className="text-gray-600">Availability: </span>
                        {product.quantity > 0 ? (
                            <span className="text-green-500 font-medium">In Stock</span>
                        ) : (
                            <span className="text-red-500 font-medium">Out of Stock</span>
                        )}
                    </p>

                    {/* Add to Cart Row */}
                    <div className="flex flex-wrap items-stretch gap-4 mb-3">
                        {/* Quantity Selector */}
                        <div className="flex items-center border border-gray-200 bg-white">
                            <button onClick={handleDecrement} className="px-4 py-2 text-gray-500 hover:text-black transition" disabled={product.quantity <= 0}>−</button>
                            <span className="px-3 py-2 text-[13px] text-center w-10 text-gray-800">{quantity}</span>
                            <button onClick={handleIncrement} className="px-4 py-2 text-gray-500 hover:text-black transition" disabled={product.quantity <= 0}>+</button>
                        </div>
                        
                        {/* Add to Cart Button */}
                        <button 
                            disabled={product.quantity <= 0}
                            className="flex-1 min-w-[150px] bg-[#222] text-white text-xs font-bold uppercase tracking-wide hover:bg-black transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            ADD TO CART
                        </button>
                    </div>

                    {/* Buy It Now Button */}
                    <button 
                        disabled={product.quantity <= 0}
                        className="w-[calc(100%-10px)] max-w-[340px] bg-[#e6e6e6] text-gray-800 py-3 text-xs font-bold uppercase tracking-wide hover:bg-gray-300 transition mb-8 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                        BUY IT NOW
                    </button>

                    {/* Meta Links */}
                    <div className="space-y-3 mb-8">
                        <button className="flex items-center gap-2 text-gray-600 hover:text-black text-[13px] transition">
                            <Heart size={16} strokeWidth={1.5} /> Add to wishlist
                        </button>
                        
                        <div className="flex items-center gap-2 text-gray-600 text-[13px]">
                            <Clock size={16} strokeWidth={1.5} /> 
                            <span>Estimated Delivery: {product.delivery}</span>
                        </div>
                    </div>

                    {/* Categories & Tags */}
                    <div className="space-y-1.5 mb-8 text-[13px]">
                        <p className="text-gray-500">Category: <span className="text-gray-800">{product.category}</span></p>
                        <p className="text-gray-500">Tag: <span className="text-gray-800">{product.tag}</span></p>
                    </div>

                    {/* Social Share */}
                    <div className="flex items-center gap-3 text-[13px] text-gray-800">
                        <span className="font-medium text-gray-600">Share:</span>
                        <div className="flex items-center gap-3">
                            <button className="text-gray-800 hover:text-black"><Facebook size={14} /></button>
                            <button className="text-gray-800 hover:text-black"><Twitter size={14} /></button>
                            <button className="text-gray-800 hover:text-black"><Linkedin size={14} /></button>
                            <button className="text-gray-800 hover:text-black"><Send size={14} /></button>
                            <button className="text-gray-800 hover:text-black"><Pin size={14} /></button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Additional Information Tabs --- */}
            <div className="mt-16 pt-8 border-t border-gray-100">
                <div className="flex justify-center mb-8">
                    <h3 className="text-[15px] font-medium text-gray-800 border-b-2 border-gray-800 pb-2 inline-block tracking-wide">
                        Additional information
                    </h3>
                </div>
                
                <div className="max-w-4xl mx-auto px-4 sm:px-0">
                    <table className="w-full border-collapse text-[13px]">
                        <tbody>
                            <tr className="border border-gray-200">
                                <th className="py-3 px-6 text-left font-bold text-gray-800 w-1/4 sm:w-1/3 uppercase bg-white align-top">
                                    WEIGHT
                                </th>
                                <td className="py-3 px-6 text-left text-gray-500 bg-white border-l border-gray-200 align-top">
                                    {product.weight}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- Related Products Section --- */}
            {relatedProducts.length > 0 && (
                <div className="mt-20 pt-10 border-t border-gray-100">
                    
                    {/* Related Products Header */}
                    <div className="flex items-center justify-center gap-6 mb-10">
                        <div className="h-[1px] bg-gray-200 w-full max-w-[250px]"></div>
                        <h2 className="text-xl font-medium text-gray-800 whitespace-nowrap tracking-wide">
                            Related Products
                        </h2>
                        <div className="h-[1px] bg-gray-200 w-full max-w-[250px]"></div>
                    </div>

                    {/* Related Products Swiper */}
                    <div className="relative pb-12">
                        <Swiper
                            modules={[Pagination, Navigation, Autoplay]}
                            spaceBetween={24}
                            slidesPerView={1}
                            navigation
                            pagination={{ clickable: true, dynamicBullets: true }}
                            autoplay={{ delay: 4000, disableOnInteraction: false }}
                            breakpoints={{
                                480: { slidesPerView: 2 },
                                768: { slidesPerView: 3 },
                                1024: { slidesPerView: 4 },
                                1280: { slidesPerView: 5 },
                            }}
                            className="!pb-14"
                        >
                            {relatedProducts.map((p) => {
                                const relVatAmount = p.originalPrice ? Math.round(p.originalPrice * 0.05) : 0;
                                
                                return (
                                    <SwiperSlide key={p._id}>
                                        <div className="flex flex-col group h-full">
                                            
                                            {/* Product Image & Quick View Overlay */}
                                            <div className="relative w-full aspect-square bg-[#f9f9f9] flex items-center justify-center overflow-hidden mb-4">
                                                <img 
                                                    src={p.imageUrl} 
                                                    alt={p.title} 
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=No+Image'; }}
                                                />
                                                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6 z-10 pointer-events-none group-hover:pointer-events-auto">
                                                    <button 
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            navigate(`/product/${p._id}`);
                                                        }}
                                                        className="bg-white text-black px-6 py-2.5 text-xs font-bold uppercase tracking-wider shadow-lg hover:bg-[#d4af37] hover:text-white transition-colors w-[80%]"
                                                    >
                                                        Quick View
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Category, Title, Heart */}
                                            <div className="flex justify-between items-start mb-2 px-1">
                                                <div className="flex flex-col pr-2">
                                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 truncate">
                                                        {p.category}
                                                    </p>
                                                    <h3 className="text-sm text-gray-800 font-medium hover:text-[#d4af37] transition cursor-pointer truncate" onClick={() => navigate(`/product/${p._id}`)}>
                                                        {p.title}
                                                    </h3>
                                                </div>
                                                <button className="text-gray-400 hover:text-red-500 pt-0.5 flex-shrink-0 transition">
                                                    <Heart size={14} strokeWidth={1.5} />
                                                </button>
                                            </div>

                                            {/* Price Breakdown */}
                                            <div className="space-y-0.5 mb-3 px-1 flex-grow">
                                                <p className="text-[11px] text-gray-500">মূল দাম: {Number(p.originalPrice).toLocaleString('en-IN')}৳</p>
                                                <p className="text-[11px] text-gray-500">VAT (5%): {relVatAmount.toLocaleString('en-IN')}৳</p>
                                                <p className="text-[11px] text-gray-500">মজুরি (6%): {Number(p.wages).toLocaleString('en-IN')}৳</p>
                                            </div>

                                            {/* Total Price Box */}
                                            <div className="inline-block bg-[#fde047] px-2 py-1.5 self-start ml-1">
                                                <span className="text-gray-900 font-semibold text-[11px]">
                                                    মোট দাম: <span className="font-bold text-[13px] ml-1">{Number(p.totalPrice).toLocaleString('en-IN')}৳</span>
                                                </span>
                                            </div>
                                            
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;