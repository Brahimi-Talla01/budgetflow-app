import { useRef, useState } from 'react';
import { Button } from '../ui/Button';
import { 
  ArrowLeft, 
  ArrowRight, 
  ShoppingBag, 
  Coffee, 
  Car, 
  Home, 
  Utensils,
  Zap,
  Wifi
} from 'lucide-react';
import RecentTransactionCard from './RecentTransactionCard';

export type RecentTransType = {
  icon: any;
  title: string;
  price: number;
  date: string;
  category: string;
}

const RecentTransaction = () => {
      const scrollContainerRef = useRef<HTMLDivElement>(null);
      const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
      const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

      // Données de transactions
      const recentTransactionData: RecentTransType[] = [
            {
                  icon: ShoppingBag,
                  title: "Courses Supermarché",
                  price: 125.50,
                  date: "Aujourd'hui",
                  category: "Alimentation"
            },
            {
                  icon: Coffee,
                  title: "Café Starbucks",
                  price: 8.50,
                  date: "Aujourd'hui",
                  category: "Loisirs"
            },
            {
                  icon: Car,
                  title: "Essence Total",
                  price: 65.00,
                  date: "Hier",
                  category: "Transport"
            },
            {
                  icon: Home,
                  title: "Loyer Appartement",
                  price: 850.00,
                  date: "Il y a 2 jours",
                  category: "Logement"
            },
            {
                  icon: Utensils,
                  title: "Restaurant",
                  price: 45.80,
                  date: "Il y a 3 jours",
                  category: "Alimentation"
            },
            {
                  icon: Zap,
                  title: "Facture Électricité",
                  price: 89.00,
                  date: "Il y a 5 jours",
                  category: "Services"
            },
            {
                  icon: Wifi,
                  title: "Abonnement Internet",
                  price: 39.99,
                  date: "Il y a 7 jours",
                  category: "Services"
            }
      ];

      // Vérifier si on peut scroller
      const checkScroll = () => {
            if (scrollContainerRef.current) {
                  const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
                  setCanScrollLeft(scrollLeft > 0);
                  setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
            }
      };

      // Scroller vers la gauche
      const scrollLeft = () => {
            if (scrollContainerRef.current) {
                  scrollContainerRef.current.scrollBy({
                        left: -320, 
                        behavior: 'smooth'
                  });
            }
      };

      // Scroller vers la droite
      const scrollRight = () => {
            if (scrollContainerRef.current) {
                  scrollContainerRef.current.scrollBy({
                        left: 320,
                        behavior: 'smooth'
                  });
            }
      };

      // Obtenir la couleur de la catégorie
      const getCategoryColor = (category: string) => {
            switch(category) {
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

                        {/* Boutons */}
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

                  {/* Conteneur  */}
                  <div 
                        ref={scrollContainerRef}
                        onScroll={checkScroll}
                        className='flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth cursor-pointer pb-2'
                        style={{
                        scrollbarWidth: 'none', 
                        msOverflowStyle: 'none', 
                  }}
                  >
                        {recentTransactionData.map((transaction, index) => (
                              <RecentTransactionCard 
                                    transaction={transaction} 
                                    index={index} 
                                    getCategoryColor={getCategoryColor}  
                              />
                        ))}
                  </div>
            </div>
      );
};

export default RecentTransaction;