import React from 'react';
import { motion } from 'motion/react';
import { InstrumentBezel } from './InstrumentBezel';

interface AttitudeIndicatorProps {
  pitch: number; // degrees
  roll: number;  // degrees
}

export function AttitudeIndicator({ pitch, roll }: AttitudeIndicatorProps) {
  // Translate pitch: let's say 1 degree = 2px translation
  const pitchTranslation = pitch * 2;

  // The horizon and pitch ladders rotate and translate together.
  return (
    <InstrumentBezel className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
      {/* Container for moving horizon */}
      <motion.div 
        className="absolute inset-[-50%] rounded-full shadow-inner"
        animate={{
          rotate: roll,
          y: pitchTranslation,
        }}
        transition={{ type: 'spring', stiffness: 50, damping: 10, mass: 1.5 }}
      >
        {/* Sky */}
        <div className="absolute top-0 w-full h-1/2 bg-[#3A82F6] border-b-2 border-white" />
        
        {/* Ground */}
        <div className="absolute bottom-0 w-full h-1/2 bg-[#A0522D]" />
        
        {/* Pitch Lines */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {[-40, -30, -20, -10, 10, 20, 30, 40].map((degree) => (
             <div 
               key={degree}
               className="absolute w-24 flex items-center justify-between"
               style={{
                 top: `calc(50% - ${degree * 2}px)`,
                 left: '50%',
                 transform: 'translate(-50%, -50%)'
               }}
             >
               <div className="w-6 h-0.5 bg-white" />
               <div className="text-white text-[10px] font-bold px-1">{Math.abs(degree)}</div>
               <div className="w-6 h-0.5 bg-white" />
             </div>
          ))}
          {/* Shorter lines for 5, 15, 25, 35 */}
          {[-35, -25, -15, -5, 5, 15, 25, 35].map((degree) => (
             <div 
               key={`short-${degree}`}
               className="absolute w-12 h-0.5 bg-white"
               style={{
                 top: `calc(50% - ${degree * 2}px)`,
                 left: '50%',
                 transform: 'translate(-50%, -50%)'
               }}
             />
          ))}
        </div>
      </motion.div>

      {/* Static Fixed Plane Symbol (Orange) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
         {/* Center dot */}
         <div className="w-2 h-2 rounded-full bg-[#FF8C00] z-10" />
         {/* Left wing */}
         <div className="absolute w-16 h-1.5 bg-[#FF8C00] -ml-24 flex items-center justify-start rounded-l-sm">
           <div className="w-2 h-4 bg-[#FF8C00]" /> {/* Wingtip down */}
         </div>
         {/* Right wing */}
         <div className="absolute w-16 h-1.5 bg-[#FF8C00] ml-24 flex items-center justify-end rounded-r-sm">
           <div className="w-2 h-4 bg-[#FF8C00]" /> {/* Wingtip down */}
         </div>
      </div>
      
      {/* Roll Indicator Scale (Static arc at top) */}
      <div className="absolute inset-0 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full stroke-white fill-none stroke-[1.5]">
           <path d="M 20 50 A 30 30 0 0 1 80 50" />
           {/* Tick marks for roll - mapped from degrees to polar coordinates. Wait, easier with simple rotation on lines in a container */}
        </svg>
      </div>

      <div className="absolute inset-0 pointer-events-none">
         {[-60, -45, -30, -20, -10, 0, 10, 20, 30, 45, 60].map((deg) => (
            <div 
              key={`roll-${deg}`}
              className="absolute w-full h-full flex flex-col items-center justify-start origin-center"
              style={{ transform: `rotate(${deg}deg)` }}
            >
              <div className={`w-0.5 bg-white ${deg === 0 || Math.abs(deg) === 30 || Math.abs(deg) === 60 ? 'h-4' : 'h-2'}`} />
            </div>
         ))}
         {/* Roll pointer triangle (attaches to horizon? No, the horizon rolls, pointer is static. Actually, there's a triangle pointing down at the 0 mark) */}
         <div className="absolute top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[10px] border-l-transparent border-r-transparent border-t-[#FF8C00] z-10" />
      </div>

    </InstrumentBezel>
  );
}
