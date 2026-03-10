import React, { useEffect, useState } from "react";
import { useMetalTypes } from "../../../Hook/useMetalTypes";
import useAuth from "../../../Hook/useAuth";

const MetalType = () => {

  const {
    metalTypes,
    pagination,
    loading,
    fetchMetalTypes,
    createMetalType,
    updateMetalType,
    deleteMetalType
  } = useMetalTypes();

  const { branch } = useAuth();

  const [metalName, setMetalName] = useState("");
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchMetalTypes();
  }, [fetchMetalTypes]);

  // OPEN ADD MODAL
  const handleAdd = () => {
    setMetalName("");
    setEditId(null);
    setIsModalOpen(true);
  };

  // OPEN EDIT MODAL
  const handleEdit = (item) => {
    setMetalName(item.metalName);
    setEditId(item._id);
    setIsModalOpen(true);
  };

  // SUBMIT FORM
  const handleSubmit = async (e) => {

    e.preventDefault();

    let success;

    if (editId) {
      success = await updateMetalType(editId, { metalName });
    } else {
      success = await createMetalType({ metalName });
    }

    if (success) {
      setIsModalOpen(false);
      setMetalName("");
      setEditId(null);
      fetchMetalTypes();
    }
  };

  // DELETE
  const handleDelete = async (id) => {

    const confirm = window.confirm("Delete this metal type?");
    if (!confirm) return;

    const success = await deleteMetalType(id);

    if (success) {
      fetchMetalTypes();
    }
  };

  return (

    <div className="p-10 bg-secondary min-h-screen">

      <div className="flex justify-between mb-6">

        <h1 className="text-2xl font-bold">
          Metal Types
        </h1>

        <button
          onClick={handleAdd}
          className="bg-primary text-white px-4 py-2 rounded hover:brightness-110 transition-all"
        >
          Add Metal Type
        </button>

      </div>

      {/* TABLE */}

      {loading ? (
        <p>Loading...</p>
      ) : (

        <table className="w-full border text-center bg-white shadow-sm">

          <thead className="bg-primary text-white">

            <tr>
              <th className="p-2 border border-white/20">#</th>
              <th className="p-2 border border-white/20">Metal Name</th>
              <th className="p-2 border border-white/20">Branch</th>
              <th className="p-2 border border-white/20">Action</th>
            </tr>

          </thead>

          <tbody>

            {metalTypes?.map((item, index) => (

              <tr key={item._id} className={index % 2 === 0 ? "bg-white" : "bg-secondary"}>

                <td className="border p-2">
                  {index + 1}
                </td>

                <td className="border p-2">
                  {item.metalName}
                </td>

                <td className="border p-2">
                  {item.branch}
                </td>

                <td className="border p-2 flex gap-2 justify-center">

                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-white border border-primary text-primary hover:bg-primary hover:text-white px-3 py-1 rounded transition-colors"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

      {/* PAGINATION */}

      <div className="flex justify-center gap-4 mt-6">

        <button
          disabled={pagination.currentPage === 1}
          onClick={() =>
            fetchMetalTypes(pagination.currentPage - 1)
          }
          className="border border-primary text-primary bg-white hover:bg-secondary disabled:border-gray-300 disabled:text-gray-400 px-3 py-1 rounded transition-colors"
        >
          Prev
        </button>

        <span className="font-medium text-primary flex items-center">
          Page {pagination.currentPage} / {pagination.totalPages}
        </span>

        <button
          disabled={pagination.currentPage === pagination.totalPages}
          onClick={() =>
            fetchMetalTypes(pagination.currentPage + 1)
          }
          className="border border-primary text-primary bg-white hover:bg-secondary disabled:border-gray-300 disabled:text-gray-400 px-3 py-1 rounded transition-colors"
        >
          Next
        </button>

      </div>

      {/* MODAL */}

      {isModalOpen && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

          <div className="bg-white p-6 rounded w-96 shadow-lg">

            <h2 className="text-xl font-bold mb-4 text-primary">

              {editId ? "Update Metal Type" : "Add Metal Type"}

            </h2>

            <form onSubmit={handleSubmit}>

              <input
                type="text"
                placeholder="Enter Metal Name"
                value={metalName}
                onChange={(e) => setMetalName(e.target.value)}
                className="w-full border p-2 rounded mb-4 focus:outline-primary focus:border-primary"
                required
              />

              <div className="flex justify-end gap-2">

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded hover:brightness-110 transition-all"
                >
                  {editId ? "Update" : "Save"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default MetalType;