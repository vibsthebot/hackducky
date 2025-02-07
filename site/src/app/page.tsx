'use client';

import { useEffect, useState } from 'react';
import Terminal from '@/components/Terminal';
import IntroAnimation from '@/components/IntroAnimation';

export default function Home() {
  const [showTerminal, setShowTerminal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const introAnimation = document.querySelector('.intro-animation');
      if (introAnimation instanceof HTMLElement) {
        introAnimation.classList.add('animate-zoomIn');
        console.log('Animation started');
        setTimeout(() => {
          introAnimation.classList.add('hidden');
          setShowTerminal(true);
          console.log('Intro hidden, terminal shown');
        }, 1000);
      }
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0a] font-mono text-[#39ff14] flex flex-col overflow-hidden">
      <div className="intro-animation transition-opacity duration-300">
        <IntroAnimation />
      </div>
      {showTerminal && (
        <Terminal className="m-5 p-5 bg-[#1a1a1a] rounded flex-grow overflow-y-auto shadow-[0_0_10px_rgba(57,255,20,0.3)] whitespace-pre-wrap" />
      )}
    </main>
  );
}
