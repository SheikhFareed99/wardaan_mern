import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import axios from "axios";

// SVG Icons
const Icons = {
  Search: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Plus: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>,
  Edit: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
  Delete: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Grid: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  List: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>,
  ChevronLeft: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>,
  ChevronRight: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>,
};

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
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

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
    const token = localStorage.getItem("adminToken") || localStorage.getItem("superadminToken");
    if (!token) {
      navigate("/AdminLogin");
      return;
    }

    fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    const token = localStorage.getItem("adminToken") || localStorage.getItem("superadminToken");
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
    const token = localStorage.getItem("adminToken") || localStorage.getItem("superadminToken");
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((p) => p._id !== id));
      showNotification("Product deleted successfully", "success");
    } catch (err) {
      console.error("Error deleting product", err);
      showNotification("Failed to delete product", "error");
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
    const token = localStorage.getItem("adminToken") || localStorage.getItem("superadminToken");
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
      showNotification("Product updated successfully", "success");
    } catch (err) {
      console.error("Error updating product", err);
      showNotification("Failed to update product", "error");
    }
  };

  const handleAddProduct = async () => {
    const token = localStorage.getItem("adminToken") || localStorage.getItem("superadminToken");
    if (!newProduct.name || !newProduct.price) {
      showNotification("Please fill in required fields", "error");
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
      showNotification("Product added successfully", "success");
    } catch (err) {
      console.error("Error adding product", err);
      showNotification("Failed to add product", "error");
    }
  };

  const handleApplyDiscountToAll = async () => {
    const token = localStorage.getItem("adminToken") || localStorage.getItem("superadminToken");
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
      
      showNotification("Bulk discount applied successfully", "success");
      setDiscountAllPercentage(0);
    } catch (err) {
      console.error("Error applying discount to all products", err);
      showNotification("Failed to apply bulk discount", "error");
    }
  };

  // Filter and Paginate Products
  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: "Out of Stock", color: "bg-rose-100 text-rose-800" };
    if (stock < 5) return { text: "Low Stock", color: "bg-amber-100 text-amber-800" };
    return { text: "In Stock", color: "bg-emerald-100 text-emerald-800" };
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600 mx-auto"></div>
          <h1 className="mt-4 text-slate-600 font-medium">Loading Catalog...</h1>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-slate-50 pb-12 font-sans">
      <AdminHeader />

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-6 right-6 px-6 py-3 rounded-xl shadow-2xl font-medium text-sm z-[100] border transition-all duration-500 flex items-center gap-3 ${
          notification.type === "success" 
            ? "bg-white border-emerald-100 text-emerald-800 shadow-emerald-500/10" 
            : "bg-white border-rose-100 text-rose-800 shadow-rose-500/10"
        }`}>
          <div className={`h-2 w-2 rounded-full ${notification.type === "success" ? "bg-emerald-500" : "bg-rose-500"}`}></div>
          {notification.message}
        </div>
      )}
      
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Product Catalog</h1>
                <p className="mt-1 text-slate-500">Manage your inventory, prices, and stock levels efficiently.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-all ${viewMode === "grid" ? "bg-slate-100 text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                    title="Grid View"
                  >
                    <Icons.Grid />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-all ${viewMode === "list" ? "bg-slate-100 text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                    title="List View"
                  >
                    <Icons.List />
                  </button>
                </div>
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Icons.Plus />
                  Add New Product
                </button>
              </div>
            </div>

            {/* Search & Bulk Actions Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Icons.Search />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by name, brand, or category..."
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-11 pr-4 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  />
                </div>
                
                <div className="flex flex-wrap items-center gap-4 py-2 lg:py-0 border-t lg:border-t-0 border-slate-100 lg:pl-6 lg:border-l">
                  <span className="text-sm font-medium text-slate-600">Bulk Discount</span>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <input
                        type="number"
                        className="block w-20 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                        value={discountAllPercentage}
                        onChange={(e) => setDiscountAllPercentage(Number(e.target.value))}
                        min="0"
                        max="100"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">%</span>
                    </div>
                    <button
                      onClick={handleApplyDiscountToAll}
                      className="inline-flex items-center px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition shadow-sm"
                    >
                      Apply to All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Catalog Content */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-20 text-center shadow-sm">
              <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icons.Search />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No products found</h3>
              <p className="text-slate-500 max-w-xs mx-auto">
                {searchTerm ? `We couldn't find anything matching "${searchTerm}".` : "Your catalog is empty. Start adding products to see them here."}
              </p>
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="mt-6 text-emerald-600 font-semibold hover:underline">
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentProducts.map((product) => {
                    const stockStatus = getStockStatus(product.stock);
                    return (
                      <div key={product._id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group">
                        <div className="relative aspect-[4/5] bg-slate-100 overflow-hidden">
                          {product.imageUrl?.length > 0 ? (
                            <img
                              src={product.imageUrl[0]}
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <Icons.Grid />
                            </div>
                          )}
                          
                          {product.discountPercentage > 0 && (
                            <div className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-black px-2 py-1 rounded shadow-sm">
                              {product.discountPercentage}% OFF
                            </div>
                          )}

                          <div className={`absolute bottom-3 right-3 ${stockStatus.color} px-2 py-1 rounded text-[10px] font-bold shadow-sm backdrop-blur-sm bg-opacity-80`}>
                            {stockStatus.text}
                          </div>
                        </div>

                        <div className="p-5">
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{product.category}</span>
                              <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{product.brand}</span>
                            </div>
                            <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">{product.name}</h3>
                          </div>

                          <div className="flex items-center justify-between mb-5">
                            <div className="flex flex-col">
                              <span className="text-lg font-black text-slate-900">Rs {product.price}</span>
                              {product.discountPercentage > 0 && (
                                <span className="text-[10px] text-slate-400 line-through font-medium">
                                  Rs {Math.round(product.price / (1 - product.discountPercentage / 100))}
                                </span>
                              )}
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] font-medium text-slate-500">Stock: <span className="text-slate-900 font-bold">{product.stock}</span></span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => { setEditProductId(product._id); setEditedProduct({ ...product }); setShowEditModal(true); }}
                              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-100 border border-slate-200 transition"
                            >
                              <Icons.Edit />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="px-3 py-2 bg-white text-rose-600 text-xs font-bold rounded-lg hover:bg-rose-50 border border-slate-200 hover:border-rose-100 transition"
                              title="Delete"
                            >
                              <Icons.Delete />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentProducts.map((product) => {
                        const stockStatus = getStockStatus(product.stock);
                        return (
                          <tr key={product._id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0">
                                  {product.imageUrl?.length > 0 ? (
                                    <img src={product.imageUrl[0]} alt={product.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300"><Icons.Grid /></div>
                                  )}
                                </div>
                                <div>
                                  <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{product.name}</div>
                                  <div className="text-[10px] text-slate-400 font-medium">{product.brand}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-xs font-bold text-slate-500">{product.category}</td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-black text-slate-900">Rs {product.price}</div>
                              {product.discountPercentage > 0 && <div className="text-[10px] text-rose-500 font-bold">-{product.discountPercentage}%</div>}
                            </td>
                            <td className="px-6 py-4">
                              <div className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${stockStatus.color}`}>
                                {product.stock} Units
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => { setEditProductId(product._id); setEditedProduct({ ...product }); setShowEditModal(true); }}
                                  className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                                >
                                  <Icons.Edit />
                                </button>
                                <button
                                  onClick={() => handleDelete(product._id)}
                                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                >
                                  <Icons.Delete />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-between bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                  <span className="text-xs font-medium text-slate-500">
                    Showing <span className="text-slate-900 font-bold">{currentProducts.length}</span> of <span className="text-slate-900 font-bold">{filteredProducts.length}</span> products
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      <Icons.ChevronLeft />
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-9 h-9 rounded-lg text-xs font-bold transition ${
                          currentPage === i + 1 
                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" 
                            : "bg-white text-slate-500 border border-slate-200 hover:border-slate-400 hover:text-slate-900"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      <Icons.ChevronRight />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Add Product</h2>
                <p className="text-xs text-slate-500 font-medium">Create a new item in your catalog</p>
              </div>
              <button
                onClick={() => { setShowAddProduct(false); setActiveTab("basic"); }}
                className="h-10 w-10 flex items-center justify-center text-slate-400 hover:bg-slate-50 rounded-full transition"
              >
                <Icons.Plus className="rotate-45" />
              </button>
            </div>

            <div className="flex gap-8 px-8 border-b border-slate-100 overflow-x-auto no-scrollbar">
              {["basic", "details", "images"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 font-bold text-[10px] uppercase tracking-widest whitespace-nowrap border-b-2 transition-all ${
                    activeTab === tab
                      ? "border-emerald-600 text-emerald-600"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {tab} Information
                </button>
              ))}
            </div>

            <div className="p-8 overflow-y-auto flex-grow custom-scrollbar">
              {activeTab === "basic" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Product Name</label>
                    <input
                      type="text"
                      name="name"
                      value={newProduct.name}
                      onChange={handleAddProductChange}
                      placeholder="e.g. Classic Oxford Shirt"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                    <textarea
                      name="description"
                      value={newProduct.description}
                      onChange={handleAddProductChange}
                      placeholder="Detailed product information..."
                      rows="4"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition text-sm resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Brand</label>
                      <input
                        type="text"
                        name="brand"
                        value={newProduct.brand}
                        onChange={handleAddProductChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Season</label>
                      <input
                        type="text"
                        name="season"
                        value={newProduct.season}
                        onChange={handleAddProductChange}
                        placeholder="Summer 2024"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "details" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Price (PKR)</label>
                      <input
                        type="number"
                        name="price"
                        value={newProduct.price}
                        onChange={handleAddProductChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition text-sm font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Discount (%)</label>
                      <input
                        type="number"
                        name="discountPercentage"
                        value={newProduct.discountPercentage}
                        onChange={handleAddProductChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition text-sm"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Stock Inventory</label>
                      <input
                        type="number"
                        name="stock"
                        value={newProduct.stock}
                        onChange={handleAddProductChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Color</label>
                      <input
                        type="text"
                        name="color"
                        value={newProduct.color}
                        onChange={handleAddProductChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Sizes (Comma separated)</label>
                    <input
                      type="text"
                      name="sizes"
                      value={newProduct.sizes.join(", ")}
                      onChange={handleAddProductChange}
                      placeholder="S, M, L, XL"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition text-sm font-mono"
                    />
                  </div>
                </div>
              )}

              {activeTab === "images" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Image URLs ($ separated)</label>
                    <textarea
                      name="imageUrl"
                      value={newProduct.imageUrl.join("$")}
                      onChange={handleAddProductChange}
                      rows="6"
                      placeholder="URL1$URL2$URL3"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition text-xs font-mono"
                    />
                  </div>
                  {newProduct.imageUrl.length > 0 && (
                    <div className="grid grid-cols-4 gap-3">
                      {newProduct.imageUrl.map((url, idx) => (
                        <div key={idx} className="aspect-square rounded-lg border border-slate-100 bg-slate-50 overflow-hidden">
                          <img src={url} className="h-full w-full object-cover" alt="Preview" onError={(e) => e.target.style.display = 'none'} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
              <button
                onClick={() => setShowAddProduct(false)}
                className="px-6 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="bg-slate-900 text-white px-8 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-900/10"
              >
                Create Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Edit Product</h2>
                <p className="text-xs text-slate-500 font-medium">Modify existing product details</p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="h-10 w-10 flex items-center justify-center text-slate-400 hover:bg-slate-50 rounded-full transition"
              >
                <Icons.Plus className="rotate-45" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto flex-grow custom-scrollbar">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editedProduct.name}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition text-sm font-bold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Price</label>
                    <input
                      type="number"
                      name="price"
                      value={editedProduct.price}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Discount (%)</label>
                    <input
                      type="number"
                      name="discountPercentage"
                      value={editedProduct.discountPercentage}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Stock Inventory</label>
                  <input
                    type="number"
                    name="stock"
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

            <div className="sticky bottom-0 bg-white/95 backdrop-blur px-6 py-4 border-t border-slate-100 flex justify-end gap-3 animate-slide-in-up">
              <button
                onClick={() => { setShowEditModal(false); setEditProductId(null); }}
                className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-300 hover:border-slate-400 hover:shadow-md hover:scale-105 active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:scale-105 active:scale-95"
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
