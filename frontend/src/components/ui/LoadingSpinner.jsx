import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ text = 'Memuat data...', fullPage = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <Loader2 size={32} className="text-primary animate-spin" />
      <p className="text-sm text-slate-500 font-medium">{text}</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
