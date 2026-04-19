import React from 'react';
import { Camera } from 'lucide-react';

interface StatusPanelProps {
  activeTab: 'FUEL' | 'HYD';
  setActiveTab: (tab: 'FUEL' | 'HYD') => void;
}

export function StatusPanel({ activeTab, setActiveTab }: StatusPanelProps) {
  return (
    <div className="flex flex-col h-full w-full bg-black border-l-2 border-black">
      
      {/* Top Green Section */}
      <div className="bg-[#1f591b] h-[30%] w-full relative flex flex-col items-center justify-center p-4">
        
        {/* Clock */}
        <div className="absolute top-2 right-2 bg-[#5b8de6] text-white px-6 py-1 text-2xl font-mono tracking-wider shadow-sm font-semibold">
          22:59
        </div>

        {/* Master Alerts */}
        <div className="flex gap-4 mt-6">
          <button className="border-[3px] border-white px-4 py-2 flex flex-col items-center justify-center min-w-[120px] h-[72px] hover:bg-white/10 transition-colors">
            <span className="text-white text-lg leading-tight font-medium">Master</span>
            <span className="text-white text-lg leading-tight font-medium">Caution</span>
          </button>
          
          <button className="border-[3px] border-red-600 px-4 py-2 flex flex-col items-center justify-center min-w-[120px] h-[72px] hover:bg-red-600/10 transition-colors">
            <span className="text-white text-lg leading-tight font-medium">Master</span>
            <span className="text-white text-lg leading-tight font-medium">Warning</span>
          </button>
        </div>

        {/* Mode Selectors */}
        <div className="flex gap-4 mt-6">
          <button 
            className={`w-20 py-1.5 text-black font-bold tracking-wide shadow-sm bg-[#e2e8f0] hover:bg-white transition-colors`}
            onClick={() => setActiveTab('HYD')}
          >
            HYD
          </button>
          <button 
            className={`w-20 py-1.5 text-black font-bold tracking-wide shadow-sm bg-[#e2e8f0] hover:bg-white transition-colors`}
            onClick={() => setActiveTab('FUEL')}
          >
            FUEL
          </button>
          <button className="w-20 py-1.5 text-black font-bold tracking-wide shadow-sm bg-[#e2e8f0] hover:bg-white transition-colors">
            CLR
          </button>
        </div>

      </div>

      {/* Bottom Black Display Area */}
      <div className="flex-1 bg-black w-full relative overflow-hidden">
        {activeTab === 'FUEL' ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-center gap-12 mt-12">
            <h2 className="text-white text-3xl font-sans tracking-wide">Take a snapshot of FUEL page</h2>
            <div className="relative">
               {/* Frame corners */}
               <div className="absolute -top-3 -left-3 w-4 h-4 border-t-2 border-l-2 border-[#5b8de6]" />
               <div className="absolute -top-3 -right-3 w-4 h-4 border-t-2 border-r-2 border-[#5b8de6]" />
               <div className="absolute -bottom-3 -left-3 w-4 h-4 border-b-2 border-l-2 border-[#5b8de6]" />
               <div className="absolute -bottom-3 -right-3 w-4 h-4 border-b-2 border-r-2 border-[#5b8de6]" />
               
               <Camera className="w-16 h-16 text-[#5b8de6]" strokeWidth={1.5} />
            </div>
          </div>
        ) : (
          <HydraulicsPage />
        )}
      </div>
      
    </div>
  );
}

