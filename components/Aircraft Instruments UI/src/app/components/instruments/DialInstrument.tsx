import React from 'react';
import { motion } from 'motion/react';
import { InstrumentBezel } from './InstrumentBezel';

interface DialInstrumentProps {
  title: string;
  unit: string;
  value: number;
  minValue: number;
  maxValue: number;
  majorTickStep: number;
  minorTickStep: number;
  startAngle?: number; // E.g. -135 (bottom left)
  endAngle?: number;   // E.g. 135 (bottom right)
  valueMultiplier?: number; // to scale the readout e.g. 1000s
}

export function DialInstrument({ 
  title, 
  unit, 
  value, 
  minValue, 
  maxValue, 
  majorTickStep, 
  minorTickStep,
  startAngle = -135,
  endAngle = 135,
  valueMultiplier = 1
}: DialInstrumentProps) {
  
  const valueRange = maxValue - minValue;
  const angleRange = endAngle - startAngle;
  
  const getAngle = (val: number) => {
    // clamp value between min and max for the needle
    const clampedVal = Math.max(minValue, Math.min(maxValue, val));
    const percent = (clampedVal - minValue) / valueRange;
    return startAngle + (percent * angleRange);
  };

  const needleAngle = getAngle(value);

  const ticks = [];
  for (let i = minValue; i <= maxValue; i += minorTickStep) {
    const isMajor = i % majorTickStep === 0;
    const angle = getAngle(i);
    ticks.push(
      <div
        key={i}
        className="absolute inset-0 flex flex-col items-center justify-start origin-center pointer-events-none"
        style={{ transform: `rotate(${angle}deg)` }}
      >
        <div className={`bg-white ${isMajor ? 'w-1 h-5' : 'w-0.5 h-3'}`} />
        {isMajor && (
          <div 
            className="mt-1 text-white font-bold text-sm md:text-base font-mono"
            style={{ transform: `rotate(${-angle}deg)` }}
          >
            {i}
          </div>
        )}
      </div>
    );
  }

  return (
    <InstrumentBezel className="w-56 h-56 md:w-72 md:h-72">
      <div className="absolute inset-0 rounded-full flex items-center justify-center">
        
        {/* Ticks and Numbers Container */}
        <div className="absolute inset-2">
          {ticks}
        </div>
        
        {/* Texts & Digital Readout */}
        <div className="absolute flex flex-col items-center justify-center pointer-events-none z-10" style={{ transform: 'translateY(-20px)' }}>
          <div className="text-[#8c9bab] font-semibold text-xs tracking-widest uppercase">{title}</div>
          <div className="text-[#596673] text-[10px] uppercase mb-1">{unit}</div>
        </div>

        <div className="absolute bottom-12 bg-black/80 border-t border-[#333] px-3 py-1 rounded font-mono text-[#4ade80] text-xl tabular-nums shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] z-10 w-24 text-center">
           {Math.round(value * valueMultiplier).toString().padStart(4, '0')}
        </div>

        {/* Needle */}
        <motion.div
          className="absolute inset-2 flex flex-col items-center justify-start origin-center z-20 pointer-events-none"
          animate={{ rotate: needleAngle }}
          transition={{ type: 'spring', stiffness: 45, damping: 15 }}
        >
          {/* Main Needle Blade */}
          <div className="w-1 h-[45%] mt-[5%] bg-white relative shadow-md flex justify-center">
             <div className="absolute -top-3 w-0 h-0 border-l-[3px] border-r-[3px] border-b-[12px] border-b-white border-l-transparent border-r-transparent" />
             <div className="absolute bottom-0 w-2.5 h-12 bg-white rounded-t-sm" />
          </div>
        </motion.div>
        
        {/* Center Cap */}
        <div className="absolute w-8 h-8 bg-gradient-to-br from-[#3a3c3e] to-[#1a1c1e] rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.6),inset_0_1px_rgba(255,255,255,0.3)] z-30 flex items-center justify-center border border-[#111]">
           <div className="w-2.5 h-2.5 bg-[#0a0a0c] rounded-full shadow-inner" />
        </div>
      </div>
    </InstrumentBezel>
  );
}
