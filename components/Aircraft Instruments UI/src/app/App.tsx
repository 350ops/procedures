import React, { useState } from 'react';
import { RadarPanel } from './components/RadarPanel';
import { ControlPanel } from './components/ControlPanel';
import { StatusPanel } from './components/StatusPanel';

export default function App() {
  const [activeTab, setActiveTab] = useState<'FUEL' | 'HYD'>('FUEL');

  return (
    <div className="flex h-screen w-full font-sans antialiased overflow-hidden text-white bg-[#8d9ab3]">
      <div className="w-[45%] h-full p-2 pl-3 py-3 pr-1">
        <RadarPanel />
      </div>
      <div className="w-[20%] h-full p-2 py-6">
        <ControlPanel />
      </div>
      <div className="w-[35%] h-full">
        <StatusPanel activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}