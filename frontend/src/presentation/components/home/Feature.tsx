import { BarChart3, BellRing, Brain, Briefcase, MonitorSmartphone, ShieldCheck, type LucideIcon } from 'lucide-react';
import FeatureCard from './FeatureCard';

interface Feature {
    title: string;
    description: string;
    icon: LucideIcon; 
}

const Feature = () => {

      const featuresData: Feature[] = [
            {
                  title: 'Multi-plateforme',
                  description: 'Accédez à vos finances depuis votre mobile, tablette ou ordinateur. Synchronisation en temps réel.',
                  icon: MonitorSmartphone 
            },
            {
                  title: 'Statistiques avancées',
                  description: 'Visualisez vos dépenses avec des graphiques interactifs et des rapports détaillés.',
                  icon: BarChart3
            },
            {
                  title: 'Gestion de projets',
                  description: 'Créez des projets budgétaires et suivez leur progression en temps réel.',
                  icon: Briefcase
            },
            {
                  title: 'Alertes intelligentes',
                  description: 'Recevez des notifications quand vous approchez de vos limites de budget.',
                  icon: BellRing
            },
            {
                  title: 'Prédictions IA',
                  description: "Intelligence artificielle pour prédire vos dépenses et optimiser votre budget.",
                  icon: Brain
            },
            {
                  title: 'Sécurité maximale',
                  description: 'Vos données sont chiffrées et protégées avec les standards bancaires.',
                  icon: ShieldCheck
            },
      ];

      return (
            <div id='feature' className='w-full pt-16 pb-20 lg:pt-24 lg:pb-32 scroll-mt-16'>
                  <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>

                        <div className=' flex items-center justify-center'>
                              <h1 className=' bg-primary-flow py-2 px-4 rounded-full text-sm md:text-base my-2 uppercase text-primary font-semibold tracking-wider'>Fonctionnalités</h1>
                        </div>

                        <h1 className=" text-2xl md:text-5xl lg:text-7xl font-bold tracking-tight text-dark mb-6 leading-[1.1] text-center">
                              Tout ce dont vous avez besoin pour gérer votre budget
                        </h1>

                        <p className='text-center text-sm sm:text-lg font-medium text-gray-500 pb-3'>Des outils puissants et intuitifs pour suivre vos finances et atteindre vos objectifs</p>

                        <div id='services' className='relative flex flex-col items-center gap-7 pt-8 md:pt-12 text-gray-700 dark:text-white'>


                              <div className='flex flex-col md:grid grid-cols-2 xl:grid-cols-3'>
                                    {featuresData.map((feature, index) => (
                                          <FeatureCard key={index} feature={feature} index={index} />
                                    ))}
                              </div>

                        </div>
                  </div>
            </div>
      )
}

export default Feature
