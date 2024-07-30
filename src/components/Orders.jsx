import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [userType, setUserType] = useState('');
    const [userId, setUserID] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/orders/customer', {
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
                setUserID(response.data);
                if (response.data.userType === 'provider') {
                    const response = await axios.get('http://localhost:5000/api/orders/provider', {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    });
                    setOrders(response.data);
                }
            } catch (error) {
                console.error('Error fetching user type:', error);
            }
        };

        fetchOrders();
        fetchUserType();
    }, []);

    const handleConfirmOrder = async (orderId) => {
        try {
            const response = await axios.put(
                `http://localhost:5000/api/orders/confirm/${orderId}`,
                { userId, userType },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
            );
            setOrders(orders.map(order =>
                order._id === orderId ? { ...order, status: 'completed' } : order
            ));
        } catch (error) {
            console.error('Error confirming order:', error);
        }
    };

    const handleCancel = async (orderId) => {
        try {
            const response = await axios.put(
                `http://localhost:5000/api/orders/cancel/${orderId}`,
                { userId, userType },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
            );
            setOrders(orders.map(order =>
                order._id === orderId ? { ...order, status: 'cancelled' } : order
            ));
        } catch (error) {
            console.error('Error cancelling order:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 p-6">
            <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
                    <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition duration-300">Logout</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orders.map(order => (
                        <div key={order._id} className="border border-gray-200 p-4 rounded-lg bg-gradient-to-r from-white to-gray-100 shadow-md transition-transform transform hover:scale-105">
                            <h2 className="text-xl font-semibold text-gray-900">Order ID: {order._id}</h2>
                            <p className="text-gray-700">Status: <span className={`px-2 py-1 text-sm font-semibold rounded ${order.status === 'completed' ? 'bg-green-200 text-green-800' : order.status === 'cancelled' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}`}>{order.status}</span></p>
                            <p className="text-gray-700">Total Amount: <span className="font-semibold">${order.totalAmount}</span></p>
                            <div className="mt-4">
                                <h3 className="font-semibold text-gray-800">Products:</h3>
                                {order.products.map(product => (
                                    <div key={product._id} className="mt-2 border-t border-gray-300 pt-2">
                                        <p className="text-gray-600">Name: <span className="font-medium">{product.product.name}</span></p>
                                        <p className="text-gray-600">Quantity: <span className="font-medium">{product.quantity}</span></p>
                                    </div>
                                ))}
                            </div>
                            {userType === 'provider' && order.status === 'pending' && (
                                <div className="mt-4 flex space-x-2">
                                    <button
                                        onClick={() => handleConfirmOrder(order._id)}
                                        className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition duration-300"
                                    >
                                        Complete Order
                                    </button>
                                    <button
                                        onClick={() => handleCancel(order._id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition duration-300"
                                    >
                                        Cancel Order
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Orders;
