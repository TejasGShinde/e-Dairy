import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import CustomerDashboard from './CustomerDashboard';
import ProviderDashboard from './ProviderDashboard';

function Home() {
  const [userType, setUserType] = useState('');
  const [providers, setProviders] = useState([]);

  useEffect(() => {
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

    const fetchProviders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/providers', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setProviders(response.data);
      } catch (error) {
        console.error('Error fetching providers:', error);
      }
    };

    fetchUserType();
    fetchProviders();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <Navbar userType={userType} />
      <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center animate-fade-in">Welcome to DairyDash</h1>
        {userType === 'customer' && (
          <div className="animate-slide-up">
            <CustomerDashboard />
          </div>
        )}
        {userType === 'provider' && (
          <div className="animate-slide-up">
            <ProviderDashboard />
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
