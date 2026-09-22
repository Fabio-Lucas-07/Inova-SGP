import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './Navbar'; 



const Layout = () => {
  return (
    <div className="flex flex-col">
      <NavBar />
      <main >
        <Outlet />
      </main>
    </div>
  );  
};

export default Layout;