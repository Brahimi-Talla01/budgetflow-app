import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { assets } from '../../../assets/asset';

const FAQSection = () => {
      
      const [openIndex, setOpenIndex] = useState<number | null>(null);

      const faqs = [
            {
                  id: 1,
                  question: "Est-ce que BudgetFlow est vraiment gratuit ?",
                  answer: "Oui ! Vous pouvez utiliser notre plan 'Gratuit' indéfiniment. Il vous donne accès aux fonctionnalités essentielles pour la gestion quotidienne de vos dépenses. Vous n'avez besoin de passer à Premium que si vous souhaitez des analyses avancées ou une gestion illimitée de projets.",
            },
            {
                  id: 2,
                  question: "Comment BudgetFlow sécurise-t-il mes données financières ?",
                  answer: "La sécurité est notre priorité. Toutes vos données sont chiffrées (cryptées) en transit et au repos (stockage). Nous n'avons jamais accès à vos identifiants bancaires, car nous nous connectons via des agrégateurs sécurisés de niveau bancaire (si l'option de synchronisation est activée).",
            },
            {
                  id: 3,
                  question: "Puis-je fixer des objectifs d'épargne et des budgets ?",
                  answer: "Absolument. BudgetFlow vous permet de créer des enveloppes budgétaires personnalisées pour chaque catégorie (loyer, nourriture, loisirs) et de définir des objectifs d'épargne à court ou long terme. L'application vous alerte en temps réel si vous dépassez une limite.",
            },
            {
                  id: 4,
                  question: "Comment ajouter mes transactions manuellement ou automatiquement ?",
                  answer: "Vous pouvez ajouter une dépense en quelques secondes via notre interface mobile. Pour l'automatisation, vous pouvez synchroniser vos comptes bancaires. BudgetFlow catégorise automatiquement la majorité de vos transactions pour vous simplifier la vie.",
            },
      ];

      const toggleFaq = (index: number | null) => {
            setOpenIndex(openIndex === index ? null : index);
      };

      return (
            <section id="faqs" className="md:py-20 lg:py-32 bg-gray-50 scroll-mt-16">
                  
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start justify-between gap-12">
                        
                        <div className="md:w-5/12 sticky h-20 w-full md:h-120 md:top-20">
                              <img
                                    className="w-full h-full rounded-2xl shadow-xl mt-6 object-cover aspect-4/3"
                                    src={assets.faq}
                                    alt="Illustration de support client"
                              />
                        </div>

                        <div className="md:w-7/12 w-full md:mt-0">

                              <p className="text-primary text-sm font-semibold uppercase tracking-wider">FAQs</p>
                              <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mt-2">
                                    Vous avez des questions ? Nous avons les réponses.
                              </h1>
                              <p className="text-base text-slate-600 mt-4 pb-6">
                                    Tout ce que vous devez savoir sur la gestion des dépenses, la sécurité des données et le fonctionnement de BudgetFlow.
                              </p>

                              {/* Faqs */}
                              {faqs.map((faq, index) => (
                                    <div 
                                          className="border-b border-slate-200 py-5 cursor-pointer" 
                                          key={index} 
                                          onClick={() => toggleFaq(index)}
                                    >
                                          <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold text-gray-800">
                                                      {faq.question}
                                                </h3>
                                                <ChevronDown 
                                                      className={`w-5 h-5 text-primary transition-transform duration-300 ${
                                                      openIndex === index ? "rotate-180" : "rotate-0"
                                                      }`}
                                                />
                                          </div>
                                          
                                          <p className={`
                                                text-base text-slate-600 overflow-hidden transition-all duration-500 ease-in-out
                                                ${openIndex === index 
                                                      ? "opacity-100 max-h-[500px] pt-3" 
                                                      : "opacity-0 max-h-0 pt-0"
                                                }
                                          `}>
                                                {faq.answer}
                                          </p>
                                    </div>
                              ))}
                        </div>
                  </div>
            </section>
      );
};

export default FAQSection;