function HydraulicsPage() {
  return (
    <div className="w-full h-full p-4 pl-8 pt-8 font-mono text-sm relative">
      {/* Camera Icon */}
      <div className="absolute top-4 right-4 border-[3px] border-[#5b8de6] w-12 h-12 flex items-center justify-center">
        <Camera className="w-6 h-6 text-[#5b8de6]" strokeWidth={2} />
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-4 text-center font-bold mb-6 gap-2 w-[85%] pr-4 text-base tracking-widest">
        <div className="text-[#ef4444]">RED</div>
        <div className="text-[#5b8de6]">BLUE</div>
        <div className="text-[#22c55e]">GREEN</div>
        <div className="text-white">WHITE</div>
      </div>

      {/* PSI Values */}
      <div className="grid grid-cols-4 text-center font-bold mb-4 gap-2 w-[85%] pr-4">
        <div className="text-[#ef4444]"><span className="mr-2">0</span> PSI</div>
        <div className="text-[#ef4444]"><span className="mr-2">0</span> PSI</div>
        <div className="text-[#22c55e]"><span className="mr-2">2500</span> PSI</div>
        <div className="text-[#22c55e]"><span className="mr-2">2500</span> PSI</div>
      </div>

      {/* Schematic Graphic Area */}
      <div className="relative w-full h-[400px]">
        {/* Draw Lines - Using SVG for perfect layout */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          {/* Vertical Main Lines */}
          <line x1="10%" y1="0" x2="10%" y2="45%" stroke="#ef4444" strokeWidth="3" />
          <line x1="32%" y1="0" x2="32%" y2="55%" stroke="#ef4444" strokeWidth="3" />
          <line x1="55%" y1="0" x2="55%" y2="55%" stroke="#22c55e" strokeWidth="3" />
          <line x1="77%" y1="0" x2="77%" y2="45%" stroke="#22c55e" strokeWidth="3" />

          {/* Horizontal Cross Feed Lines */}
          <line x1="10%" y1="20%" x2="32%" y2="20%" stroke="#ef4444" strokeWidth="3" />
          <line x1="32%" y1="40%" x2="55%" y2="40%" stroke="#ef4444" strokeWidth="3" />
          <line x1="55%" y1="20%" x2="77%" y2="20%" stroke="#22c55e" strokeWidth="3" />

          {/* Bottom vertical lines connecting to cylinders */}
          <line x1="10%" y1="45%" x2="10%" y2="70%" stroke="#ef4444" strokeWidth="3" />
          <line x1="32%" y1="55%" x2="32%" y2="70%" stroke="#ef4444" strokeWidth="3" />
          <line x1="55%" y1="55%" x2="55%" y2="70%" stroke="#22c55e" strokeWidth="3" />
          <line x1="77%" y1="45%" x2="77%" y2="70%" stroke="#22c55e" strokeWidth="3" />
          
          <line x1="5%" y1="85%" x2="85%" y2="85%" stroke="white" strokeWidth="1" />
        </svg>

        {/* X Feed Valves (Yellow Circles) */}
        {/* LH X FEED */}
        <div className="absolute top-[20%] left-[21%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-10 h-10 rounded-full border-[3px] border-yellow-300 bg-black flex items-center justify-center z-10">
            <div className="w-1 h-6 bg-yellow-300" />
          </div>
          <div className="text-yellow-300 text-xs font-bold mt-1 tracking-wider whitespace-nowrap">LH X FEED</div>
        </div>

        {/* CE X FEED */}
        <div className="absolute top-[40%] left-[43.5%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-[3px] border-yellow-300 bg-black flex items-center justify-center z-10">
            <div className="w-1 h-6 bg-yellow-300" />
          </div>
          <div className="text-yellow-300 text-xs font-bold tracking-wider whitespace-nowrap absolute right-[120%]">CE X FEED</div>
        </div>

        {/* RH X FEED */}
        <div className="absolute top-[20%] left-[66%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-10 h-10 rounded-full border-[3px] border-yellow-300 bg-black flex items-center justify-center z-10">
            <div className="w-1 h-6 bg-yellow-300" />
          </div>
          <div className="text-yellow-300 text-xs font-bold mt-1 tracking-wider whitespace-nowrap">RH X FEED</div>
        </div>

        {/* Pump Status Boxes */}
        {/* Red LOW 1 */}
        <div className="absolute top-[45%] left-[10%] -translate-x-1/2 w-[45px] z-10 flex flex-col items-center">
           <div className="border border-red-500 mb-1 flex items-center justify-center p-0.5 text-red-500 text-[10px] leading-tight bg-black">
              CB 1<br/>ON
           </div>
           <div className="border-[2px] border-red-500 h-12 w-full bg-black flex items-center justify-center text-red-500 font-bold text-lg">
             LOW
           </div>
        </div>
        
        {/* Red LOW 2 */}
        <div className="absolute top-[55%] left-[32%] -translate-x-1/2 w-[45px] z-10 flex flex-col items-center">
           <div className="border-[2px] border-red-500 h-12 w-full bg-black flex items-center justify-center text-red-500 font-bold text-lg">
             LOW
           </div>
        </div>

        {/* Green PUMP ON 1 */}
        <div className="absolute top-[55%] left-[55%] -translate-x-1/2 w-[45px] z-10 flex flex-col items-center">
           <div className="border-[2px] border-green-500 h-16 w-full bg-black flex items-center justify-center text-green-500 font-bold text-[10px] leading-tight text-center">
             GREEN<br/>HYD<br/>PUMP<br/>ON
           </div>
        </div>

        {/* Green PUMP ON 2 */}
        <div className="absolute top-[45%] left-[77%] -translate-x-1/2 w-[45px] z-10 flex flex-col items-center">
           <div className="border border-green-500 mb-1 flex items-center justify-center p-0.5 text-green-500 text-[10px] leading-tight bg-black">
              CB 1<br/>ON
           </div>
           <div className="border-[2px] border-green-500 h-16 w-full bg-black flex items-center justify-center text-green-500 font-bold text-[10px] leading-tight text-center">
             WHITE<br/>HYD<br/>PUMP<br/>ON
           </div>
        </div>

        {/* Bottom Cylinders */}
        <div className="absolute top-[70%] left-[10%] -translate-x-1/2 w-4 h-24 border-2 border-green-800 bg-transparent flex items-end">
           <div className="w-full h-0 bg-green-500" /> {/* Empty */}
        </div>
        
        <div className="absolute top-[70%] left-[32%] -translate-x-1/2 w-4 h-24 border-2 border-green-800 bg-transparent flex items-end">
           <div className="w-full h-0 bg-green-500" /> {/* Empty */}
        </div>

        <div className="absolute top-[70%] left-[55%] -translate-x-1/2 w-4 h-24 border-2 border-green-500 bg-transparent flex items-end">
           <div className="w-full h-full bg-green-500" /> {/* Full */}
        </div>

        <div className="absolute top-[70%] left-[77%] -translate-x-1/2 w-4 h-24 border-2 border-green-500 bg-transparent flex items-end">
           <div className="w-full h-full bg-green-500" /> {/* Full */}
        </div>

        {/* Checklist Text */}
        <div className="absolute top-[87%] left-0 w-full flex flex-col items-center">
           <div className="font-bold text-lg mb-2">CHECKLIST</div>
           <div className="flex flex-col gap-1 text-xs self-start ml-[5%]">
              <div>LH X FEED ON</div>
              <div>CE X FEED ON</div>
           </div>
        </div>
      </div>
    </div>
  );
}