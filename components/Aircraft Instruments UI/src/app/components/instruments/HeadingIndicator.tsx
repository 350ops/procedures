import React from 'react';
import { motion } from 'motion/react';
import { InstrumentBezel } from './InstrumentBezel';
import { Plane } from 'lucide-react';

interface HeadingIndicatorProps {
  heading: number; // 0-359
}

export function HeadingIndicator({ heading }: HeadingIndicatorProps) {
  
  const ticks = [];
  for (let i = 0; i < 360; i += 10) {
    const isMajor = i % 30 === 0;
    
    // Convert angle to heading string (N, NE, E, etc.)
    let label = '';
    if (i === 0) label = 'N';
    else if (i === 90) label = 'E';
    else if (i === 180) label = 'S';
    else if (i === 270) label = 'W';
    else if (isMajor) label = (i / 10).toString();

    ticks.push(
      <div
        key={i}
        className="absolute inset-2 flex flex-col items-center justify-start origin-center pointer-events-none"
        style={{ transform: `rotate(${i}deg)` }}
      >
        <div className={`bg-white ${isMajor ? 'w-1 h-4' : 'w-0.5 h-2'}`} />
        {isMajor && (
          <div className="mt-1 text-white font-bold text-sm font-mono">
            {label}
          </div>
        )}
      </div>
    );
  }

  return (
    <InstrumentBezel className="w-56 h-56 md:w-72 md:h-72">
      <div className="absolute inset-0 rounded-full flex items-center justify-center overflow-hidden">
        
        {/* Fixed pointer at top (lubber line) */}
        <div className="absolute top-2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[10px] border-l-transparent border-r-transparent border-t-[#FF8C00] z-30 pointer-events-none" />
        
        {/* Rotating Compass Card */}
        <motion.div 
          className="absolute inset-0 origin-center"
          animate={{ rotate: -heading }}
          transition={{ type: 'spring', stiffness: 30, damping: 10 }}
        >
          {ticks}
          
          {/* Internal ring */}
          <div className="absolute inset-16 border-2 border-[#333] rounded-full" />
        </motion.div>
        
        {/* Fixed Center Plane */}
        <div className="absolute z-20 pointer-events-none text-[#FF8C00]">
          <Plane className="w-12 h-12 stroke-[1.5]" />
        </div>
        
        {/* Digital Readout */}
        <div className="absolute bottom-6 bg-black/60 border border-[#333] px-3 py-1 rounded font-mono text-[#00ff41] text-lg tabular-nums shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] z-10 w-20 text-center">
           {Math.round(heading).toString().padStart(3, '0')}
        </div>
        
      </div>
    </InstrumentBezel>
  );
}
