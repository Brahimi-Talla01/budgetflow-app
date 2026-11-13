import { useState } from 'react';
import { Button } from '../ui/Button';
import StyledSelect from './StyledSelect';
import BarchartComponent from './BarchartComponent';


type FinancialView = "Revenu" | "Dépense"; 

const TransactionsBar = () => {
  const [currentButton, setCurrentButton] = useState<FinancialView>("Revenu");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("last_6_months");

  return (
    <div className='bg-white mt-6 p-4 rounded-xl'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Button 
            onClick={() => setCurrentButton('Revenu')}
            variant={currentButton === 'Revenu' ? 'primary' : 'ghost'}
            size='sm'
          >
            Revenu
          </Button>

          <Button 
            onClick={() => setCurrentButton('Dépense')}
            variant={currentButton === 'Dépense' ? 'primary' : 'ghost'}
            size='sm'
          >
            Dépense
          </Button>
        </div>

        <StyledSelect onChange={setSelectedPeriod} />
      </div>

      <div className='mt-2'>
        <BarchartComponent 
          view={currentButton}
          period={selectedPeriod}
        />
      </div>
    </div>
  );
};


export default TransactionsBar;
