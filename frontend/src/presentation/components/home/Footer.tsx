import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Twitter } from 'lucide-react';
import { assets, footer_data } from '../../../assets/asset';


const Footer = () => {

    return (
        <footer className='bg-dark'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex flex-col md:flex-row items-start justify-between gap-10 py-16 border-b border-gray-700 text-gray-400'>

                    <div>
                        {/* Logo  */}
                        <Link 
                              to={'/'} 
                              className='flex items-center gap-2'
                        >
                              <div className='w-8 h-8'>
                                    <img src={assets.logo} alt="Logo BudgetFlow" className='w-full h-full object-cover' />
                              </div>
                              <span className='text-xl font-extrabold text-primary'>BudgetFlow</span>
                        </Link>
                        
                        <p className='max-w-xs mt-6 text-base'>
                            Reprenez le contrôle de vos finances. BudgetFlow vous offre les outils intelligents pour budgétiser, suivre et épargner sans effort.
                        </p>
                        
                        <div className="flex space-x-4 mt-6">
                            <a href="#" aria-label="Lien Instagram" className="text-gray-400 hover:text-primary transition-colors duration-200">
                                <Instagram className="w-6 h-6" />
                            </a>
                            <a href="#" aria-label="Lien Twitter" className="text-gray-400 hover:text-primary transition-colors duration-200">
                                <Twitter className="w-6 h-6" />
                            </a>
                            <a href="#" aria-label="Lien LinkedIn" className="text-gray-400 hover:text-primary transition-colors duration-200">
                                <Linkedin className="w-6 h-6" />
                            </a>
                        </div>
                    </div>

                    <div className='grid grid-cols-2 sm:grid-cols-3 gap-8 md:w-2/3 lg:w-1/2 mt-8 md:mt-0'>
                        {footer_data.map((section, index) => (
                            <div key={index} className='flex flex-col'>
                                <h3 className='font-bold text-lg text-white mb-4'>{section.title}</h3>
                                <ul className='text-base space-y-3'>
                                    {section.links.map((link, id) => (
                                        <li key={id}>
                                            <a 
                                                href={link.url} 
                                                className='flex items-center hover:text-white transition duration-200'
                                            >
                                                {link.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <p className='py-6 text-center text-sm text-gray-500'>
                    &copy; {new Date().getFullYear()} BudgetFlow. Tous droits réservés.
                </p>
            </div>
        </footer>
    )
}

export default Footer;