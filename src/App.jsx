import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import ProviderDashboard from './components/ProviderDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import ProviderProducts from './components/ProviderProducts';
import Orders from './components/Orders';
import Profile from './components/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProviderDashboard />} />
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/provider/:providerId" element={<ProviderProducts />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;