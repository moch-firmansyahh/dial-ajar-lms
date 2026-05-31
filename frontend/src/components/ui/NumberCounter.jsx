import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const NumberCounter = ({ value, duration = 1.5 }) => {
  const nodeRef = useRef(null);

  useGSAP(() => {
    const isDecimal = value.toString().includes('.');
    const numericValue = parseFloat(value);
    
    if (isNaN(numericValue)) {
      if (nodeRef.current) nodeRef.current.textContent = value;
      return;
    }

    const target = { val: 0 };
    gsap.to(target, {
      val: numericValue,
      duration: duration,
      ease: "power3.out",
      onUpdate: () => {
        if (nodeRef.current) {
          nodeRef.current.textContent = isDecimal 
            ? target.val.toFixed(2) 
            : Math.floor(target.val);
        }
      }
    });
  }, [value, duration]);

  return <span ref={nodeRef}>0</span>;
};

export default NumberCounter;
