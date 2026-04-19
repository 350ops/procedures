import React from 'react';

interface BezelProps {
  children: React.ReactNode;
  className?: string;
}

export function InstrumentBezel({ children, className = '' }: BezelProps) {
  return (
    <div className={`relative flex items-center justify-center bg-[#1a1c1e] p-2 rounded-xl shadow-[inset_0_4px_10px_rgba(0,0,0,0.8),_0_2px_4px_rgba(255,255,255,0.05)] border border-[#3a3c3e] ${className}`}>
      {/* Corner screws */}
      <div className="absolute top-3 left-3 w-2.5 h-2.5 rounded-full bg-[#2a2c2e] shadow-[inset_0_1px_2px_rgba(0,0,0,0.8),_0_1px_0_rgba(255,255,255,0.2)] flex items-center justify-center transform -rotate-45">
        <div className="w-[1px] h-full bg-[#111]" />
      </div>
      <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-[#2a2c2e] shadow-[inset_0_1px_2px_rgba(0,0,0,0.8),_0_1px_0_rgba(255,255,255,0.2)] flex items-center justify-center transform rotate-12">
        <div className="w-[1px] h-full bg-[#111]" />
      </div>
      <div className="absolute bottom-3 left-3 w-2.5 h-2.5 rounded-full bg-[#2a2c2e] shadow-[inset_0_1px_2px_rgba(0,0,0,0.8),_0_1px_0_rgba(255,255,255,0.2)] flex items-center justify-center transform rotate-45">
        <div className="w-[1px] h-full bg-[#111]" />
      </div>
      <div className="absolute bottom-3 right-3 w-2.5 h-2.5 rounded-full bg-[#2a2c2e] shadow-[inset_0_1px_2px_rgba(0,0,0,0.8),_0_1px_0_rgba(255,255,255,0.2)] flex items-center justify-center transform -rotate-12">
        <div className="w-[1px] h-full bg-[#111]" />
      </div>
      
      {/* Instrument Face Container */}
      <div className="relative rounded-full overflow-hidden bg-[#0a0a0c] shadow-[inset_0_8px_16px_rgba(0,0,0,0.9),_0_0_0_2px_#000] border-2 border-[#1f2123] w-full h-full">
        {children}
        
        {/* Glass Reflection */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-transparent to-white/10 pointer-events-none z-50 mix-blend-screen" />
        <div className="absolute top-[5%] left-[10%] w-[80%] h-[40%] rounded-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-50 opacity-30" style={{ filter: 'blur(2px)', transform: 'rotate(-15deg)' }} />
      </div>
    </div>
  );
}
