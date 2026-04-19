import React from 'react';

export function RadarPanel() {
  const renderCompassTicks = () => {
    const ticks = [];
    for (let i = 0; i < 360; i += 5) {
      const isMajor = i % 10 === 0;
      let label = '';
      if (i === 0) label = 'N';
      else if (i === 90) label = 'E';
      else if (i === 180) label = 'S';
      else if (i === 270) label = 'W';
      else if (isMajor) label = i.toString();

      ticks.push(
        <div
          key={i}
          className="absolute inset-0 flex flex-col items-center pointer-events-none"
          style={{ transform: `rotate(${i}deg)` }}
        >
          {/* Outer Tick */}
          <div className={`bg-white ${isMajor ? 'w-[3px] h-10' : 'w-[2px] h-5'}`} />
          {/* Label */}
          {isMajor && (
            <div className="mt-2 text-white font-bold text-2xl tracking-tighter" style={{ fontFamily: 'Arial, sans-serif' }}>
              {label}
            </div>
          )}
        </div>
      );
    }
    return ticks;
  };

  return (
    <div className="w-full h-full bg-[#111111] border-[1px] border-[#556] relative overflow-hidden flex items-center justify-center">
      
      {/* Actual Rotating Compass */}
      {/* We make its height 110% of the container to overflow naturally left/right. */}
      <div className="absolute h-[115%] aspect-square flex items-center justify-center transform -rotate-[5deg] transition-transform duration-1000 ease-linear rounded-full">
         
         {/* Ticks container - placed exactly at the edge */}
         <div className="absolute inset-0 rounded-full border-[3px] border-white">
           <div className="absolute inset-0">
             {renderCompassTicks()}
           </div>
         </div>
      </div>

      {/* Dashed Rings */}
      <div className="absolute h-[75%] aspect-square rounded-full border-[6px] border-dashed border-white opacity-90" />
      <div className="absolute h-[40%] aspect-square rounded-full border-[6px] border-dashed border-white opacity-90 flex items-center justify-start">
         <span className="text-white text-base font-bold -ml-12 bg-[#111111] px-1 font-mono">5NM</span>
      </div>
      
      {/* Airplane Icon - Center */}
      <svg 
        className="w-12 h-12 text-[#5b8de6] absolute z-10 fill-current" 
        viewBox="0 0 24 24" 
        style={{ transform: 'rotate(0deg)' }}
      >
        <path d="M21,16V14L13,9V3.5A1.5,1.5 0 0,0 11.5,2A1.5,1.5 0 0,0 10,3.5V9L2,14V16L10,13.5V19L8,20.5V22L11.5,21L15,22V20.5L13,19V13.5L21,16Z" />
      </svg>
      
      {/* Waypoints */}
      <div className="absolute top-[60%] left-[70%] text-[#5b8de6] flex items-center font-mono font-bold">
         <div className="relative w-8 h-8 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" className="stroke-current stroke-[3] fill-none"><path d="M12 4v16m-8-8h16" /></svg>
         </div>
         <span className="text-white text-xs -mt-3 ml-1 font-sans font-medium">ZCV</span>
      </div>
      <div className="absolute top-[62%] left-[45%] text-[#5b8de6] flex items-center font-mono font-bold">
         <div className="relative w-8 h-8 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" className="stroke-current stroke-[3] fill-none"><path d="M12 4v16m-8-8h16" /></svg>
         </div>
         <span className="text-white text-xs -mt-3 ml-1 font-sans font-medium">VPM</span>
      </div>
      <div className="absolute top-[15%] left-[80%] text-[#5b8de6] flex items-center font-mono font-bold">
         {/* Diamond icon for SB234 */}
         <div className="w-3.5 h-3.5 border-[2.5px] border-[#5b8de6] rotate-45 ml-2" />
         <div className="flex flex-col text-white text-[10px] font-sans font-medium leading-tight ml-2 mt-1">
            <span>SB234</span>
            <span>6200ft</span>
         </div>
      </div>
    </div>
  );
}
