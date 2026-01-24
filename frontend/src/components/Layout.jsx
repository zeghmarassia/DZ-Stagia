import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children, showNavbar = true }) => {
  return (
    <div className="min-h-screen bg-white">
      {showNavbar && <Navbar />}
      <main>{children}</main>
    </div>
  );
};

export default Layout;