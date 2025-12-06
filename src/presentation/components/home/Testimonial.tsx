import { assets } from '../../../assets/asset';
import TestimonialCard from './TestimonialCard';

export interface TestimonialType {
    id: number;
    name: string; 
    address: string;
    image: string; 
    rating: number;
    review: string;
}

const Testimonials = () => { 
    
      const testimonials: TestimonialType[] = [
            { 
                  id: 1, 
                  name: "Roger Fodop", 
                  address: "Yaoudé, Cameroun", 
                  image: assets.testimonial1, 
                  rating: 4, 
                  review: "BudgetFlow a transformé ma façon de gérer mon argent. Je sais enfin où vont mes dépenses et j'ai réussi à économiser 300€ le premier mois ! Simple et terriblement efficace." 
            },
            { 
                  id: 2, 
                  name: "Marc Yamessi", 
                  address: "Montréal, Canada", 
                  image: assets.testimonial2,
                  rating: 5, 
                  review: "Super outil pour suivre mes dépenses récurrentes. L'interface est intuitive et l'ajout de transactions est ultra-rapide. Un vrai gain de temps et de clarté." 
            },
            { 
                  id: 3, 
                  name: "Léa Ndogmo", 
                  address: "Abidjan, Côte d'Ivoire", 
                  image: assets.testimonial3,
                  rating: 4, 
                  review: "J'étais perdue dans mes finances. Grâce aux graphiques clairs de BudgetFlow, j'ai repris le contrôle et je respecte mes budgets sans frustration. Un indispensable !" 
            }
      ];

      return (
            <section className="flex flex-col items-center px-6 md:px-16 lg:px-24 pt-20 pb-32 bg-white">
                  <div className="flex flex-col justify-center items-center text-center">
                  
                  <h2 className='bg-primary-flow py-2 px-4 rounded-full text-sm md:text-base my-2 uppercase text-primary font-semibold tracking-wider'>
                        Témoignages
                  </h2>
                  
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.1] mt-3">
                        Ils ont repris le contrôle avec <span className='text-primary'>BudgetFlow</span>
                  </h1>
                  <p className="text-sm md:text-lg text-gray-500/90 mt-3 max-w-3xl">
                        Découvrez comment notre application a simplifié la gestion des dépenses et aidé des milliers d'utilisateurs à atteindre leurs objectifs financiers.
                  </p>
                  </div>

                  <div className="flex flex-wrap items-stretch justify-center gap-8 mt-16">
                        {testimonials.map((testimonial) => (
                              <TestimonialCard testimonial={testimonial}  />
                        ))}
                  </div>
            </section>
      );
}

export default Testimonials;