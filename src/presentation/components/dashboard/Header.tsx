import { Activity, useState } from 'react';
import { Button } from '../ui/Button';
import { Download, Plus } from 'lucide-react';
import TransactionModal from '../transaction/TransactionModal';

const Header = () => {
      const [isModalOpen, setIsModalOpen] = useState(false);

      const handleSubmit = () => {
            console.log("Submit data");
      }

      return (
            <>
                  <div className='flex items-center justify-between'>
                        <div className='flex-1'>
                              <h1 className='font-bold text-xl md:text-3xl text-dark'>Tableau de bord</h1>
                              <p className='text-sm mt-2 text-gray-600'>Vue d'ensemble de vos finances</p>
                        </div>

                        <div className='flex items-center gap-2'>
                              <Button 
                                    icon={<Download className='w-5 h-5' />} 
                                    variant='ghost'
                              >
                                    Exporter vos données
                              </Button>
                              <Button 
                                    icon={<Plus className='w-5 h-5 font-bold' />} 
                                    variant='primary'
                                    onClick={() => setIsModalOpen(true)}
                              >
                                    Transactions
                              </Button>
                        </div>
                  </div>

                  {/* Modal */}
                  <Activity mode={isModalOpen ? 'visible' : 'hidden' }>
                        <TransactionModal 
                              isOpen={isModalOpen} 
                              onClose={() => setIsModalOpen(false)}
                              onSubmit={handleSubmit} 
                        />
                  </Activity>
                  {/* {isModalOpen && (
                        <TransactionModal 
                              isOpen={isModalOpen} 
                              onClose={() => setIsModalOpen(false)} 
                        />
                  )} */}
            </>
      );
};


export default Header;
