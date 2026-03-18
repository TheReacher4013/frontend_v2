import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const ExpenseCategories = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
  });

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("expenseCategories"));
    if (storedData) {
      setCategories(storedData);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("expenseCategories", JSON.stringify(categories));
  }, [categories]);

  const handleOpen = () => {
    setFormData({ id: null, name: "", description: "" });
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!formData.name) {
      alert("Expense Category Name is required");
      return;
    }

    if (formData.id) {
      const updated = categories.map((item) =>
        item.id === formData.id ? formData : item
      );
      setCategories(updated);
    } else {
      const newCategory = {
        ...formData,
        id: Date.now(),
      };
      setCategories([...categories, newCategory]);
    }

    setShowModal(false);
  };

  const handleEdit = (item) => {
    setFormData(item);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    const filtered = categories.filter((item) => item.id !== id);
    setCategories(filtered);
  };

  return (
    <div className="p-4 sm:p-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold">
          Expense Categories
        </h2>

        <button
          onClick={handleOpen}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto"
        >
          + Add New Expense Category
        </button>
      </div>

      {/* Desktop Table - hidden on mobile */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Category Name</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center p-4 text-gray-500">
                  No Data Found
                </td>
              </tr>
            ) : (
              categories.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{item.name}</td>
                  <td className="p-2 border">{item.description}</td>
                  <td className="p-2 border text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="w-9 h-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm transition"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="w-9 h-9 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm transition"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards - visible only on mobile */}
      <div className="block sm:hidden">
        {categories.length === 0 ? (
          <div className="text-center p-6 text-gray-500 border border-gray-200 rounded-lg bg-white">
            No Data Found
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {categories.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                {/* Card Row: Name */}
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 font-medium uppercase mb-0.5">
                      Category Name
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {item.name}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 ml-3">
                    <button
                      onClick={() => handleEdit(item)}
                      className="w-9 h-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm transition"
                    >
                      <FaEdit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="w-9 h-9 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm transition"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>

                {/* Card Row: Description */}
                {item.description && (
                  <div className="border-t border-gray-100 pt-2 mt-2">
                    <p className="text-xs text-gray-400 font-medium uppercase mb-0.5">
                      Description
                    </p>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 p-3">
          <div className="bg-white w-full max-w-md p-6 rounded shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              {formData.id ? "Edit Expense Category" : "Add New Expense Category"}
            </h3>

            <div className="mb-3">
              <label className="block text-sm mb-1">
                Expense Category Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="Enter category name"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="Enter description"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <button
                onClick={handleClose}
                className="px-4 py-2 border rounded w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto"
              >
                {formData.id ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ExpenseCategories;