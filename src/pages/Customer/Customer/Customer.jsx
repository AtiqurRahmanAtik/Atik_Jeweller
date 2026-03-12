import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  X,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useCustomers } from "../../../Hook/useCustomers";
import useAuth from "../../../Hook/useAuth";

const Customer = () => {
  const { branch } = useAuth();

  const {
    customers,
    loading,
    pagination,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  } = useCustomers();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    customerName: "",
  });

  // Fetch customers
  useEffect(() => {
    if (branch) {
      fetchCustomers(1, 10);
    }
  }, [branch, fetchCustomers]);

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    let success;

    if (editingId) {
      success = await updateCustomer(editingId, formData);
    } else {
      success = await createCustomer(formData);
    }

    if (success) {
      closeModal();
      fetchCustomers(pagination.currentPage || 1, 10);
    }
  };

  // Edit
  const handleEdit = (cust) => {
    setEditingId(cust._id);

    setFormData({
      customerName: cust.customerName,
    });

    setIsModalOpen(true);
  };

  // Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      const success = await deleteCustomer(id);

      if (success) {
        fetchCustomers(pagination.currentPage || 1, 10);
      }
    }
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);

    setFormData({
      customerName: "",
    });
  };

  // Search filter
  const filteredData = customers?.filter((c) =>
    c.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Customer Management</h2>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg"
        >
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-xl mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />

          <input
            type="text"
            placeholder="Search customer..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        )}

        <table className="w-full text-sm text-center">

          <thead className="bg-primary text-white">
            <tr>
              <th className="py-3">SL</th>
              <th className="py-3 text-left">Customer Name</th>
              <th className="py-3">Action</th>
            </tr>
          </thead>

          <tbody>

            {filteredData?.length > 0 ? (
              filteredData.map((cust, index) => (
                <tr key={cust._id} className="border-b">

                  <td className="py-3">
                    {(pagination.currentPage - 1) * 10 + index + 1}
                  </td>

                  <td className="text-left py-3 px-4">
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      {cust.customerName}
                    </div>
                  </td>

                  <td>
                    <div className="flex justify-center gap-2">

                      <button
                        onClick={() => handleEdit(cust)}
                        className="text-blue-500"
                      >
                        <Edit size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(cust._id)}
                        className="text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>
                  </td>

                </tr>
              ))
            ) : (
              !loading && (
                <tr>
                  <td colSpan="3" className="py-10 text-gray-400">
                    No Customers Found
                  </td>
                </tr>
              )
            )}

          </tbody>

        </table>

        {/* PAGINATION */}
        <div className="flex justify-between items-center p-4 bg-gray-50">

          <p className="text-sm">
            Page {pagination.currentPage} of {pagination.totalPages}
          </p>

          <div className="flex gap-2">

            <button
              disabled={pagination.currentPage === 1}
              onClick={() =>
                fetchCustomers(pagination.currentPage - 1, 10)
              }
              className="border p-2 rounded"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() =>
                fetchCustomers(pagination.currentPage + 1, 10)
              }
              className="border p-2 rounded"
            >
              <ChevronRight size={16} />
            </button>

          </div>

        </div>

      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">

          <div className="bg-white p-6 rounded-xl w-96">

            <div className="flex justify-between mb-4">
              <h3 className="font-bold">
                {editingId ? "Edit Customer" : "Add Customer"}
              </h3>

              <button onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>

              <input
                type="text"
                required
                placeholder="Customer Name"
                className="w-full border p-3 rounded mb-4"
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({ customerName: e.target.value })
                }
              />

              <button className="w-full bg-primary text-white py-3 rounded">

                {loading ? (
                  <Loader2 className="animate-spin mx-auto" />
                ) : editingId ? (
                  "Update"
                ) : (
                  "Create"
                )}

              </button>

            </form>

          </div>

        </div>
      )}
    </div>
  );
};

export default Customer;