import React, { useEffect, useState } from 'react';

const MatrixRain: React.FC = () => {
  const [columns, setColumns] = useState<string[]>([]);
  const [speeds, setSpeeds] = useState<number[]>([]);
  const [opacities, setOpacities] = useState<number[]>([]);

  useEffect(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
    const columnWidth = 15;
    const screenWidth = 600;
    const columnCount = Math.floor(screenWidth / columnWidth);
    
    const initialColumns = Array(columnCount).fill('').map(() => 
      Array(Math.floor(Math.random() * 20)).fill('').map(() => 
        chars[Math.floor(Math.random() * chars.length)]
      ).join('')
    );
    const initialSpeeds = Array(columnCount).fill(0).map(() => Math.random() * 2 + 1);
    const initialOpacities = Array(columnCount).fill(0).map(() => Math.random() * 0.5 + 0.3);

    setColumns(initialColumns);
    setSpeeds(initialSpeeds);
    setOpacities(initialOpacities);

    const interval = setInterval(() => {
      setColumns(prev => prev.map(col => {  // Removed unused 'i' parameter
        if (Math.random() < 0.05) return '';
        const newChar = chars[Math.floor(Math.random() * chars.length)];
        return (col + newChar).slice(-25); // Keep last 25 characters
      }));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {columns.map((col, i) => (
        <div
          key={i}
          className="absolute top-0 text-[#39ff14] font-mono text-sm whitespace-pre"
          style={{
            left: `${i * 15}px`,
            transform: `translateY(${speeds[i] * 15}px)`,
            opacity: opacities[i] || 0.5,
            textShadow: '0 0 8px rgba(57, 255, 20, 0.8)',
          }}
        >
          {col.split('').map((char, j) => (
            <div key={j} style={{ opacity: 1 - (j * 0.1) }}>{char}</div>
          ))}
        </div>
      ))}
    </div>
  );
};

const IntroAnimation: React.FC = () => {
  const [showMatrix, setShowMatrix] = useState(false);
  const [showUSB, setShowUSB] = useState(false);
  const [usbPlugged, setUsbPlugged] = useState(false);
  const [isZooming, setIsZooming] = useState(false);

  useEffect(() => {
    // Set up animation sequence
    const timer1 = setTimeout(() => setShowUSB(true), 1000);
    const timer2 = setTimeout(() => setUsbPlugged(true), 2000);
    const timer3 = setTimeout(() => setShowMatrix(true), 3000);
    const timer4 = setTimeout(() => setIsZooming(true), 4000);

    // Cleanup timers
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0a0a0a] z-50">
      <div className="relative w-screen h-screen flex items-center justify-center overflow-hidden [perspective:3000px]">
        <div 
          className={`transform-gpu transition-all duration-1000 ease-zoom
            ${isZooming ? 'animate-zoomIn' : ''}`}
        >
          <div className="relative transform-gpu rotate-x-[15deg] transition-transform duration-700">
            {/* Screen */}
            <div className="w-[600px] h-[400px] bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] rounded-t-lg p-3 shadow-2xl">
              <div className="w-full h-full bg-[#0a0a0a] rounded relative overflow-hidden">
                {showMatrix && <MatrixRain />}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-[#39ff14] text-lg font-mono z-10 bg-[#0a0a0a]/80 px-4 py-2 rounded">
                    {usbPlugged ? '> HackDucky Connected...' : '> Waiting for device...'}
                    <span className="animate-blink ml-1">█</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Laptop Base */}
            <div className="w-[600px] h-[30px] bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] rounded-b-xl shadow-2xl relative">
              {/* USB Port */}
              <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-4 h-8 bg-[#111] rounded-sm border border-[#222] transform rotate-x-[-15deg]" />
            </div>
          </div>
        </div>

        {/* USB Drive */}
        {showUSB && (
          <div 
            className={`absolute left-1/2 transform-gpu -translate-x-1/2 transition-all duration-1000
              ${usbPlugged 
                ? 'translate-y-[245px] rotate-x-[-15deg]' 
                : 'translate-y-[345px] rotate-x-[-45deg]'}`}
          >
            <div className="w-8 h-16 bg-gradient-to-b from-[#444] to-[#222] rounded-sm relative shadow-lg">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-2 bg-[#666] rounded-sm border-t border-[#888]" />
              <div className={`absolute top-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full transition-colors duration-300
                ${usbPlugged ? 'bg-[#39ff14] animate-pulse shadow-[0_0_8px_rgba(57,255,20,0.8)]' : 'bg-[#333]'}`} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntroAnimation;