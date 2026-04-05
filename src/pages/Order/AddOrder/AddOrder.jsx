import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    Calendar, ShoppingCart, Plus, PackageOpen, Loader2,
    Trash2, X, Scale, Coins, Receipt, Tag
} from 'lucide-react';
import { useGoldProducts } from '../../../Hook/useGoldProducts';

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

    const [selectedCategory, setSelectedCategory] = useState('All');
    const [cartItems,        setCartItems]         = useState([]);
    const [discountPct,      setDiscountPct]       = useState('');
    const [discountAmt,      setDiscountAmt]       = useState('');
    const [paidAmt,          setPaidAmt]           = useState('');
    const [deliveryDate,     setDeliveryDate]      = useState('');
    const [note,             setNote]              = useState('');

    /* ── fetch once per branch ─────────────────────────────────── */
    const fetchedBranch = useRef(null);
    useEffect(() => {
        if (branch && fetchedBranch.current !== branch) {
            fetchedBranch.current = branch;
            fetchFilters();
            fetchGoldProducts(1, 100);
        }
    }, [branch]); // eslint-disable-line

    /* ── field helpers ─────────────────────────────────────────── */
    const getImage     = (p) => p.productImage || p.imageUrl || p.image || null;
    const getName      = (p) => p.productName  || p.name     || 'Unnamed';
    const getSalePrice = (p) => parseFloat(p.salesPrice || p.salePrice || p.price || 0);
    const getVat       = (p) => parseFloat(p.vatPercentage || p.vat || 0);

    const getProductCategoryName = (p) => {
        if (!p.category) return '';
        if (typeof p.category === 'string') return p.category;
        return p.category.name || p.category.categoryName || '';
    };
    const getCatName = (cat) => {
        if (typeof cat === 'string') return cat;
        return cat.name || cat.categoryName || cat.title || String(cat);
    };

    const fmt = (n) => Number(n || 0).toLocaleString('en-BD');

    /* ── category list (merged from hook + products) ───────────── */
    const categoryNames = useMemo(() => {
        const fromHook     = categories.map(getCatName).filter(Boolean);
        const fromProducts = goldProducts.map(getProductCategoryName).filter(Boolean);
        return [...new Set([...fromHook, ...fromProducts])].sort();
    }, [categories, goldProducts]);

    /* ── filtered products ─────────────────────────────────────── */
    const filteredProducts = useMemo(() => {
        if (!goldProducts?.length) return [];
        if (selectedCategory === 'All') return goldProducts;
        return goldProducts.filter(p => getProductCategoryName(p) === selectedCategory);
    }, [goldProducts, selectedCategory]);

    /* ── cart helpers ──────────────────────────────────────────── */
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

    /* ── totals ────────────────────────────────────────────────── */
    const subtotal = cartItems.reduce((s, i) => s + getSalePrice(i) * i.qty, 0);

    const discountValue = discountPct
        ? (subtotal * parseFloat(discountPct)) / 100
        : parseFloat(discountAmt || 0);

    const afterDiscount = Math.max(0, subtotal - discountValue);

    // VAT: calculated per item (item's own vatPercentage × its line total), then summed
    const vatTotal = cartItems.reduce((s, i) => {
        const lineTotal  = getSalePrice(i) * i.qty;
        const vatAmt     = (lineTotal * getVat(i)) / 100;
        return s + vatAmt;
    }, 0);

    const total = afterDiscount + vatTotal;
    const paid  = parseFloat(paidAmt || 0);
    const due   = Math.max(0, total - paid);

    return (
        <div className="min-h-screen bg-[#fdf8ed] p-4 md:p-6 font-sans text-slate-800">
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ══ LEFT ══════════════════════════════════════════════ */}
                <div className="lg:col-span-2 flex flex-col h-[calc(100vh-48px)]">

                    {/* Category bar */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-orange-100 mb-4 flex-shrink-0">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                                Filter by Category
                            </h2>
                            <span className="text-xs text-gray-400">
                                {filteredProducts.length} / {goldProducts.length} products
                            </span>
                        </div>

                        {loading && categoryNames.length === 0 ? (
                            <div className="flex items-center gap-2 text-orange-400 text-sm">
                                <Loader2 size={14} className="animate-spin" /> Loading…
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSelectedCategory('All')}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                        selectedCategory === 'All'
                                            ? 'bg-[#c27803] text-white shadow-md'
                                            : 'bg-orange-50 text-orange-800 border border-orange-200 hover:bg-orange-100'
                                    }`}
                                >
                                    All Products
                                </button>
                                {categoryNames.map((name) => (
                                    <button
                                        key={name}
                                        onClick={() => setSelectedCategory(name)}
                                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                            selectedCategory === name
                                                ? 'bg-[#c27803] text-white shadow-md'
                                                : 'bg-orange-50 text-orange-800 border border-orange-200 hover:bg-orange-100'
                                        }`}
                                    >
                                        {name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Grid */}
                    <div className="flex-1 overflow-y-auto pr-1 pb-2">
                        {loading ? (
                            <div className="h-full flex flex-col items-center justify-center text-[#c27803]">
                                <Loader2 size={40} className="animate-spin mb-4" />
                                <p className="font-semibold">Loading Products…</p>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400
                                            bg-white rounded-xl border border-dashed border-orange-100">
                                <PackageOpen size={48} className="mb-3 opacity-40" />
                                <p className="font-medium text-gray-500">No products found</p>
                                <p className="text-sm mt-1">
                                    {goldProducts.length === 0
                                        ? 'No data from server — check branch / API.'
                                        : 'No products in this category.'}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {filteredProducts.map((product) => {
                                    const imgSrc = getImage(product);
                                    const name   = getName(product);
                                    const inCart = cartItems.find(i => i._id === product._id);

                                    return (
                                        <div
                                            key={product._id}
                                            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden
                                                       hover:shadow-lg transition-shadow duration-300 flex flex-col group"
                                        >
                                            {/* Image */}
                                            <div className="relative aspect-[4/3] bg-gradient-to-br from-orange-50 to-amber-50 overflow-hidden">
                                                {imgSrc ? (
                                                    <img
                                                        src={imgSrc} alt={name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                ) : null}
                                                <div style={{ display: imgSrc ? 'none' : 'flex' }}
                                                     className="absolute inset-0 flex items-center justify-center text-orange-200 text-5xl">💍</div>

                                                <span className="absolute top-3 left-3 bg-slate-800/90 backdrop-blur-sm text-white
                                                                  text-[10px] font-bold uppercase px-2.5 py-1 rounded shadow-sm tracking-wide">
                                                    {product.metalType || 'N/A'}
                                                </span>
                                                <span className="absolute top-3 right-3 bg-[#c27803]/90 backdrop-blur-sm text-white
                                                                  text-[10px] font-bold uppercase px-2.5 py-1 rounded shadow-sm">
                                                    {product.purity || 'N/A'}
                                                </span>
                                                {inCart && (
                                                    <span className="absolute bottom-3 right-3 bg-green-600 text-white text-xs
                                                                     font-bold px-3 py-1.5 rounded-full shadow-md">
                                                        {inCart.qty} in Cart
                                                    </span>
                                                )}
                                            </div>

                                            {/* Body */}
                                            <div className="p-4 flex flex-col flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h2 className="font-bold text-lg text-gray-900 line-clamp-1" title={name}>
                                                        {name}
                                                    </h2>
                                                    <span className="bg-gray-100 text-gray-600 text-[10px] font-semibold
                                                                     px-2 py-1 rounded uppercase tracking-wider whitespace-nowrap ml-2">
                                                        {getProductCategoryName(product) || 'N/A'}
                                                    </span>
                                                </div>

                                                <p className="text-xs text-gray-500 mb-4 line-clamp-2 min-h-[32px]">
                                                    {product.productDescription || product.description || 'No description available.'}
                                                </p>

                                                {/* Weight */}
                                                <div className="bg-orange-50/50 border border-orange-100 rounded-lg p-2.5 mb-4">
                                                    <div className="flex items-center gap-1.5 text-orange-800 mb-1.5">
                                                        <Scale size={14} />
                                                        <span className="text-xs font-bold uppercase tracking-wider">Weight Details</span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-500">Grams:</span>
                                                            <span className="font-semibold text-gray-800">{product.weightInGrams || product.weight || 0}g</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-500">Trad:</span>
                                                            <span className="font-semibold text-gray-800">
                                                                {product.vori || 0}v {product.roti || 0}r {product.point || 0}p
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Purchase / Sales */}
                                                <div className="grid grid-cols-2 gap-3 mb-4">
                                                    <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-2.5">
                                                        <span className="block text-[10px] font-bold text-blue-800 uppercase tracking-wider mb-1.5">
                                                            Purchase
                                                        </span>
                                                        <div className="space-y-1 text-xs">
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-500">Price:</span>
                                                                <span className="font-semibold text-gray-800">৳{fmt(product.purchasePrice)}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-500">Rate/V:</span>
                                                                <span className="font-semibold text-gray-800">৳{product.purchaseRatePerVori || 0}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="bg-green-50/50 border border-green-100 rounded-lg p-2.5">
                                                        <span className="block text-[10px] font-bold text-green-800 uppercase tracking-wider mb-1.5">
                                                            Sales
                                                        </span>
                                                        <div className="space-y-1 text-xs">
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-500">Price:</span>
                                                                <span className="font-semibold text-gray-800">৳{fmt(getSalePrice(product))}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-500">Rate/V:</span>
                                                                <span className="font-semibold text-gray-800">৳{product.salesRatePerVori || 0}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Making & VAT */}
                                                <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between text-xs">
                                                    <div className="flex items-center gap-1.5 text-gray-600">
                                                        <Coins size={14} className="text-gray-400" />
                                                        Making: <span className="font-bold text-gray-800 ml-1">৳{product.makingCharge || 0}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-gray-600">
                                                        <Receipt size={14} className="text-gray-400" />
                                                        VAT: <span className="font-bold text-gray-800 ml-1">{product.vatPercentage || 0}%</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Footer */}
                                            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                                                <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                                                    <Tag size={12} />
                                                    <span className="font-semibold text-gray-700 uppercase tracking-wide truncate max-w-[100px]">
                                                        {product.stockTypes || 'Standard'}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => handleAddToCart(product)}
                                                    className="bg-[#c27803] hover:bg-[#a66502] text-white text-xs font-bold
                                                               px-4 py-2 rounded-md transition-colors shadow-sm flex items-center gap-1.5"
                                                >
                                                    <Plus size={14} strokeWidth={3} />
                                                    {inCart ? 'Add Another' : 'Add to Order'}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {pagination?.totalPages > 1 && (
                        <p className="flex-shrink-0 text-center text-xs text-gray-400 pt-2">
                            Page {pagination.currentPage} of {pagination.totalPages}
                        </p>
                    )}
                </div>

                {/* ══ RIGHT ═════════════════════════════════════════════ */}
                <div className="space-y-4">

                    {/* Payment Summary */}
                    <div className="bg-white rounded-xl shadow-sm border border-orange-100/50 overflow-hidden">
                        <div className="bg-[#dca45b] px-4 py-3 flex justify-between items-center">
                            <h3 className="font-bold text-gray-900">Payment Summary</h3>
                            <span className="flex items-center gap-1 text-sm bg-white/30 px-2 py-0.5 rounded font-semibold text-gray-900">
                                <ShoppingCart size={14} /> {cartItems.reduce((s, i) => s + i.qty, 0)} items
                            </span>
                        </div>

                        {/* Cart list */}
                        {cartItems.length > 0 && (
                            <div className="px-4 pt-3 space-y-2 max-h-52 overflow-y-auto">
                                {cartItems.map((item) => {
                                    const linePrice = getSalePrice(item) * item.qty;
                                    const lineVat   = (linePrice * getVat(item)) / 100;
                                    return (
                                        <div key={item._id}
                                             className="flex items-center gap-2 pb-2 border-b border-gray-50 last:border-0">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold text-gray-800 truncate">{getName(item)}</p>
                                                <p className="text-[11px] text-gray-400">
                                                    ৳{fmt(getSalePrice(item))} × {item.qty}
                                                    {getVat(item) > 0 && (
                                                        <span className="ml-1 text-amber-500">+{getVat(item)}% VAT</span>
                                                    )}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1 flex-shrink-0">
                                                <button onClick={() => handleQty(item._id, -1)}
                                                    className="w-5 h-5 rounded bg-orange-100 text-orange-700 text-xs font-bold flex items-center justify-center hover:bg-orange-200">−</button>
                                                <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                                                <button onClick={() => handleQty(item._id, 1)}
                                                    className="w-5 h-5 rounded bg-orange-100 text-orange-700 text-xs font-bold flex items-center justify-center hover:bg-orange-200">+</button>
                                            </div>
                                            <span className="text-xs font-bold text-[#c27803] w-16 text-right flex-shrink-0">
                                                ৳{fmt(linePrice + lineVat)}
                                            </span>
                                            <button onClick={() => handleRemove(item._id)}
                                                className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Totals */}
                        <div className="p-5 space-y-3 text-sm font-medium text-gray-600">

                            {/* Subtotal */}
                            <div className="flex justify-between border-b border-gray-100 pb-3">
                                <span>Subtotal</span>
                                <span className="font-bold text-gray-800">৳ {fmt(subtotal)}</span>
                            </div>

                            {/* Discount */}
                            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                <div>
                                    <span>Discount</span>
                                    {discountValue > 0 && (
                                        <span className="ml-1 text-xs text-red-400 font-semibold">
                                            − ৳{fmt(discountValue)}
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="%"
                                        value={discountPct}
                                        onChange={e => { setDiscountPct(e.target.value); setDiscountAmt(''); }}
                                        className="w-14 border border-gray-300 rounded p-1.5 text-right text-xs outline-none focus:border-[#c27803]"
                                    />
                                   
                                </div>
                            </div>

                            {/* After Discount */}
                            {discountValue > 0 && (
                                <div className="flex justify-between text-sm text-gray-600 border-b border-gray-100 pb-3">
                                    <span>After Discount</span>
                                    <span className="font-semibold text-gray-800">৳ {fmt(afterDiscount)}</span>
                                </div>
                            )}

                            {/* VAT breakdown per item */}
                            {vatTotal > 0 && (
                                <div className="border border-amber-100 bg-amber-50/50 rounded-lg p-3 space-y-1.5 border-b border-gray-100 pb-3">
                                    <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1">
                                        <Receipt size={12} /> VAT Breakdown
                                    </p>
                                    {cartItems.map((item) => {
                                        const linePrice = getSalePrice(item) * item.qty;
                                        const lineVat   = (linePrice * getVat(item)) / 100;
                                        if (lineVat === 0) return null;
                                        return (
                                            <div key={item._id} className="flex justify-between text-[11px] text-amber-800">
                                                <span className="truncate flex-1 mr-2">{getName(item)} ({getVat(item)}%)</span>
                                                <span className="font-semibold whitespace-nowrap">+ ৳{fmt(lineVat)}</span>
                                            </div>
                                        );
                                    })}
                                    <div className="flex justify-between text-xs font-bold text-amber-900 border-t border-amber-200 pt-1.5 mt-1">
                                        <span>Total VAT</span>
                                        <span>+ ৳{fmt(vatTotal)}</span>
                                    </div>
                                </div>
                            )}

                            {/* Grand Total */}
                            <div className="flex justify-between text-base text-gray-900 font-bold bg-orange-50 rounded-lg px-3 py-2.5">
                                <span>Total</span>
                                <span className="text-[#c27803]">৳ {fmt(total)}</span>
                            </div>

                            {/* Paid */}
                            <div className="flex justify-between items-center text-green-600">
                                <span>Paid</span>
                                <input
                                    type="number"
                                    placeholder="Enter amount"
                                    value={paidAmt}
                                    onChange={e => setPaidAmt(e.target.value)}
                                    className="w-28 border border-green-200 rounded p-1.5 text-right text-sm font-semibold text-green-700 outline-none focus:border-green-500"
                                />
                            </div>

                            {/* Due */}
                            <div className="flex justify-between text-red-500 font-semibold border-t border-gray-100 pt-2">
                                <span>Due Amount</span>
                                <span>৳ {fmt(due)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Delivery */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-orange-100/50">
                        <div className="border border-gray-200 rounded-lg p-2.5 relative flex items-center bg-gray-50">
                            <span className="absolute -top-2.5 left-2 bg-white px-1.5 text-xs font-semibold text-gray-500 rounded">
                                Expected Delivery
                            </span>
                            <input
                                type="date"
                                value={deliveryDate}
                                onChange={e => setDeliveryDate(e.target.value)}
                                className="w-full text-sm outline-none bg-transparent text-gray-700 font-medium"
                            />
                            <Calendar size={18} className="text-gray-400 flex-shrink-0" />
                        </div>
                    </div>

                    {/* Note */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-orange-100/50">
                        <div className="border border-gray-200 rounded-lg p-2.5 relative h-24 bg-gray-50">
                            <span className="absolute -top-2.5 left-2 bg-white px-1.5 text-xs font-semibold text-gray-500 rounded">
                                Order Note
                            </span>
                            <textarea
                                placeholder="Special instructions…"
                                value={note}
                                onChange={e => setNote(e.target.value)}
                                className="w-full h-full text-sm outline-none bg-transparent resize-none pt-1"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={clearOrder}
                            className="flex-1 bg-[#fdf8ed] border-2 border-[#dca45b] text-gray-700 py-3 rounded-lg
                                       font-bold hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <Trash2 size={15} /> Clear
                        </button>
                        <button
                            disabled={cartItems.length === 0}
                            className="flex-1 bg-[#c27803] hover:bg-[#a66502] disabled:opacity-40
                                       disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold shadow-md transition-colors"
                        >
                            Confirm Order
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AddOrder;