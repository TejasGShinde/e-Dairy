import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [userType, setUserType] = useState('');
  const [isProvider, setIsProvider] = useState(false);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/orders/${userType}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    const fetchUserType = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/user-type', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setUserType(response.data.userType);
      } catch (error) {
        console.error('Error fetching user type:', error);
      }
    };
    const confirmOrder = async (orderId) => {
        try {
          const response = await axios.put(`http://localhost:5000/api/orders/confirm/${orderId}`, {}, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          // Update the order status in the state
          setOrders(orders.map(order => order._id === orderId ? { ...order, status: 'confirmed' } : order));
        } catch (error) {
          console.error('Error confirming order', error);
        }
      };
      confirmOrder();
    fetchUserType();
    fetchOrders();
  }, [userType]);

  return (
    <div className="container mx-auto p-4">
    <h1 className="text-3xl font-bold mb-4">Orders</h1>
    <div className="grid grid-cols-1 gap-6">
      {orders.map(order => (
        <div key={order._id} className="p-4 border rounded shadow-md">
          <h2 className="text-2xl font-bold mb-2">Order ID: {order._id}</h2>
          <p className="mb-2">Customer: {order.customer.name}</p>
          <p className="mb-2">Total Amount: ${order.totalAmount}</p>
          <p className="mb-2">Status: {order.status}</p>
          <div className="mb-2">
            <h3 className="text-xl font-semibold">Products:</h3>
            <ul>
              {order.products.map(product => (
                <li key={product.product._id}>{product.product.name} x {product.quantity}</li>
              ))}
            </ul>
          </div>
          {isProvider && order.status === 'pending' && (
            <button 
              onClick={() => confirmOrder(order._id)}
              className="bg-green-500 text-white p-2 rounded mt-2"
            >
              Confirm Order
            </button>
          )}
        </div>
      ))}
    </div>
  </div>
  );
}

export default Orders;
