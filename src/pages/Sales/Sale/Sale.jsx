import React, { useState, useEffect } from 'react';
import { Search, Plus, Calendar, FileText, User } from 'lucide-react';
import useSales from '../../../Hook/useSales'; // Adjust path
import { useCustomers } from '../../../Hook/useCustomers'; // Adjust path

const Sale = () => {
    const { createSale, loading: saleLoading, error: saleError } = useSales();
    const { customers, fetchCustomers, loading: customerLoading } = useCustomers();
    
    // Helper function to get initial state
    const getInitialState = () => ({
        invoiceNumber: `INV-${Math.floor(Math.random() * 1000000000)}`,
        saleDate: new Date().toISOString().split('T')[0],
        customer: 'Walk-in Customer',
        addProduct: [], // List of selected products
        paymentSummary: { subTotal: 0, discount: 0, total: 0, paid: 0, due: 0 },
        paymentMethod: 'Cash',
        note: '',
        branch: 'Main Branch' // Required by your backend schema
    });

    // Form State
    const [formData, setFormData] = useState(getInitialState());

    // Fetch customers on mount
    useEffect(() => {
        fetchCustomers(1, 100); 
    }, [fetchCustomers]);

    // Update Totals when discount changes 
    const handleDiscountChange = (e) => {
        const discountPercentage = parseFloat(e.target.value) || 0;
        const subTotal = formData.paymentSummary.subTotal; 
        const discountAmount = (subTotal * discountPercentage) / 100;
        const total = subTotal - discountAmount;
        
        setFormData(prev => ({
            ...prev,
            paymentSummary: {
                ...prev.paymentSummary,
                discount: discountPercentage,
                total: total,
                due: total - prev.paymentSummary.paid
            }
        }));
    };

    // Save Sale to Backend
    const handleSave = async () => {
        try {
            // Send data to backend
            await createSale(formData);
            alert("Sale saved successfully!");
            
            // Reset form for the next sale
            setFormData(getInitialState());
        } catch (err) {
            console.error("Save Error:", err);
            alert(err.message || "Something went wrong while saving.");
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-sans relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-700">Add Sale</h2>
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded flex items-center gap-2 text-sm transition">
                    <FileText size={16} /> View All Sales
                </button>
            </div>

            {/* Error Message Display */}
            {saleError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-200">
                    {saleError}
                </div>
            )}

            <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
                {/* Top Section: Invoice Info */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Invoice Number</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400"><FileText size={16}/></span>
                            <input type="text" value={formData.invoiceNumber} readOnly className="w-full pl-10 pr-3 py-2 border rounded bg-gray-50 focus:outline-none text-gray-500" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Sale Date</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400"><Calendar size={16}/></span>
                            <input type="date" value={formData.saleDate} onChange={(e) => setFormData({...formData, saleDate: e.target.value})} className="w-full pl-10 pr-3 py-2 border rounded focus:ring-1 focus:ring-orange-400 outline-none" />
                        </div>
                    </div>
                    
                    {/* CUSTOMER DROPDOWN */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1 flex justify-between">
                            Customer * <span className="text-orange-500 cursor-pointer flex items-center gap-1"><Plus size={12}/> Add</span>
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400"><User size={16}/></span>
                            <select 
                                value={formData.customer}
                                onChange={(e) => setFormData({...formData, customer: e.target.value})}
                                className="w-full pl-10 pr-3 py-2 border rounded outline-none appearance-none bg-white text-black"
                            >
                                <option className="text-black" value="Walk-in Customer">Walk-in Customer</option>
                                {customerLoading ? (
                                    <option className="text-black" disabled>Loading...</option>
                                ) : (
                                    customers?.map(c => (
                                        <option className="text-black" key={c._id} value={c._id}>{c.name || c.phone}</option>
                                    ))
                                )}
                            </select>
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
                                <input type="number" value={formData.paymentSummary.discount || ''} onChange={handleDiscountChange} className="w-full px-3 py-2 outline-none" placeholder="0" />
                                <span className="bg-gray-100 px-4 py-2 border-l text-gray-500">%</span>
                            </div>
                            <input type="number" readOnly value={(formData.paymentSummary.subTotal * formData.paymentSummary.discount) / 100} className="flex-1 px-3 py-2 border rounded bg-gray-50 text-gray-500" placeholder="0.00" />
                        </div>

                        <div className="space-y-2 text-right">
                            <p className="text-gray-600">Sub Total: <span className="font-semibold ml-4">৳ {formData.paymentSummary.subTotal.toFixed(2)}</span></p>
                            <p className="text-orange-500 font-bold text-lg">Total: <span className="ml-4">৳ {formData.paymentSummary.total.toFixed(2)}</span></p>
                            <p className="text-green-600">Paid: <span className="ml-4">৳ {formData.paymentSummary.paid.toFixed(2)}</span></p>
                            <p className="text-red-500">Due: <span className="ml-4">৳ {formData.paymentSummary.due.toFixed(2)}</span></p>
                        </div>
                    </div>
                </div>

                {/* Payment Methods Section (Direct Inline) */}
                <div className="border-t pt-6">
                    <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Payment Information</h3>
                    
                    <div className="w-full md:w-1/2">
                        <label className="block text-sm font-medium text-gray-600 mb-1">Payment Method</label>
                        <select 
                            value={formData.paymentMethod} 
                            onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                            className="w-full px-3 py-2 border rounded outline-none bg-white text-black focus:ring-1 focus:ring-orange-400"
                        >
                            <option value="Cash">Cash</option>
                            <option value="Card">Credit/Debit Card</option>
                            <option value="Mobile Banking">Mobile Banking (bKash/Nagad)</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                        </select>
                    </div>
                </div>

                {/* Note & Save */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end border-t pt-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Note</label>
                        <textarea 
                            rows="3" 
                            className="w-full p-3 border rounded focus:ring-1 focus:ring-orange-400 outline-none" 
                            placeholder="Add note (optional)"
                            value={formData.note}
                            onChange={(e) => setFormData({...formData, note: e.target.value})}
                        ></textarea>
                    </div>
                    <div className="flex justify-start">
                        <button 
                            onClick={handleSave}
                            disabled={saleLoading}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-10 rounded transition-all shadow-md active:transform active:scale-95 disabled:bg-gray-400"
                        >
                            {saleLoading ? "Saving..." : "Save Sale"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sale;