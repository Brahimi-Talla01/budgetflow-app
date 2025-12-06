import React, { useState } from 'react'
import type { TestimonialType } from './Testimonial';
import { motion, type Variants } from 'framer-motion'; 


interface TestimonialCardProps {
    testimonial: TestimonialType;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {

      const [visible, setVisible] = useState(false);


      const handleMouseEnter = () => setVisible(true);
      const handleMouseLeave = () => setVisible(false);

      const cardVariants: Variants = {
            hidden: { opacity: 0, y: 50, scale: 0.95 },
            visible: { 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  transition: { 
                        duration: 0.6, 
                        delay: testimonial.id * 0.15, 
                        ease: [0.17, 0.67, 0.83, 0.67], 
                  } 
            },
      };

      const Star = ({ filled }: { filled: boolean }) => (
            <svg className="w-4 h-4 text-yellow-400" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 17.25l-6.16 3.73 1.64-7.03L2.5 9.77l7.19-.61L12 2.5l2.31 6.66 7.19.61-5 4.18 1.64 7.03z" />
            </svg>
      );

      return (
            <motion.div 
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  key={testimonial.id} 
                  variants={cardVariants} 
                  initial="hidden" 
                  whileInView="visible" 
                  viewport={{ once: true, amount: 0.4 }}
                  className="bg-white p-6 rounded-2xl shadow-xl max-w-xs flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300"
            >

                  <div 
                        className={`pointer-events-none transition-all duration-300 ease-out ${
                              visible ? 'opacity-40' : 'opacity-0'
                        }`}
                  />

                  <p className="text-gray-400 text-lg italic max-w-90 mb-6">
                        “  {testimonial.review}  ”
                  </p>
                  
                  <div>
                        <div className="flex items-center gap-1 mb-3">
                              {Array(5).fill(0).map((_, index) => (
                                    <Star key={index} filled={testimonial.rating > index} />
                              ))}
                        </div>
                        
                        <div className="flex items-center gap-3 mt-3">
                              <img 
                                    className="w-12 h-12 rounded-full object-cover border-2 border-primary-flow" 
                                    src={testimonial.image} 
                                    alt={testimonial.name} 
                              />
                              <div>
                                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                                    <p className="text-sm text-gray-500">{testimonial.address}</p>
                              </div>
                        </div>
                  </div>
            </motion.div >
      )
}

export default TestimonialCard
