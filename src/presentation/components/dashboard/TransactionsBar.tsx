import { useState } from 'react';
import { Button } from '../ui/Button';
import BarchartComponent from './BarchartComponent';
import StyledSelect from './StyledSelect';


type FinancialView = "Revenu" | "Dépense"; 

const TransactionsBar = () => {

      const [currentButton, setCurrentButton] = useState<FinancialView>("Revenu");

      const handleCurrentBtn = (value: FinancialView) => {
            setCurrentButton(value);
      };



      return (
            <div className='bg-white mt-6 p-4 rounded-xl'>
                  <div className='flex items-center justify-between'>

                        <div className='flex items-center gap-2'>
                              <Button 
                                    onClick={() => handleCurrentBtn('Revenu')}
                                    variant={`${currentButton === 'Revenu' ? 'primary' : 'ghost'}`}
                                    size='sm'
                              >
                                    Revenu
                              </Button>
                              <Button 
                                    variant={`${currentButton === 'Dépense' ? 'primary' : 'ghost'}`}
                                    size='sm'
                                    onClick={() => handleCurrentBtn('Dépense')}
                              >
                                    Dépense
                              </Button>
                        </div>

                        {/* Filtrer les données pour afficher dans le graphe */}
                        <StyledSelect />

                  </div>

                  {/* Graph */}
                  <div className='mt-2'>
                        <BarchartComponent />
                  </div>
            </div>
      )
}

export default TransactionsBar;
