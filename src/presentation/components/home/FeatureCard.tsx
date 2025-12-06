import { useCallback, useRef, useState } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import type Feature from './Feature';
import { motion, type Variants } from 'framer-motion'; 

interface FeatureCardProps {
    feature: Feature;
    index: number; 
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, index }) => {
      const [position, setPosition] = useState({ x: 0, y: 0 });
      const [visible, setVisible] = useState(false);
      const divRef = useRef<HTMLDivElement>(null);
      const IconComponent = feature.icon;
      
      const handleMouseMove = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
            if (!divRef.current) return;
            
            const bounds = divRef.current.getBoundingClientRect();
            setPosition({
                  x: e.clientX - bounds.left,
                  y: e.clientY - bounds.top
            });
      }, []);

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
                        delay: index * 0.15, 
                        ease: [0.17, 0.67, 0.83, 0.67], 
                  } 
            },
      };


      return (
            <motion.div 
                  className='relative overflow-hidden max-w-lg m-2 rounded-xl border border-gray-200 shadow-2xl shadow-gray-100 cursor-pointer' 
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave} 
                  ref={divRef}
                  onMouseMove={handleMouseMove}
                  
                  variants={cardVariants} 
                  initial="hidden" 
                  whileInView="visible" 
                  viewport={{ once: true, amount: 0.4 }}
            >
                  
                  <div 
                        className={`pointer-events-none bg-linear-to-r from-primary via-primary-hover to-primary-flow w-[300px] h-[300px] absolute z-0 transition-all duration-300 ease-out ${
                              visible ? 'opacity-40' : 'opacity-0'
                        }`}
                        style={{
                              top: position.y - 100,
                              left: position.x - 100,
                              borderRadius: '50%',
                              filter: 'blur(40px)',
                        }}
                  />

                  <div className='flex items-center gap-4 md:gap-10 p-4 md:p-8 hover:p-7.5 hover:m-0.5 transition-all rounded-[10px] bg-white/90 backdrop-blur-sm z-10 relative h-full'>
                  
                        <div className=' border-8 border-gray-100 rounded-full shrink-0 md:p-4 p-3'>
                              <IconComponent className='w-6 h-6 md:w-8 md:h-8 text-primary' />
                        </div>
                        
                        <div className='flex-1'>
                              <h3 className='font-bold text-gray-900 text-xl '>{feature.title}</h3>
                              <p className='text-sm mt-2 text-gray-600'>{feature.description}</p>
                        </div>

                  </div>
            </motion.div>
      );
}

export default FeatureCard;
