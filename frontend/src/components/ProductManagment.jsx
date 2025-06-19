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
      const res = await axios.get("https://wardaan-mern.onrender.com/api/products/admin", {
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
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`https://wardaan-mern.onrender.com/api/products/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting product", err);
    }
  };

  const handleEditClick = (product) => {
    setEditProductId(product._id);
    setEditedProduct({ ...product });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    if (["sizes", "styleOptions", "imageUrl"].includes(name)) {
      setEditedProduct((prev) => ({ ...prev, [name]: value.split(",").map(v => v.trim()) }));
    } else {
      setEditedProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      const res = await axios.put(
        `https://wardaan-mern.onrender.com/api/products/admin/${editProductId}`,
        editedProduct
        , {
          headers: { Authorization: `Bearer ${token}` },
        });
      const updatedList = products.map((p) => (p._id === editProductId ? res.data : p));
      setProducts(updatedList);
      setEditProductId(null);
    } catch (err) {
      console.error("Error updating product", err);
    }
  };

  const handleAddProductChange = (e) => {
    const { name, value } = e.target;

    if (["sizes", "styleOptions", "imageUrl"].includes(name)) {
      setNewProduct((prev) => ({ ...prev, [name]: value.split(",").map(v => v.trim()) }));
    } else {
      setNewProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddProduct = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      const res = await axios.post(
        "https://wardaan-mern.onrender.com/api/products/admin",
        newProduct
        , {
          headers: { Authorization: `Bearer ${token}` },
        });
      setProducts([...products, res.data]);
      setShowAddProduct(false);
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
    } catch (err) {
      console.error("Error adding product", err);
    }
  };

  const handleApplyDiscountToAll = async () => {
    const token = localStorage.getItem("adminToken");
    if (!window.confirm(`Apply ${discountAllPercentage}% discount to ALL products?`)) return;

    try {
      await axios.patch(
        "https://wardaan-mern.onrender.com/api/products/admin/discount-all",
        { discountPercentage: discountAllPercentage }, {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      // Update local state to reflect the discount
      setProducts(products.map(product => ({
        ...product,
        discountPercentage: discountAllPercentage
      })));
      
      alert("Discount applied to all products successfully!");
      setDiscountAllPercentage(0);
    } catch (err) {
      console.error("Error applying discount to all products", err);
      alert("Failed to apply discount to all products");
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 bg-white rounded-xl shadow-sm w-full max-w-4xl">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
          <h1 className="text-center text-xl text-gray-600 mt-4">Loading Products...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
                <p className="mt-2 text-sm text-gray-600">
                  Manage your product inventory and details
                </p>
              </div>
              <button
                onClick={() => setShowAddProduct(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Add New Product
              </button>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Discount %"
                    className="block w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={discountAllPercentage}
                    onChange={(e) => setDiscountAllPercentage(Number(e.target.value))}
                    min="0"
                    max="100"
                  />
                  <button
                    onClick={handleApplyDiscountToAll}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Apply to All
                  </button>
                </div>
                <span className="text-sm text-gray-500">{filteredProducts.length} products</span>
              </div>
            </div>
          </div>

          {/* Add Product Form */}
          {showAddProduct && (
            <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleAddProductChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    name="description"
                    value={newProduct.description}
                    onChange={handleAddProductChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={newProduct.category}
                    onChange={handleAddProductChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
                  <input
                    type="text"
                    name="subCategory"
                    value={newProduct.subCategory}
                    onChange={handleAddProductChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <input
                    type="text"
                    name="brand"
                    value={newProduct.brand}
                    onChange={handleAddProductChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs)</label>
                  <input
                    type="number"
                    name="price"
                    value={newProduct.price}
                    onChange={handleAddProductChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                  <input
                    type="number"
                    name="discountPercentage"
                    value={newProduct.discountPercentage}
                    onChange={handleAddProductChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sizes (comma separated)</label>
                  <input
                    type="text"
                    name="sizes"
                    value={newProduct.sizes.join(", ")}
                    onChange={handleAddProductChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <input
                    type="text"
                    name="color"
                    value={newProduct.color}
                    onChange={handleAddProductChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Season</label>
                  <input
                    type="text"
                    name="season"
                    value={newProduct.season}
                    onChange={handleAddProductChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={newProduct.stock}
                    onChange={handleAddProductChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fabric</label>
                  <input
                    type="text"
                    name="fabric"
                    value={newProduct.fabric}
                    onChange={handleAddProductChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fitting</label>
                  <input
                    type="text"
                    name="fitting"
                    value={newProduct.fitting}
                    onChange={handleAddProductChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Style Options (comma separated)</label>
                  <input
                    type="text"
                    name="styleOptions"
                    value={newProduct.styleOptions.join(", ")}
                    onChange={handleAddProductChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Attribute</label>
                  <input
                    type="text"
                    name="specialAttribute"
                    value={newProduct.specialAttribute}
                    onChange={handleAddProductChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs (comma separated)</label>
                  <textarea
                    name="imageUrl"
                    value={newProduct.imageUrl.join(", ")}
                    onChange={handleAddProductChange}
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowAddProduct(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProduct}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Add Product
                </button>
              </div>
            </div>
          )}

          {/* Products List */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {filteredProducts.length === 0 ? (
              <div className="p-8 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No products found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? "Try a different search term" : "No products available"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <div key={product._id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                    {editProductId === product._id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
      <input
        type="text"
        name="name"
        value={editedProduct.name || ''}
        onChange={handleEditChange}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
      <input
        type="text"
        name="description"
        value={editedProduct.description || ''}
        onChange={handleEditChange}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
      <input
        type="text"
        name="category"
        value={editedProduct.category || ''}
        onChange={handleEditChange}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
      <input
        type="text"
        name="subCategory"
        value={editedProduct.subCategory || ''}
        onChange={handleEditChange}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
      <input
        type="text"
        name="brand"
        value={editedProduct.brand || ''}
        onChange={handleEditChange}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs)</label>
      <input
        type="number"
        name="price"
        value={editedProduct.price || 0}
        onChange={handleEditChange}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
      <input
        type="number"
        name="discountPercentage"
        value={editedProduct.discountPercentage || 0}
        onChange={handleEditChange}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Sizes (comma separated)</label>
      <input
        type="text"
        name="sizes"
        value={editedProduct.sizes?.join(", ") || ''}
        onChange={handleEditChange}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
      <input
        type="text"
        name="color"
        value={editedProduct.color || ''}
        onChange={handleEditChange}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Season</label>
      <input
        type="text"
        name="season"
        value={editedProduct.season || ''}
        onChange={handleEditChange}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
      <input
        type="number"
        name="stock"
        value={editedProduct.stock || 0}
        onChange={handleEditChange}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Fabric</label>
      <input
        type="text"
        name="fabric"
        value={editedProduct.fabric || ''}
        onChange={handleEditChange}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Fitting</label>
      <input
        type="text"
        name="fitting"
        value={editedProduct.fitting || ''}
        onChange={handleEditChange}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Style Options (comma separated)</label>
      <input
        type="text"
        name="styleOptions"
        value={editedProduct.styleOptions?.join(", ") || ''}
        onChange={handleEditChange}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Special Attribute</label>
      <input
        type="text"
        name="specialAttribute"
        value={editedProduct.specialAttribute || ''}
        onChange={handleEditChange}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
    </div>
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs (comma separated)</label>
      <textarea
        name="imageUrl"
        value={editedProduct.imageUrl?.join(", ") || ''}
        onChange={handleEditChange}
        rows={3}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
    </div>
  </div>
  <div className="flex justify-end space-x-3 pt-4">
    <button
      onClick={() => setEditProductId(null)}
      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      Cancel
    </button>
    <button
      onClick={handleSave}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      Save Changes
    </button>
  </div>
</div>
                        </div>
                        <div className="flex justify-end space-x-3 pt-4">
                          <button
                            onClick={() => setEditProductId(null)}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSave}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col md:flex-row gap-6">
                     <div className="flex flex-col md:flex-row gap-6">
  {/* Product Image */}
  <div className="flex-shrink-0">
    <div className="h-40 w-25 rounded-lg bg-gray-200 overflow-hidden flex items-center justify-center">
      {product.imageUrl?.length > 0 ? (
        <img
          src={product.imageUrl[0]}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      ) : (
        <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )}
    </div>
  </div>

  {/* Product Details */}
  <div className="flex-grow">
    <div className="flex items-start justify-between">
      <div>
        <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.brand}</p>
      </div>
      <div className="text-right">
        <p className="text-lg font-semibold text-gray-900">Rs {product.price}</p>
        {product.discountPercentage > 0 && (
          <p className="text-sm text-green-600">
            {product.discountPercentage}% off
          </p>
        )}
      </div>
    </div>

    <div className="mt-2">
      <p className="text-sm text-gray-600">{product.description}</p>
    </div>

    <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
      <div>
        <span className="font-medium text-gray-500">Category:</span> {product.category}
      </div>
      <div>
        <span className="font-medium text-gray-500">Subcategory:</span> {product.subCategory}
      </div>
      <div>
        <span className="font-medium text-gray-500">Color:</span> {product.color}
      </div>
      <div>
        <span className="font-medium text-gray-500">Fabric:</span> {product.fabric}
      </div>
      <div>
        <span className="font-medium text-gray-500">Sizes:</span> {product.sizes?.join(", ")}
      </div>
      <div>
        <span className="font-medium text-gray-500">Stock:</span> {product.stock}
      </div>
    </div>

    <div className="mt-4 flex space-x-3">
      <button
        onClick={() => handleEditClick(product)}
        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Edit
      </button>
      <button
        onClick={() => handleDelete(product._id)}
        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        Delete
      </button>
    </div>
  </div>
</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProductManagement;