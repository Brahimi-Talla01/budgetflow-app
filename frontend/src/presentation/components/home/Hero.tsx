import { Button } from "../ui/Button"; 
import groupeProfile from '../../../assets/group_profile.png'; 
import expense from '../../../assets/expense.png'; 
import { ArrowRight, TrendingUp, ShieldCheck } from 'lucide-react'; 
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { useAuth } from "../../../application/context/authContext";

const Hero = () => {

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
            <section className="relative overflow-hidden bg-white pt-16 pb-20 lg:pt-24 lg:pb-32">
                  
                  {/* Background */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
                        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-flow rounded-full blur-3xl opacity-60" />
                        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary-flow rounded-full blur-3xl opacity-60" />
                  </div>

                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

                              {/* --- Left section*/}
                              <div className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">

                                    <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-dark mb-6 leading-[1.1]">
                                          Maîtrisez vos dépenses, <br />
                                          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-30 to-primary">
                                                sans effort.
                                          </span>
                                    </h1>
                                    
                                    <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
                                          BudgetFlow synchronise vos revenus, catégorise vos dépenses et vous aide à gérer vos projets intelligemment. Rejoignez la révolution.
                                    </p>

                                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-10">
                                          <Button onClick={handleStartClick} className="w-full sm:w-auto text-lg shadow-xl shadow-primary-flow transition-all duration-300 ">
                                                <span className="flex items-center gap-2">
                                                      {user ? "Voir votre dashboard " : "Essayer Gratuitement"}
                                                      <ArrowRight className="ml-2 w-5 h-5" />
                                                </span>
                                          </Button>
                                          
                                          <button className="text-gray-600 cursor-pointer font-medium hover:text-dark px-6 py-3 transition-colors">
                                                Voir la démo
                                          </button>

                                    </div>

                                    {/* Social Proof */}
                                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                                          <div className="flex -space-x-3">
                                                <img className="h-12 w-auto object-contain drop-shadow-sm" src={groupeProfile} alt="Utilisateurs satisfaits" />
                                          </div>
                                          <div className="text-left">
                                                <div className="flex items-center gap-1">
                                                      {[...Array(5)].map((_, i) => (
                                                            <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                                      ))}
                                                </div>
                                                <p className="text-sm font-medium text-gray-700">
                                                      <span className="font-bold text-gray-900">50+</span> Utilisateurs actifs
                                                </p>
                                          </div>
                                    </div>
                              </div>

                              {/* --- Right section */}
                              <div className="relative mt-12 lg:mt-0 lg:h-[600px] w-full flex items-center justify-center perspective-1000">
                                    
                                    {/* Carte Principale  */}
                                    <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-indigo-500/10 border border-gray-100 overflow-hidden transform transition-transform hover:scale-[1.02] duration-500 z-10">
                                          {/* Header  */}
                                          <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">BudgetFlow</div>
                                          </div>
                                          
                                          {/* Body App */}
                                          <div className="p-8">
                                                <p className="text-sm text-gray-500 mb-1">Total des dépenses</p>
                                                <h3 className="text-4xl font-bold text-gray-900 mb-6">$4,500.00</h3>
                                                
                                                {/* Fake Chart */}
                                                <div className="flex items-center justify-center">
                                                      <div className="h-40 w-40 mb-8">
                                                            <img src={expense} alt="Chart" className="w-full h-full" />
                                                      </div>
                                                </div>

                                                {/* Liste dépenses */}
                                                <div className="space-y-4">
                                                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                                                      <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                                                  <TrendingUp className="w-5 h-5 text-primary" />
                                                            </div>
                                                            <div>
                                                                  <p className="font-semibold text-gray-900 text-sm">Revenus</p>
                                                                  <p className="text-xs text-gray-500">Aujourd'hui, 14:00</p>
                                                            </div>
                                                      </div>
                                                      <span className="font-bold text-green-600 text-sm">+$450.00</span>
                                                      </div>
                                                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                                                      <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                                                  <ShieldCheck className="w-5 h-5 text-orange-500" />
                                                            </div>
                                                            <div>
                                                                  <p className="font-semibold text-gray-900 text-sm">Dépenses</p>
                                                                  <p className="text-xs text-gray-500">Hier, 09:30</p>
                                                            </div>
                                                      </div>
                                                      <span className="font-bold text-gray-900 text-sm">-$120.00</span>
                                                      </div>
                                                </div>
                                          </div>
                                    </div>

                              </div>

                        </div>
                  </div>
            </section>
      )
}

export default Hero