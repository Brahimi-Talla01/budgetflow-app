import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import RegisterPage from '../../pages/auth/RegisterPage';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  const [user] = useState<boolean>(true);

  if (!user) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <RegisterPage />
      </div>
    );
  }

  return (
    <div className='flex h-screen w-full bg-[#F4F7FB] overflow-hidden'>
      
      <Sidebar />

      <div className='flex-1 flex flex-col h-full'>
        
        <Navbar />

        <main className='flex-1 overflow-y-auto p-6'>
           <Outlet />
        </main>
        
      </div>

    </div>
  );
}

export default Layout;