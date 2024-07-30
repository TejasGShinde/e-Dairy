import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CustomerDashboard() {
  const [nearbyProviders, setNearbyProviders] = useState([]);
  const [allProviders, setAllProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [paymentMode, setPaymentMode] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchAllProviders();
    fetchLocationAndProviders();
  }, []);

  const fetchLocationAndProviders = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchNearbyProviders(latitude, longitude);
        },
        (error) => {
          setError('Error fetching location');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation not supported by this browser');
      setLoading(false);
    }
  };

  const fetchNearbyProviders = async (latitude, longitude) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/providers/nearby?latitude=${latitude}&longitude=${longitude}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNearbyProviders(response.data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching nearby providers');
      setLoading(false);
    }
  };

  const fetchAllProviders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/providers', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAllProviders(response.data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching all providers');
      setLoading(false);
    }
  };

  const fetchProviderProducts = async (providerId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products/provider/${providerId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProducts(response.data);
    } catch (error) {
      setError('Error fetching provider products');
    }
  };

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
    fetchProviderProducts(provider._id);
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item._id === product._id);
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login first");
      return;
    }
    if (existingItem) {
      setCart(cart.map(item => 
        item._id === product._id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => 
        item._id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      ));
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const checkout = () => {
    setShowReceipt(true);
  };

  const placeOrder = async () => {
    try {
      const orderData = {
        products: cart.map(item => ({ product: item._id, quantity: item.quantity })),
        totalAmount: calculateTotal(),
        providerId: selectedProvider._id,
        paymentMode: paymentMode
      };

      const response = await axios.post('http://localhost:5000/api/orders', orderData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setOrderPlaced(true);
      setCart([]);
      setShowReceipt(false);
    } catch (error) {
      setError('Error placing order');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="container mx-auto p-6">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <div className="text-center">
            <div className="loader"></div>
            <p className="text-gray-600 mt-2">Loading...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-teal-400 to-blue-500 p-4 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-white">Customer Dashboard</h1>
        <button 
          onClick={handleLogout}
          className="bg-red-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-700 transition duration-300"
        >
          Logout
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div className="col-span-1 bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold mb-4">Nearby Providers</h2>
          {nearbyProviders.length ? (
            nearbyProviders.map(provider => (
              <div key={provider._id} className="mb-2">
                <button 
                  onClick={() => handleProviderSelect(provider)}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-300"
                >
                  {provider.name}
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No nearby providers found.</p>
          )}
        </div>

        <div className="col-span-1 bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold mb-4">All Providers</h2>
          {allProviders.length ? (
            allProviders.map(provider => (
              <div key={provider._id} className="mb-2">
                <button 
                  onClick={() => handleProviderSelect(provider)}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-300"
                >
                  {provider.name}
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No providers found.</p>
          )}
        </div>

        <div className="col-span-1 md:col-span-2 bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold mb-4">Products</h2>
          {selectedProvider ? (
            <div>
              <h3 className="text-xl font-semibold mb-2">{selectedProvider.name}</h3>
              <p className="mb-4 text-gray-700">Email: {selectedProvider.email}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.length ? (
                  products.map(product => (
                    <div key={product._id} className="p-4 border border-gray-200 rounded-lg shadow-md bg-white transition duration-300 hover:shadow-lg">
                      <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                      <p className="text-gray-600 mb-2">{product.description}</p>
                      <p className="font-semibold mb-2">Price: ${product.price}</p>
                      <button 
                                                onClick={() => addToCart(product)}
                                                className="mt-2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition duration-300"
                                              >
                                                Add to Cart
                                              </button>
                                            </div>
                                          ))
                                        ) : (
                                          <p className="text-gray-600">No products available for this provider.</p>
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-gray-600">Select a provider to see products</p>
                                  )}
                                </div>
                        
                                <div className="col-span-1 bg-white p-4 rounded-lg shadow-md border border-gray-200">
                                  <h2 className="text-2xl font-bold mb-4">Cart</h2>
                                  {cart.length ? (
                                    <>
                                      {cart.map(item => (
                                        <div key={item._id} className="mb-4 p-4 border border-gray-200 rounded-lg shadow-md bg-white">
                                          <h3 className="font-bold text-lg">{item.name}</h3>
                                          <p className="font-semibold mb-2">Price: ${item.price}</p>
                                          <div className="flex items-center mb-2">
                                            <button 
                                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                              className="bg-gray-300 px-2 py-1 rounded-lg text-gray-700"
                                            >
                                              -
                                            </button>
                                            <span className="mx-2">{item.quantity}</span>
                                            <button 
                                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                              className="bg-gray-300 px-2 py-1 rounded-lg text-gray-700"
                                            >
                                              +
                                            </button>
                                          </div>
                                          <button 
                                            onClick={() => removeFromCart(item._id)}
                                            className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded-lg transition duration-300"
                                          >
                                            Remove
                                          </button>
                                        </div>
                                      ))}
                                      <div className="font-bold text-xl mt-4">Total: ${calculateTotal()}</div>
                                      <button 
                                        onClick={checkout}
                                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mt-4 transition duration-300"
                                      >
                                        Checkout
                                      </button>
                                    </>
                                  ) : (
                                    <p className="text-gray-600">Your cart is empty.</p>
                                  )}
                                </div>
                              </div>
                        
                              {showReceipt && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                  <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
                                    <h2 className="text-2xl font-bold mb-4">Receipt</h2>
                                    {cart.map(item => (
                                      <div key={item._id} className="flex justify-between mb-2">
                                        <span>{item.name} x{item.quantity}</span>
                                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                                      </div>
                                    ))}
                                    <div className="border-t pt-2 mt-2 font-bold text-xl flex justify-between">
                                      <span>Total:</span>
                                      <span>${calculateTotal()}</span>
                                    </div>
                                    <div className="mt-4">
                                      <label className="block font-bold mb-2">Select Payment Mode:</label>
                                      <select
                                        value={paymentMode}
                                        onChange={(e) => setPaymentMode(e.target.value)}
                                        className="w-full p-2 border rounded-lg"
                                      >
                                        <option value="" disabled>Select payment mode</option>
                                        <option value="cod">Cash on Delivery</option>
                                        <option value="online">Online Payment</option>
                                      </select>
                                    </div>
                                    <button 
                                      onClick={placeOrder}
                                      className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg mt-4 transition duration-300"
                                    >
                                      Place Order
                                    </button>
                                    <button 
                                      onClick={() => setShowReceipt(false)}
                                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mt-4 transition duration-300"
                                    >
                                      Close
                                    </button>
                                  </div>
                                </div>
                              )}
                        
                              {orderPlaced && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                  <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
                                    <h2 className="text-2xl font-bold mb-4">Order Placed!</h2>
                                    <p className="mb-4">Your order has been placed successfully.</p>
                                    <button 
                                      onClick={() => setOrderPlaced(false)}
                                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-300"
                                    >
                                      Close
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        }
                        
                        export default CustomerDashboard;
                        