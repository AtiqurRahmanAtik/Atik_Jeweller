import React from 'react';
import { Search, User, Heart, ShoppingCart } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="w-full bg-white border-b border-gray-200 py-4 px-6 md:px-12 flex items-center justify-between">
      
      {/* 1. Left Section - Search Bar */}
      <div className="flex-1 flex justify-start">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search products"
            className="w-full border border-gray-300 rounded-[2px] py-2.5 pl-4 pr-10 outline-none text-sm text-gray-700 placeholder-gray-500 focus:border-gray-400 transition-colors"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800 transition-colors">
            <Search size={20} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* 2. Center Section - Logo */}
      <div className="flex-1 flex justify-center">
        <a href="/" className="flex flex-col items-center">
          {/* Replace src with your actual logo path */}
          <img 
            src="/path-to-your-logo.png" 
            alt="Kunjo Jewellers" 
            className="h-16 object-contain"
            // Fallback text in case image is missing while you set it up:
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          {/* Temporary text logo if image fails to load */}
          <div className="hidden text-center">
             <h1 className="text-xl font-serif text-yellow-600 font-bold uppercase tracking-widest">Kunjo</h1>
             <p className="text-[10px] uppercase tracking-widest font-semibold">Jewellers</p>
          </div>
        </a>
      </div>

      {/* 3. Right Section - Icons */}
      <div className="flex-1 flex justify-end items-center gap-7">
        
        {/* User Icon */}
        <button className="text-gray-700 hover:text-black transition-colors">
          <User size={24} strokeWidth={1.5} />
        </button>

        {/* Wishlist Icon with Badge */}
        <button className="relative text-gray-700 hover:text-black transition-colors">
          <Heart size={24} strokeWidth={1.5} />
          <span className="absolute -top-1.5 -right-2 bg-[#222222] text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
            0
          </span>
        </button>

        {/* Cart Icon with Badge */}
        <button className="relative text-gray-700 hover:text-black transition-colors">
          <ShoppingCart size={24} strokeWidth={1.5} />
          <span className="absolute -top-1.5 -right-2 bg-[#222222] text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
            0
          </span>
        </button>
        
      </div>

    </nav>
  );
};

export default Navbar;