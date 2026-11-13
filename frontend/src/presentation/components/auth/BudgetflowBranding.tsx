import { FileText, Users } from 'lucide-react';
import { assets } from '../../../assets/asset';

const BudgetflowBranding = () => {
  return (
    <div className="text-center space-y-4 flex-col md:flex md:justify-between">
            {/* BudgetFlow Logo */}
            <div className="md:flex items-center justify-center space-x-3">
                  <div className='flex items-center justify-center gap-2'>
                    <div className='w-8 h-8'>
                        <img src={assets.logo} alt="Logo BudgetFlow" className='w-full h-full object-cover' />
                    </div>
                    <span className='text-2xl font-extrabold text-primary'>BudgetFlow</span>
                  </div>

                  <div className="text-left">
                        <p className="text-lg text-muted-foreground font-body">
                              Gestion des dépenses personnelles
                        </p>
                  </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground font-caption">
                  <div className="flex text-sm items-center space-x-1">
                        <Users className='text-gray-500 w-6 h-6' />
                        <span>5,00+ utilisateurs</span>
                  </div>
                  <div className="flex text-sm items-center space-x-1">
                        <FileText className='text-gray-500 w-6 h-6' />
                        <span>100k+ de budget gérer</span>
                  </div>
            </div>
    </div>
  );
};

export default BudgetflowBranding;