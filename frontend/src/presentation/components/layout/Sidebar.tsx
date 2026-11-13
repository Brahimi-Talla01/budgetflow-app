import {
      LayoutDashboard,
      CreditCard,
      FolderOpen,
      BarChart3,
      MessageCircle,
      LogOut,
      Kanban
} from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../application/context/authContext';

const navItems = [
      { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
      { to: '/dashboard/transaction', label: 'Transactions', Icon: CreditCard },
      { to: '/dashboard/projet', label: 'Projets', Icon: FolderOpen },
      { to: '/dashboard/analyse', label: 'Analyses', Icon: BarChart3 },
      { to: '/dashboard/conseil', label: 'Conseils', Icon: MessageCircle },
];

const Sidebar = () => {
      const [ isOpenSidebar, setIsOpenSiderbar ] = useState<boolean>(true);
      const { logout } = useAuth();


      return (
            <div className={` ${isOpenSidebar ? "w-64": "w-15"} h-full bg-white border-r border-gray-200 flex flex-col`}>
                  
                  <div className='h-16 px-2 flex items-center gap-2 border-b border-gray-100'>
                        <button 
                              onClick={() => setIsOpenSiderbar(!isOpenSidebar)} 
                              className=' cursor-pointer p-2 rounded-full hover:bg-gray-100 transition'
                        >
                              <Kanban className=' w-5 h-5 transform -rotate-90' />
                        </button>
                        {
                              isOpenSidebar && 
                              <NavLink 
                                    to={'/dashboard'}
                                    className={'text-2xl font-bold text-primary'}
                              >
                                    BudgetFlow
                              </NavLink>
                        }
                  </div>

                  <div className='flex-1 py-6 flex flex-col overflow-y-auto'>
                        <div className=' text-sm font-medium gap-0'>
                              {navItems.map(({to, label, Icon}) => (
                                    <NavLink 
                                          key={to} 
                                          to={to} 
                                          end={to === '/dashboard'} 
                                          className={({isActive}) => `
                                                flex items-center gap-3 px-4 py-4 transition-colors
                                                ${isActive 
                                                      ? 'bg-primary-flow text-primary border-r-4 border-primary' 
                                                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                                          `}
                                    >
                                          <Icon className="w-5 h-5" />
                                          { isOpenSidebar && <span>{label}</span> }
                                    </NavLink>
                              ))}
                        </div>
                  </div>

                  <div className='p-2 border-t border-gray-200 flex items-center'>
                        <button onClick={logout} className='flex items-center gap-3 cursor-pointer text-gray-600 hover:text-red-500 px-4 py-2 transition-colors'>
                              <LogOut className='w-5 h-5' />
                              { isOpenSidebar && <span>Déconnexion</span> }
                        </button>
                  </div>
            </div>
      )
}

export default Sidebar;