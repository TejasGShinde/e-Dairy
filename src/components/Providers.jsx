import { useEffect, useState } from 'react';
import axios from 'axios';

const Providers = () => {
  const [providers, setProviders] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchAllProviders();
    fetchAllCustomers();
  }, []);

  const fetchAllProviders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/providers', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProviders(response.data);
    } catch (error) {
      console.error('Error fetching all providers', error);
    }
  };

  const fetchAllCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/customers', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching all customers', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-100 to-purple-300 p-6">
      <div className="container mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Providers</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {providers.map(provider => (
            <div key={provider._id} className="border border-gray-200 bg-gradient-to-r from-white to-gray-100 p-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
              <h2 className="text-xl font-semibold text-gray-900">{provider.name}</h2>
              <p className="text-gray-700">Email: {provider.email}</p>
              {provider.location && (
                <p className="text-gray-600">
                  Location: {provider.location.coordinates[0]}, {provider.location.coordinates[1]}
                </p>
              )}
            </div>
          ))}
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">Customers</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map(customer => (
            <div key={customer._id} className="border border-gray-200 bg-gradient-to-r from-white to-gray-100 p-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
              <h2 className="text-xl font-semibold text-gray-900">{customer.name}</h2>
              <p className="text-gray-700">Email: {customer.email}</p>
              {customer.location && (
                <p className="text-gray-600">
                  Location: {customer.location.coordinates[0]}, {customer.location.coordinates[1]}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Providers;
