import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    Calendar, ShoppingCart, Plus, PackageOpen, Loader2,
    Trash2, X, Scale, Coins, Receipt, Tag, CheckCircle, AlertCircle, Printer
} from 'lucide-react';
import { useGoldProducts } from '../../../Hook/useGoldProducts';
import { useOrders } from '../../../Hook/useOrders';

const AddOrder = () => {
    const {
        branch,
        fetchFilters,
        fetchGoldProducts,
        categories,
        goldProducts,
        loading,
        pagination,
    } = useGoldProducts();

    const { createOrder, loading: orderLoading } = useOrders();

    const [selectedCategory, setSelectedCategory] = useState('All');
    const [cartItems, setCartItems] = useState([]);
    const [discountPct, setDiscountPct] = useState('');
    const [discountAmt, setDiscountAmt] = useState('');
    const [paidAmt, setPaidAmt] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [note, setNote] = useState('');

    const [toast, setToast] = useState(null);
    const [successModal, setSuccessModal] = useState(null);

    const fetchedBranch = useRef(null);
    useEffect(() => {
        if (branch && fetchedBranch.current !== branch) {
            fetchedBranch.current = branch;
            fetchFilters();
            fetchGoldProducts(1, 100);
        }
    }, [branch]);

    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 3500);
        return () => clearTimeout(t);
    }, [toast]);

    const getImage = (p) => p.productImage || p.imageUrl || p.image || null;
    const getName = (p) => p.productName || p.name || 'Unnamed';
    const getSalePrice = (p) => parseFloat(p.salesPrice || p.salePrice || p.price || 0);
    const getVat = (p) => parseFloat(p.vatPercentage || p.vat || 0);

    const getProductCategoryName = (p) => {
        if (!p.category) return '';
        if (typeof p.category === 'string') return p.category;
        return p.category.name || p.category.categoryName || '';
    };
    const getCatName = (cat) => {
        if (typeof cat === 'string') return cat;
        return cat.name || cat.categoryName || cat.title || String(cat);
    };

    const fmt = (n) => Number(n || 0).toLocaleString('en-BD', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    const categoryNames = useMemo(() => {
        const fromHook = categories.map(getCatName).filter(Boolean);
        const fromProducts = goldProducts.map(getProductCategoryName).filter(Boolean);
        return [...new Set([...fromHook, ...fromProducts])].sort();
    }, [categories, goldProducts]);

    const filteredProducts = useMemo(() => {
        if (!goldProducts?.length) return [];
        if (selectedCategory === 'All') return goldProducts;
        return goldProducts.filter(p => getProductCategoryName(p) === selectedCategory);
    }, [goldProducts, selectedCategory]);

    const subtotal = cartItems.reduce((s, i) => s + getSalePrice(i) * i.qty, 0);

    const discountValue = discountPct
        ? (subtotal * parseFloat(discountPct)) / 100
        : parseFloat(discountAmt || 0);

    const afterDiscount = Math.max(0, subtotal - discountValue);

    const vatTotal = cartItems.reduce((s, i) => {
        const lineTotal = getSalePrice(i) * i.qty;
        const vatAmt = (lineTotal * getVat(i)) / 100;
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
        setCartItems([]); setDiscountPct(''); setDiscountAmt('');
        setPaidAmt(''); setDeliveryDate(''); setNote('');
    };

    const handleConfirmOrder = async () => {
        if (cartItems.length === 0) return;

        const payload = {
            orderId: Date.now(),
            Products: cartItems.map(item => ({
                product: item._id,
                productName: getName(item),
                category: getProductCategoryName(item),
                salesPrice: getSalePrice(item),
                vatPercentage: getVat(item),
                quantity: item.qty,
                Total: getSalePrice(item) * item.qty,
                VAT: (getSalePrice(item) * item.qty * getVat(item)) / 100,
                TotalWithVat: getSalePrice(item) * item.qty + (getSalePrice(item) * item.qty * getVat(item)) / 100,
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

    return (
        <>
            {/* ── MAIN LAYOUT (Hidden entirely during print to prevent overlap) ── */}
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
                        {/* Category bar */}
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-orange-100 mb-4">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Filter by Category</h2>
                                <span className="text-xs text-gray-400">{filteredProducts.length} / {goldProducts.length} products</span>
                            </div>

                            {loading && categoryNames.length === 0 ? (
                                <div className="flex items-center gap-2 text-orange-400 text-sm">
                                    <Loader2 size={14} className="animate-spin" /> Loading…
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setSelectedCategory('All')}
                                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${selectedCategory === 'All' ? 'bg-[#c27803] text-white shadow-md' : 'bg-orange-50 text-orange-800 border border-orange-200 hover:bg-orange-100'
                                            }`}
                                    >
                                        All Products
                                    </button>
                                    {categoryNames.map((name) => (
                                        <button
                                            key={name}
                                            onClick={() => setSelectedCategory(name)}
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {filteredProducts.map((product) => {
                                        const imgSrc = getImage(product);
                                        const name = getName(product);
                                        const inCart = cartItems.find(i => i._id === product._id);

                                        return (
                                            <div key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col group">
                                                <div className="relative aspect-[4/3] bg-gradient-to-br from-orange-50 to-amber-50 overflow-hidden">
                                                    {imgSrc ? (
                                                        <img src={imgSrc} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                                                    ) : null}
                                                    <div style={{ display: imgSrc ? 'none' : 'flex' }} className="absolute inset-0 flex items-center justify-center text-orange-200 text-5xl">💍</div>
                                                    {inCart && (
                                                        <span className="absolute bottom-3 right-3 bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                                                            {inCart.qty} in Cart
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="p-4 flex flex-col flex-1">
                                                    <h2 className="font-bold text-lg text-gray-900 line-clamp-1 mb-2" title={name}>{name}</h2>
                                                    <p className="text-xs text-gray-500 mb-4 line-clamp-2 min-h-[32px]">{product.productDescription || product.description || 'No description available.'}</p>
                                                </div>

                                                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                                                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500"><Tag size={12} /><span className="font-semibold text-gray-700 uppercase tracking-wide truncate max-w-[100px]">{product.stockTypes || 'Standard'}</span></div>
                                                    <button onClick={() => handleAddToCart(product)} className="bg-[#c27803] hover:bg-[#a66502] text-white text-xs font-bold px-4 py-2 rounded-md transition-colors shadow-sm flex items-center gap-1.5">
                                                        <Plus size={14} strokeWidth={3} /> {inCart ? 'Add Another' : 'Add to Order'}
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
                                <h3 className="font-bold text-gray-900">Payment Summary</h3>
                                <span className="flex items-center gap-1 text-sm bg-white/30 px-2 py-0.5 rounded font-semibold text-gray-900">
                                    <ShoppingCart size={14} /> {cartItems.reduce((s, i) => s + i.qty, 0)} items
                                </span>
                            </div>

                            {cartItems.length > 0 && (
                                <div className="px-4 pt-3 space-y-2 max-h-52 overflow-y-auto">
                                    {cartItems.map((item) => {
                                        const linePrice = getSalePrice(item) * item.qty;
                                        const lineVat = (linePrice * getVat(item)) / 100;
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
                                <div className="flex justify-between text-base text-gray-900 font-bold bg-orange-50 rounded-lg px-3 py-2.5"><span>Total</span><span className="text-[#c27803]">৳ {fmt(total)}</span></div>
                                <div className="flex justify-between items-center text-green-600">
                                    <span>Paid</span>
                                    <input type="number" placeholder="Enter amount" value={paidAmt} onChange={e => setPaidAmt(e.target.value)} className="w-28 border border-green-200 rounded p-1.5 text-right text-sm font-semibold text-green-700 outline-none focus:border-green-500" />
                                </div>
                                <div className="flex justify-between text-red-500 font-semibold border-t border-gray-100 pt-2"><span>Due Amount</span><span>৳ {fmt(due)}</span></div>
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
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 p-4 print:block overflow-y-auto backdrop-blur-sm">
                    <div className="bg-[#fffdfa] rounded-[2rem] max-w-[1000px] w-full flex flex-col md:flex-row shadow-2xl overflow-hidden">
                        
                        {/* LEFT SIDE MODAL */}
                        <div className="print:hidden md:w-1/2 p-10 md:p-14 flex flex-col justify-center bg-white">
                            <h1 className="text-[2.75rem] font-black text-[#1a1a1a] leading-tight mb-4 tracking-tight">
                                Thank you for your purchase!
                            </h1>
                            <p className="text-gray-600 mb-10 text-[15px] leading-relaxed pr-4">
                                Your order will be processed within 24 hours during working days. We will notify you by email once your order has been shipped.
                            </p>

                            <h3 className="font-bold text-[#1a1a1a] text-lg mb-4">Billing address</h3>
                            <div className="grid grid-cols-[100px_1fr] gap-y-3 text-[14px] text-gray-800 font-medium mb-10">
                                <span className="text-gray-900 font-bold">Branch</span>
                                <span>{successModal.branch.charAt(0).toUpperCase() + successModal.branch.slice(1)}</span>
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

                                    {/* Top Grid */}
                                    <div className="grid grid-cols-3 gap-4 pb-6 border-b border-dashed border-gray-200">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Date</p>
                                            <p className="text-[13px] font-bold text-[#1a1a1a]">{successModal.date}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Order Number</p>
                                            <p className="text-[13px] font-bold text-[#1a1a1a]">#{successModal.orderId.toString().slice(-8)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Status</p>
                                            <p className="text-[13px] font-bold text-[#1a1a1a]">Confirmed</p>
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

            {/* ── PRINT ONLY VIEW (Hidden on screen, pure receipt for PDF generation) ── */}
            {successModal && (
                <div className="hidden print:block w-full text-black bg-white">
                    <div className="max-w-[500px] mx-auto py-10 px-6">
                        <h2 className="text-3xl font-black text-black mb-8 text-center border-b pb-4">Order Summary</h2>

                        {/* Top Grid */}
                        <div className="flex justify-between pb-6 border-b border-dashed border-gray-300">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Date</p>
                                <p className="text-[14px] font-bold text-black">{successModal.date}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-500 mb-1">Order Number</p>
                                <p className="text-[14px] font-bold text-black">#{successModal.orderId.toString().slice(-8)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500 mb-1">Status</p>
                                <p className="text-[14px] font-bold text-black">Confirmed</p>
                            </div>
                        </div>

                        {/* Product List */}
                        <div className="py-6 border-b border-dashed border-gray-300 space-y-6">
                            {successModal.Products.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-xl font-bold text-gray-600 border border-gray-300">
                                        {item.productName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-black text-sm mb-1 line-clamp-1">{item.productName}</h4>
                                        <p className="text-xs text-gray-600 mb-0.5">Category: {item.category || 'Standard'}</p>
                                        <p className="text-xs text-gray-600">Qty: {item.quantity} (VAT {item.vatPercentage}%)</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-black text-sm">৳{fmt(item.TotalWithVat)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Totals List */}
                        <div className="py-6 border-b border-dashed border-gray-300 space-y-3 text-sm">
                            <div className="flex justify-between text-gray-700">
                                <span>Sub Total</span>
                                <span className="font-bold text-black">৳{fmt(successModal.price)}</span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>Discount</span>
                                <span className="font-bold text-black">- ৳{fmt(successModal.discount)}</span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>Tax (VAT)</span>
                                <span className="font-bold text-black">+ ৳{fmt(successModal.totalVat)}</span>
                            </div>
                        </div>

                        {/* Grand Total */}
                        <div className="pt-6 pb-4 border-b-2 border-black">
                            <div className="flex justify-between items-center mb-6">
                                <span className="font-black text-black text-xl">Order Total</span>
                                <span className="font-black text-black text-xl">৳{fmt(successModal.total)}</span>
                            </div>
                            
                            <div className="flex justify-between text-gray-800 mb-2">
                                <span className="font-medium">Amount Paid</span>
                                <span className="font-bold">৳{fmt(successModal.paid)}</span>
                            </div>
                            <div className="flex justify-between text-black font-bold">
                                <span>Balance Due</span>
                                <span>৳{fmt(successModal.dueAmount)}</span>
                            </div>
                        </div>
                        
                        <div className="mt-8 text-center text-xs text-gray-500">
                            <p className="font-semibold mb-1">Thank you for your purchase!</p>
                            <p>Branch: {successModal.branch.toUpperCase()}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddOrder;