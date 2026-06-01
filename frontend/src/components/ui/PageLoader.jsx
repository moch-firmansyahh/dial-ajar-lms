import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

const PageLoader = () => {
  const container = useRef(null);

  useGSAP(() => {
    if (!container.current) return;

    // Simple fade in on mount
    gsap.fromTo(container.current, 
      { opacity: 0 },
      { opacity: 1, duration: 0.2, ease: 'power2.out' }
    );

    // Animasi 3 titik melompat (Bouncing Wave)
    gsap.to('.loader-dot', {
      y: -10,
      stagger: 0.15,
      duration: 0.5,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    });

  }, { scope: container });

  return (
    <div 
      ref={container}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white shadow-2xl opacity-0"
    >
      <div className="relative flex flex-col items-center justify-center min-h-[300px]">
        {/* 3 Dots Bouncing Container */}
        <div className="flex items-center justify-center gap-2">
          <div className="loader-dot w-2 h-2 bg-primary rounded-full shadow-sm" />
          <div className="loader-dot w-2 h-2 bg-primary rounded-full shadow-sm" />
          <div className="loader-dot w-2 h-2 bg-primary rounded-full shadow-sm" />
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
