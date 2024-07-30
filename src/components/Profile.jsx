import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [orders, setOrders] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUserInfo(userResponse.data);

        const ordersResponse = await axios.get(`http://localhost:5000/api/orders/${userResponse.data.userType}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setOrders(ordersResponse.data);

        // Calculate total amount for providers
        if (userResponse.data.userType === 'provider') {
          const total = ordersResponse.data.reduce((sum, order) => sum + order.totalAmount, 0);
          setTotalAmount(total);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 p-6">
      <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/4 flex justify-center">
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-4xl font-bold text-gray-500 shadow-lg">
              {userInfo?.name ? userInfo.name[0] : ''}
            </div>
          </div>
          <div className="w-full md:w-3/4 mt-4 md:mt-0 md:ml-6">
            <h1 className="text-2xl font-bold text-gray-800">{userInfo?.name}</h1>
            <p className="text-gray-600">{userInfo?.email}</p>
            <div className="mt-4">
              <h2 className="text-xl font-semibold text-gray-700">Order History</h2>
              {userInfo?.userType === 'customer' ? (
                <ul className="mt-2">
                  {orders.map(order => (
                    <li key={order._id} className="border-b border-gray-200 py-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">Order #{order._id}</span>
                        <span className={`px-2 py-1 text-sm font-semibold ${order.status === 'completed' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'} rounded`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-gray-600">Total: ${order.totalAmount}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-2">
                  <h2 className="text-xl font-semibold text-gray-700">Products Sold</h2>
                  {orders.map(order => (
                    <div key={order._id} className="border-b border-gray-200 py-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">{order.products.map(product => product.name).join(', ')}</span>
                        <span className="text-gray-600">Sold: {order.products.reduce((total, product) => total + product.quantity, 0)}</span>
                      </div>
                      <p className="text-gray-600">Price: ${order.products.reduce((total, product) => total + product.price * product.quantity, 0)}</p>
                    </div>
                  ))}
                  <div className="mt-4">
                    <h2 className="text-xl font-semibold text-gray-700">Total Amount Sold</h2>
                    <p className="text-gray-600">${totalAmount}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
