import PricingCard from "./PricingCard";

export interface PricingPlan {
    title: string;
    price: number; 
    period: string;
    features: string[]; 
    isFeatured: boolean;
    buttonText: string;
}

const pricingData: PricingPlan[] = [
    {
        title: 'Gratuit',
        price: 0,
        period: '/mois',
        features: [
            'Jusqu\'à 50 transactions/mois',
            '1 projet budgétaire',
            'Graphiques basiques',
            'Application mobile',
            'Support par email standard',
        ],
        isFeatured: false,
        buttonText: 'Commencer gratuitement',
    },
    {
        title: 'Premium',
        price: 4.99,
        period: '/mois',
        features: [
            'Transactions illimitées',
            'Projets illimités',
            'Graphiques avancés et rapports',
            'Prédictions par IA',
            'Export PDF et CSV',
            'Support prioritaire 24/7',
            'Synchronisation multi-device',
        ],
        isFeatured: true,
        buttonText: 'Essayer Premium 7 jours',
    },
];

const Prices = () => {
    return (
        <section id='price' className='w-full pt-16 pb-20 lg:pt-24 lg:pb-32 scroll-mt-16 bg-light'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>

                <div className='flex flex-col items-center justify-center text-center mb-12'>
                    <h2 className='bg-primary-flow py-2 px-4 rounded-full text-sm md:text-base my-2 uppercase text-primary font-semibold tracking-wider'>
                        Tarifs
                    </h2>

                    <p className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.1] mt-3">
                        Un plan pour chaque <span className='text-primary'>besoin</span>.
                    </p>

                    <p className='text-center text-sm sm:text-lg font-medium text-gray-600 pt-3'>
                        Commencez gratuitement, évoluez quand vous voulez.
                    </p>
                </div>


                {/* Cartes */}
                <div className='flex justify-center pt-8'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full'>
                        {pricingData.map((plan, index) => (
                            <PricingCard key={index} plan={plan} />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}

export default Prices;