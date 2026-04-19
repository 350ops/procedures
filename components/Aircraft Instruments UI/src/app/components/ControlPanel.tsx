import React from 'react';
import { ChevronDown } from 'lucide-react';

export function ControlPanel() {
  return (
    <div className="flex flex-col gap-6 w-full px-4 text-center">
      
      {/* Radio Freq */}
      <div className="flex flex-col gap-1 items-center">
        <label className="text-white font-medium text-lg tracking-wide">Radio Freq</label>
        <div className="bg-black w-full h-10 flex items-center justify-center font-mono text-[#00FFFF] italic text-2xl font-semibold px-2">
          121.50
        </div>
        <div className="flex w-full items-center justify-between mt-2 px-1">
          <div className="bg-[#b3d79f] text-black w-14 h-14 rounded-full flex items-center justify-center font-bold text-2xl shadow-md border border-[#8caa7c] select-none cursor-pointer hover:bg-[#a6ca92]">
            <span className="mr-2.5">-</span>
            <span>+</span>
          </div>
          <button className="bg-[#24a82a] text-white px-4 py-2 font-medium hover:bg-[#2dc433] active:bg-[#1f8c24] border border-[#1a7f1f] shadow-sm tracking-wide text-lg rounded-sm">
            Verify
          </button>
        </div>
      </div>

      {/* Altitude */}
      <div className="flex flex-col gap-1 items-center mt-2">
        <label className="text-white font-medium text-lg tracking-wide">Altitude</label>
        <div className="bg-black w-full h-10 flex items-center justify-center font-mono text-[#00FFFF] italic text-2xl font-semibold px-2">
          22500
        </div>
        <div className="flex w-full items-center justify-between mt-2 px-1">
          <div className="bg-[#b3d79f] text-black w-14 h-14 rounded-full flex items-center justify-center font-bold text-2xl shadow-md border border-[#8caa7c] select-none cursor-pointer hover:bg-[#a6ca92]">
            <span className="mr-2.5">-</span>
            <span>+</span>
          </div>
          <button className="bg-[#24a82a] text-white px-4 py-2 font-medium hover:bg-[#2dc433] active:bg-[#1f8c24] border border-[#1a7f1f] shadow-sm tracking-wide text-lg rounded-sm">
            Verify
          </button>
        </div>
      </div>

      {/* VOR Station */}
      <div className="flex flex-col gap-1 items-center mt-4">
        <label className="text-white font-medium text-lg tracking-wide">VOR Station</label>
        <div className="flex w-full h-10 bg-black">
          <div className="flex-1 flex items-center justify-start px-3 font-mono text-[#00FFFF] text-xl font-semibold">
            VPM
          </div>
          <button className="w-10 bg-[#24a82a] hover:bg-[#2dc433] flex items-center justify-center border-l border-[#1a7f1f]">
             <ChevronDown className="w-6 h-6 text-black/60" strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* NM */}
      <div className="flex flex-col gap-1 items-center mt-2">
        <label className="text-white font-medium text-lg tracking-wide">NM</label>
        <div className="flex w-full h-10 bg-black">
          <div className="flex-1 px-3">
          </div>
          <button className="w-12 bg-[#24a82a] hover:bg-[#2dc433] flex items-center justify-center text-white font-medium border-l border-[#1a7f1f]">
             ok
          </button>
        </div>
      </div>

      {/* ROC/ROD */}
      <div className="flex flex-col gap-1 items-center mt-2">
        <label className="text-white font-medium text-lg tracking-wide">ROC/ROD</label>
        <div className="flex w-full h-10 bg-black">
          <div className="flex-1 px-3">
          </div>
          <button className="w-12 bg-[#24a82a] hover:bg-[#2dc433] flex items-center justify-center text-white font-medium border-l border-[#1a7f1f]">
             ok
          </button>
        </div>
      </div>
      
    </div>
  );
}