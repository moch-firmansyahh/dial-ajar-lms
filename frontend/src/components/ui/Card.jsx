import React from 'react';

const Card = ({ children, className = '', onClick, gradient, noPadding = false }) => {
  return (
    <div 
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5' : ''
      } ${noPadding ? '' : 'p-5'} ${className}`}
      onClick={onClick}
    >
      {gradient && (
        <div className={`${gradient} h-36 -mx-5 -mt-5 mb-4 rounded-t-2xl relative overflow-hidden`}>
          {/* Decorative shapes */}
          <div className="absolute top-4 right-4 w-16 h-16 bg-white/20 rounded-xl rotate-12" />
          <div className="absolute bottom-3 left-6 w-10 h-10 bg-white/15 rounded-full" />
          <div className="absolute top-8 left-1/2 w-8 h-8 bg-white/10 rounded-lg -rotate-6" />
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
