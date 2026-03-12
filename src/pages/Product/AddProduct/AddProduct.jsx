import React, { useState } from "react";
import { useGoldProducts } from "../../../Hook/useGoldProducts"; 
import useAuth from "../../../Hook/useAuth"; 
import { Plus, List, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";


const initialFormState = {
  productImage: "",
  productName: "",
  category: "",
  productCode: "",
  stockTypes: "",
  metalType: "",
  purity: "",
  weightInGrams: "",
  vori: "",
  ana: "",
  roti: "",
  point: "",
  purchaseRatePerVori: "",
  purchasePrice: "",
  salesRatePerVori: "",
  salesPrice: "",
  makingCharge: "",
  vatPercentage: "",
  productDescription: "",
};


// Data extracted from your provided images (add1, add2, add3)
const CATEGORY_OPTIONS = ["Ear Rings", "Bracelet", "Silver Bar", "Nose pin", "Fingers Ring", "Necklace", "Gold Bar", "Raw Gold"];
const STOCK_OPTIONS = ["Fine Stock", "Raw Material", "Customized Order Stock", "Mortgage Stock", "Production", "Artisan Stock", "Wholesale"];
const METAL_OPTIONS = ["GOLD", "DESI GOLD", "GOLD BAR", "SILVER", "PLATINUM", "COPPER", "DIAMOND"];
const PURITY_OPTIONS = ["24K | 99.9", "22K | 91.6", "21K | 87.5", "18K | 75.0"];



const AddProduct = () => {
  const navigate = useNavigate();
  const { branch } = useAuth();
  const { createGoldProduct, loading } = useGoldProducts();
  const [formData, setFormData] = useState(initialFormState);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mapping and sanitizing data for the API
    const payload = {
      ...formData,
      weightInGrams: Number(formData.weightInGrams) || 0,
      vori: Number(formData.vori) || 0,
      ana: Number(formData.ana) || 0,
      roti: Number(formData.roti) || 0,
      point: Number(formData.point) || 0,
      purchaseRatePerVori: Number(formData.purchaseRatePerVori) || 0,
      purchasePrice: Number(formData.purchasePrice) || 0,
      salesRatePerVori: Number(formData.salesRatePerVori) || 0,
      salesPrice: Number(formData.salesPrice) || 0,
      makingCharge: Number(formData.makingCharge) || 0,
      vatPercentage: Number(formData.vatPercentage) || 0,
    };

    const result = await createGoldProduct(payload);

    if (result) {
      alert("Product added successfully!");
      setFormData(initialFormState);
      navigate("/product/list"); // Redirect to list after success
    } else {
      alert("Failed to add product. Please check console for errors.");
    }
  };

  
  return (
    <div className="p-4 md:p-8 bg-secondary min-h-screen font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Add Product</h2>
            <p className="text-xs text-gray-400 mt-1">Branch: <span className="text-primary font-bold">{branch}</span></p>
          </div>
          <Link to={'/product/list'} 
            
            className="bg-primary text-white px-4 py-2 rounded-md hover:brightness-110 transition-all font-medium flex items-center gap-2 text-sm shadow-sm"
          >
            <List size={16} /> View All
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Row 1: Image, Name, Category, Code, Stock */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">Product Image URL</label>
              <input 
                type="text" name="productImage" value={formData.productImage} onChange={handleChange}
                placeholder="Paste URL here..."
                className="w-full border border-gray-300 p-2 rounded text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">Product Name <span className="text-red-500">*</span></label>
              <input 
                type="text" name="productName" value={formData.productName} onChange={handleChange} required
                className="w-full border border-gray-300 p-2 rounded text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">Category</label>
              <div className="flex gap-1">
                <select 
                  name="category" value={formData.category} onChange={handleChange} required
                  className="w-full border border-gray-300 p-2 rounded text-sm bg-white focus:ring-1 focus:ring-primary outline-none"
                >
                  <option value="">Select Category</option>
                  {CATEGORY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <button type="button" className="bg-primary text-white px-2 rounded hover:opacity-90"><Plus size={16}/></button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">Product Code <span className="text-red-500">*</span></label>
              <input 
                type="text" name="productCode" value={formData.productCode} onChange={handleChange} required
                className="w-full border border-gray-300 p-2 rounded text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">Stock Type <span className="text-red-500">*</span></label>
              <select 
                name="stockTypes" value={formData.stockTypes} onChange={handleChange} required
                className="w-full border border-gray-300 p-2 rounded text-sm bg-white focus:ring-1 focus:ring-primary outline-none"
              >
                <option value="">Select Stock</option>
                {STOCK_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>

          {/* Row 2: Metal, Purity, Weight, Vori, Ana */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">Metal Type <span className="text-red-500">*</span></label>
              <select 
                name="metalType" value={formData.metalType} onChange={handleChange} required
                className="w-full border border-gray-300 p-2 rounded text-sm bg-white focus:ring-1 focus:ring-primary outline-none"
              >
                <option value="">Select Metal</option>
                {METAL_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">Purity <span className="text-red-500">*</span></label>
              <select 
                name="purity" value={formData.purity} onChange={handleChange} required
                className="w-full border border-gray-300 p-2 rounded text-sm bg-white focus:ring-1 focus:ring-primary outline-none"
              >
                <option value="">Select Purity</option>
                {PURITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">Weight (Grams) <span className="text-red-500">*</span></label>
              <input type="number" step="any" name="weightInGrams" value={formData.weightInGrams} onChange={handleChange} required className="w-full border border-gray-300 p-2 rounded text-sm outline-none" />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">Vori</label>
              <input type="number" name="vori" value={formData.vori} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded text-sm outline-none" />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">Ana</label>
              <input type="number" name="ana" value={formData.ana} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded text-sm outline-none" />
            </div>
          </div>

          {/* Row 3: Roti, Point, Purchase Rate, Purchase Price, Sale Rate, Sale Price */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">Roti</label>
              <input type="number" name="roti" value={formData.roti} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded text-sm outline-none" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">Point</label>
              <input type="number" name="point" value={formData.point} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded text-sm outline-none" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">Purchase Rate</label>
              <input type="number" name="purchaseRatePerVori" value={formData.purchaseRatePerVori} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded text-sm outline-none" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">Purchase Price</label>
              <input type="number" name="purchasePrice" value={formData.purchasePrice} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded text-sm outline-none" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">Sale Rate</label>
              <input type="number" name="salesRatePerVori" value={formData.salesRatePerVori} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded text-sm outline-none" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">Sale Price</label>
              <input type="number" name="salesPrice" value={formData.salesPrice} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded text-sm outline-none" />
            </div>
          </div>

          {/* Row 4: Making Charge, VAT, Description, Save Button */}
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-end">
            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">Making Charge</label>
              <input type="number" name="makingCharge" value={formData.makingCharge} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded text-sm outline-none" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">VAT (%)</label>
              <input type="number" name="vatPercentage" value={formData.vatPercentage} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded text-sm outline-none" />
            </div>
            <div className="lg:col-span-3">
              <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">Description</label>
              <textarea 
                name="productDescription" value={formData.productDescription} onChange={handleChange}
                rows="1" className="w-full border border-gray-300 p-2 rounded text-sm outline-none resize-none"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-white w-full py-2 rounded font-bold shadow-md hover:brightness-110 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                {loading ? "Saving..." : "Save Product"}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddProduct;