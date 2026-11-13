import { useNavigate, type NavigateFunction } from 'react-router-dom';
import { useAuth } from '../../../application/context/AuthContext';
import { Button } from '../ui/Button';


const CtaSection = () => {

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
            <div className='w-full pt-16 pb-20 lg:pt-24 lg:pb-32'>

                  <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>

                        <h1 className=" text-2xl md:text-5xl font-bold tracking-tight text-dark mb-6 leading-[1.1] text-center">
                              Prêt à prendre le contrôle de vos finances ?
                        </h1>

                        <p className='text-center text-sm sm:text-lg font-medium text-gray-500 pb-6'>Rejoignez des milliers d'utilisateurs qui gèrent déjà leur budget avec BudgetFlow</p>

                        <div className='flex items-center justify-center gap-6'>
                              <Button onClick={handleStartClick} variant='primary'>
                                    {user ? "Voir votre dashboard " : "Commencer gratuitement"}
                              </Button>
                              <Button variant='ghost' className='hover:text-dark'>
                                    Voir une démo
                              </Button>
                        </div>

                  </div>
                  
            </div>
      )
}

export default CtaSection;
