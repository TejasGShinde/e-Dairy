import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ userType }) {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">DairyDash</Link>
        <div>
          <Link to="/" className="text-white mx-2">Home</Link>
          {userType === 'customer' && (
            <>
              <Link to="/providers" className="text-white mx-2">Providers</Link>
              <Link to="/orders" className="text-white mx-2">My Orders</Link>
            </>
          )}
          {userType === 'provider' && (
            <>
              <Link to="/dashboard" className="text-white mx-2">Dashboard</Link>
              <Link to="/orders" className="text-white mx-2">Orders</Link>
            </>
          )}
          <Link to="/profile" className="text-white mx-2">Profile</Link>
          <button onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }} className="text-white mx-2">Logout</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;