import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../../shared/utils/cn';
import type { PricingPlan } from './Prices';
import { Button } from '../ui/Button';
import { useAuth } from '../../../application/context/AuthContext';
import { useNavigate, type NavigateFunction } from 'react-router-dom';


interface PricingCardProps {
    plan: PricingPlan;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan }) => {
    
      const cardClasses = cn(
            "p-6 md:p-8 rounded-2xl shadow-xl transition-all duration-300 transform",
            plan.isFeatured 
                  ? "bg-primary text-white border-4 border-primary-flow scale-105" 
                  : "bg-white text-gray-900 border border-gray-200 hover:shadow-2xl hover:border-2 hover:border-primary" 
      );

      const priceClasses = cn(
            "text-5xl font-extrabold",
            plan.isFeatured ? "text-white" : "text-gray-900"
      );

      const variants = plan.isFeatured ? 'ghost' : 'primary';
      // const textBtn = plan.isFeatured ? 'Essayer gratuitement' : 'Commencer';

      const { user } = useAuth();
      const navigate: NavigateFunction = useNavigate();

      const handleStartClick = () => {
            if (user) {
                  navigate('/dashboard');
            } else {
                  navigate('/login');
            }
      };

      return (
            <div className={cardClasses}>
                  
                  <h3 className={`text-2xl font-bold mb-2 ${plan.isFeatured ? 'text-white' : 'text-primary'}`}>
                        {plan.title}
                  </h3>

                  <div className="price my-4">
                        <span className={priceClasses}>
                              {plan.price === 0 ? '0' : `${plan.price}€`}
                        </span>
                        <span className={`text-lg font-medium ${plan.isFeatured ? 'text-gray-200' : 'text-gray-500'}`}>
                              {plan.period}
                        </span>
                  </div>

                  <ul className="space-y-3 pt-4 border-t border-dashed border-opacity-30 mb-5">
                        {plan.features.map((feature, index) => (
                              <li key={index} className={`flex items-center text-sm md:text-lg md:py-1.5 ${plan.isFeatured ? 'text-gray-100' : 'text-gray-600'}`}>
                                    <Check className={`w-5 h-5 mr-3 shrink-0 ${plan.isFeatured ? 'text-white' : 'text-primary-hover'}`} />
                                    {feature}
                              </li>
                        ))}
                  </ul>

                  <Button 
                        className={`w-full ${variants === 'ghost' ? 'hover:text-dark' : ''}`}
                        variant={variants}
                        onClick={handleStartClick}
                  >
                        {/* {textBtn} */}
                        {plan.buttonText}
                  </Button>
            </div>
      );
};

export default PricingCard;