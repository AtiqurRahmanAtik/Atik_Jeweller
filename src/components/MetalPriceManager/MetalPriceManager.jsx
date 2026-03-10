import React, { useState, useEffect } from "react";
import { RotateCcw, Plus, Pencil, Trash2, Save, Filter, Search } from "lucide-react";
import { useDailyPrice } from "../../Hook/useDailyPrice";
import { useMetalTypes } from "../../Hook/useMetalTypes";
import { usePurities } from "../../Hook/usePurities";

const MetalPriceManager = () => {
  // 1. Grab everything directly from the refactored hook
  const {
    dailyPrices,
    pagination,
    loading,
    fetchDailyPrices,
    createDailyPrice,
    updateDailyPrice,
    removeDailyPrice
  } = useDailyPrice();

  const { purities, fetchPurities } = usePurities();
  const { metalTypes, fetchMetalTypes } = useMetalTypes();

  // 2. Component UI States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    type: "",
    purity: "",
    rate: "",
    makingCharge: ""
  });

  // 3. Pagination & Filter States
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [filterPurity, setFilterPurity] = useState("");
  const [filterMetal, setFilterMetal] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Load dropdowns on mount
  useEffect(() => {
    fetchPurities();
    fetchMetalTypes();
  }, [fetchPurities, fetchMetalTypes]);

  // Fetch table data wrapper
  const fetchData = async (page = currentPage) => {
    await fetchDailyPrices(page, limit);
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchData(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Modal controls
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setFormData({ type: "", purity: "", rate: "", makingCharge: "" });
  };

  // Save (Create/Update)
  const handleSave = async (e) => {
    e.preventDefault();

    const payload = {
      metalType: formData.type.toUpperCase(),
      purity: formData.purity,
      ratePerVori: Number(formData.rate),
      makingChargePerVori: Number(formData.makingCharge),
    };

    try {
      if (editId) {
        await updateDailyPrice(editId, payload);
      } else {
        await createDailyPrice(payload);
      }
      await fetchData(currentPage);
      closeModal();
    } catch (error) {
      console.error("Save failed", error);
    }
  };

  // Edit handler
  const handleEdit = (item) => {
    setEditId(item._id);
    setFormData({
      type: item.metalType,
      purity: item.purity,
      rate: item.ratePerVori,
      makingCharge: item.makingChargePerVori
    });
    openModal();
  };

  // Delete handler
  const handleDelete = async (id) => {
    if (window.confirm("Delete this price?")) {
      await removeDailyPrice(id);
      
      // Edge case: If deleting the last item on a page, go back one page
      const isLastItemOnPage = dailyPrices.length === 1 && currentPage > 1;
      await fetchData(isLastItemOnPage ? currentPage - 1 : currentPage);
    }
  };

  // Filtering Logic
  const safePrices = dailyPrices || [];
  const displayedPrices = safePrices.filter((item) => {
    const mType = item.metalType || "";
    const pType = item.purity || "";

    const matchesPurity = filterPurity ? pType === filterPurity : true;
    const matchesMetal = filterMetal ? mType === filterMetal : true;
    const matchesSearch =
      mType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pType.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesPurity && matchesMetal && matchesSearch;
  });

  // --- Pagination Logic Helper ---
  const generatePageNumbers = (current, total) => {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 3) return [1, 2, 3, 4, '...', total];
    if (current >= total - 2) return [1, '...', total - 3, total - 2, total - 1, total];
    return [1, '...', current - 1, current, current + 1, '...', total];
  };

  const totalPages = pagination?.totalPages || 1;
  const pageNumbers = generatePageNumbers(currentPage, totalPages);

  return (
    <div className="min-h-screen bg-secondary p-4 md:p-6 lg:p-8">

      {/* --- Top Controls --- */}
      <div className="bg-base-100 p-4 rounded-t-box shadow-sm flex flex-col lg:flex-row justify-between gap-4 mb-2">
        <div className="flex gap-3 flex-wrap lg:flex-nowrap w-full lg:w-auto">
          
          <label className="input input-bordered flex items-center gap-2 w-full lg:w-64 focus-within:outline-primary focus-within:outline-2 focus-within:outline">
             <Search className="h-4 w-4 text-base-content/50" />
            <input
              type="text"
              placeholder="Search by metal type or purity..."
              className="grow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </label>

          <div className="relative w-full lg:w-48">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-base-content/50" />
            </div>
            <select
              className="select select-bordered w-full pl-10 focus:outline-primary"
              value={filterMetal}
              onChange={(e) => setFilterMetal(e.target.value)}
            >
              <option value="">All Metals</option>
              {metalTypes?.map((m) => (
                <option key={m._id} value={m.metalName}>
                  {m.metalName}
                </option>
              ))}
            </select>
          </div>

          <div className="relative w-full lg:w-48">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-base-content/50" />
            </div>
            <select
              className="select select-bordered w-full pl-10 focus:outline-primary"
              value={filterPurity}
              onChange={(e) => setFilterPurity(e.target.value)}
            >
              <option value="">All Purity</option>
              {purities?.map((p) => (
                <option key={p._id} value={p.purityName}>
                  {p.purityName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={() => fetchData(currentPage)}
            disabled={loading}
            className="btn btn-outline hover:bg-base-200 hover:text-base-content"
          >
            <RotateCcw size={16} className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Reload</span>
          </button>

          <button
            onClick={openModal}
            className="btn bg-primary hover:brightness-110 text-white border-none"
          >
            <Plus size={16} /> Add Metal Price
          </button>
        </div>
      </div>

      {/* --- Table --- */}
      <div className="overflow-x-auto rounded-b-box shadow-sm relative bg-white">
        {loading && (
          <div className="absolute inset-0 bg-base-100/50 flex justify-center items-center z-10 backdrop-blur-[1px]">
             <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        )}
        <table className="table text-center w-full">
          <thead className="text-white bg-primary">
            <tr>
              <th className="py-4 font-bold border-r border-primary/20">#</th>
              <th className="py-4 font-bold border-r border-primary/20">Metal Type</th>
              <th className="py-4 font-bold border-r border-primary/20">Purity</th>
              <th className="py-4 font-bold border-r border-primary/20">Rate/Vori</th>
              <th className="py-4 font-bold border-r border-primary/20">Making Charge/Vori</th>
              <th className="py-4 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedPrices.length === 0 && !loading ? (
              <tr>
                <td colSpan="6" className="py-8 text-base-content/50 bg-white">No data found</td>
              </tr>
            ) : (
              displayedPrices.map((item, index) => (
                <tr 
                  key={item._id} 
                  className={`hover ${index % 2 === 0 ? 'bg-white' : 'bg-secondary'}`}
                >
                  <td className="font-medium text-base-content/70 border-r border-base-200">
                    {(currentPage - 1) * limit + index + 1}
                  </td>
                  <td className="font-medium text-base-content/80 uppercase border-r border-base-200">{item.metalType}</td>
                  <td className="text-base-content/80 border-r border-base-200">{item.purity}</td>
                  <td className="font-medium text-base-content/80 tabular-nums border-r border-base-200">৳ {item.ratePerVori}</td>
                  <td className="font-medium text-base-content/80 tabular-nums border-r border-base-200">৳ {item.makingChargePerVori}</td>
                  <td>
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="btn btn-sm btn-ghost btn-square text-info hover:bg-info/10"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="btn btn-sm btn-ghost btn-square text-error hover:bg-error/10"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- Numbered Pagination --- */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="join shadow-sm bg-white rounded-box">
            <button
              disabled={currentPage === 1 || loading}
              onClick={() => fetchData(currentPage - 1)}
              className="join-item btn bg-base-100 border-base-200 hover:bg-base-200 disabled:bg-base-100 disabled:text-base-content/30"
            >
              «
            </button>

            {pageNumbers.map((num, idx) => (
              <button
                key={idx}
                disabled={num === '...' || loading}
                onClick={() => num !== '...' && fetchData(num)}
                className={`join-item btn border-base-200 ${
                  num === '...' ? 'bg-base-100 disabled:bg-base-100 disabled:text-base-content cursor-default' : 
                  num === currentPage ? 'bg-primary text-white border-primary hover:brightness-110' : 'bg-base-100 hover:bg-base-200 text-base-content/70'
                }`}
              >
                {num}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages || loading}
              onClick={() => fetchData(currentPage + 1)}
              className="join-item btn bg-base-100 border-base-200 hover:bg-base-200 disabled:bg-base-100 disabled:text-base-content/30"
            >
              »
            </button>
          </div>
        </div>
      )}

      {/* --- Add/Edit Modal --- */}
      <dialog className={`modal ${isModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box shadow-2xl bg-base-100">
          <h3 className="font-bold text-lg mb-4 text-center text-primary border-b border-base-200 pb-2">
            {editId ? "Edit Metal Price" : "Add Metal Price"}
          </h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Metal Type</span></label>
              <select
                name="type"
                required
                value={formData.type}
                onChange={handleInputChange}
                className="select select-bordered w-full focus:outline-primary"
              >
                <option value="" disabled>Select Metal</option>
                {metalTypes?.map((m) => (
                  <option key={m._id} value={m.metalName}>
                    {m.metalName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Purity Level</span></label>
              <select
                name="purity"
                required
                value={formData.purity}
                onChange={handleInputChange}
                className="select select-bordered w-full focus:outline-primary"
              >
                <option value="" disabled>Select Purity</option>
                {purities?.map((p) => (
                  <option key={p._id} value={p.purityName}>
                    {p.purityName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="form-control w-full">
                <label className="label"><span className="label-text font-semibold">Rate per Vori</span></label>
                <input
                  type="number"
                  name="rate"
                  placeholder="e.g. 180000"
                  required
                  value={formData.rate}
                  onChange={handleInputChange}
                  className="input input-bordered w-full focus:outline-primary tabular-nums"
                />
              </div>
              <div className="form-control w-full">
                <label className="label"><span className="label-text font-semibold">Making Charge</span></label>
                <input
                  type="number"
                  name="makingCharge"
                  placeholder="e.g. 15000"
                  required
                  value={formData.makingCharge}
                  onChange={handleInputChange}
                  className="input input-bordered w-full focus:outline-primary tabular-nums"
                />
              </div>
            </div>

            <div className="modal-action border-t border-base-200 pt-5 mt-6">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn bg-primary hover:brightness-110 text-white border-none shadow-sm"
              >
                {loading ? <span className="loading loading-spinner loading-sm"></span> : <Save size={16} />}
                {editId ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>
        
        {/* Click outside to close */}
        <form method="dialog" className="modal-backdrop bg-black/40 backdrop-blur-sm">
          <button onClick={closeModal}>close</button>
        </form>
      </dialog>

    </div>
  );
};

export default MetalPriceManager;