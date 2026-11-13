import { UserPlus, Wallet, LineChart, type LucideIcon } from 'lucide-react'; 
import FeatureCard from './FeatureCard'; 


interface SteepType {
    title: string;
    description: string;
    icon: LucideIcon; 
}


const HowDoWork = () => {
    
      const steepDatas: SteepType[] = [
            {
                  title: '1. Créez votre compte',
                  description: 'Inscription simple et rapide. Commencez sans saisir d\'informations bancaires.',
                  icon: UserPlus 
            },
            {
                  title: '2. Saisissez vos transactions',
                  description: 'Enregistrez facilement vos revenus et dépenses, manuellement ou par importation.',
                  icon: Wallet
            },
            {
                  title: '3. Atteignez vos objectifs',
                  description: 'Visualisez vos budgets, analysez les tendances et optimisez votre épargne.',
                  icon: LineChart
            },
      ];

      return (
            <section id='getStart' className='w-full bg-gray-50 pt-16 pb-20 lg:pt-24 lg:pb-32 scroll-mt-16'>
                  <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>

                        {/* Titre */}
                        <div className='flex flex-col items-center justify-center text-center mb-16'>
                              <h2 className='bg-primary-flow py-2 px-4 rounded-full text-sm md:text-base my-2 uppercase text-primary font-semibold tracking-wider'>
                                    Comment ça marche
                              </h2>

                              <p className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.1] mt-3">
                                    Commencez en  <span className='text-primary'>3 étapes </span> simples.
                              </p>

                              <p className='text-center text-sm sm:text-lg font-medium text-gray-600 pt-3'>Prenez le contrôle de vos finances en quelques minutes.</p>
                        </div>


                        <div className='flex justify-center'>
                              
                              <div className='relative grid grid-cols-1 gap-y-12 md:grid-cols-3 md:gap-x-8 lg:gap-x-12'>
                                    
                                    <div className='absolute hidden md:block w-full h-0.5 bg-gray-200 top-1/2 left-0 -translate-y-1/2 z-0'></div>
                                    
                                    {steepDatas.map((feature, index) => (
                                          <div key={index} className='relative z-10'>
                                                <FeatureCard feature={feature} index={index} />
                                                {index < steepDatas.length - 1 && (
                                                      <div className='hidden md:block absolute w-6 h-6 bg-white border-4 border-primary rounded-full -right-12 top-1/2 transform -translate-y-1/2'></div>
                                                )}
                                          </div>
                                    ))}
                              </div>
                        </div>

                  </div>
            </section>
      )

}

export default HowDoWork;