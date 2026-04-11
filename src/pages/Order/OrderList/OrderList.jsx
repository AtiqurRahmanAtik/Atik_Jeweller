import React, { useState, useEffect, useRef } from 'react';
import { 
    Eye, Edit, Trash2, Search, Loader2, AlertCircle, X, ChevronLeft, ChevronRight, CheckCircle, Printer
} from 'lucide-react';
import { useOrders } from '../../../Hook/useOrders'; // Adjust path as necessary

const OrderList = () => {
    // State for pagination
    const [page, setPage] = useState(1);
    const printRef = useRef();
    
    // Fetch data using the custom hook
    const { 
        orders, 
        pagination, 
        loading, 
        error, 
        updateOrder, 
        deleteOrder 
    } = useOrders(page, 10);

    // Modal states
    const [viewingOrder, setViewingOrder] = useState(null);
    const [editingOrder, setEditingOrder] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    // Form state for editing
    const [editForm, setEditForm] = useState({
        customerName: '', // Added customerName to state
        paid: 0,
        expectedDelivery: '',
        orderNote: '',
        status: 'Confirmed'
    });

    const [actionLoading, setActionLoading] = useState(false);

    // --- Helpers ---
    const fmt = (n) => Number(n || 0).toLocaleString('en-BD', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    // --- Print Handlers ---

    /**
     * 1. Print All Orders (Report List)
     */
    const handlePrintAll = (ordersData) => {
        const printWindow = window.open('', '_blank');
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Order List Report</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #fff; color: #333; padding: 20px; }
                    .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #c27803; padding-bottom: 15px; }
                    .header h1 { font-size: 28px; color: #1a1a1a; margin-bottom: 5px; }
                    .header p { font-size: 12px; color: #666; margin-bottom: 10px; }
                    .print-date { font-size: 11px; color: #999; font-style: italic; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    thead { background-color: #dca45b; color: white; }
                    th { padding: 12px; text-align: left; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid #c27803; }
                    td { padding: 10px 12px; border: 1px solid #ddd; font-size: 11px; }
                    tbody tr:nth-child(even) { background-color: #fdf8ed; }
                    .amount { text-align: right; font-weight: 600; }
                    .paid { color: #10b981; font-weight: 600; }
                    .due { color: #e66c5c; font-weight: 700; }
                    .invoice-id { font-weight: bold; color: #1a1a1a; }
                    .customer-name { font-weight: 600; color: #333; }
                    .footer { margin-top: 30px; text-align: center; font-size: 11px; color: #999; border-top: 2px solid #e5e7eb; padding-top: 15px; }
                    .summary { margin-top: 20px; background-color: #fdf8ed; padding: 15px; border-radius: 5px; border: 1px solid #dca45b; }
                    .summary-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 12px; }
                    .summary-row.total { font-weight: bold; font-size: 13px; color: #c27803; border-top: 1px solid #dca45b; padding-top: 8px; margin-top: 8px; }
                    @media print { body { padding: 0; } table { page-break-inside: avoid; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>📋 Order List Report</h1>
                    <p>Complete Order Management Summary</p>
                    <p class="print-date">Generated on ${new Date().toLocaleString('en-BD', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Order Date</th>
                            <th>Customer Name</th>
                            <th>Delivery Date</th>
                            <th>Invoice ID</th>
                            <th>Total Bill</th>
                            <th>Paid</th>
                            <th>Due</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${ordersData && ordersData.length > 0 ? ordersData.map(order => `
                            <tr>
                                <td>${order.date || (order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A')}</td>
                                <td class="customer-name">${order.customerName || 'Walk-in Customer'}</td>
                                <td>${order.expectedDelivery || 'N/A'}</td>
                                <td class="invoice-id">INV-${order.Invoice || order.orderId?.toString().slice(-6) || 'N/A'}</td>
                                <td class="amount">৳${fmt(order.total)}</td>
                                <td class="amount paid">৳${fmt(order.paid)}</td>
                                <td class="amount due">${order.dueAmount > 0 ? `৳${fmt(order.dueAmount)}` : 'Paid'}</td>
                            </tr>
                        `).join('') : '<tr><td colspan="7" style="text-align: center; color: #999;">No orders found</td></tr>'}
                    </tbody>
                </table>

                <div class="summary">
                    <div class="summary-row">
                        <span>Total Orders:</span>
                        <strong>${ordersData?.length || 0}</strong>
                    </div>
                    <div class="summary-row">
                        <span>Total Bill Amount:</span>
                        <strong>৳${fmt(ordersData?.reduce((sum, o) => sum + (o.total || 0), 0) || 0)}</strong>
                    </div>
                    <div class="summary-row">
                        <span>Total Paid:</span>
                        <strong style="color: #10b981;">৳${fmt(ordersData?.reduce((sum, o) => sum + (o.paid || 0), 0) || 0)}</strong>
                    </div>
                    <div class="summary-row">
                        <span>Total Due:</span>
                        <strong style="color: #e66c5c;">৳${fmt(ordersData?.reduce((sum, o) => sum + (o.dueAmount || 0), 0) || 0)}</strong>
                    </div>
                    <div class="summary-row total">
                        <span>Report Status:</span>
                        <strong style="color: #1a1a1a;">Complete</strong>
                    </div>
                </div>

                <div class="footer">
                    <p>© ${new Date().getFullYear()} Order Management System. All rights reserved.</p>
                    <p>This is a computer-generated report and does not require a signature.</p>
                </div>
                <script>
                    window.onload = function() { window.print(); }
                </script>
            </body>
            </html>
        `;
        printWindow.document.write(html);
        printWindow.document.close();
    };

    /**
     * 2. Print Single Order (Invoice Style)
     */
    const handlePrintSingle = (order) => {
        if (!order) return;
        
        const printWindow = window.open('', '_blank');
        const invoiceId = `INV-${order.Invoice || order.orderId?.toString().slice(-6) || 'N/A'}`;
        
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Invoice ${invoiceId}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #fff; color: #333; padding: 40px; max-width: 800px; margin: auto; }
                    .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #dca45b; }
                    .company-details h1 { font-size: 28px; color: #c27803; margin-bottom: 5px; }
                    .company-details p { font-size: 14px; color: #666; }
                    .invoice-title { text-align: right; }
                    .invoice-title h2 { font-size: 36px; color: #1a1a1a; text-transform: uppercase; letter-spacing: 2px; }
                    .invoice-title p { font-size: 14px; color: #666; font-weight: bold; margin-top: 5px; }
                    .order-info { display: flex; justify-content: space-between; margin-bottom: 40px; }
                    .info-block { background: #fdf8ed; padding: 15px; border-radius: 6px; width: 48%; border: 1px solid #eee; }
                    .info-block h3 { font-size: 14px; color: #999; text-transform: uppercase; margin-bottom: 10px; }
                    .info-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
                    .info-row strong { color: #1a1a1a; }
                    .totals-box { width: 50%; margin-left: auto; border: 1px solid #eee; border-radius: 6px; overflow: hidden; }
                    .total-row { display: flex; justify-content: space-between; padding: 12px 15px; font-size: 15px; border-bottom: 1px solid #eee; }
                    .total-row:last-child { border-bottom: none; }
                    .total-row.grand-total { background-color: #dca45b; color: white; font-weight: bold; font-size: 18px; }
                    .paid-amount { color: #10b981; font-weight: bold; }
                    .due-amount { color: #e66c5c; font-weight: bold; }
                    .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
                    @media print { body { padding: 20px; } }
                </style>
            </head>
            <body>
                <div class="invoice-header">
                    <div class="company-details">
                        <h1>Your Company Name</h1>
                        <p>123 Business Street, Dhaka, BD</p>
                        <p>Phone: +880 1234 567890</p>
                    </div>
                    <div class="invoice-title">
                        <h2>INVOICE</h2>
                        <p># ${invoiceId}</p>
                    </div>
                </div>

                <div class="order-info">
                    <div class="info-block">
                        <h3>Dates & Details</h3>
                        <div class="info-row">
                            <span>Customer:</span>
                            <strong>${order.customerName || 'Walk-in Customer'}</strong>
                        </div>
                        <div class="info-row">
                            <span>Order Date:</span>
                            <strong>${order.date || (order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A')}</strong>
                        </div>
                        <div class="info-row">
                            <span>Expected Delivery:</span>
                            <strong>${order.expectedDelivery || 'N/A'}</strong>
                        </div>
                    </div>
                    <div class="info-block">
                        <h3>Status</h3>
                        <div class="info-row">
                            <span>Payment Status:</span>
                            <strong style="color: ${order.dueAmount > 0 ? '#e66c5c' : '#10b981'}">
                                ${order.dueAmount > 0 ? 'Partial / Unpaid' : 'Fully Paid'}
                            </strong>
                        </div>
                    </div>
                </div>

                <div class="totals-box">
                    <div class="total-row">
                        <span>Subtotal / Total Bill</span>
                        <strong>৳${fmt(order.total)}</strong>
                    </div>
                    <div class="total-row">
                        <span>Amount Paid</span>
                        <span class="paid-amount">৳${fmt(order.paid)}</span>
                    </div>
                    <div class="total-row grand-total">
                        <span>Amount Due</span>
                        <span>৳${fmt(order.dueAmount)}</span>
                    </div>
                </div>

                <div class="footer">
                    <h2>Thank you for your business!</h2>
                    <p style="margin-top: 10px;">If you have any questions about this invoice, please contact support.</p>
                    <p style="margin-top: 5px;">Generated on ${new Date().toLocaleString()}</p>
                </div>

                <script>
                    window.onload = function() { window.print(); }
                </script>
            </body>
            </html>
        `;
        printWindow.document.write(html);
        printWindow.document.close();
    };

    // --- Actions ---
    const handleOpenEdit = (order) => {
        setEditingOrder(order);
        setEditForm({
            customerName: order.customerName || '', // Load existing customer name
            paid: order.paid || 0,
            expectedDelivery: order.expectedDelivery || '',
            orderNote: order.orderNote || '',
            status: order.status || 'Confirmed'
        });
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        if (!editingOrder) return;
        setActionLoading(true);
        try {
            // Recalculate due amount based on new paid amount
            const newPaid = parseFloat(editForm.paid) || 0;
            const newDue = Math.max(0, (editingOrder.total || 0) - newPaid);

            const payload = {
                ...editForm,
                paid: newPaid,
                dueAmount: newDue
            };

            await updateOrder(editingOrder._id, payload);
            setEditingOrder(null);
        } catch (err) {
            console.error("Update failed:", err);
        } finally {
            setActionLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!deletingId) return;
        setActionLoading(true);
        try {
            await deleteOrder(deletingId);
            setDeletingId(null);
        } catch (err) {
            console.error("Delete failed:", err);
        } finally {
            setActionLoading(false);
        }
    };

    // Main code 
    return (
        <div className="min-h-screen bg-[#fdf8ed] p-4 md:p-6 font-sans text-slate-800">
            <div className="max-w-[1400px] mx-auto">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-[#1a1a1a]">Order Management</h1>
                        <p className="text-sm text-gray-500">View, update, and manage your recent orders.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-orange-100 flex items-center gap-2">
                            <Search size={18} className="text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search orders..." 
                                className="bg-transparent border-none outline-none text-sm w-48 focus:ring-0"
                            />
                        </div>
                        <button 
                            onClick={() => handlePrintAll(orders)}
                            className="bg-[#c27803] hover:bg-[#a66502] text-white px-4 py-2 rounded-xl shadow-sm font-bold flex items-center gap-2 transition-colors"
                            title="Print all orders"
                        >
                            <Printer size={18} />
                            <span className="hidden sm:inline">Print All</span>
                        </button>
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-2">
                        <AlertCircle size={20} />
                        <span className="font-semibold">{error}</span>
                    </div>
                )}

                {/* Table Container */}
              <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
    <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
                <tr className="bg-[#dca45b]/10 border-b border-orange-100">
                    <th className="p-4 text-xs font-bold text-[#c27803] uppercase tracking-wider">Order Date</th>
                    <th className="p-4 text-xs font-bold text-[#c27803] uppercase tracking-wider">Customer Name</th>
                    <th className="p-4 text-xs font-bold text-[#c27803] uppercase tracking-wider">Delivery Date</th>
                    <th className="p-4 text-xs font-bold text-[#c27803] uppercase tracking-wider">Invoice ID</th>
                    <th className="p-4 text-xs font-bold text-[#c27803] uppercase tracking-wider">Total Bill</th>
                    <th className="p-4 text-xs font-bold text-[#c27803] uppercase tracking-wider">Paid</th>
                    <th className="p-4 text-xs font-bold text-[#c27803] uppercase tracking-wider">Due</th>
                    <th className="p-4 text-xs font-bold text-[#c27803] uppercase tracking-wider text-center">Actions</th>
                </tr>
            </thead>
            <tbody>
                {loading && orders?.length === 0 ? (
                    <tr>
                        <td colSpan="8" className="p-10 text-center text-[#c27803]">
                            <Loader2 size={32} className="animate-spin mx-auto mb-2" />
                            <p className="font-semibold">Loading orders...</p>
                        </td>
                    </tr>
                ) : orders?.length === 0 ? (
                    <tr>
                        <td colSpan="8" className="p-10 text-center text-gray-400">
                            <p className="font-medium text-gray-500">No orders found.</p>
                        </td>
                    </tr>
                ) : (
                    orders?.map((order) => (
                        <tr key={order._id} className="border-b border-gray-50 hover:bg-orange-50/30 transition-colors">
                            <td className="p-4 text-sm text-gray-600">
                                {order.date || (order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A')}
                            </td>
                            <td className="p-4 text-sm font-semibold text-gray-800">
                                {order.customerName || 'Walk-in Customer'}
                            </td>
                            <td className="p-4 text-sm text-gray-600">
                                {order.expectedDelivery || 'N/A'}
                            </td>
                            <td className="p-4 text-sm font-bold text-gray-800">
                                INV-{order.Invoice || order.orderId?.toString().slice(-6) || 'N/A'}
                            </td>
                            <td className="p-4 text-sm font-bold text-[#1a1a1a]">
                                ৳{fmt(order.total)}
                            </td>
                            <td className="p-4 text-sm font-semibold text-green-600">
                                ৳{fmt(order.paid)}
                            </td>
                            <td className="p-4 text-sm font-bold text-[#e66c5c]">
                                {order.dueAmount > 0 ? `৳${fmt(order.dueAmount)}` : 'Paid'}
                            </td>
                            <td className="p-4 flex justify-center gap-2">
                                {/* Read / View */}
                                <button 
                                    onClick={() => setViewingOrder(order)}
                                    className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"
                                    title="View Details"
                                >
                                    <Eye size={16} />
                                </button>
                                
                                {/* Print */}
                                <button 
                                    onClick={() => handlePrintSingle(order)}
                                    className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors"
                                    title="Print Order"
                                >
                                    <Printer size={16} />
                                </button>

                                {/* Update / Edit */}
                                <button 
                                    onClick={() => handleOpenEdit(order)}
                                    className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center hover:bg-amber-100 transition-colors"
                                    title="Edit Order"
                                >
                                    <Edit size={16} />
                                </button>

                                {/* Delete */}
                                <button 
                                    onClick={() => setDeletingId(order._id)}
                                    className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                                    title="Delete Order"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    </div>

    {/* Pagination */}
    {pagination?.totalPages > 1 && (
        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
            <span className="text-sm text-gray-500">
                Showing Page <span className="font-bold text-gray-800">{page}</span> of {pagination.totalPages}
            </span>
            <div className="flex gap-2">
                <button 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                >
                    <ChevronLeft size={16} />
                </button>
                <button 
                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                    className="p-2 rounded bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    )}
</div>

            </div>

            {/* ── MODALS ── */}

            {/* 1. VIEW MODAL (READ) */}
            {viewingOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-lg text-gray-800">Order Details</h3>
                            <button onClick={() => setViewingOrder(null)} className="text-gray-400 hover:text-red-500"><X size={20}/></button>
                        </div>
                        <div className="p-5 overflow-y-auto space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                <div><span className="text-gray-500 block text-xs">Order ID</span><span className="font-bold">#{viewingOrder.orderId?.toString().slice(-8)}</span></div>
                                <div><span className="text-gray-500 block text-xs">Invoice ID</span><span className="font-bold">INV-{viewingOrder.Invoice}</span></div>
                                <div><span className="text-gray-500 block text-xs">Customer Name</span><span className="font-bold">{viewingOrder.customerName || 'Walk-in Customer'}</span></div>
                                <div><span className="text-gray-500 block text-xs">Branch</span><span className="font-bold uppercase">{viewingOrder.branch}</span></div>
                                {/* Ensured Date format displays robustly */}
                                <div><span className="text-gray-500 block text-xs">Date</span><span className="font-bold">{viewingOrder.date || (viewingOrder.createdAt ? new Date(viewingOrder.createdAt).toLocaleDateString() : 'N/A')}</span></div>
                                <div><span className="text-gray-500 block text-xs">Expected Delivery</span><span className="font-bold">{viewingOrder.expectedDelivery || 'N/A'}</span></div>
                            </div>
                            
                            <div className="bg-[#fdf8ed] border border-[#dca45b]/30 rounded-xl p-4">
                                <h4 className="text-xs font-bold text-[#c27803] uppercase mb-3 border-b border-[#dca45b]/20 pb-2">Products ({viewingOrder.Products?.length || 0})</h4>
                                <div className="space-y-3">
                                    {viewingOrder.Products?.map((item, i) => (
                                        <div key={i} className="flex justify-between text-sm">
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-800">{item.productName}</p>
                                                <p className="text-xs text-gray-500">Qty: {item.quantity} | VAT: {item.vatPercentage}%</p>
                                            </div>
                                            <div className="font-bold text-gray-800 text-right">
                                                ৳{fmt(item.TotalWithVat)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl text-sm space-y-2">
                                <div className="flex justify-between"><span className="text-gray-500">Subtotal:</span><span className="font-bold text-gray-800">৳{fmt(viewingOrder.price)}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">Discount:</span><span className="font-bold text-red-400">- ৳{fmt(viewingOrder.discount)}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">VAT:</span><span className="font-bold text-gray-800">+ ৳{fmt(viewingOrder.totalVat)}</span></div>
                                <div className="border-t border-gray-200 pt-2 flex justify-between font-black text-base">
                                    <span>Total:</span><span className="text-[#c27803]">৳{fmt(viewingOrder.total)}</span>
                                </div>
                                <div className="flex justify-between text-green-600 font-semibold mt-2">
                                    <span>Paid:</span><span>৳{fmt(viewingOrder.paid)}</span>
                                </div>
                                <div className="flex justify-between text-red-500 font-bold">
                                    <span>Due:</span><span>৳{fmt(viewingOrder.dueAmount)}</span>
                                </div>
                            </div>
                            
                            {viewingOrder.orderNote && (
                                <div className="text-sm bg-blue-50 p-3 rounded-lg border border-blue-100 text-blue-800">
                                    <span className="font-bold block text-xs uppercase mb-1">Note:</span>
                                    {viewingOrder.orderNote}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* 2. EDIT MODAL (UPDATE) */}
            {editingOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-[#fdf8ed]">
                            <h3 className="font-bold text-lg text-[#c27803]">Edit Order</h3>
                            <button onClick={() => setEditingOrder(null)} className="text-gray-400 hover:text-red-500"><X size={20}/></button>
                        </div>
                        <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Order Total</label>
                                <p className="text-lg font-black text-gray-800 mb-2 border p-2 bg-gray-50 rounded">৳{fmt(editingOrder.total)}</p>
                            </div>
                            
                            {/* Added Customer Name Input */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Customer Name</label>
                                <input 
                                    type="text" 
                                    value={editForm.customerName}
                                    onChange={(e) => setEditForm({...editForm, customerName: e.target.value})}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-[#c27803] font-semibold"
                                    placeholder="Enter customer name"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Update Paid Amount (৳)</label>
                                <input 
                                    type="number" 
                                    value={editForm.paid}
                                    onChange={(e) => setEditForm({...editForm, paid: e.target.value})}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-[#c27803] font-semibold"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                                <p className="text-xs text-[#dca45b] mt-1 font-semibold">
                                    New Due: ৳{fmt(Math.max(0, (editingOrder.total || 0) - parseFloat(editForm.paid || 0)))}
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expected Delivery</label>
                                <input 
                                    type="date" 
                                    value={editForm.expectedDelivery}
                                    onChange={(e) => setEditForm({...editForm, expectedDelivery: e.target.value})}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-[#c27803]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Order Note</label>
                                <textarea 
                                    value={editForm.orderNote}
                                    onChange={(e) => setEditForm({...editForm, orderNote: e.target.value})}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-[#c27803] resize-none h-20"
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button 
                                    type="button" 
                                    onClick={() => setEditingOrder(null)} 
                                    className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-bold hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={actionLoading}
                                    className="flex-1 bg-[#c27803] text-white py-2.5 rounded-lg font-bold hover:bg-[#a66502] flex justify-center items-center gap-2"
                                >
                                    {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 3. DELETE CONFIRMATION MODAL (DELETE) */}
            {deletingId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center">
                        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={32} />
                        </div>
                        <h3 className="font-black text-xl text-gray-900 mb-2">Delete Order?</h3>
                        <p className="text-sm text-gray-500 mb-6">This action cannot be undone. Are you sure you want to permanently delete this order?</p>
                        
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setDeletingId(null)} 
                                disabled={actionLoading}
                                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmDelete}
                                disabled={actionLoading}
                                className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 flex justify-center items-center gap-2"
                            >
                                {actionLoading ? <Loader2 size={18} className="animate-spin" /> : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderList;