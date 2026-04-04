// File: src/pages/AutumnProductDetails/AutumnProductDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Heart, Share2, Facebook, Twitter, Linkedin, Instagram, Minus, Plus } from 'lucide-react';
import useAutumnCollections from '../../Hook/useAutumnCollections';

const AutumnProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCollectionById } = useAutumnCollections();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('additional');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const result = await getCollectionById(id);
      if (result.success) {
        setProduct(result.data);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading Details...</div>;
  if (!product) return <div className="h-screen flex items-center justify-center">Product not found.</div>;

  // Calculations based on the UI logic in the image
  const originalPrice = Number(product.originalPrice || product.totalPrice * 0.9); 
  const vat = originalPrice * 0.05;
  const makingCharge = originalPrice * 0.06;
  const totalPrice = originalPrice + vat + makingCharge;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 md:py-16 bg-white">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 mb-6 text-gray-500 hover:text-black transition-colors"
      >
        <ArrowLeft size={18} /> <span className="text-sm font-medium">Back to Collection</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        
        {/* LEFT: Product Image Section */}
        <div className="relative group">
          <div className="border border-gray-100 rounded-lg overflow-hidden bg-[#F8F8F8]">
            <img 
              src={product.imageUrl} 
              alt={product.productTitle} 
              className="w-full h-auto object-cover"
            />
          </div>
          {/* Zoom icon placeholder as seen in image */}
          <div className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-sm cursor-pointer hover:bg-gray-100">
             <Plus size={18} className="text-gray-600" />
          </div>
        </div>

        {/* RIGHT: Product Info Section */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-serif text-gray-800 mb-4">{product.productTitle}</h1>
          
          {/* Price Breakdown */}
          <div className="space-y-1 mb-4 border-b border-gray-100 pb-4 text-sm text-gray-600">
            <p>মূল দাম: {originalPrice.toLocaleString()}৳</p>
            <p>VAT (5%): {vat.toLocaleString()}৳</p>
            <p>মজুরি (6%): {makingCharge.toLocaleString()}৳</p>
            <div className="mt-3 inline-block bg-[#FFEB99] px-4 py-2 rounded-sm">
               <p className="text-lg font-bold text-gray-900">
                 মোট দাম: {totalPrice.toLocaleString()}৳
               </p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm font-medium">Availability: <span className="text-green-600">In Stock</span></p>
          </div>

          {/* Quantity and Actions */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center border border-gray-300 rounded-md">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-gray-100 transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="px-6 font-medium">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 hover:bg-gray-100 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
            
            <button className="bg-[#222] text-white px-10 py-3.5 font-bold text-xs uppercase tracking-widest hover:bg-black transition-colors rounded-sm">
              Add to Cart
            </button>
          </div>

          <button className="w-full md:w-auto bg-[#E5E5E5] text-gray-700 py-3.5 px-20 font-bold text-xs uppercase tracking-widest hover:bg-gray-300 transition-colors mb-6 rounded-sm">
            Buy It Now
          </button>

          {/* Secondary Actions */}
          <div className="flex flex-col gap-3 border-t border-gray-100 pt-6">
            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-500 transition-colors w-fit">
              <Heart size={16} /> Add to wishlist
            </button>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Estimated Delivery:</span> 07 April - 11 April
            </p>
            <div className="text-sm text-gray-600 mt-2">
              <p>Category: <span className="text-gray-400 capitalize">{product.category || 'Rings'}</span></p>
              <p>Tag: <span className="text-gray-400">rings</span></p>
            </div>

            {/* Social Share */}
            <div className="flex items-center gap-4 mt-4">
              <span className="text-sm text-gray-600">Share:</span>
              <div className="flex gap-3 text-gray-500">
                <Facebook size={16} className="cursor-pointer hover:text-blue-600" />
                <Twitter size={16} className="cursor-pointer hover:text-blue-400" />
                <Linkedin size={16} className="cursor-pointer hover:text-blue-700" />
                <Instagram size={16} className="cursor-pointer hover:text-pink-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-20 border-t border-gray-100 pt-10">
        <div className="flex justify-center gap-8 border-b border-gray-100 mb-8">
          <button 
            className={`pb-4 text-sm font-medium uppercase tracking-widest transition-all ${activeTab === 'additional' ? 'border-b-2 border-black text-black' : 'text-gray-400'}`}
            onClick={() => setActiveTab('additional')}
          >
            Additional information
          </button>
        </div>

        {activeTab === 'additional' && (
          <div className="max-w-2xl mx-auto">
            <table className="w-full text-sm border-collapse">
              <tbody>
                <tr className="border-y border-gray-100">
                  <td className="py-4 font-bold text-gray-700 uppercase w-1/3">Weight</td>
                  <td className="py-4 text-gray-500 italic">{product.weight || '14.76 gm'}</td>
                </tr>
                {/* You can add more specs here if they exist in your DB */}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutumnProductDetails;