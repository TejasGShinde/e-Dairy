import React, { useState, useEffect,useCallback  } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ProviderDashboard() {
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const navigate = useNavigate();
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products/provider', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products', error);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token in localStorage:', token);
  }, []);
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      console.log('Token being sent:', token);
      const response = await axios.post(
        'http://localhost:5000/api/products',
        { name, description, price, category },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Product added successfully:', response.data);
      fetchProducts();
      setName('');
      setDescription('');
      setPrice('');
      setCategory('');
    } catch (error) {
      console.error('Error adding product:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      alert('Failed to add product: ' + (error.response?.data?.error || error.message));
    }
  };
  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchProducts(); // Refresh the product list after deletion
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product: ' + (error.response?.data?.error || error.message));
    }
  };
  const handleToggleStock = async (id, inStock) => {
    try {
      await axios.put(
        `http://localhost:5000/api/products/${id}`,
        { inStock: !inStock },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      fetchProducts();
    } catch (error) {
      console.error('Error updating stock status', error);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/api/products/${editingProduct._id}`,
        { name, description, price, category },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setProducts(products.map(p => p._id === editingProduct._id ? response.data : p));
      setEditingProduct(null);
      setName('');
      setDescription('');
      setPrice('');
      setCategory('');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setCategory(product.category);
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Provider Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded">Logout</button>
      </div>
      <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="mb-8">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product Name"
          required
          className="mb-2 p-2 border rounded"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
          className="mb-2 p-2 border rounded"
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          required
          className="mb-2 p-2 border rounded"
        />
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          required
          className="mb-2 p-2 border rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {editingProduct ? 'Update Product' : 'Add Product'}
        </button>
        {editingProduct && (
          <button type="button" onClick={() => setEditingProduct(null)} className="bg-gray-500 text-white p-2 rounded ml-2">
            Cancel Edit
          </button>
        )}
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product._id} className="border p-4 rounded">
            <h2 className="text-xl font-bold">{product.name}</h2>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <p>Category: {product.category}</p>
            <button
              onClick={() => handleToggleStock(product._id, product.inStock)}
              className={`mt-2 p-2 rounded ${product.inStock ? 'bg-green-500' : 'bg-red-500'} text-white`}
            >
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </button>
            <button
              onClick={() => handleEditProduct(product)}
              className="mt-2 ml-2 p-2 rounded bg-yellow-500 text-white"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteProduct(product._id)}
              className="mt-2 ml-2 p-2 rounded bg-red-500 text-white"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProviderDashboard;
