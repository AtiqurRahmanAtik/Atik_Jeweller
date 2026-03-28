import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGoldProducts } from '../../Hook/useGoldProducts'; 
import { Heart, Maximize2, Facebook, Twitter, Linkedin, Send, Pin, Loader2 } from 'lucide-react';

// --- Swiper Imports ---
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ShopDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { getGoldProductById, loading, fetchGoldProducts, goldProducts } = useGoldProducts();
  const [product, setProduct] = useState(null);
  
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');

  // 1. Fetch SINGLE product details whenever the URL ID changes
  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        const data = await getGoldProductById(id);
        setProduct(data);
        setMainImage(data?.productImage || 'https://placehold.co/600x600/1a1a1a/FFF?text=Gold+Jewelry');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    fetchProduct();
  }, [id]); // Only triggers when ID changes

  // 2. Fetch ALL products so we have a list to pick related items from
  useEffect(() => {
    fetchGoldProducts(1, 100); // Grab a good amount (100) to ensure we have matches
  }, [fetchGoldProducts]);

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };
  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
  };

  // --- BULLETPROOF RELATED PRODUCTS FILTER ---
  let relatedProducts = (goldProducts || []).filter((item) => {
    // 1. Make category matching case-insensitive to prevent strict comparison errors
    const itemCat = item?.category?.toLowerCase() || "";
    const prodCat = product?.category?.toLowerCase() || "";
    
    return itemCat === prodCat && item?._id !== product?._id;
  });

  // 2. FALLBACK: If there are no exact category matches, just show 8 other items from the store
  if (relatedProducts.length === 0 && goldProducts?.length > 0) {
    relatedProducts = goldProducts.filter(item => item?._id !== product?._id).slice(0, 8);
  }

  // --- Loading State ---
  if (loading && !product) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <Loader2 className="animate-spin text-gray-800" size={48} />
      </div>
    );
  }

  // --- Not Found State ---
  if (!product && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center bg-white">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
        <button 
          onClick={() => navigate('/shop')} 
          className="bg-black text-white px-6 py-2 text-sm uppercase tracking-wide hover:bg-gray-800 transition"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const originalPrice = product?.originalPrice || (product?.salesPrice * 0.9) || 0; 
  const vatAmount = originalPrice * 0.05;
  const wagesAmount = originalPrice * 0.06;
  const totalPrice = product?.salesPrice || (originalPrice + vatAmount + wagesAmount);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-white font-sans text-gray-800">
      
      {/* --- Top Section: Product Details --- */}
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start mb-20">
        
        {/* --- Left Column: Images --- */}
        <div className="w-full lg:w-[55%] flex gap-4">
          <div className="flex flex-col gap-4 w-20 shrink-0 hidden md:flex">
            <div 
              className={`border-2 cursor-pointer transition-colors ${mainImage === product?.productImage ? 'border-gray-800' : 'border-transparent hover:border-gray-300'}`}
              onClick={() => setMainImage(product?.productImage)}
            >
              <img 
                src={product?.productImage || 'https://placehold.co/100x100/1a1a1a/FFF'} 
                alt="thumbnail 1" 
                className="w-full h-auto object-cover" 
              />
            </div>
          </div>

          <div className="relative w-full bg-[#0a0a0a] flex items-center justify-center group overflow-hidden">
            <img 
              src={mainImage} 
              alt={product?.productName} 
              className="w-full h-auto object-contain max-h-[600px] hover:scale-105 transition-transform duration-500"
              onError={(e) => { e.target.src = 'https://placehold.co/600x600/1a1a1a/FFF?text=No+Image'; }}
            />
            <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] font-bold px-3 py-1 uppercase rounded-sm shadow-sm z-10">
              New Arrival
            </div>
            <button className="absolute top-14 right-4 bg-white p-2 rounded-full shadow-md text-gray-500 hover:text-black transition opacity-0 group-hover:opacity-100 z-10">
              <Maximize2 size={16} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* --- Right Column: Details --- */}
        <div className="w-full lg:w-[45%] flex flex-col pt-2">
          
          <h1 className="text-2xl font-medium text-gray-900 mb-6 hidden md:block">
            {product?.productName}
          </h1>

          <div className="space-y-1.5 mb-6 text-sm text-gray-600">
            <p>মূল দাম: {originalPrice.toLocaleString('en-BD', { minimumFractionDigits: 2 })}৳</p>
            <p>VAT (5%): {vatAmount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}৳</p>
            <p>মজুরি (6%): {wagesAmount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}৳</p>
            
            <div className="inline-block bg-[#fde047] px-4 py-2 mt-2">
              <span className="text-gray-900 font-semibold">
                মোট দাম: <span className="font-bold text-lg ml-1">{totalPrice.toLocaleString('en-BD', { minimumFractionDigits: 2 })}৳</span>
              </span>
            </div>
          </div>

          <div className="mb-6 text-sm">
            <span className="text-gray-600">Availability: </span>
            <span className="text-green-600 font-medium">In Stock</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center border border-gray-300 bg-white">
              <button onClick={handleDecrement} className="px-4 py-2.5 text-gray-500 hover:text-black transition font-bold">−</button>
              <span className="w-10 text-center text-sm font-medium">{quantity}</span>
              <button onClick={handleIncrement} className="px-4 py-2.5 text-gray-500 hover:text-black transition font-bold">+</button>
            </div>
            <button className="flex-1 min-w-[160px] bg-[#222] text-white text-xs font-bold uppercase tracking-widest py-3.5 hover:bg-black transition">
              ADD TO CART
            </button>
          </div>

          <button className="w-full bg-[#e6e6e6] text-gray-900 text-xs font-bold uppercase tracking-widest py-3.5 hover:bg-gray-300 transition mb-8">
            BUY IT NOW
          </button>

          <div className="space-y-4 mb-8">
            <button className="flex items-center gap-2 text-gray-600 hover:text-black text-sm transition">
              <Heart size={16} strokeWidth={1.5} /> Add to wishlist
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <span>Estimated Delivery: <span className="text-gray-800">31 March - 04 April</span></span>
            </div>
          </div>

          <div className="space-y-2 mb-8 text-sm">
            <p className="text-gray-500">
              Category: <span className="text-gray-800 cursor-pointer hover:underline">{product?.category}</span>
            </p>
            <p className="text-gray-500">
              Tag: <span className="text-gray-800 cursor-pointer hover:underline">deshi jewelry</span>
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-800">
            <span className="font-medium text-gray-600">Share:</span>
            <div className="flex items-center gap-3">
              <button className="text-gray-600 hover:text-black transition"><Facebook size={16} /></button>
              <button className="text-gray-600 hover:text-black transition">
                <svg width="14" height="14" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="currentColor"/>
                </svg>
              </button>
              <button className="text-gray-600 hover:text-black transition"><Linkedin size={16} /></button>
              <button className="text-gray-600 hover:text-black transition"><Send size={16} /></button>
              <button className="text-gray-600 hover:text-black transition"><Pin size={16} /></button>
            </div>
          </div>

        </div>
      </div>

      {/* --- Bottom Section: Related Products Slider --- */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 pt-10 border-t border-gray-100">
          
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="h-[1px] bg-gray-200 flex-1 max-w-[200px]"></div>
            <h2 className="text-xl font-medium text-gray-900 tracking-wide uppercase">
              Related Products
            </h2>
            <div className="h-[1px] bg-gray-200 flex-1 max-w-[200px]"></div>
          </div>

          <div className="relative pb-10">
            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              spaceBetween={24}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true, dynamicBullets: true }}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              breakpoints={{
                480: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              className="!pb-12"
            >
              {relatedProducts.map((relProduct) => (
                <SwiperSlide key={relProduct._id}>
                  <div 
                    className="group relative cursor-pointer flex flex-col h-full"
                    onClick={() => navigate(`/shop/${relProduct._id}`)}
                  >
                    <div className="relative overflow-hidden bg-gray-50 aspect-square mb-4">
                      <img
                        src={relProduct.productImage}
                        alt={relProduct.productName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.src = 'https://placehold.co/400x400/f5e6c8/b8860b?text=Gold'; }}
                      />
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 pointer-events-none group-hover:pointer-events-auto">
                         <button className="bg-white text-black px-6 py-2 text-xs font-bold uppercase tracking-wider shadow-lg hover:bg-[#fde047] transition w-[80%]">
                            Quick View
                         </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-col flex-grow">
                      <p className="text-[10px] text-gray-400 tracking-widest uppercase mb-1">
                        {relProduct.category}
                      </p>
                      <h3 className="text-[14px] text-gray-800 font-medium leading-snug mb-1 truncate group-hover:text-yellow-600 transition">
                        {relProduct.productName}
                      </h3>
                      <p className="text-[15px] font-bold text-gray-900 mt-auto">
                        {relProduct.salesPrice?.toLocaleString('en-BD', { minimumFractionDigits: 2 })}৳
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

        </div>
      )}
      
    </div>
  );
};

export default ShopDetails;