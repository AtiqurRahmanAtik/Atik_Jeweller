import React, { useState } from 'react';
import { Search, Plus, Calendar, FileText, User } from 'lucide-react';
import useSales from '../../../Hook/useSales'; // Adjust path as needed

const Sale = () => {
    const { createSale, loading } = useSales();
    
    // Initial State based on your Mongoose Schema
    const [formData, setFormData] = useState({
        invoiceNumber: `INV-${Math.floor(Math.random() * 1000000000)}`,
        saleDate: new Date().toISOString().split('T')[0],
        customer: 'Walk-in Customer',
        addProduct: [], // List of selected products
        paymentSummary: { subTotal: 0, discount: 0, total: 0, paid: 0, due: 0 },
        paymentMethod: 'Cash',
        note: '',
        branch: 'Main Branch' // Required by your schema
    });

    const handleSave = async () => {
        try {
            await createSale(formData);
            alert("Sale saved successfully!");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-sans">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-700">Add Sale</h2>
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded flex items-center gap-2 text-sm transition">
                    <FileText size={16} /> View All Sales
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
                {/* Top Section: Invoice Info */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Invoice Number</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400"><FileText size={16}/></span>
                            <input type="text" readOnly value={formData.invoiceNumber} className="w-full pl-10 pr-3 py-2 border rounded bg-gray-50 focus:outline-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Sale Date</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400"><Calendar size={16}/></span>
                            <input type="date" value={formData.saleDate} onChange={(e) => setFormData({...formData, saleDate: e.target.value})} className="w-full pl-10 pr-3 py-2 border rounded focus:ring-1 focus:ring-orange-400 outline-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1 flex justify-between">
                            Customer * <span className="text-orange-500 cursor-pointer flex items-center gap-1"><Plus size={12}/> Add</span>
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400"><Search size={16}/></span>
                            <input type="text" placeholder="Search customer" value={formData.customer} onChange={(e) => setFormData({...formData, customer: e.target.value})} className="w-full pl-10 pr-3 py-2 border rounded outline-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Add Products</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400"><Search size={16}/></span>
                            <input type="text" placeholder="Search product by name or code" className="w-full pl-10 pr-3 py-2 border rounded outline-none" />
                        </div>
                    </div>
                </div>

                {/* Payment Summary Section */}
                <div className="border-t pt-6">
                    <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Payment Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex items-center gap-4">
                            <span className="text-gray-600 w-24">Discount:</span>
                            <div className="flex flex-1 border rounded overflow-hidden">
                                <input type="number" className="w-full px-3 py-2 outline-none" placeholder="0" />
                                <span className="bg-gray-100 px-4 py-2 border-l text-gray-500">%</span>
                            </div>
                            <input type="number" className="flex-1 px-3 py-2 border rounded bg-gray-50" placeholder="0.00" />
                        </div>
                        <div className="space-y-2 text-right">
                            <p className="text-gray-600">Sub Total: <span className="font-semibold ml-4">৳ 0.00</span></p>
                            <p className="text-orange-500 font-bold text-lg">Total: <span className="ml-4">৳ 0.00</span></p>
                            <p className="text-green-600">Paid: <span className="ml-4">৳ 0.00</span></p>
                            <p className="text-red-500">Due: <span className="ml-4">৳ 0.00</span></p>
                        </div>
                    </div>
                </div>

                {/* Payment Methods Section */}
                <div className="border-t pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Payment Methods (0)</h3>
                        <button className="bg-orange-500 text-white px-3 py-1 rounded text-sm flex items-center gap-1 hover:bg-orange-600">
                            <Plus size={14}/> Add Payment
                        </button>
                    </div>
                    <div className="text-center py-8 text-gray-400 italic text-sm border-2 border-dashed rounded-md">
                        No payments added yet
                    </div>
                </div>

                {/* Note & Save */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Note</label>
                        <textarea 
                            rows="3" 
                            className="w-full p-3 border rounded focus:ring-1 focus:ring-orange-400 outline-none" 
                            placeholder="Add note (optional)"
                            onChange={(e) => setFormData({...formData, note: e.target.value})}
                        ></textarea>
                    </div>
                    <div className="flex justify-start">
                        <button 
                            onClick={handleSave}
                            disabled={loading}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-10 rounded transition-all shadow-md active:transform active:scale-95 disabled:bg-gray-400"
                        >
                            {loading ? "Saving..." : "Save Sale"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sale;