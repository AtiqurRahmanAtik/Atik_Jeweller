import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGoldProducts } from '../../Hook/useGoldProducts';
import {
  Heart, Maximize2, Facebook, Linkedin,
  Send, Pin, Loader2, Home, ChevronRight,
  Minus, Plus, Clock, Tag, Share2
} from 'lucide-react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ShopDetails = () => {
  const { id }       = useParams();
  const navigate     = useNavigate();

  const { getGoldProductById, fetchGoldProducts, goldProducts } = useGoldProducts();

  const [product, setProduct]                     = useState(null);
  const [quantity, setQuantity]                   = useState(1);
  const [mainImage, setMainImage]                 = useState('');
  const [isFetchingProduct, setIsFetchingProduct] = useState(true);
  const [wishlisted, setWishlisted]               = useState(false);
  const [addedToCart, setAddedToCart]             = useState(false);

  /* ── fetch single product ─────────────────────────── */
  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setIsFetchingProduct(true);
      setProduct(null);
      const raw  = await getGoldProductById(id);
      const data = raw?.data ?? raw;
      setProduct(data || null);
      setMainImage(data?.productImage || 'https://placehold.co/700x700/111/fff?text=Gold');
      setIsFetchingProduct(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    load();
  }, [id]); // eslint-disable-line

  /* ── fetch related products ───────────────────────── */
  useEffect(() => {
    fetchGoldProducts(1, 100);
  }, []); // eslint-disable-line

  /* ── related list ─────────────────────────────────── */
  let related = (goldProducts || []).filter(item => {
    const a = item?.category?.toLowerCase() || '';
    const b = product?.category?.toLowerCase() || '';
    return a === b && item?._id !== product?._id;
  });
  if (related.length === 0 && goldProducts?.length > 0) {
    related = goldProducts.filter(i => i?._id !== product?._id).slice(0, 8);
  }

  /* ── price math ───────────────────────────────────── */
  const originalPrice = product?.originalPrice || (product?.salesPrice ? product.salesPrice / 1.11 : 0);
  const vatAmount     = originalPrice * 0.05;
  const wagesAmount   = originalPrice * 0.06;
  const totalPrice    = product?.salesPrice || (originalPrice + vatAmount + wagesAmount);

  const fmt = (n) => Number(n).toLocaleString('en-BD', { minimumFractionDigits: 2 });

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  /* ── loading ──────────────────────────────────────── */
  if (isFetchingProduct) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-[#c8a96e]" size={44} />
          <p className="text-[13px] text-gray-400 tracking-widest uppercase">Loading product…</p>
        </div>
      </div>
    );
  }

  /* ── not found ────────────────────────────────────── */
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white text-center px-6">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-5">
          <Tag size={28} className="text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Product Not Found</h2>
        <p className="text-[13px] text-gray-500 mb-7 max-w-xs">
          The product you're looking for doesn't exist or may have been removed.
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="bg-gray-900 text-white text-[12px] font-bold uppercase tracking-widest px-8 py-3 hover:bg-gray-700 transition-colors"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  /* ── main render ──────────────────────────────────── */
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Georgia', serif" }}>

      {/* breadcrumb */}
      <div className="bg-[#f8f8f8] border-b border-gray-100 py-3 px-4">
        <nav className="max-w-6xl mx-auto flex items-center gap-1.5 text-[12px] text-gray-400" style={{ fontFamily: 'sans-serif' }}>
          <Link to="/" className="hover:text-gray-700 flex items-center gap-1 transition-colors">
            <Home size={11} />Home
          </Link>
          <ChevronRight size={10} />
          <Link to="/shop" className="hover:text-gray-700 transition-colors">Shop</Link>
          {product.category && (
            <>
              <ChevronRight size={10} />
              <Link to={`/shop/product-category/${product.category}`} className="hover:text-gray-700 capitalize transition-colors">
                {product.category}
              </Link>
            </>
          )}
          <ChevronRight size={10} />
          <span className="text-gray-600 truncate max-w-[220px]">{product.productName}</span>
        </nav>
      </div>

      {/* ── main product section ─────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">

          {/* LEFT — image panel */}
          <div className="w-full lg:w-[48%] flex gap-3">

            {/* thumbnail strip */}
            <div className="hidden md:flex flex-col gap-2 w-[68px] shrink-0">
              {[product.productImage].map((src, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(src)}
                  className={`border-2 overflow-hidden transition-all ${
                    mainImage === src ? 'border-gray-800 shadow-sm' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img
                    src={src || 'https://placehold.co/80x80/f5f0e8/b8860b?text=G'}
                    alt=""
                    className="w-full aspect-square object-cover"
                    onError={e => { e.target.src = 'https://placehold.co/80x80/f5f0e8/b8860b?text=G'; }}
                  />
                </button>
              ))}
            </div>

            {/* main image */}
            <div className="relative flex-1 overflow-hidden group bg-gray-50">
              <img
                src={mainImage}
                alt={product.productName}
                className="w-full h-auto object-cover aspect-square lg:aspect-auto lg:max-h-[520px] group-hover:scale-[1.03] transition-transform duration-700"
                onError={e => { e.target.src = 'https://placehold.co/700x700/f5f0e8/b8860b?text=Gold+Jewelry'; }}
              />

              {/* badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                <span className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 uppercase tracking-wide">
                  New Arrival
                </span>
              </div>

              {/* zoom button */}
              <button
                onClick={() => window.open(mainImage, '_blank')}
                className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 shadow-sm text-gray-600 hover:text-black transition opacity-0 group-hover:opacity-100"
              >
                <Maximize2 size={14} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* RIGHT — details panel */}
          <div className="w-full lg:w-[52%] flex flex-col" style={{ fontFamily: "'Segoe UI', sans-serif" }}>

            {/* title */}
            <h1 className="text-[22px] font-semibold text-gray-900 leading-snug mb-5" style={{ fontFamily: 'Georgia, serif' }}>
              {product.productName}
            </h1>

            {/* price breakdown */}
            <div className="mb-5 space-y-1">
              <p className="text-[13px] text-gray-500">
                মূল দাম: <span className="text-gray-700">{fmt(originalPrice)}৳</span>
              </p>
              <p className="text-[13px] text-gray-500">
                VAT (5%): <span className="text-gray-700">{fmt(vatAmount)}৳</span>
              </p>
              <p className="text-[13px] text-gray-500">
                মজুরি (6%): <span className="text-gray-700">{fmt(wagesAmount)}৳</span>
              </p>

              {/* total price highlight — matches yellow badge in screenshot */}
              <div className="inline-flex items-center gap-2 bg-[#fde047] px-4 py-2 mt-2">
                <span className="text-[13px] font-semibold text-gray-900">মোট দাম:</span>
                <span className="text-[18px] font-bold text-gray-900">{fmt(totalPrice)}৳</span>
              </div>
            </div>

            {/* availability */}
            <div className="mb-5 text-[13px]">
              <span className="text-gray-500">Availability: </span>
              <span className="text-green-600 font-semibold">In Stock</span>
            </div>

            {/* qty + add to cart */}
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <div className="flex items-center border border-gray-300 h-[42px]">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3.5 h-full text-gray-500 hover:text-black hover:bg-gray-50 transition flex items-center"
                >
                  <Minus size={14} strokeWidth={2} />
                </button>
                <span className="w-10 text-center text-[14px] font-medium text-gray-800 select-none">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-3.5 h-full text-gray-500 hover:text-black hover:bg-gray-50 transition flex items-center"
                >
                  <Plus size={14} strokeWidth={2} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex-1 min-w-[160px] h-[42px] text-[11px] font-bold uppercase tracking-widest transition-all ${
                  addedToCart
                    ? 'bg-green-600 text-white'
                    : 'bg-[#222] text-white hover:bg-black'
                }`}
              >
                {addedToCart ? '✓ Added!' : 'Add to Cart'}
              </button>
            </div>

            {/* buy now */}
            <button className="w-full h-[42px] bg-[#ebebeb] text-gray-800 text-[11px] font-bold uppercase tracking-widest hover:bg-gray-300 transition-colors mb-6">
              Buy It Now
            </button>

            {/* wishlist + delivery */}
            <div className="space-y-2.5 mb-6">
              <button
                onClick={() => setWishlisted(w => !w)}
                className="flex items-center gap-2 text-[13px] text-gray-600 hover:text-black transition-colors group"
              >
                <Heart
                  size={15}
                  strokeWidth={1.5}
                  className={`transition-colors ${wishlisted ? 'fill-red-500 text-red-500' : 'group-hover:text-red-400'}`}
                />
                {wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              </button>

              <div className="flex items-center gap-2 text-[13px] text-gray-600">
                <Clock size={14} strokeWidth={1.5} className="shrink-0" />
                <span>
                  Estimated Delivery:{' '}
                  <span className="text-gray-800 font-medium">01 April – 05 April</span>
                </span>
              </div>
            </div>

            {/* meta divider */}
            <div className="border-t border-gray-100 pt-5 mb-5 space-y-2">
              <p className="text-[13px] text-gray-500">
                Category:{' '}
                <Link
                  to={`/shop/product-category/${product.category}`}
                  className="text-gray-800 hover:underline capitalize"
                >
                  {product.category}
                </Link>
              </p>
              <p className="text-[13px] text-gray-500">
                Tags:{' '}
                <span className="text-gray-700">earrings, necklace</span>
              </p>
            </div>

            {/* share */}
            <div className="flex items-center gap-3 text-[13px]">
              <span className="text-gray-500 font-medium flex items-center gap-1.5">
                <Share2 size={13} />Share:
              </span>
              <div className="flex items-center gap-2.5">
                <a href="#" className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#1877f2] hover:border-[#1877f2] transition-colors">
                  <Facebook size={13} />
                </a>
                <a href="#" className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black hover:border-black transition-colors">
                  {/* X/Twitter icon */}
                  <svg width="11" height="11" viewBox="0 0 1200 1227" fill="none">
                    <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="currentColor"/>
                  </svg>
                </a>
                <a href="#" className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#0077b5] hover:border-[#0077b5] transition-colors">
                  <Linkedin size={13} />
                </a>
                <a href="#" className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#0088cc] hover:border-[#0088cc] transition-colors">
                  <Send size={13} />
                </a>
                <a href="#" className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#e60023] hover:border-[#e60023] transition-colors">
                  <Pin size={13} />
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* ── Related Products ──────────────────────────── */}
        {related.length > 0 && (
          <div className="mt-20 pt-10 border-t border-gray-100">

            <div className="flex items-center justify-center gap-5 mb-10">
              <span className="flex-1 max-w-[140px] h-px bg-gray-200" />
              <h2 className="text-[15px] font-semibold text-gray-800 tracking-[0.2em] uppercase" style={{ fontFamily: 'Georgia, serif' }}>
                Related Products
              </h2>
              <span className="flex-1 max-w-[140px] h-px bg-gray-200" />
            </div>

            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true, dynamicBullets: true }}
              autoplay={{ delay: 3800, disableOnInteraction: false }}
              breakpoints={{
                480:  { slidesPerView: 2 },
                768:  { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              className="!pb-12"
            >
              {related.map(rel => (
                <SwiperSlide key={rel._id}>
                  <div
                    className="group cursor-pointer"
                    onClick={() => navigate(`/product/${rel._id}`)}
                  >
                    <div className="relative overflow-hidden bg-gray-50 aspect-square mb-3">
                      <img
                        src={rel.productImage}
                        alt={rel.productName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={e => { e.target.src = 'https://placehold.co/400x400/f5e6c8/b8860b?text=Gold'; }}
                      />
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                        <span className="bg-white text-black px-5 py-1.5 text-[11px] font-bold uppercase tracking-wider shadow-md hover:bg-[#fde047] transition w-[80%] text-center block">
                          Quick View
                        </span>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400 tracking-widest uppercase mb-0.5">{rel.category}</p>
                    <h3 className="text-[13px] text-gray-800 font-medium leading-snug mb-1 truncate group-hover:text-[#b8860b] transition-colors">
                      {rel.productName}
                    </h3>
                    <p className="text-[14px] font-bold text-gray-900">
                      {rel.salesPrice?.toLocaleString('en-BD', { minimumFractionDigits: 2 })}৳
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

          </div>
        )}

      </div>
    </div>
  );
};

export default ShopDetails;