import React, { useState, useEffect } from 'react';
import { Plus, PackageOpen, X, Trash2, Edit } from 'lucide-react';

function Products() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);

  const [formData, setFormData] = useState({
    logo: '', type: 'Product', name: '', price: '', taxLabel: '', taxRate: '0'
  });

  useEffect(() => {
    const savedProducts = localStorage.getItem('my_products_list');
    if (savedProducts) setProducts(JSON.parse(savedProducts));
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, logo: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = () => {
    if (!formData.name || !formData.price) {
      alert("Please fill required fields!");
      return;
    }

    if (editingProductId) {
      const updatedProducts = products.map((p) =>
        p.id === editingProductId ? { ...p, ...formData } : p
      );
      setProducts(updatedProducts);
      localStorage.setItem('my_products_list', JSON.stringify(updatedProducts));
    } else {
      const newProduct = { ...formData, id: Date.now() };
      const updated = [...products, newProduct];
      setProducts(updated);
      localStorage.setItem('my_products_list', JSON.stringify(updated));
    }

    setFormData({ logo: '', type: 'Product', name: '', price: '', taxLabel: '', taxRate: '0' });
    setEditingProductId(null);
    setIsDrawerOpen(false);
  };

  const handleEditProduct = (product) => {
    setFormData(product);
    setEditingProductId(product.id);
    setIsDrawerOpen(true);
  };

  const deleteProduct = (id) => {
    if (window.confirm("Delete this product?")) {
      const filtered = products.filter(p => p.id !== id);
      setProducts(filtered);
      localStorage.setItem('my_products_list', JSON.stringify(filtered));
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-slate-900 pb-10">

      {/* Backdrop */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => { setIsDrawerOpen(false); setEditingProductId(null); }}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white dark:bg-slate-800 shadow-2xl z-50 transform transition-transform duration-300 ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-4 border-b dark:border-slate-700">
          <h2 className="text-lg font-semibold dark:text-white">
            {editingProductId ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={() => { setIsDrawerOpen(false); setEditingProductId(null); }}>
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <input type="file" id="logoUpload" hidden onChange={handleImageUpload} />
            <label htmlFor="logoUpload" className="border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-lg w-24 h-24 flex items-center justify-center cursor-pointer overflow-hidden bg-gray-50 dark:bg-slate-900">
              {formData.logo
                ? <img src={formData.logo} className="w-full h-full object-cover" alt="logo" />
                : <Plus className="text-gray-400" />}
            </label>
          </div>

          <input type="text" placeholder="Product Name" value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded dark:bg-slate-900 dark:text-white dark:border-slate-700" />

          <input type="number" placeholder="Price" value={formData.price}
            onChange={e => setFormData({ ...formData, price: e.target.value })}
            className="w-full p-2 border rounded dark:bg-slate-900 dark:text-white dark:border-slate-700" />

          <input type="text" placeholder="Tax Label" value={formData.taxLabel}
            onChange={e => setFormData({ ...formData, taxLabel: e.target.value })}
            className="w-full p-2 border rounded dark:bg-slate-900 dark:text-white dark:border-slate-700" />

          <button onClick={handleSaveProduct}
            className="w-full bg-[#0095ff] text-white p-3 rounded-lg font-bold">
            {editingProductId ? "Update Product" : "Create Product"}
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold dark:text-white">Products</h1>
            <p className="text-xs text-gray-400 mt-0.5">Dashboard - Products</p>
          </div>
          <button
            onClick={() => { setIsDrawerOpen(true); setEditingProductId(null); }}
            className="bg-[#0095ff] hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add New Product</span>
          </button>
        </div>

        {/* ── MOBILE CARDS ── */}
        <div className="grid grid-cols-1 gap-3 md:hidden">
          {products.length > 0 ? products.map((product) => (
            <div key={product.id} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">

              {/* Card header with action buttons */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg border dark:border-slate-700 overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                    {product.logo
                      ? <img src={product.logo} className="w-full h-full object-cover" alt={product.name} />
                      : <PackageOpen size={18} className="text-gray-300" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 dark:text-white">{product.name}</p>
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded dark:bg-blue-900/20">{product.type}</span>
                  </div>
                </div>
                {/* ✅ Expenses-style buttons */}
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="w-9 h-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm"
                  >
                    <Edit size={15} />
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="w-9 h-9 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-sm"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">Price</span>
                <span className="text-sm font-bold text-blue-500">${product.price}</span>
              </div>

              {product.taxLabel && (
                <div className="flex flex-col px-4 py-3">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">Tax</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{product.taxLabel} ({product.taxRate}%)</span>
                </div>
              )}
            </div>
          )) : (
            <div className="text-center p-10 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 text-gray-400">
              <PackageOpen size={36} className="mx-auto mb-2 text-gray-300" />
              <p className="text-sm font-semibold">No products found</p>
            </div>
          )}
        </div>

        {/* ── DESKTOP TABLE ── */}
        <div className="hidden md:block bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-700">
              <tr>
                {["Logo", "Name", "Type", "Price", "Tax", "Action"].map(h => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 text-sm">No products found</td>
                </tr>
              ) : products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/40 transition-colors dark:text-white">
                  <td className="px-4 py-3.5">
                    <div className="w-10 h-10 rounded-lg border dark:border-slate-700 overflow-hidden bg-gray-50 flex items-center justify-center">
                      {product.logo
                        ? <img src={product.logo} className="w-full h-full object-cover" alt={product.name} />
                        : <PackageOpen size={18} className="text-gray-300" />}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-gray-800 dark:text-white">{product.name}</td>
                  <td className="px-4 py-3.5 text-gray-600 dark:text-gray-300">{product.type}</td>
                  <td className="px-4 py-3.5 text-blue-500 font-bold">${product.price}</td>
                  <td className="px-4 py-3.5 text-xs text-gray-500 dark:text-gray-400">{product.taxLabel} ({product.taxRate}%)</td>
                  <td className="px-4 py-3.5">
                    {/* ✅ Expenses-style buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="w-9 h-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm"
                      >
                        <Edit size={15} />
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="w-9 h-9 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-sm"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Products;