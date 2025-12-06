import { Smartphone, Star, Shield, Zap, Users } from 'lucide-react';
import { assets } from '../../../assets/asset';

const MobileApp = () => {

      const features = [
            {
                  icon: <Zap className="w-5 h-5" />,
                  title: "Ultra Rapide",
                  description: "Performance optimale sur tous les appareils"
            },
            {
                  icon: <Shield className="w-5 h-5" />,
                  title: "100% Sécurisé",
                  description: "Vos données sont cryptées et protégées"
            },
            {
                  icon: <Users className="w-5 h-5" />,
                  title: "Interface Intuitive",
                  description: "Design moderne et facile à utiliser"
            }
      ];

      return (
            <section className="w-full pt-16 pb-20 lg:pt-24 lg:pb-32 bg-dark ">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  
                        {/* Section Title */}
                        <div className="text-center mb-16">
                              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
                                    <Smartphone className="w-4 h-4" />
                                    <span className="text-sm font-semibold uppercase">Application Mobile</span>
                              </div>

                              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                    Bientôt disponible sur Android
                              </h2>
                              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                                    Téléchargez notre application et profitez d'une expérience optimale où que vous soyez
                              </p>
                        </div>

                        {/* Content Grid */}
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                        
                        {/* Left Section - Description & Features */}
                        <div className="space-y-8">
                              
                              {/* Main Description */}
                              <div>
                                    <h3 className="text-3xl font-bold text-white/80 mb-4">
                                          Tout ce dont vous avez besoin, dans votre poche
                                    </h3>
                                    <p className=" text-gray-300 leading-relaxed">
                                          Notre application mobile vous offre une expérience fluide et intuitive. 
                                          Accédez à tous vos services préférés en quelques clics, où que vous soyez.
                                    </p>
                              </div>

                              {/* Features List */}
                              <div className="space-y-4">
                                    {features.map((feature, index) => (
                                          <div 
                                                key={index}
                                                className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl hover:shadow-lg transition-shadow"
                                          >
                                                <div className="shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                                      {feature.icon}
                                                </div>
                                                <div>
                                                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                                            {feature.title}
                                                      </h4>
                                                      <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {feature.description}
                                                      </p>
                                                </div>
                                          </div>
                                    ))}
                              </div>

                              {/* Download Buttons */}
                              <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">

                                    <button className="flex items-center gap-3 px-6 py-3 cursor-pointer bg-black text-white rounded-xl hover:bg-gray-800 transition-colors">
                                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                                          </svg>
                                          <div className="text-left">
                                                <div className="text-xs">Bientôt disponible sur</div>
                                                <div className="text-sm font-semibold">Google Play</div>
                                          </div>
                                    </button>
                              </div>

                              {/* Rating Stars */}
                              <div className="flex items-center gap-2 pt-2">
                                    <div className="flex text-yellow-400">
                                          {[...Array(4)].map((_, i) => (
                                                <Star key={i} className="w-5 h-5 fill-current" />
                                          ))}
                                    </div>
                                    <span className="text-sm text-gray-400">
                                          Note moyenne des personnes qui l'ont essayé!
                                    </span>
                              </div>
                        </div>

                        {/* Right Section */}
                        <div className="relative lg:order-last order-first">
                              

                              <div className="relative mx-auto max-w-sm">

                                    
                                    {/* Phone Frame */}
                                    <div className="relative z-10 bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
                                          {/* Notch */}
                                          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gray-900 z-20"></div>
                                    
                                          {/* Screen */}
                                          <div className="bg-white rounded-[2.5rem] overflow-hidden aspect-9/19">                                             
                                                <img 
                                                      src={assets.budgetflow}
                                                      alt="App Screenshot"
                                                      className="w-full h-full object-cover"
                                                /> 
                                          </div>

                                          {/* Home Indicator */}
                                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-white/30 rounded-full"></div>
                                    </div>
                              </div>
                        </div>

                        </div>
                  </div>
            </section>
      );
};

export default MobileApp;