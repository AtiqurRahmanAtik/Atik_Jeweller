import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    Calendar, ShoppingCart, Plus, PackageOpen, Loader2,
    Trash2, X, Scale, Coins, Receipt, Tag, CheckCircle, AlertCircle, Printer
} from 'lucide-react';
import { useWebProducts } from '../../../Hook/useWebProducts'; 
import { useOrders } from '../../../Hook/useOrders';
import useAuth from '../../../Hook/useAuth'; 

// Custom SVG exactly matching your uploaded 9-dot grid image
const NineDotGridIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="4" fill="currentColor" />
        <circle cx="6" cy="6" r="2.5" fill="white" />
        <circle cx="12" cy="6" r="2.5" fill="white" />
        <circle cx="18" cy="6" r="2.5" fill="white" />
        <circle cx="6" cy="12" r="2.5" fill="white" />
        <circle cx="12" cy="12" r="2.5" fill="white" />
        <circle cx="18" cy="12" r="2.5" fill="white" />
        <circle cx="6" cy="18" r="2.5" fill="white" />
        <circle cx="12" cy="18" r="2.5" fill="white" />
        <circle cx="18" cy="18" r="2.5" fill="white" />
    </svg>
);

// Helper function to convert Amount to Words
const convertNumberToWords = (amount) => {
    if (!amount) return "Zero Taka Only";
    
    const words = [
        "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
        "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
    ];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    function convert(num) {
        if (num < 20) return words[num];
        if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? " " + words[num % 10] : "");
        if (num < 1000) return words[Math.floor(num / 100)] + " Hundred" + (num % 100 !== 0 ? " and " + convert(num % 100) : "");
        if (num < 100000) return convert(Math.floor(num / 1000)) + " Thousand" + (num % 1000 !== 0 ? " " + convert(num % 1000) : "");
        if (num < 10000000) return convert(Math.floor(num / 100000)) + " Lakh" + (num % 100000 !== 0 ? " " + convert(num % 100000) : "");
        return convert(Math.floor(num / 10000000)) + " Crore" + (num % 10000000 !== 0 ? " " + convert(num % 10000000) : "");
    }

    const numStr = String(amount);
    if (numStr.includes('.')) {
        const parts = numStr.split('.');
        const taka = convert(Number(parts[0]));
        const poisha = convert(Number(parts[1].substring(0, 2))); // Max 2 decimal
        return poisha !== "Zero" ? `${taka} Taka and ${poisha} Poisha Only` : `${taka} Taka Only`;
    }
    return convert(Number(amount)) + " Taka Only";
};

