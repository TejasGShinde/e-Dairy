import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

function ProviderProducts() {
  const [provider, setProvider] = useState(null);
  const [products, setProducts] = useState([]);
  const [userType, setUserType] = useState('');
  const { providerId } = useParams();

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setUserType(response.data.userType);
      } catch (error) {
        console.error('Error fetching user type:', error);
      }
    };

    const fetchProviderAndProducts = async () => {
      try {
        const providerResponse = await axios.get(`http://localhost:5000/api/providers/${providerId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setProvider(providerResponse.data);

        const productsResponse = await axios.get(`http://localhost:5000/api/products/provider/${providerId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setProducts(productsResponse.data);
      } catch (error) {
        console.error('Error fetching provider and products:', error);
      }
    };

    fetchUserType();
    fetchProviderAndProducts();
  }, [providerId]);

  return (
    <div>
      <Navbar userType={userType} />
      <div className="container mx-auto p-4">
        {provider && (
          <h1 className="text-3xl font-bold mb-4">Products from {provider.name}</h1>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <div key={product._id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-bold">{product.name}</h2>
              <p>{product.description}</p>
              <p className="font-bold mt-2">Price: ${product.price}</p>
              <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProviderProducts;