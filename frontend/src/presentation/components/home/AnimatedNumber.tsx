import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useInView } from 'react-intersection-observer'; 

interface AnimatedNumberProps {
      end: number; 
      unit: string; 
      duration?: number; 
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ end, unit, duration = 2 }) => {
      const count = useMotionValue(0); 

      const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());

      const { ref, inView } = useInView({
            triggerOnce: true, 
            threshold: 0.5,
      });

      useEffect(() => {
            let controls: { stop: () => void };

            if (inView) {
                  controls = animate(count, end, {
                        duration: duration,
                        ease: "easeOut", 
                  });
            }

            return () => {
                  if (controls) {
                        controls.stop();
                  }
            };
            
      }, [count, end, duration, inView]); 

      return (
            <div ref={ref} className="inline-flex items-end">
                  <motion.span>{rounded}</motion.span>
                  <span className='text-5xl md:text-7xl font-extrabold align-top ml-1'>{unit}</span>
            </div>
      );
};

export default AnimatedNumber;