import React, { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import logo from '../../assets/logo.png';

gsap.registerPlugin(useGSAP);

const PageLoader = () => {
  const location = useLocation();
  const container = useRef(null);
  const [isActive, setIsActive] = useState(true); // Mulai dengan true saat pertama kali load

  // Trigger animasi setiap kali route berubah
  React.useEffect(() => {
    setIsActive(true);
  }, [location.pathname]);

  useGSAP(() => {
    if (!isActive || !container.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setIsActive(false);
      }
    });

    // Fade in
    gsap.set(container.current, { opacity: 0 });
    
    tl.to(container.current, { 
      opacity: 1, 
      duration: 0.2, 
      ease: 'power2.out' 
    })
    // Tahan sedikit
    .to({}, { duration: 0.3 })
    // Fade out
    .to(container.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.inOut'
    });

    // Animasi 3 titik melompat (Bouncing Wave)
    gsap.to('.loader-dot', {
      y: -10,
      stagger: 0.15,
      duration: 0.5,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    });

  }, { dependencies: [isActive], scope: container });

  if (!isActive) return null;

  return (
    <div 
      ref={container}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white shadow-2xl"
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
