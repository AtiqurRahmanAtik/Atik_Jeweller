import React, { useState, useEffect } from "react";
// Make sure this path correctly points to where your hook is defined
import { usePurchases } from "../../../Hook/usePurchases"; 
import { Link } from "react-router-dom";

const Purchase = () => {
  // --- 1. Hook Integration ---
  // Using the actual hook to handle the API call
  const { createPurchase, loading } = usePurchases();

  // --- Form State Management ---
  const [formData, setFormData] = useState({
    invoiceNumber: `#INV-${Math.floor(100000000 + Math.random() * 900000000)}`,
    purchaseDate: new Date().toISOString().split("T")[0],
    supplier: "",
    subTotal: 0,
    discountPercentage: 0,
    discountAmount: 0,
    totalAmount: 0,
    paid: 0,
    due: 0,
    paymentMethod: 1, // 1 = Cash, 2 = Card, 3 = Mobile Banking, 4 = Bank Transfer
    note: "",
    products: [], 
  });

  // --- Modal State Management ---
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const initialProductState = {
    productName: "",
    phone: "",
    metalType: "",
    purity: "",
    weight: 0,
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
  };
  const [productData, setProductData] = useState(initialProductState);

  // --- Dynamic Calculation for Totals ---
  useEffect(() => {
    // 1. Calculate subtotal from products array
    const calculatedSubTotal = formData.products.reduce(
      (sum, item) => sum + (Number(item.totalPrice) || 0),
      0
    );

    // 2. Calculate discounts and final amounts based on the new subtotal
    const calculatedDiscountAmount = (calculatedSubTotal * formData.discountPercentage) / 100;
    const calculatedTotal = calculatedSubTotal - calculatedDiscountAmount;
    const calculatedDue = calculatedTotal - formData.paid;

    setFormData((prev) => ({
      ...prev,
      subTotal: calculatedSubTotal,
      discountAmount: calculatedDiscountAmount,
      totalAmount: calculatedTotal > 0 ? calculatedTotal : 0,
      due: calculatedDue > 0 ? calculatedDue : 0,
    }));
  }, [formData.products, formData.discountPercentage, formData.paid]);

  // --- Handle Main Form Inputs ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "purchaseDate" || name === "invoiceNumber" || name === "supplier" || name === "note" 
        ? value 
        : Number(value) || 0, 
    }));
  };

  // --- Handle Product Modal Inputs ---
  const handleProductChange = (e) => {
    const { name, value } = e.target;
    
    setProductData((prev) => {
      const parsedValue = ["weight", "quantity", "unitPrice", "totalPrice"].includes(name) 
        ? (value === "" ? "" : Number(value)) 
        : value;

      const updatedProduct = { ...prev, [name]: parsedValue };

      // Auto-calculate Total Price for the individual item
      if (name === "quantity" || name === "unitPrice") {
        updatedProduct.totalPrice = (updatedProduct.quantity || 0) * (updatedProduct.unitPrice || 0);
      }

      return updatedProduct;
    });
  };

  // --- Add Product to List ---
  const handleAddProduct = () => {
    if (!productData.productName) return alert("Please provide the product name");
    if (!productData.quantity) return alert("Please provide the quantity");
    if (!productData.unitPrice) return alert("Please provide the unit price");

    setFormData((prev) => ({
      ...prev,
      products: [...prev.products, productData],
    }));

    setProductData(initialProductState);
    setIsProductModalOpen(false);
  };

  // --- Remove Product from List ---
  const handleRemoveProduct = (index) => {
    setFormData((prev) => {
      const updatedProducts = [...prev.products];
      updatedProducts.splice(index, 1);
      return { ...prev, products: updatedProducts };
    });
  };

  // --- API Integration: Handle Form Submission ---
  const handleSavePurchase = async () => {
    if (!formData.supplier) return alert("Please select a supplier");
    if (formData.products.length === 0) return alert("Please add at least one product");
    
    // Call the actual API via the hook
    const success = await createPurchase(formData);
    
    if (success) {
      alert("Purchase created successfully!");
      // Reset form if desired, or redirect using react-router-dom
      setFormData({
        invoiceNumber: `#INV-${Math.floor(100000000 + Math.random() * 900000000)}`,
        purchaseDate: new Date().toISOString().split("T")[0],
        supplier: "",
        subTotal: 0,
        discountPercentage: 0,
        discountAmount: 0,
        totalAmount: 0,
        paid: 0,
        due: 0,
        paymentMethod: 1, 
        note: "",
        products: [], 
      });
    }
  };

  // Helper to display the selected payment method name
  const getPaymentMethodName = (val) => {
    switch (val) {
      case 1: return "Cash";
      case 2: return "Card";
      case 3: return "Mobile Banking";
      case 4: return "Bank Transfer";
      default: return "Unknown";
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8EE] p-6 font-sans relative">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
        
        {/* --- Header --- */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h1 className="text-xl font-semibold text-gray-800">Add Purchase</h1>


       
<Link to="/purchase/purchaseList">
  <button className="bg-[#C57C27] hover:bg-[#a66820] text-white px-4 py-2 rounded shadow flex items-center gap-2 text-sm transition-colors">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
    View All Purchases
  </button>
</Link>


        </div>

        <div className="p-6">
          {/* --- Top Row: Inputs & Actions --- */}
          <div className="flex flex-wrap lg:flex-nowrap gap-6 mb-8">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-gray-500 mb-1 ml-1 bg-white px-1 absolute -mt-2">Invoice #</label>
              <div className="relative flex items-center border border-gray-300 rounded focus-within:border-[#C57C27]">
                <span className="pl-3 text-gray-400">#</span>
                <input type="text" name="invoiceNumber" value={formData.invoiceNumber} onChange={handleChange} className="w-full p-2 outline-none rounded bg-transparent" />
              </div>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-gray-500 mb-1 ml-1 bg-white px-1 absolute -mt-2">Purchase Date</label>
              <input type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded outline-none focus:border-[#C57C27]" />
            </div>

            <div className="flex-1 min-w-[250px]">
              <div className="flex justify-between items-center mb-1">
                 <label className="block text-xs font-medium text-gray-500 ml-1 bg-white px-1 absolute -mt-2">Supplier <span className="text-red-500">*</span></label>
              
              </div>
              <div className="relative">
              
                <input type="text" name="supplier" value={formData.supplier} onChange={handleChange} placeholder="Enter Supplier Name" className="w-full pl-9 p-2 border border-gray-300 rounded outline-none focus:border-[#C57C27]" />
              </div>
            </div>

            <div className="flex-1 min-w-[250px]">
               <label className="block text-xs font-medium text-gray-500 mb-2">Add Products</label>
               <div className="flex gap-2">
                 <button 
                   onClick={() => setIsProductModalOpen(true)}
                   className="flex-1 bg-[#C57C27] hover:bg-[#a66820] text-white px-3 py-2 rounded text-sm flex items-center justify-center gap-1 transition-colors"
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    Add New Items
                 </button>
               
               </div>
            </div>
          </div>

          {/* --- Added Products List Table --- */}
          {formData.products.length > 0 && (
            <div className="mb-6 overflow-x-auto border border-gray-200 rounded">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                  <tr>
                    <th className="p-3">Product Name</th>
                    <th className="p-3">Metal Type</th>
                    <th className="p-3">Weight</th>
                    <th className="p-3">Qty</th>
                    <th className="p-3">Unit Price</th>
                    <th className="p-3 text-right">Total Price</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.products.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                      <td className="p-3">{item.productName}</td>
                      <td className="p-3">{item.metalType || '-'}</td>
                      <td className="p-3">{item.weight || 0}</td>
                      <td className="p-3">{item.quantity}</td>
                      <td className="p-3">৳{item.unitPrice}</td>
                      <td className="p-3 text-right font-medium">৳{item.totalPrice}</td>
                      <td className="p-3 text-center">
                        <button onClick={() => handleRemoveProduct(index)} className="text-red-500 hover:text-red-700">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* --- Payment Summary Section --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100 pt-6 mb-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 mb-4">Payment Summary</h3>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Sub Total:</span>
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">৳</span>
                  <input type="number" readOnly value={formData.subTotal} className="w-24 text-right border rounded p-1 bg-gray-50 text-gray-600 outline-none" />
                </div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Discount:</span>
                <div className="flex gap-2">
                  <div className="relative flex items-center">
                    <span className="absolute left-2 text-gray-400">%</span>
                    <input type="Text" name="discountPercentage" value={formData.discountPercentage} onChange={handleChange} className="w-16 pl-6 pr-1 py-1 border border-gray-300 rounded text-right outline-none focus:border-[#C57C27]" />
                  </div>
                 
                </div>
              </div>
            </div>

            <div className="space-y-4 border-l border-gray-100 pl-8 pt-10">
              <div className="flex justify-between items-center font-bold text-lg text-gray-800">
                <span>Total:</span>
                <div className="flex items-center gap-1 text-[#C57C27]">
                  <span>৳</span>
                  <span>{formData.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Paid:</span>
                <div className="flex items-center gap-1 text-green-600 font-semibold">
                  <span>৳</span>
                  <input type="text" name="paid" value={formData.paid} onChange={handleChange} className="w-24 text-right border rounded p-1 outline-none focus:border-green-500 text-green-600" />
                </div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Due:</span>
                <div className="flex items-center gap-1 text-green-600 font-semibold">
                  <span>৳</span>
                  <span>{formData.due.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* --- Payment Methods Section --- */}
          <div className="border-t border-b border-gray-100 py-4 mb-6 flex justify-between items-center bg-gray-50 px-4 rounded">
            <span className="text-sm font-semibold text-gray-700">
              Payment Method: <span className="text-[#C57C27] font-bold">{getPaymentMethodName(formData.paymentMethod)}</span>
            </span>
            <button 
              onClick={() => setIsPaymentModalOpen(true)}
              className="bg-gray-200 text-gray-600 px-3 py-1 rounded text-sm hover:bg-gray-300 transition-colors font-medium shadow-sm"
            >
              + Payment Method
            </button>
          </div>

          {/* --- Notes & Submit --- */}
          <div>
             <label className="block text-xs font-medium text-gray-500 mb-2">Note</label>
             <div className="flex flex-col md:flex-row gap-6 items-start">
               <textarea name="note" value={formData.note} onChange={handleChange} placeholder="Add note (optional)" rows="3" className="flex-1 w-full md:w-1/2 p-3 border border-gray-300 rounded outline-none focus:border-[#C57C27] resize-none"></textarea>
               
               <button 
                 onClick={handleSavePurchase} 
                 disabled={loading} 
                 className="bg-[#C57C27] hover:bg-[#a66820] text-white px-8 py-3 rounded font-medium shadow transition-colors disabled:opacity-50"
               >
                 {loading ? "Saving..." : "Save Purchase"}
               </button>
             </div>
          </div>

        </div>
      </div>

      {/* --- ADD PRODUCT MODAL --- */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800">Add New Product</h2>
              <button onClick={() => setIsProductModalOpen(false)} className="text-gray-500 hover:text-red-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name <span className="text-red-500">*</span></label>
                <input type="text" name="productName" value={productData.productName} onChange={handleProductChange} className="w-full p-2 border border-gray-300 rounded outline-none focus:border-[#C57C27]" placeholder="E.g. Gold Ring" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="text" name="phone" value={productData.phone} onChange={handleProductChange} className="w-full p-2 border border-gray-300 rounded outline-none focus:border-[#C57C27]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Metal Type</label>
                <input type="text" name="metalType" value={productData.metalType} onChange={handleProductChange} className="w-full p-2 border border-gray-300 rounded outline-none focus:border-[#C57C27]" placeholder="E.g. Gold, Silver" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purity</label>
                <input type="text" name="purity" value={productData.purity} onChange={handleProductChange} className="w-full p-2 border border-gray-300 rounded outline-none focus:border-[#C57C27]" placeholder="E.g. 22K" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                <input type="text" name="weight" value={productData.weight} onChange={handleProductChange} className="w-full p-2 border border-gray-300 rounded outline-none focus:border-[#C57C27]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity <span className="text-red-500">*</span></label>
                <input type="text" name="quantity" value={productData.quantity} onChange={handleProductChange} min="1" className="w-full p-2 border border-gray-300 rounded outline-none focus:border-[#C57C27]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price (৳) <span className="text-red-500">*</span></label>
                <input type="text" name="unitPrice" value={productData.unitPrice} onChange={handleProductChange} className="w-full p-2 border border-gray-300 rounded outline-none focus:border-[#C57C27]" />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Price (৳) <span className="text-red-500">*</span></label>
                <input type="number" name="totalPrice" value={productData.totalPrice} readOnly className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-600 outline-none font-semibold" />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-4 border-t border-gray-100 bg-gray-50">
              <button onClick={() => setIsProductModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition-colors">
                Cancel
              </button>
              <button onClick={handleAddProduct} className="px-4 py-2 bg-[#C57C27] hover:bg-[#a66820] text-white rounded shadow transition-colors">
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SELECT PAYMENT METHOD MODAL --- */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800">Select Payment Method</h2>
              <button onClick={() => setIsPaymentModalOpen(false)} className="text-gray-500 hover:text-red-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method <span className="text-red-500">*</span>
              </label>
              <select 
                name="paymentMethod" 
                value={formData.paymentMethod} 
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded outline-none focus:border-[#C57C27] bg-white cursor-pointer"
              >
                <option value={1}>Cash</option>
                <option value={2}>Card</option>
                <option value={3}>Mobile Banking</option>
                <option value={4}>Bank Transfer</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 p-4 border-t border-gray-100 bg-gray-50">
              <button onClick={() => setIsPaymentModalOpen(false)} className="w-full py-2 bg-[#C57C27] hover:bg-[#a66820] text-white rounded shadow transition-colors font-medium">
                Save Selection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Purchase;