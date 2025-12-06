import { Link, useNavigate, type NavigateFunction } from 'react-router-dom';
import { Button } from '../ui/Button';
import logo from '../../../assets/Icon-512.png';
import { ChevronDown, Kanban, X } from 'lucide-react'; 
import { useState } from 'react'; 
import { useAuth } from '../../../application/context/AuthContext';
import { assets } from '../../../assets/asset';


const navLinks = [
    { label: "Fonctionnalités", to: "#feature" },
    { label: "Comment ça marche", to: "#getStart" },
    { label: "Tarifs", to: "#price" },
    { label: "Faqs", to: "#faqs" },
];

const NavbarLanding = () => {
    const navigate: NavigateFunction = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user } = useAuth();

    const handleStartClick = () => {
        if (user) {
            navigate('/dashboard');
        } else {
            navigate('/login');
        }
        setIsMenuOpen(false);
    };

    return (
        <nav className='w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm'>
            <div className='max-w-7xl mx-auto h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8'>
                
                {/* Logo  */}
                <Link 
                        to={'/'} 
                        className='flex items-center gap-2'
                        onClick={() => setIsMenuOpen(false)}
                >
                    <div className='w-8 h-8'>
                        <img src={logo} alt="Logo BudgetFlow" className='w-full h-full object-cover' />
                    </div>
                    <span className='text-xl font-extrabold text-primary'>BudgetFlow</span>
                </Link>

                <ul className='hidden md:flex items-center gap-6'>
                    {navLinks.map((link) => (
                        <a 
                            key={link.to}
                            href={link.to}
                            className='text-gray-600 hover:text-primary transition-colors text-sm font-medium'
                        >
                            {link.label}
                        </a>
                    ))}
                </ul>

                {/* Boutons d'action */}
                <div className='hidden md:flex items-center gap-3'>
                    {user ? (
                        <div className='flex items-center gap-4'>
                            <div className='flex items-center gap-3 cursor-pointer'>
                                <div className='w-10 h-10 rounded-full overflow-hidden border border-gray-200'>
                                    <img src={assets.user} alt="Profile" className='w-full h-full object-cover' />
                                </div>
                                <div className='text-left hidden md:block'>
                                    <div className='flex items-center gap-2'>
                                        <p className='text-sm font-semibold text-dark'>{`${user.firstname} ${user.lastname}`}</p>
                                        <ChevronDown className='w-4 h-4 text-dark' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Button onClick={() => navigate('/login')} variant='ghost' className='text-sm font-medium hover:bg-gray-100'>
                            Connexion
                        </Button>
                    )}

                    <Button
                        className='text-sm font-medium'
                        onClick={handleStartClick}
                    >
                        {user ? 'Tableau de bord' : 'Commencer'}
                    </Button>
                </div>

                {/* Menu  */}
                <button 
                    className='md:hidden p-2 text-gray-700 hover:text-primary'
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Kanban className=' w-5 h-5 transform rotate-90' />}
                </button>
            </div>

            {/* Menu Mobile */}
            <div 
                className={`md:hidden absolute w-full bg-white shadow-lg transition-all z-30 duration-300 ${
                    isMenuOpen ? 'max-h-screen opacity-100 py-2' : 'max-h-0 opacity-0 overflow-hidden'
                }`}
            >
                <div className='flex flex-col items-center p-4 gap-4'>
                    {navLinks.map((link) => (
                         <a 
                            key={link.to}
                            href={link.to}
                            onClick={() => setIsMenuOpen(false)} 
                            className='w-full text-center py-2 text-gray-700 hover:bg-gray-50'
                        >
                            {link.label}
                        </a>
                    ))}
                    <div className='w-full h-px bg-gray-100 my-2'></div>
                    {user ? (
                        <Button 
                            className='w-full' 
                            onClick={handleStartClick}
                        >
                            Tableau de bord
                        </Button>
                        ) : (
                        <>
                            <Button 
                                variant='ghost' 
                                onClick={() => {
                                    navigate('/login');
                                    setIsMenuOpen(false);
                                }} 
                                className='w-full'
                            >
                                Connexion
                            </Button>
                            <Button 
                                className='w-full'
                                onClick={handleStartClick}
                            >
                                Commencer
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {
                isMenuOpen && (
                    <div 
                        onClick={() => setIsMenuOpen(false)} 
                        className='fixed inset-0 mt-64 w-full h-full bg-black/80 z-20'
                    >
                    </div>
                )
            }
        </nav>
    );
};

export default NavbarLanding;