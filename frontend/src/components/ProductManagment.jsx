import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import axios from "axios";

function ProductManagement() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [editProductId, setEditProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [notification, setNotification] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    category: "",
    subCategory: "",
    brand: "",
    price: 0,
    discountPercentage: 0,
    sizes: [],
    color: "",
    season: "",
    stock: 0,
    fabric: "",
    fitting: "",
    styleOptions: [],
    specialAttribute: "",
    imageUrl: []
  });
  const [discountAllPercentage, setDiscountAllPercentage] = useState(0);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/adminLogin");
      return;
    }

    fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("adminToken");
    if (!window.confirm("🗑️ Are you sure? This action cannot be undone.")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((p) => p._id !== id));
      showNotification("✓ Product deleted successfully", "success");
    } catch (err) {
      console.error("Error deleting product", err);
      showNotification("✗ Failed to delete product", "error");
    }
  };

  const handleAddProductChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "imageUrl") {
      setNewProduct((prev) => ({ 
        ...prev, 
        [name]: value.split('$').map(v => v.trim()).filter(v => v) 
      }));
    } else if (["sizes", "styleOptions"].includes(name)) {
      setNewProduct((prev) => ({ ...prev, [name]: value.split(",").map(v => v.trim()) }));
    } else {
      setNewProduct((prev) => ({ ...prev, [name]: value }));
    }
  };
  
  const handleEditChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "imageUrl") {
      setEditedProduct((prev) => ({ 
        ...prev, 
        [name]: value.split('$').map(v => v.trim()).filter(v => v) 
      }));
    } else if (["sizes", "styleOptions"].includes(name)) {
      setEditedProduct((prev) => ({ ...prev, [name]: value.split(",").map(v => v.trim()) }));
    } else {
      setEditedProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/products/admin/${editProductId}`,
        editedProduct, {
          headers: { Authorization: `Bearer ${token}` },
        });
      const updatedList = products.map((p) => (p._id === editProductId ? res.data : p));
      setProducts(updatedList);
      setEditProductId(null);
      setShowEditModal(false);
      showNotification("✓ Product updated successfully!", "success");
    } catch (err) {
      console.error("Error updating product", err);
      showNotification("✗ Failed to update product", "error");
    }
  };

  const handleAddProduct = async () => {
    const token = localStorage.getItem("adminToken");
    if (!newProduct.name || !newProduct.price) {
      showNotification("✗ Please fill in required fields", "error");
      return;
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/products/admin`,
        newProduct, {
          headers: { Authorization: `Bearer ${token}` },
        });
      setProducts([...products, res.data]);
      setShowAddProduct(false);
      setActiveTab("basic");
      setNewProduct({
        name: "",
        description: "",
        category: "",
        subCategory: "",
        brand: "",
        price: 0,
        discountPercentage: 0,
        sizes: [],
        color: "",
        season: "",
        stock: 0,
        fabric: "",
        fitting: "",
        styleOptions: [],
        specialAttribute: "",
        imageUrl: []
      });
      showNotification("✓ Product added successfully!", "success");
    } catch (err) {
      console.error("Error adding product", err);
      showNotification("✗ Failed to add product", "error");
    }
  };

  const handleApplyDiscountToAll = async () => {
    const token = localStorage.getItem("adminToken");
    if (!window.confirm(`Apply ${discountAllPercentage}% discount to ALL products?`)) return;

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/products/admin/discount-all`,
        { discountPercentage: discountAllPercentage }, {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      setProducts(products.map(product => ({
        ...product,
        discountPercentage: discountAllPercentage
      })));
      
      showNotification("✓ Bulk discount applied successfully!", "success");
      setDiscountAllPercentage(0);
    } catch (err) {
      console.error("Error applying discount to all products", err);
      showNotification("✗ Failed to apply bulk discount", "error");
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="admin-shell admin-bg flex min-h-screen items-center justify-center px-4">
        <div className="admin-card w-full max-w-4xl rounded-3xl p-8 text-center">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
          <h1 className="admin-title mt-4 text-xl text-slate-600">Loading Products...</h1>
        </div>
      </div>
    );
  }

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: "Out of Stock", color: "bg-red-100 text-red-800", icon: "⛔" };
    if (stock < 5) return { text: "Low Stock", color: "bg-orange-100 text-orange-800", icon: "⚠️" };
    if (stock < 20) return { text: "Medium", color: "bg-yellow-100 text-yellow-800", icon: "📦" };
    return { text: "In Stock", color: "bg-green-100 text-green-800", icon: "✓" };
  };

  return (
    <div className="admin-shell admin-bg min-h-screen pb-8">
      <AdminHeader />

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-full shadow-lg font-medium text-sm z-50 animate-fade-in ${
          notification.type === "success" 
            ? "bg-green-500 text-white" 
            : "bg-red-500 text-white"
        }`}>
          {notification.message}
        </div>
      )}
      
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 admin-animate">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
              <div>
                <h1 className="admin-title text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  📦 Inventory Management
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  Manage, edit, and organize your product catalog
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:shadow-md"
                >
                  {viewMode === "grid" ? "📋" : "🔲"} {viewMode === "grid" ? "List" : "Grid"}
                </button>
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5"
                >
                  ➕ Add Product
                </button>
              </div>
            </div>

            {/* Search & Filters Bar */}
            <div className="admin-card rounded-2xl p-5 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-lg">🔍</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Search by name, brand, or category..."
                    className="block w-full rounded-xl border border-slate-200 bg-white/70 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white transition"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <label className="text-sm font-medium text-slate-600 whitespace-nowrap">Bulk Discount:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="0"
                      className="block w-16 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      value={discountAllPercentage}
                      onChange={(e) => setDiscountAllPercentage(Number(e.target.value))}
                      min="0"
                      max="100"
                    />
                    <span className="text-slate-500">%</span>
                    <button
                      onClick={handleApplyDiscountToAll}
                      className="inline-flex items-center rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 hover:-translate-y-0.5"
                    >
                      💰 Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Add Product Modal */}
          {showAddProduct && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
              <div className="admin-card rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="sticky top-0 bg-white/95 backdrop-blur px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900">✨ Add New Product</h2>
                  <button
                    onClick={() => { setShowAddProduct(false); setActiveTab("basic"); }}
                    className="text-slate-400 hover:text-slate-600 text-2xl transition"
                  >
                    ✕
                  </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-1 px-6 pt-4 border-b border-slate-100">
                  {["basic", "details", "images"].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 font-medium text-sm rounded-t-lg transition ${
                        activeTab === tab
                          ? "bg-emerald-50 text-emerald-600 border-b-2 border-emerald-500"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {tab === "basic" && "📝 Basic"} 
                      {tab === "details" && "🔧 Details"}
                      {tab === "images" && "🖼️ Images"}
                    </button>
                  ))}
                </div>

                <div className="p-6">
                  {/* Basic Tab */}
                  {activeTab === "basic" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Product Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={newProduct.name}
                          onChange={handleAddProductChange}
                          placeholder="e.g., Premium Cotton Shirt"
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                        <textarea
                          name="description"
                          value={newProduct.description}
                          onChange={handleAddProductChange}
                          placeholder="Product description..."
                          rows="3"
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition resize-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Brand</label>
                          <input
                            type="text"
                            name="brand"
                            value={newProduct.brand}
                            onChange={handleAddProductChange}
                            placeholder="Brand name"
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Season</label>
                          <input
                            type="text"
                            name="season"
                            value={newProduct.season}
                            onChange={handleAddProductChange}
                            placeholder="e.g., Summer, Winter"
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                          <input
                            type="text"
                            name="category"
                            value={newProduct.category}
                            onChange={handleAddProductChange}
                            placeholder="Category"
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Subcategory</label>
                          <input
                            type="text"
                            name="subCategory"
                            value={newProduct.subCategory}
                            onChange={handleAddProductChange}
                            placeholder="Subcategory"
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Details Tab */}
                  {activeTab === "details" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Price (Rs) *</label>
                          <input
                            type="number"
                            name="price"
                            value={newProduct.price}
                            onChange={handleAddProductChange}
                            placeholder="0"
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Discount (%)</label>
                          <input
                            type="number"
                            name="discountPercentage"
                            value={newProduct.discountPercentage}
                            onChange={handleAddProductChange}
                            placeholder="0"
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Stock Quantity</label>
                          <input
                            type="number"
                            name="stock"
                            value={newProduct.stock}
                            onChange={handleAddProductChange}
                            placeholder="0"
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Color</label>
                          <input
                            type="text"
                            name="color"
                            value={newProduct.color}
                            onChange={handleAddProductChange}
                            placeholder="e.g., Blue, Red"
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Fabric</label>
                          <input
                            type="text"
                            name="fabric"
                            value={newProduct.fabric}
                            onChange={handleAddProductChange}
                            placeholder="e.g., Cotton, Silk"
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Fitting</label>
                          <input
                            type="text"
                            name="fitting"
                            value={newProduct.fitting}
                            onChange={handleAddProductChange}
                            placeholder="e.g., Slim, Regular"
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Sizes (comma separated)</label>
                        <input
                          type="text"
                          name="sizes"
                          value={newProduct.sizes.join(", ")}
                          onChange={handleAddProductChange}
                          placeholder="XS, S, M, L, XL"
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Style Options (comma separated)</label>
                          <input
                            type="text"
                            name="styleOptions"
                            value={newProduct.styleOptions.join(", ")}
                            onChange={handleAddProductChange}
                            placeholder="Pattern1, Pattern2"
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Special Attribute</label>
                          <input
                            type="text"
                            name="specialAttribute"
                            value={newProduct.specialAttribute}
                            onChange={handleAddProductChange}
                            placeholder="e.g., Handmade, Premium"
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Images Tab */}
                  {activeTab === "images" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Image URLs</label>
                        <p className="text-xs text-slate-500 mb-3">Separate multiple URLs with $ symbol</p>
                        <textarea
                          name="imageUrl"
                          value={newProduct.imageUrl.join("$")}
                          onChange={handleAddProductChange}
                          rows="5"
                          placeholder="https://example.com/image1.jpg$https://example.com/image2.jpg"
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition resize-none font-mono text-sm"
                        />
                      </div>
                      {newProduct.imageUrl.length > 0 && (
                        <div className="pt-4">
                          <p className="text-sm font-medium text-slate-700 mb-3">Preview ({newProduct.imageUrl.length} images)</p>
                          <div className="grid grid-cols-4 gap-3">
                            {newProduct.imageUrl.map((url, idx) => (
                              <div key={idx} className="aspect-square rounded-lg bg-slate-100 overflow-hidden">
                                {url && (
                                  <img src={url} alt={`preview-${idx}`} className="w-full h-full object-cover" onError={(e) => e.target.style.display = "none"} />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="sticky bottom-0 bg-white/95 backdrop-blur px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
                  <button
                    onClick={() => { setShowAddProduct(false); setActiveTab("basic"); }}
                    className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:shadow-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddProduct}
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5"
                  >
                    ✓ Add Product
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid/List View */}
          {filteredProducts.length === 0 ? (
            <div className="admin-card rounded-2xl p-12 text-center">
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No products found</h3>
              <p className="text-slate-500">
                {searchTerm ? "Try a different search term" : "Start by adding your first product!"}
              </p>
            </div>
          ) : viewMode === "grid" ? (
            // Grid View
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock);
                return (
                  <div
                    key={product._id}
                    className="admin-card rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
                  >
                    {/* Product Image */}
                    <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
                      {product.imageUrl?.length > 0 ? (
                        <img
                          src={product.imageUrl[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl text-slate-300">🖼️</div>
                      )}
                      
                      {/* Discount Badge */}
                      {product.discountPercentage > 0 && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold shadow-lg">
                          {product.discountPercentage}%
                        </div>
                      )}

                      {/* Stock Status Badge */}
                      <div className={`absolute top-3 left-3 ${stockStatus.color} rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1`}>
                        <span>{stockStatus.icon}</span> {stockStatus.text}
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="p-4 space-y-3">
                      <div>
                        <p className="text-xs text-slate-500 font-medium">{product.brand} • {product.category}</p>
                        <h3 className="text-sm font-bold text-slate-900 line-clamp-2 mt-1">{product.name}</h3>
                      </div>

                      {/* Price Section */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-emerald-600">Rs {product.price}</span>
                        {product.discountPercentage > 0 && (
                          <span className="text-sm text-slate-400 line-through">
                            Rs {Math.round(product.price / (1 - product.discountPercentage / 100))}
                          </span>
                        )}
                      </div>

                      {/* Details Row */}
                      <div className="flex items-center justify-between text-xs text-slate-600">
                        <span>📦 Stock: {product.stock}</span>
                        <span>🎨 {product.color}</span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-600 line-clamp-2">{product.description}</p>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-3 border-t border-slate-100">
                        <button
                          onClick={() => { setEditProductId(product._id); setEditedProduct({ ...product }); setShowEditModal(true); }}
                          className="flex-1 px-3 py-2 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg hover:bg-emerald-100 transition"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="flex-1 px-3 py-2 bg-red-50 text-red-700 text-xs font-semibold rounded-lg hover:bg-red-100 transition"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // List View
            <div className="space-y-3">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock);
                return (
                  <div
                    key={product._id}
                    className="admin-card rounded-lg p-4 hover:shadow-md transition-shadow flex items-center gap-4"
                  >
                    {/* Thumbnail */}
                    <div className="flex-shrink-0 h-16 w-16 rounded-lg bg-slate-100 overflow-hidden">
                      {product.imageUrl?.length > 0 ? (
                        <img
                          src={product.imageUrl[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl text-slate-300">📦</div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-grow grid grid-cols-5 gap-4 items-center">
                      <div>
                        <p className="text-xs text-slate-500">{product.brand}</p>
                        <p className="font-semibold text-sm text-slate-900 line-clamp-1">{product.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Category</p>
                        <p className="font-medium text-sm text-slate-700">{product.category}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Price</p>
                        <p className="font-semibold text-sm text-emerald-600">Rs {product.price}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Stock</p>
                        <p className={`font-semibold text-sm ${stockStatus.color}`}>
                          {stockStatus.icon} {product.stock}
                        </p>
                      </div>
                      <div className="text-right">
                        {product.discountPercentage > 0 && (
                          <span className="inline-block bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">
                            -{product.discountPercentage}%
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => { setEditProductId(product._id); setEditedProduct({ ...product }); setShowEditModal(true); }}
                        className="p-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Edit Modal */}
      {showEditModal && editProductId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="admin-card rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white/95 backdrop-blur px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">✏️ Edit Product</h2>
              <button
                onClick={() => { setShowEditModal(false); setEditProductId(null); }}
                className="text-slate-400 hover:text-slate-600 text-2xl transition"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={editedProduct.name || ''}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Price (Rs)</label>
                  <input
                    type="number"
                    name="price"
                    value={editedProduct.price || 0}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Discount (%)</label>
                  <input
                    type="number"
                    name="discountPercentage"
                    value={editedProduct.discountPercentage || 0}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={editedProduct.stock || 0}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Color</label>
                  <input
                    type="text"
                    name="color"
                    value={editedProduct.color || ''}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={editedProduct.description || ''}
                  onChange={handleEditChange}
                  rows="3"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={editedProduct.category || ''}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Subcategory</label>
                  <input
                    type="text"
                    name="subCategory"
                    value={editedProduct.subCategory || ''}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                  />
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white/95 backdrop-blur px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => { setShowEditModal(false); setEditProductId(null); }}
                className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:shadow-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5"
              >
                ✓ Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductManagement;
