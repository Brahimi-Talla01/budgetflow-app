import { useRef, useState } from 'react';
import { Button } from '../ui/Button';
import { 
  ArrowLeft, 
  ArrowRight, 
  ShoppingBag, 
  Car, 
  Home, 
  ListOrdered,
  ServerIcon
} from 'lucide-react';
import { useExpenses } from '../../../application/context/expenseContext';
import RecentTransactionCard from './RecentTransactionCard';


const RecentTransaction = () => {
      const scrollContainerRef = useRef<HTMLDivElement>(null);
      const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
      const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

      const { expenses, loading } = useExpenses();

      if (loading) return <p>Chargement...</p>;

      // Icon selon la catégorie
      const getCategoryIcon = (category: string) => {
            switch (category) {
                  case "Alimentation": return ShoppingBag;
                  case "Transport": return Car;
                  case "Logement": return Home;
                  case "Services": return ServerIcon;
                  default: return ListOrdered;
            }
      };

      // Parser les données API 
      const parsedExpenses = expenses.map((exp) => ({
            title: exp.description || exp.category,
            price: exp.amount,
            date: new Date(exp.date).toLocaleDateString("fr-FR"),
            category: exp.category,
            icon: getCategoryIcon(exp.category)
      }));


      // Scroll handlers
      const checkScroll = () => {
            if (scrollContainerRef.current) {
                  const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
                  setCanScrollLeft(scrollLeft > 0);
                  setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
            }
      };

      const scrollLeft = () => {
            scrollContainerRef.current?.scrollBy({ left: -320, behavior: "smooth" });
      };

      const scrollRight = () => {
            scrollContainerRef.current?.scrollBy({ left: 320, behavior: "smooth" });
      };

      // Couleur de catégorie
      const getCategoryColor = (category: string) => {
            switch (category) {
                  case 'Alimentation': return 'bg-green-100 text-green-700';
                  case 'Transport': return 'bg-primary-30 text-primary';
                  case 'Logement': return 'bg-purple-100 text-purple-700';
                  case 'Loisirs': return 'bg-orange-100 text-orange-700';
                  case 'Services': return 'bg-cyan-100 text-cyan-700';
                  default: return 'bg-gray-100 text-gray-700';
            }
      };

      return (
            <div className='bg-white mt-4 p-4 md:p-6 rounded-xl'>
                  
                  {/* Header */}
                  <div className='flex items-center justify-between mb-4'>
                        <h1 className='text-xl md:text-2xl font-bold text-dark'>
                              Transactions récentes
                        </h1>

                        <div className='flex items-center gap-2'>
                              <Button 
                                    variant='ghost'
                                    size='sm'
                                    onClick={scrollLeft}
                                    disabled={!canScrollLeft}
                                    className={`transition-opacity ${!canScrollLeft ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                              >
                                    <ArrowLeft className='w-5 h-5' />
                              </Button>

                              <Button 
                                    variant='ghost'
                                    size='sm'
                                    onClick={scrollRight}
                                    disabled={!canScrollRight}
                                    className={`transition-opacity ${!canScrollRight ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                              >
                                    <ArrowRight className='w-5 h-5' />
                              </Button>
                        </div>
                  </div>

                  {/* Scroll container */}
                  <div 
                        ref={scrollContainerRef}
                        onScroll={checkScroll}
                        className='flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth cursor-pointer pb-2'
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                        {parsedExpenses.map((expense, index) => (
                              <RecentTransactionCard 
                                    key={index}
                                    expense={expense}
                                    getCategoryColor={getCategoryColor}
                              />
                        ))}
                  </div>
            </div>
      )

};

export default RecentTransaction;
