import axios from "axios";
import React, { useState } from "react";
import { MdOutlineImage, MdNumbers, MdLink, MdStorefront, MdCloudUpload } from "react-icons/md";

const BannerCreate = () => {
  const [formData, setFormData] = useState({
    bannerNumber: "",
    bannerName: "",
    bannerUrl: "",
    bannerPhoto: "",
    branch: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("Banner Data Submitted:", formData);
    // Add your API call logic here
    const res = await axios.post("http://localhost:8000/api/banners/post", formData);

    console.log(res.data);

  };



  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Create New Banner
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Fill in the details below to add a new promotional banner to the system.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">

            {/* Submit here */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Banner Number */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Banner Number
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdNumbers className="text-xl text-gray-400 group-focus-within:text-[#d4af37] transition-colors" />
                  </div>
                  <input
                    type="number"
                    name="bannerNumber"
                    required
                    placeholder="e.g. 101"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] outline-none transition-all placeholder-gray-400 text-gray-800"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Banner Name */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Banner Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdOutlineImage className="text-xl text-gray-400 group-focus-within:text-[#d4af37] transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="bannerName"
                    required
                    placeholder="Winter Collection 2026"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] outline-none transition-all placeholder-gray-400 text-gray-800"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Banner URL */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Redirection URL (Link)
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdLink className="text-xl text-gray-400 group-focus-within:text-[#d4af37] transition-colors" />
                </div>
                <input
                  type="url"
                  name="bannerUrl"
                  required
                  placeholder="https://kunjo.com/offers/winter"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] outline-none transition-all placeholder-gray-400 text-gray-800"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Branch */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Branch Location
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdStorefront className="text-xl text-gray-400 group-focus-within:text-[#d4af37] transition-colors" />
                  </div>
                  <select
                    name="branch"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] outline-none transition-all text-gray-800 appearance-none bg-white"
                    onChange={handleChange}
                  >
                    <option value="">Select Branch</option>
                    <option value="Dhaka">Dhaka (JFP)</option>
                    <option value="Chittagong">Chittagong</option>
                    <option value="Sylhet">Sylhet</option>
                  </select>
                </div>
              </div>

              {/* Banner Photo URL/Input */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Banner Photo URL
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdCloudUpload className="text-xl text-gray-400 group-focus-within:text-[#d4af37] transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="bannerPhoto"
                    required
                    placeholder="Paste image hosting link"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] outline-none transition-all placeholder-gray-400 text-gray-800"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-[#d4af37] hover:bg-[#b8962d] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>Create Banner</span>
              </button>
            </div>
          </form>

          
        </div>

        {/* Footer info */}
        <p className="mt-6 text-center text-xs text-gray-400 uppercase tracking-widest">
          Kunjo Jewellers Admin Portal &bull; 2026
        </p>
      </div>
    </div>
  );
};

export default BannerCreate;