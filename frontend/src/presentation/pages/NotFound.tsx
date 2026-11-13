import { ArrowLeft, Home } from 'lucide-react';
import { useNavigate, type NavigateFunction } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const NotFound = () => {
      const navigate: NavigateFunction = useNavigate() ;

      const handleGoHome = () => {
            navigate('/');
      };

      return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
                  <div className="text-center max-w-md">
                        <div className="flex justify-center mb-6">
                              <div className="relative">
                                    <h1 className="text-9xl font-bold text-primary opacity-20">404</h1>
                              </div>
                        </div>

                        <h2 className="text-2xl font-medium text-onBackground mb-2">Page introuvable</h2>
                        <p className="text-onBackground/70 mb-8">
                              La page que vous recherchez n'existe pas. Nous allons vous y ramener !
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                              <Button
                                    variant="primary"
                                    icon={<ArrowLeft className='text-gray-200'/>}
                                    iconPosition="left"
                                    onClick={() => window.history?.back()}
                              >
                                    Retourner
                              </Button>

                              <Button
                                    variant="ghost"
                                    icon={<Home className='text-gray-200'/>}
                                    iconPosition="left"
                                    onClick={handleGoHome}
                              >
                                    Retour à la page d'acceuil
                              </Button>
                        </div>
                  </div>
            </div>
      );
};

export default NotFound;
