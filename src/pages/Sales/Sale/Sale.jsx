import React, { useState, useEffect } from 'react';
import useSales from '../../../Hook/useSales'; // Adjust the import path as necessary
import useAuth from '../../../Hook/useAuth'; // Adjust based on your auth hook location
import { Link } from 'react-router-dom';

const Sale = () => {
    const { createSale, loading, error, clearError } = useSales();
    const { branch } = useAuth(); // Required by your Mongoose schema

    // Form State
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [saleDate, setSaleDate] = useState('');
    const [customer, setCustomer] = useState('');
    const [productSearch, setProductSearch] = useState('');
    
    // Payment Summary State
    const [subTotal, setSubTotal] = useState(0);
    const [discountPercent, setDiscountPercent] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0);
    
    // Payment State
    const [paid, setPaid] = useState(0); // Paid is now a state variable for the input field
    const [payments, setPayments] = useState([]);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false); // Payment modal state
    const [paymentAmountInput, setPaymentAmountInput] = useState('');
    const [paymentMethodInput, setPaymentMethodInput] = useState('Cash');
    
    // Note State
    const [note, setNote] = useState('');

    // --- State for Products & Modal ---
    const [products, setProducts] = useState([]);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        phone: '',
        metalType: '',
        purity: '',
        weight: 0,
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0
    });

    // Auto-calculate Total Price in Add Product Modal
    useEffect(() => {
        setNewProduct(prev => ({
            ...prev,
            totalPrice: Number(prev.quantity) * Number(prev.unitPrice)
        }));
    }, [newProduct.quantity, newProduct.unitPrice]);

    // Derived values
    const total = subTotal - discountAmount;
    const due = total - paid; // Due now uses the new paid state

    // Initialize default values (Invoice & Date)
    useEffect(() => {
        setInvoiceNumber(`INV-${Math.floor(1000000000 + Math.random() * 9000000000)}`);
        const today = new Date().toISOString().split('T')[0];
        setSaleDate(today);
    }, []);

    // Clear API error when user starts typing/interacting again
    useEffect(() => {
        if (error) clearError();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customer, products, payments, isProductModalOpen, isPaymentModalOpen, paid]);

    // Handlers for Discount
    const handleDiscountPercentChange = (e) => {
        const pct = parseFloat(e.target.value) || 0;
        setDiscountPercent(pct);
        setDiscountAmount((subTotal * pct) / 100);
    };

    const handleDiscountAmountChange = (e) => {
        const amt = parseFloat(e.target.value) || 0;
        setDiscountAmount(amt);
        if (subTotal > 0) {
            setDiscountPercent(((amt / subTotal) * 100).toFixed(2));
        } else {
            setDiscountPercent(0);
        }
    };

    // --- Handler for Adding Product ---
    const handleAddProduct = () => {
        if (!newProduct.name || newProduct.quantity <= 0 || newProduct.unitPrice <= 0) {
            alert("Please fill in the required fields correctly.");
            return;
        }

        const updatedProducts = [...products, newProduct];
        setProducts(updatedProducts);

        // Update subtotal based on products
        const newSubTotal = updatedProducts.reduce((acc, curr) => acc + curr.totalPrice, 0);
        setSubTotal(newSubTotal);

        // Recalculate discount based on new subtotal
        if (discountPercent > 0) {
            setDiscountAmount((newSubTotal * discountPercent) / 100);
        }

        // Reset Modal State
        setNewProduct({ name: '', phone: '', metalType: '', purity: '', weight: 0, quantity: 1, unitPrice: 0, totalPrice: 0 });
        setIsProductModalOpen(false);
    };

    const handleRemoveProduct = (indexToRemove) => {
        const updatedProducts = products.filter((_, index) => index !== indexToRemove);
        setProducts(updatedProducts);

        const newSubTotal = updatedProducts.reduce((acc, curr) => acc + curr.totalPrice, 0);
        setSubTotal(newSubTotal);

        if (discountPercent > 0) {
            setDiscountAmount((newSubTotal * discountPercent) / 100);
        }
    };

    // --- Handlers for Payments ---
    const handleAddPayment = () => {
        const amt = parseFloat(paymentAmountInput);
        if (amt > 0) {
            setPayments([...payments, { method: paymentMethodInput, amount: amt }]);
            setPaid(prev => prev + amt); // Automatically increment the paid input field
            setPaymentAmountInput(''); // Reset amount input
            setIsPaymentModalOpen(false); // Close Modal
        }
    };

    const handleRemovePayment = (indexToRemove) => {
        const paymentToRemove = payments[indexToRemove];
        setPayments(payments.filter((_, index) => index !== indexToRemove));
        setPaid(prev => prev - paymentToRemove.amount); // Automatically decrement the paid input field
    };

    // --- Handle Form Submission (API Integration) ---
    const handleSaveSale = async () => {
        if (products.length === 0) {
            return alert("Please add at least one product before saving the sale.");
        }
        if (!branch) {
            return alert("Branch data is missing. Please refresh or login again.");
        }

        // Map UI state to match Backend Mongoose Schema strictly
        const saleData = {
            invoiceNumber,
            saleDate,
            customer,
            subTotal,
            discountPercent,
            discountAmount,
            total,
            paid,
            due,
            // Uses the first payment method, or defaults to Cash if they just typed in the 'paid' input field
            paymentMethod: payments.length > 0 ? payments[0].method : (paid > 0 ? 'Cash' : 'Unpaid'),
            note,
            branch: branch,
            products: products.map(p => ({
                productName: p.name, 
                phone: p.phone,
                metalType: p.metalType,
                purity: p.purity,
                weight: Number(p.weight) || 0,
                quantity: Number(p.quantity),
                unitPrice: Number(p.unitPrice),
                totalPrice: Number(p.totalPrice)
            }))
        };

        try {
            await createSale(saleData);
            alert("Sale saved successfully!");
            
            // Reset form for next sale
            setInvoiceNumber(`INV-${Math.floor(1000000000 + Math.random() * 9000000000)}`);
            setProducts([]);
            setPayments([]);
            setPaid(0);
            setSubTotal(0);
            setDiscountPercent(0);
            setDiscountAmount(0);
            setCustomer('');
            setNote('');
        } catch (err) {
            console.error("Failed to save sale", err);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDF8E7] p-6 font-sans">
            <div className="max-w-7xl mx-auto bg-white border border-gray-200 shadow-sm rounded-md">
                
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <h1 className="text-xl font-semibold text-gray-800">Add Sale</h1>
               <Link to={'/sales/list'}>  <button className="bg-[#D97706] hover:bg-[#B45309] text-white px-4 py-2 rounded shadow-sm text-sm font-medium flex items-center gap-2 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
                        View All Sales
                    </button>

                    </Link>

                    
                </div>

                {/* API Error Banner */}
                {error && (
                    <div className="m-4 p-4 bg-red-100 border border-red-200 text-red-700 rounded flex justify-between">
                        <span><strong>Error:</strong> {error}</span>
                        <button onClick={clearError} className="text-red-500 hover:text-red-800 font-bold">✕</button>
                    </div>
                )}

                <div className="p-6 space-y-8">
                    {/* Top Controls Row */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-600 mb-1">Invoice Number</label>
                            <div className="flex items-center bg-gray-50 border border-gray-300 rounded px-3 py-2">
                                <div className="w-3 h-3 bg-gray-500 mr-2 rounded-sm"></div>
                                <input type="text" value={invoiceNumber} readOnly className="bg-transparent outline-none w-full text-sm text-gray-600" />
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm text-gray-600 mb-1">Sale Date</label>
                            <input 
                                type="date" 
                                value={saleDate} 
                                onChange={(e) => setSaleDate(e.target.value)}
                                className="border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#D97706]" 
                            />
                        </div>

                        <div className="flex flex-col">
                            <div className="flex justify-between mb-1">
                                <label className="text-sm text-gray-600">Customer <span className="text-red-500">*</span></label>
                            </div>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={customer}
                                    onChange={(e) => setCustomer(e.target.value)}
                                    placeholder='Enter Customer Name'
                                    className="border border-gray-300 rounded pl-9 pr-3 py-2 w-full text-sm outline-none focus:border-[#D97706]" 
                                />
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <div className="flex justify-between mb-1">
                                <label className="text-sm text-gray-600">Add Products</label>
                                <button onClick={() => setIsProductModalOpen(true)} className="text-sm text-[#D97706] font-medium flex items-center gap-1">+ Add New</button>
                            </div>
                        </div>
                    </div>

                    {/* Product List Table/Display */}
                    {products.length > 0 && (
                        <div className="border border-gray-200 rounded overflow-hidden">
                            <table className="w-full text-left text-sm text-gray-600">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="py-2 px-4 font-medium">Product Name</th>
                                        <th className="py-2 px-4 font-medium">Qty</th>
                                        <th className="py-2 px-4 font-medium">Unit Price (৳)</th>
                                        <th className="py-2 px-4 font-medium">Total Price (৳)</th>
                                        <th className="py-2 px-4 font-medium text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((item, idx) => (
                                        <tr key={idx} className="border-b border-gray-100">
                                            <td className="py-2 px-4">{item.name} {item.purity && `(${item.purity})`}</td>
                                            <td className="py-2 px-4">{item.quantity}</td>
                                            <td className="py-2 px-4">{Number(item.unitPrice).toFixed(2)}</td>
                                            <td className="py-2 px-4">{item.totalPrice.toFixed(2)}</td>
                                            <td className="py-2 px-4 text-right">
                                                <button onClick={() => handleRemoveProduct(idx)} className="text-red-500 hover:text-red-700 text-xs font-medium">Remove</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                
                   {/* Payment Summary Section */}
<div>
    <h3 className="text-sm font-semibold text-gray-700 mb-3">Payment Summary</h3>
    <div className="bg-gray-50/50 border border-gray-200 rounded p-4 flex flex-col md:flex-row justify-between">
        
        <div className="w-full md:w-1/2 space-y-4">
            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Sub Total:</span>
                <span className="text-sm font-semibold">৳ {subTotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 w-16">Discount:</span>
                <div className="flex items-center flex-1 gap-2">
                    <div className="relative flex-1">
                        <input 
                            type="text" 
                            value={discountPercent} 
                            onChange={handleDiscountPercentChange}
                            className="border border-gray-300 rounded w-full py-1.5 px-3 text-sm text-right pr-6 outline-none focus:border-[#D97706]" 
                        />
                        <span className="absolute right-2 top-1.5 text-gray-500 text-sm">%</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="w-full md:w-1/3 mt-4 md:mt-0 space-y-2 text-sm flex flex-col justify-center">
            <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Total:</span>
                <span className="font-bold text-[#D97706]">৳ {total.toFixed(2)}</span>
            </div>
            
            {/* Refactored Paid as Dynamic Text Display */}
            <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Paid:</span>
                <span className="font-bold text-green-600">৳ {paid.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Due:</span>
                <span className="font-bold text-red-500">৳ {due.toFixed(2)}</span>
            </div>
        </div>
    </div>
</div>

                    {/* Payment Methods Section */}
                    <div>
                        <div className="flex flex-wrap justify-between items-center mb-3 gap-3">
                            <h3 className="text-sm font-semibold text-gray-700">Payment Methods ({payments.length})</h3>
                            {/* Updated button to trigger the Modal */}
                            <button 
                                onClick={() => setIsPaymentModalOpen(true)}
                                className="bg-[#D97706] hover:bg-[#B45309] text-white px-3 py-1.5 rounded shadow-sm text-xs font-medium transition-colors"
                            >
                                + Add Payment
                            </button>
                        </div>

                        {/* Removed the 'No payments added yet' string completely */}
                        {payments.length > 0 && (
                            <div className="border border-gray-200 rounded p-4 text-sm text-gray-600 bg-gray-50/30">
                                <div className="space-y-2">
                                    {payments.map((p, idx) => (
                                        <div key={idx} className="flex justify-between items-center border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                                            <span>{p.method}</span>
                                            <div className="flex items-center gap-4">
                                                <span className="font-medium">৳ {p.amount.toFixed(2)}</span>
                                                <button onClick={() => handleRemovePayment(idx)} className="text-red-500 hover:text-red-700 text-xs font-medium">✕</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Note & Save Section */}
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <label className="text-xs text-gray-500 mb-1 block">Note</label>
                            <textarea 
                                placeholder="Add note (optional)"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                rows="3"
                                className="w-full border border-gray-200 rounded p-3 text-sm outline-none focus:border-[#D97706] resize-none"
                            ></textarea>
                        </div>
                        <button 
                            onClick={handleSaveSale}
                            disabled={loading}
                            className={`bg-[#D97706] hover:bg-[#B45309] text-white px-6 py-2.5 rounded shadow text-sm font-medium transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Saving...' : 'Save Sale'}
                        </button>
                    </div>

                </div>
            </div>

            {/* --- Add Payment Modal --- */}
            {isPaymentModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-800">Add Payment</h2>
                            <button onClick={() => setIsPaymentModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm text-gray-700 font-medium mb-1">Payment Method</label>
                                <select 
                                    value={paymentMethodInput} 
                                    onChange={(e) => setPaymentMethodInput(e.target.value)} 
                                    className="w-full border border-gray-300 rounded p-2.5 text-sm outline-none focus:border-[#D97706]"
                                >
                                    <option value="Cash">Cash</option>
                                    <option value="Card">Card</option>
                                    <option value="Mobile Banking">Mobile Banking</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 font-medium mb-1">Amount (৳)</label>
                                <input 
                                    type="number" 
                                    min="0"
                                    value={paymentAmountInput} 
                                    onChange={(e) => setPaymentAmountInput(e.target.value)} 
                                    className="w-full border border-gray-300 rounded p-2.5 text-sm outline-none focus:border-[#D97706]" 
                                />
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                            <button onClick={() => setIsPaymentModalOpen(false)} className="px-5 py-2 border border-gray-300 rounded text-sm text-gray-700 font-medium hover:bg-gray-100 transition-colors">Cancel</button>
                            <button onClick={handleAddPayment} className="px-5 py-2 bg-[#D97706] text-white rounded text-sm font-medium hover:bg-[#B45309] transition-colors">Add</button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Add New Product Modal --- */}
            {isProductModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-800">Add New Product</h2>
                            <button onClick={() => setIsProductModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm text-gray-700 font-medium mb-1">Product Name <span className="text-red-500">*</span></label>
                                <input type="text" placeholder="E.g. Gold Ring" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} className="w-full border border-gray-300 rounded p-2.5 text-sm outline-none focus:border-[#D97706]" />
                            </div>
                            
                            <div>
                                <label className="block text-sm text-gray-700 font-medium mb-1">Phone</label>
                                <input type="text" value={newProduct.phone} onChange={(e) => setNewProduct({...newProduct, phone: e.target.value})} className="w-full border border-gray-300 rounded p-2.5 text-sm outline-none focus:border-[#D97706]" />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-700 font-medium mb-1">Metal Type</label>
                                <input type="text" placeholder="E.g. Gold, Silver" value={newProduct.metalType} onChange={(e) => setNewProduct({...newProduct, metalType: e.target.value})} className="w-full border border-gray-300 rounded p-2.5 text-sm outline-none focus:border-[#D97706]" />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-700 font-medium mb-1">Purity</label>
                                <input type="text" placeholder="E.g. 22K" value={newProduct.purity} onChange={(e) => setNewProduct({...newProduct, purity: e.target.value})} className="w-full border border-gray-300 rounded p-2.5 text-sm outline-none focus:border-[#D97706]" />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-700 font-medium mb-1">Weight</label>
                                <input type="text" value={newProduct.weight} onChange={(e) => setNewProduct({...newProduct, weight: e.target.value})} className="w-full border border-gray-300 rounded p-2.5 text-sm outline-none focus:border-[#D97706]" />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-700 font-medium mb-1">Quantity <span className="text-red-500">*</span></label>
                                <input type="text" min="1" value={newProduct.quantity} onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})} className="w-full border border-gray-300 rounded p-2.5 text-sm outline-none focus:border-[#D97706]" />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-700 font-medium mb-1">Unit Price (৳) <span className="text-red-500">*</span></label>
                                <input type="text" min="0" value={newProduct.unitPrice} onChange={(e) => setNewProduct({...newProduct, unitPrice: e.target.value})} className="w-full border border-gray-300 rounded p-2.5 text-sm outline-none focus:border-[#D97706]" />
                            </div>

                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm text-gray-700 font-medium mb-1">Total Price (৳) <span className="text-red-500">*</span></label>
                                <input type="number" readOnly value={newProduct.totalPrice} className="w-full border border-gray-300 bg-gray-50 rounded p-2.5 text-sm outline-none text-gray-600" />
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                            <button onClick={() => setIsProductModalOpen(false)} className="px-5 py-2.5 border border-gray-300 rounded text-sm text-gray-700 font-medium hover:bg-gray-100 transition-colors">Cancel</button>
                            <button onClick={handleAddProduct} className="px-5 py-2.5 bg-[#D97706] text-white rounded text-sm font-medium hover:bg-[#B45309] transition-colors">Add Product</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sale;