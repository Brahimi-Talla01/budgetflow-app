import { Plus } from "lucide-react";
import { Button } from "../ui/Button";
import { Activity } from "react";
import TransactionModal from "../transaction/TransactionModal";

interface HeaderProps {
      isModalOpen: boolean;
      setIsModalOpen: (open: boolean) => void;
}

const EmptyStateMostExpense: React.FC<HeaderProps> = ({ isModalOpen, setIsModalOpen }) => {

      const handleSubmit = () => {
            console.log("Submit data");
      }

      return (
            <div className="flex flex-col items-center justify-center py-8 opacity-70">
                  <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                        <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              fill="none" viewBox="0 0 24 24" 
                              strokeWidth={1.5} stroke="currentColor"
                              className="w-8 h-8 text-gray-400"
                        >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M3 9h18M9 3v6" />
                        </svg>
                  </div>

                  <p className="text-sm text-gray-500 mb-6">
                        Aucune dépense enregistrée pour le moment.
                  </p>

                  <Button 
                        icon={<Plus className='w-5 h-5 font-bold' />} 
                        variant='primary'
                        size="sm"
                        onClick={() => setIsModalOpen(true)}
                  >
                        Ajouter une dépense
                  </Button>

                  {/* Modal */}
                  <Activity mode={isModalOpen ? 'visible' : 'hidden' }>
                        <TransactionModal 
                              isOpen={isModalOpen} 
                              onClose={() => setIsModalOpen(false)}
                              onSubmit={handleSubmit} 
                        />
                  </Activity>
            </div>
      );
};

export default EmptyStateMostExpense;


