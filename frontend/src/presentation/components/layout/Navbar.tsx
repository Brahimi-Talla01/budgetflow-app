import { Bell, EllipsisVertical } from 'lucide-react'
import image from '../../../assets/enfant.jpeg'; 
import { useState } from 'react';
import NotificationComponent from './NotificationComponent';
import UserProfile from './UserProfile';
import { useAuth } from '../../../application/context/authContext';
import { getDisplayName } from '../../../domain/entities/User';

const Navbar = () => {

      const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
      const { user } = useAuth();
      
      
      return (
            <header className='w-full h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10'>
                  
                  <UserProfile
                        name={getDisplayName(user)}
                        level="Niveau Standard"
                        image={image}
                  />


                  <div className='flex items-center gap-2'>
                        
                        <button 
                              onClick={() => setIsNotificationOpen(!isNotificationOpen)} 
                              className='cursor-pointer rounded-full p-2 hover:bg-gray-100 transition'
                        >
                              <div className='relative'>
                                    <div className='absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white' />
                                    <Bell className='w-6 h-6 text-gray-500 cursor-pointer hover:text-gray-700' />
                              </div>
                        </button>

                        {isNotificationOpen && (
                              <>
                                    <NotificationComponent setIsNotificationOpen={setIsNotificationOpen} />
                              </>
                        )}

                        <button className=' cursor-pointer rounded-full p-2 hover:bg-gray-100 transition'>
                              <EllipsisVertical className=' w-5 h-5' />
                        </button>
                  </div>

            </header>
      )
}

export default Navbar