const AddOrder = () => {
    const { branch } = useAuth();
    const {
        webProducts,
        loading,
        pagination,
        fetchWebProducts,
        searchProducts
    } = useWebProducts();

    const { createOrder, loading: orderLoading } = useOrders();

    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [cartItems, setCartItems] = useState([]);
    
    // --- Order Form States ---
    const [customerName, setCustomerName] = useState(''); 
    const [discountPct, setDiscountPct] = useState('');
    const [discountAmt, setDiscountAmt] = useState('');
    const [paidAmt, setPaidAmt] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [note, setNote] = useState('');
    const [invoiceId, setInvoiceId] = useState(() => Math.floor(100000 + Math.random() * 900000));
    const [toast, setToast] = useState(null);
    const [successModal, setSuccessModal] = useState(null);
    
    // --- Grid Layout (2, 3, or 4 columns) ---
    const [gridCols, setGridCols] = useState(2); 

    const fetchedBranch = useRef(null);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm) {
                searchProducts(searchTerm, page, 10);
            } else {
                fetchWebProducts(page, 10);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [page, searchTerm, searchProducts, fetchWebProducts]);

    useEffect(() => {
        if (branch && fetchedBranch.current !== branch) {
            fetchedBranch.current = branch;
            fetchWebProducts(1, 100);
        }
    }, [branch, fetchWebProducts]);

    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 3500);
        return () => clearTimeout(t);
    }, [toast]);

    const getName = (p) => p.title || p.productName || p.name || 'Unnamed';
    const getSalePrice = (p) => parseFloat(p.totalPrice || p.salesPrice || p.salePrice || p.price || 0);


    const getProductCategoryName = (p) => {
        if (!p.category) return '';
        if (typeof p.category === 'string') return p.category;
        return p.category.name || p.category.categoryName || '';
    };

    const fmt = (n) => Number(n || 0).toLocaleString('en-BD', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    const categoryNames = useMemo(() => {
        const fromProducts = webProducts.map(getProductCategoryName).filter(Boolean);
        return [...new Set(fromProducts)].sort();
    }, [webProducts]);

    const filteredProducts = useMemo(() => {
        if (!webProducts?.length) return [];
        if (selectedCategory === 'All') return webProducts;
        
        const exactMatches = webProducts.filter(p => getProductCategoryName(p) === selectedCategory);
        return exactMatches.length > 0 ? exactMatches : webProducts;
    }, [webProducts, selectedCategory]);

    const subtotal = cartItems.reduce((s, i) => s + getSalePrice(i) * i.qty, 0);

    const discountValue = discountPct
        ? (subtotal * parseFloat(discountPct)) / 100
        : parseFloat(discountAmt || 0);

    const afterDiscount = Math.max(0, subtotal - discountValue);

    const vatTotal = cartItems.reduce((s, i) => {
        const lineTotal = getSalePrice(i) * i.qty;
        const vatAmt = (lineTotal ) / 100;
        return s + vatAmt;
    }, 0);

    const total = afterDiscount + vatTotal;
    const paid = parseFloat(paidAmt || 0);
    const due = Math.max(0, total - paid);

    const handleAddToCart = (product) => {
        setCartItems(prev => {
            const exists = prev.find(i => i._id === product._id);
            if (exists) return prev.map(i => i._id === product._id ? { ...i, qty: i.qty + 1 } : i);
            return [...prev, { ...product, qty: 1 }];
        });
    };

    const handleQty = (id, delta) =>
        setCartItems(prev => prev.map(i => i._id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));

    const handleRemove = (id) =>
        setCartItems(prev => prev.filter(i => i._id !== id));

    const clearOrder = () => {
        setCartItems([]); 
        setCustomerName(''); 
        setDiscountPct(''); 
        setDiscountAmt('');
        setPaidAmt(''); 
        setDeliveryDate(''); 
        setNote('');
        setInvoiceId(Math.floor(100000 + Math.random() * 900000)); 
    };

    const handleConfirmOrder = async () => {
        if (cartItems.length === 0) return;

        const payload = {
            orderId: Date.now(),
            Invoice: invoiceId, 
            customerName: customerName || 'Walk-in Customer',
            Products: cartItems.map(item => ({
                product: item._id,
                productName: getName(item),
                category: getProductCategoryName(item),
                salesPrice: getSalePrice(item),
              
                quantity: item.qty,
                Total: getSalePrice(item) * item.qty,
                VAT: (getSalePrice(item) * item.qty ) / 100,
                TotalWithVat: getSalePrice(item) * item.qty + (getSalePrice(item) * item.qty ) / 100,
            })),
            price: subtotal,
            discount: discountValue || 0,
            afterDiscount: afterDiscount,
            totalVat: vatTotal,
            total: total,
            paid: paid,
            dueAmount: due,
            expectedDelivery: deliveryDate || '',
            orderNote: note || '',
            branch: branch || 'demo',
            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        };

        try {
            const result = await createOrder(payload);
            setToast({ type: 'success', message: 'Order confirmed successfully!' });
            setSuccessModal(payload);
            clearOrder();
        } catch (err) {
            setToast({ type: 'error', message: err?.message || 'Failed to confirm order.' });
        }
    };

    const handlePrintPDF = () => {
        window.print();
    };

    const isSubmitting = orderLoading;

    const GridColumnIcons = {
        2: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="18" rx="1.5"/><rect x="14" y="3" width="7" height="18" rx="1.5"/></svg>,
        3: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="3" width="5" height="18" rx="1"/><rect x="9.5" y="3" width="5" height="18" rx="1"/><rect x="17" y="3" width="5" height="18" rx="1"/></svg>,
        4: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="1.5" y="3" width="3.5" height="18" rx="0.5"/><rect x="7.25" y="3" width="3.5" height="18" rx="0.5"/><rect x="13" y="3" width="3.5" height="18" rx="0.5"/><rect x="18.75" y="3" width="3.5" height="18" rx="0.5"/></svg>
    };

    return (
        <>
            <div className="min-h-screen bg-[#fdf8ed] p-4 md:p-6 font-sans text-slate-800 print:hidden relative">

                {/* Toast */}
                {toast && (
                    <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl
                                     text-white text-sm font-semibold transition-all duration-300
                                     ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-500'}`}>
                        {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        {toast.message}
                    </div>
                )}

                <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* ══ LEFT (Products) ══ */}
                    <div className="lg:col-span-2">
                        {/* Search & Category bar */}
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-orange-100 mb-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
                                <div className="flex items-center gap-2 text-gray-800">
                                    <NineDotGridIcon />
                                    <h2 className="text-sm font-bold uppercase tracking-wider">Search & Filter</h2>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <div className="flex items-center gap-1 bg-orange-50/50 p-1 rounded-lg border border-orange-100">
                                        {[2, 3, 4].map(num => (
                                            <button
                                                key={num}
                                                onClick={() => setGridCols(num)}
                                                className={`w-8 h-7 rounded flex items-center justify-center transition-all 
                                                    ${gridCols === num 
                                                        ? 'bg-white shadow-sm text-black border border-orange-200' 
                                                        : 'text-black hover:text-orange-500 hover:bg-orange-100/50'
                                                    }`}
                                                title={`${num} Columns Layout`}
                                            >
                                                {GridColumnIcons[num]}
                                            </button>
                                        ))}
                                    </div>
                                    <span className="text-xs text-gray-400">{filteredProducts.length} products </span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Search products by title or tag..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setPage(1); 
                                    }}
                                    className="w-full px-4 py-2.5 text-sm border border-orange-200 rounded-lg focus:outline-none focus:border-[#c27803] focus:ring-1 focus:ring-[#c27803] transition-all bg-orange-50/30"
                                />
                            </div>

                            {loading && categoryNames.length === 0 ? (
                                <div className="flex items-center gap-2 text-orange-400 text-sm">
                                    <Loader2 size={14} className="animate-spin" /> Loading Categories…
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => {
                                            setSelectedCategory('All');
                                            setPage(1);
                                        }}
                                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${selectedCategory === 'All' ? 'bg-[#c27803] text-white shadow-md' : 'bg-orange-50 text-orange-800 border border-orange-200 hover:bg-orange-100'
                                            }`}
                                    >
                                        All Products
                                    </button>
                                    {categoryNames.map((name) => (
                                        <button
                                            key={name}
                                            onClick={() => {
                                                setSelectedCategory(name);
                                                setPage(1); 
                                            }}
                                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${selectedCategory === name ? 'bg-[#c27803] text-white shadow-md' : 'bg-orange-50 text-orange-800 border border-orange-200 hover:bg-orange-100'
                                                }`}
                                        >
                                            {name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Grid */}
                        <div className="pb-6">
                            {loading ? (
                                <div className="h-64 flex flex-col items-center justify-center text-[#c27803]">
                                    <Loader2 size={40} className="animate-spin mb-4" />
                                    <p className="font-semibold">Loading Products…</p>
                                </div>
                            ) : filteredProducts.length === 0 ? (
                                <div className="h-64 flex flex-col items-center justify-center text-gray-400 bg-white rounded-xl border border-dashed border-orange-100">
                                    <PackageOpen size={48} className="mb-3 opacity-40" />
                                    <p className="font-medium text-gray-500">No products found</p>
                                </div>
                            ) : (
                                <div className={`grid gap-5 transition-all duration-300
                                    ${gridCols === 2 ? 'grid-cols-1 sm:grid-cols-2' : ''}
                                    ${gridCols === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : ''}
                                    ${gridCols === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : ''}
                                `}>
                                    {filteredProducts.map((product) => {
                                        const finalImgSrc = product.imageUrl || product.productImage || null;
                                        const name = getName(product);
                                        const inCart = cartItems.find((i) => i._id === product._id);

                                        return (
                                            <div
                                                key={product._id}
                                                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col group"
                                            >
                                                <div className="relative aspect-[4/3] bg-gradient-to-br from-orange-50 to-amber-50 overflow-hidden">
                                                    {finalImgSrc ? (
                                                        <img
                                                            src={finalImgSrc}
                                                            alt={name}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                e.target.nextSibling.style.display = 'flex';
                                                            }}
                                                        />
                                                    ) : null}
                                                    <div
                                                        style={{ display: finalImgSrc ? 'none' : 'flex' }}
                                                        className="absolute inset-0 flex items-center justify-center text-orange-200 text-5xl"
                                                    >
                                                        💍
                                                    </div>
                                                    {inCart && (
                                                        <span className="absolute bottom-3 right-3 bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md z-10">
                                                            {inCart.qty} in Cart
                                                        </span>
                                                    )}
                                                    
                                                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 text-[10px] font-bold px-2 py-1 rounded shadow-sm border border-gray-100 uppercase tracking-wide z-10">
                                                        {product.category || 'Ring'}
                                                    </span>
                                                </div>

                                                <div className="p-4 flex flex-col flex-1">
                                                    <h2 className="font-bold text-lg text-gray-900 line-clamp-1 mb-1" title={name}>
                                                        {name}
                                                    </h2>

                                                    <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 bg-orange-50/50 p-3 rounded-lg border border-orange-100 mt-auto">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Metal/Purity</span>
                                                            <span className="text-xs font-bold text-gray-700">
                                                                {product.metalType || 'Gold'} <span className="text-gray-400 mx-0.5">•</span> {product.purity || product.tag || 'N/A'}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Sales Price</span>
                                                            <span className="text-sm font-extrabold text-[#c27803]">
                                                                ৳{(product.totalPrice || product.salesPrice)?.toLocaleString() || 0}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Making Charge</span>
                                                            <span className="text-xs font-bold text-gray-700">
                                                                ৳{(product.wages || product.makingCharge)?.toLocaleString() || 0}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Purchase Price</span>
                                                            <span className="text-xs font-bold text-gray-600">
                                                                ৳{(product.originalPrice || product.purchasePrice)?.toLocaleString() || 0}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Rates/Weight</span>
                                                            <span className="text-xs font-bold text-gray-600 truncate">
                                                                {product.salesRatePerVori || product.weight || 0} <span className="text-gray-400 mx-0.5">/</span> {product.purchaseRatePerVori || 'Gram'}
                                                            </span>
                                                        </div>
                                                        
                                                    </div>
                                                </div>

                                                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                                                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                                                        <Tag size={12} />
                                                        <span className="font-semibold text-gray-700 uppercase tracking-wide truncate max-w-[90px]" title={product.stockTypes || product.featuredProducts}>
                                                            {product.stockTypes || product.featuredProducts || 'Standard'}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => handleAddToCart(product)}
                                                        className="bg-[#c27803] hover:bg-[#a66502] text-white text-xs font-bold px-3 py-2 rounded-md transition-colors shadow-sm flex items-center gap-1.5"
                                                    >
                                                        <Plus size={14} strokeWidth={3} /> <span className="hidden sm:inline">{inCart ? 'Add Another' : 'Add to Order'}</span><span className="sm:hidden">Add</span>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ══ RIGHT (Cart & Payment) ══ */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-xl shadow-sm border border-orange-100/50 overflow-hidden">
                            <div className="bg-[#dca45b] px-4 py-3 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-gray-900">Payment Summary</h3>
                                    <p className="text-[11px] text-gray-800 font-bold opacity-80 mt-0.5">Inv #: {invoiceId}</p>
                                </div>
                                <span className="flex items-center gap-1 text-sm bg-white/30 px-2 py-0.5 rounded font-semibold text-gray-900">
                                    <ShoppingCart size={14} /> {cartItems.reduce((s, i) => s + i.qty, 0)} items
                                </span>
                            </div>

                            {cartItems.length > 0 && (
                                <div className="px-4 pt-3 space-y-2 max-h-52 overflow-y-auto">
                                    {cartItems.map((item) => {
                                        const linePrice = getSalePrice(item) * item.qty;
                                        const lineVat = (linePrice ) / 100;
                                        return (
                                            <div key={item._id} className="flex items-center gap-2 pb-2 border-b border-gray-50 last:border-0">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-semibold text-gray-800 truncate">{getName(item)}</p>
                                                    <p className="text-[11px] text-gray-400">৳{fmt(getSalePrice(item))} × {item.qty}</p>
                                                </div>
                                                <div className="flex items-center gap-1 flex-shrink-0">
                                                    <button onClick={() => handleQty(item._id, -1)} className="w-5 h-5 rounded bg-orange-100 text-orange-700 text-xs font-bold flex items-center justify-center hover:bg-orange-200">−</button>
                                                    <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                                                    <button onClick={() => handleQty(item._id, 1)} className="w-5 h-5 rounded bg-orange-100 text-orange-700 text-xs font-bold flex items-center justify-center hover:bg-orange-200">+</button>
                                                </div>
                                                <span className="text-xs font-bold text-[#c27803] w-16 text-right flex-shrink-0">৳{fmt(linePrice + lineVat)}</span>
                                                <button onClick={() => handleRemove(item._id)} className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"><X size={14} /></button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <div className="p-5 space-y-3 text-sm font-medium text-gray-600">
                                <div className="flex justify-between border-b border-gray-100 pb-3"><span>Subtotal</span><span className="font-bold text-gray-800">৳ {fmt(subtotal)}</span></div>
                                
                                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                    <div>
                                        <span>Discount</span>
                                        {discountValue > 0 && <span className="ml-1 text-xs text-red-400 font-semibold">− ৳{fmt(discountValue)}</span>}
                                    </div>
                                    <div className="flex gap-2">
                                        <input type="text" placeholder="%" value={discountPct} onChange={e => { setDiscountPct(e.target.value); setDiscountAmt(''); }} className="w-14 border border-gray-300 rounded p-1.5 text-right text-xs outline-none focus:border-[#c27803]" />
                                    </div>
                                </div>

                                {/* ADDED VAT CALCULATION TO SUMMARY */}
                               

                                <div className="flex justify-between text-base text-gray-900 font-bold bg-orange-50 rounded-lg px-3 py-2.5"><span>Total</span><span className="text-[#c27803]">৳ {fmt(total)}</span></div>
                                <div className="flex justify-between items-center text-green-600">
                                    <span>Paid</span>
                                    <input type="number" placeholder="Enter amount" value={paidAmt} onChange={e => setPaidAmt(e.target.value)} className="w-28 border border-green-200 rounded p-1.5 text-right text-sm font-semibold text-green-700 outline-none focus:border-green-500" />
                                </div>
                                <div className="flex justify-between text-red-500 font-semibold border-t border-gray-100 pt-2 pb-2"><span>Due Amount</span><span>৳ {fmt(due)}</span></div>

                                {/* Customer Name, Expected Delivery & Order Note UI */}
                                <div className="pt-4 border-t border-gray-100 space-y-4">
                                    <div>
                                        <label className="text-xs text-gray-500 font-bold mb-1.5 block">Customer Name</label>
                                        <input 
                                            type="text" 
                                            placeholder="Enter customer name..."
                                            value={customerName} 
                                            onChange={e => setCustomerName(e.target.value)} 
                                            className="w-full border border-gray-200 rounded-lg p-2 text-xs text-gray-700 outline-none focus:border-[#c27803] focus:ring-1 focus:ring-[#c27803] transition-all bg-gray-50" 
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 font-bold mb-1.5 block">Expected Delivery</label>
                                        <input 
                                            type="date" 
                                            value={deliveryDate} 
                                            onChange={e => setDeliveryDate(e.target.value)} 
                                            className="w-full border border-gray-200 rounded-lg p-2 text-xs text-gray-700 outline-none focus:border-[#c27803] focus:ring-1 focus:ring-[#c27803] transition-all bg-gray-50" 
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 font-bold mb-1.5 block">Order Note / Details</label>
                                        <textarea 
                                            placeholder="Write any specific instructions here..." 
                                            value={note} 
                                            onChange={e => setNote(e.target.value)} 
                                            rows="2" 
                                            className="w-full border border-gray-200 rounded-lg p-2 text-xs text-gray-700 outline-none focus:border-[#c27803] focus:ring-1 focus:ring-[#c27803] transition-all bg-gray-50 resize-none"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <button onClick={clearOrder} disabled={isSubmitting} className="flex-1 bg-[#fdf8ed] border-2 border-[#dca45b] text-gray-700 py-3 rounded-lg font-bold hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"><Trash2 size={15} /> Clear</button>
                            <button onClick={handleConfirmOrder} disabled={cartItems.length === 0 || isSubmitting} className="flex-1 bg-[#c27803] hover:bg-[#a66502] text-white py-3 rounded-lg font-bold shadow-md transition-colors flex items-center justify-center gap-2">
                                {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : 'Confirm Order'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── ON-SCREEN MODAL (Hidden during print) ── */}
            {successModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 p-4 print:hidden overflow-y-auto backdrop-blur-sm">
                    <div className="bg-[#fffdfa] rounded-[2rem] max-w-[1000px] w-full flex flex-col md:flex-row shadow-2xl overflow-hidden">
                        
                        {/* LEFT SIDE MODAL */}
                        <div className="md:w-1/2 p-10 md:p-14 flex flex-col justify-center bg-white">
                            <h1 className="text-[2.75rem] font-black text-[#1a1a1a] leading-tight mb-4 tracking-tight">
                                Thank you for your purchase!
                            </h1>
                            <p className="text-gray-600 mb-10 text-[15px] leading-relaxed pr-4">
                                Your order will be processed within 24 hours during working days. We will notify you by email once your order has been shipped.
                            </p>

                            <h3 className="font-bold text-[#1a1a1a] text-lg mb-4">Billing address</h3>
                            <div className="grid grid-cols-[100px_1fr] gap-y-3 text-[14px] text-gray-800 font-medium mb-10">
                                <span className="text-gray-900 font-bold">Customer</span>
                                <span>{successModal.customerName}</span>
                                <span className="text-gray-900 font-bold">Branch</span>
                                <span>{(successModal.branch || 'demo').charAt(0).toUpperCase() + (successModal.branch || 'demo').slice(1)}</span>
                                <span className="text-gray-900 font-bold">Delivery</span>
                                <span>{successModal.expectedDelivery || "Standard Timeline"}</span>
                                <span className="text-gray-900 font-bold">Note</span>
                                <span>{successModal.orderNote || "None"}</span>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={handlePrintPDF}
                                    className="bg-[#fe7a68] hover:bg-[#e66c5c] text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-[#fe7a68]/30 transition-all flex items-center gap-2"
                                >
                                    <Printer size={18} /> Print Receipt
                                </button>
                                <button
                                    onClick={() => setSuccessModal(null)}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3.5 rounded-full font-bold transition-all"
                                >
                                    Close
                                </button>
                            </div>
                        </div>

                        {/* RIGHT SIDE RECEIPT - Screen Preview */}
                        <div className="md:w-1/2 p-6 md:p-10 bg-[#f6f5f3] flex items-center justify-center">
                            <div className="w-full max-w-[420px] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-8">
                                    <h2 className="text-2xl font-black text-[#1a1a1a] mb-8">Order Summary</h2>

                                    <div className="grid grid-cols-3 gap-4 pb-6 border-b border-dashed border-gray-200">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Date</p>
                                            <p className="text-[13px] font-bold text-[#1a1a1a]">{successModal.date}</p>
                                        </div>
                                        <div className="flex flex-col items-center justify-center">
                                            <p className="text-xs text-gray-500 mb-1">Order / Invoice</p>
                                            <p className="text-[13px] font-bold text-[#1a1a1a]">#{successModal.orderId.toString().slice(-8)}</p>
                                            <p className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded mt-0.5">INV-{successModal.Invoice}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 mb-1">Status</p>
                                            <p className="text-[13px] font-bold text-green-600">Confirmed</p>
                                        </div>
                                    </div>

                                    {/* Product List */}
                                    <div className="py-6 border-b border-dashed border-gray-200 space-y-6">
                                        {successModal.Products.map((item, idx) => (
                                            <div key={idx} className="flex items-start gap-4">
                                                <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0 text-xl font-bold text-orange-300 border border-orange-100">
                                                    {item.productName.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-[#1a1a1a] text-sm mb-1 line-clamp-1">{item.productName}</h4>
                                                    <p className="text-xs text-gray-500 mb-0.5">Category: {item.category || 'Standard'}</p>
                                                    <p className="text-xs text-gray-500">Qty: {item.quantity} (VAT {item.vatPercentage}%)</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-[#1a1a1a] text-sm">৳{fmt(item.TotalWithVat)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Totals List */}
                                    <div className="py-6 border-b border-dashed border-gray-200 space-y-3 text-sm">
                                        <div className="flex justify-between text-gray-500">
                                            <span>Sub Total</span>
                                            <span className="font-bold text-gray-800">৳{fmt(successModal.price)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-500">
                                            <span>Discount</span>
                                            <span className="font-bold text-gray-800">- ৳{fmt(successModal.discount)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-500">
                                            <span>Tax (VAT)</span>
                                            <span className="font-bold text-gray-800">+ ৳{fmt(successModal.totalVat)}</span>
                                        </div>
                                    </div>

                                    {/* Grand Total */}
                                    <div className="pt-6 pb-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="font-black text-[#1a1a1a] text-lg">Order Total</span>
                                            <span className="font-black text-[#1a1a1a] text-lg">৳{fmt(successModal.total)}</span>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-xl space-y-2 text-[13px]">
                                            <div className="flex justify-between text-gray-600">
                                                <span>Amount Paid</span>
                                                <span className="font-bold text-gray-800">৳{fmt(successModal.paid)}</span>
                                            </div>
                                            <div className="flex justify-between text-[#e66c5c] font-bold">
                                                <span>Balance Due</span>
                                                <span>৳{fmt(successModal.dueAmount)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── PRINT ONLY VIEW (CASH RECEIPT - MATCHING IMAGE DESIGN) ── */}
            {successModal && (
                <div className="hidden print:flex w-full items-center justify-center bg-white text-black p-0 m-0 print:absolute print:inset-0 print:z-[9999]">
                    <div className="w-full max-w-[800px] font-sans text-black border-[2px] border-black m-2 flex flex-col">
                        
                        {/* Header: Title */}
                        <div className="text-center border-b-[2px] border-black py-2">
                            <h1 className="text-red-600 text-2xl font-bold uppercase tracking-wider">
                                Cash Receipt
                            </h1>
                        </div>

                        {/* Header: Subtitle */}
                        <div className="text-center border-b-[2px] border-black py-1.5">
                            <h2 className="text-blue-900 text-lg font-bold">
                                {(successModal.branch || 'Business Name and Address').toUpperCase()}
                            </h2>
                        </div>

                        {/* Row: Date, Delivery & Receipt No */}
                        <div className="flex border-b-[2px] border-black">
                            <div className="w-1/3 border-r-[2px] border-black p-1.5 flex gap-2">
                                <span className="font-semibold underline">Date:</span>
                                <span>{successModal.date}</span>
                            </div>
                            <div className="w-1/3 border-r-[2px] border-black p-1.5 flex gap-2 truncate">
                                <span className="font-semibold underline">Delivery:</span>
                                <span>{successModal.expectedDelivery || 'N/A'}</span>
                            </div>
                            <div className="w-1/3 p-1.5 flex gap-2">
                                <span className="font-semibold underline">Receipt No.</span>
                                <span>{successModal.Invoice}</span>
                            </div>
                        </div>

                        {/* Spacer Row */}
                        <div className="border-b-[2px] border-black h-6"></div>

                        {/* Row: Received From & Amount */}
                        <div className="flex border-b-[2px] border-black">
                            <div className="w-1/2 border-r-[2px] border-black p-1.5 flex gap-2 items-center">
                                <span className="font-semibold underline">Received From :</span>
                                <span className="font-medium text-sm">{successModal.customerName}</span>
                            </div>
                            <div className="w-1/2 p-1.5 flex gap-2 items-center">
                                <span className="font-semibold">Amount (৳)</span>
                                <span className="font-bold">{fmt(successModal.paid)}</span>
                            </div>
                        </div>

                        {/* Row: Amount in words */}
                        <div className="border-b-[2px] border-black p-1.5 flex gap-2 min-h-[36px] items-center">
                            <span className="font-semibold underline">Amount in words:</span>
                            <span className="italic text-gray-700 flex-1 border-b border-dashed border-gray-400 h-5">
                                {convertNumberToWords(successModal.paid)}
                            </span>
                        </div>

                        {/* Wide Spacer Row */}
                        <div className="border-b-[2px] border-black h-10"></div>

                        {/* Row: Payment Purpose */}
                        <div className="border-b-[2px] border-black p-1.5 flex gap-2 min-h-[36px] items-center">
                            <span className="font-semibold underline">Payment Purpose:</span>
                            <span>Order #{successModal.orderId.toString().slice(-8)} Payment</span>
                        </div>

                        {/* Headers for Bottom Grid */}
                        <div className="flex border-b-[2px] border-black text-center bg-white">
                            <div className="w-1/2 border-r-[2px] border-black p-1.5">
                                <span className="font-semibold underline">Account Details:</span>
                            </div>
                            <div className="w-1/2 p-1.5">
                                <span className="font-semibold underline">Payment Mode:</span>
                            </div>
                        </div>

                        {/* Bottom Split Section */}
                        <div className="flex min-h-[220px]">
                            
                            {/* LEFT COLUMN - Account Details */}
                            <div className="w-1/2 border-r-[2px] border-black flex flex-col">
                                <div className="flex border-b-[2px] border-black p-1.5 h-10 items-center justify-between">
                                    <span className="font-semibold">Total Due Amount:</span>
                                    <span>৳{fmt(successModal.total)}</span>
                                </div>
                                <div className="flex border-b-[2px] border-black p-1.5 h-10 items-center justify-between">
                                    <span className="font-semibold">Total Amount Paid:</span>
                                    <span>৳{fmt(successModal.paid)}</span>
                                </div>
                                <div className="flex border-b-[2px] border-black h-10">
                                    <div className="w-2/3 border-r-[2px] border-black p-1.5 flex items-center">
                                        <span className="font-semibold">Balance Due:</span>
                                    </div>
                                    <div className="w-1/3 p-1.5 flex items-center justify-center font-bold">
                                        {successModal.dueAmount <= 0 ? "-" : `৳${fmt(successModal.dueAmount)}`}
                                    </div>
                                </div>
                                {/* Empty space filler for left column */}
                                <div className="flex-1 bg-white"></div>
                            </div>

                            {/* RIGHT COLUMN - Payment Mode & Signature */}
                            <div className="w-1/2 flex flex-col">
                                {/* Checkboxes/Amounts */}
                                <div className="flex border-b-[2px] border-black h-10">
                                    <div className="w-1/2 border-r-[2px] border-black p-1.5 flex items-center">
                                        <span className="font-semibold">Cash:</span>
                                    </div>
                                    <div className="w-1/2 p-1.5 flex items-center justify-center font-bold text-lg">
                                        ✓
                                    </div>
                                </div>
                                <div className="flex border-b-[2px] border-black h-10">
                                    <div className="w-1/2 border-r-[2px] border-black p-1.5 flex items-center">
                                        <span className="font-semibold">Check No :</span>
                                    </div>
                                    <div className="w-1/2 p-1.5 flex items-center justify-center font-bold">
                                        {invoiceId}
                                    </div>
                                </div>
                                {/* Money Order removed per request */}

                                {/* Signature Block exactly matching the lines */}
                                <div className="border-b-[2px] border-black h-8"></div>
                                
                                <div className="border-b-[2px] border-black h-10 flex items-center justify-center">
                                    <span className="font-semibold underline">Received By:</span>
                                </div>
                                
                                <div className="border-b-[2px] border-black h-12"></div>
                                
                                <div className="p-1.5 h-10 flex items-end">
                                    <span className="font-semibold text-sm">Name and Signature:</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddOrder;