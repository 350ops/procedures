import React from 'react';
import { motion } from 'motion/react';
import { InstrumentBezel } from './InstrumentBezel';

interface AltimeterProps {
  altitude: number; // in feet
}

export function Altimeter({ altitude }: AltimeterProps) {
  // Needle 1: 100s of feet (0-10 on dial, full rotation = 1000 feet)
  // Needle 2: 1000s of feet (0-10 on dial, full rotation = 10,000 feet)
  
  const hundredsAngle = (altitude % 1000) / 1000 * 360;
  const thousandsAngle = (altitude % 10000) / 10000 * 360;
  const tenThousandsAngle = (altitude % 100000) / 100000 * 360;

  const ticks = [];
  for (let i = 0; i < 50; i++) {
    const isMajor = i % 5 === 0;
    const angle = i * 7.2;
    
    ticks.push(
      <div
        key={i}
        className="absolute inset-0 flex flex-col items-center justify-start origin-center pointer-events-none p-2"
        style={{ transform: `rotate(${angle}deg)` }}
      >
        <div className={`bg-white ${isMajor ? 'w-1 h-5' : 'w-0.5 h-3'}`} />
        {isMajor && (
          <div 
            className="mt-1 text-white font-bold text-lg md:text-xl font-mono"
            style={{ transform: `rotate(${-angle}deg)` }}
          >
            {i / 5}
          </div>
        )}
      </div>
    );
  }

  return (
    <InstrumentBezel className="w-56 h-56 md:w-72 md:h-72">
      <div className="absolute inset-0 rounded-full">
        {/* Ticks and Numbers */}
        <div className="absolute inset-0 z-0">
          {ticks}
        </div>
        
        {/* Texts */}
        <div className="absolute top-1/4 w-full flex flex-col items-center justify-center pointer-events-none z-10">
          <div className="text-white font-bold text-xs">ALTIMETER</div>
        </div>

        {/* Digital Strip/Kollsman window placeholder */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 bg-black border border-[#333] px-2 py-0.5 rounded font-mono text-white text-sm shadow-inner z-10">
          29.92
        </div>
        
        {/* Main Altitude Digital Readout */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-black/80 border-t border-[#333] px-3 py-1 rounded font-mono text-[#4ade80] text-xl tabular-nums shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] z-10 flex flex-col items-center">
           <span className="text-xs text-[#8c9bab] mb-1">ALT</span>
           <span>{Math.floor(altitude).toString().padStart(5, '0')}</span>
        </div>

        {/* Needles Container */}
        <div className="absolute inset-0 pointer-events-none z-20 flex justify-center items-center">
          {/* 10,000s Needle (short thin, with triangle end) */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-start origin-center"
            animate={{ rotate: tenThousandsAngle }}
            transition={{ type: 'spring', stiffness: 45, damping: 15 }}
          >
            <div className="w-1 h-[30%] mt-[20%] bg-white/90 relative flex justify-center">
              <div className="absolute -top-3 w-0 h-0 border-l-[4px] border-r-[4px] border-b-[10px] border-l-transparent border-r-transparent border-b-white/90" />
            </div>
          </motion.div>
          
          {/* 1,000s Needle (short, thick, with square/wedge end) */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-start origin-center"
            animate={{ rotate: thousandsAngle }}
            transition={{ type: 'spring', stiffness: 45, damping: 15 }}
          >
            <div className="w-3 h-[25%] mt-[25%] bg-white relative flex justify-center">
               <div className="absolute -top-4 w-5 h-4 bg-white" style={{ clipPath: 'polygon(50% 0, 100% 100%, 0 100%)' }} />
            </div>
          </motion.div>
          
          {/* 100s Needle (long) */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-start origin-center"
            animate={{ rotate: hundredsAngle }}
            transition={{ type: 'spring', stiffness: 45, damping: 15 }}
          >
             <div className="w-1.5 h-[45%] mt-4 bg-white flex justify-center shadow-md relative">
                <div className="absolute -top-4 w-0 h-0 border-l-[3px] border-r-[3px] border-b-[16px] border-b-white border-l-transparent border-r-transparent" />
             </div>
          </motion.div>
        </div>
        
        {/* Center Cap */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#2a2c2e] rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.8),inset_0_1px_rgba(255,255,255,0.2)] z-30 flex items-center justify-center">
           <div className="w-2 h-2 bg-[#111] rounded-full" />
        </div>
      </div>
    </InstrumentBezel>
  );
}
