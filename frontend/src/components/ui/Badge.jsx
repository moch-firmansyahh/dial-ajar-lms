import React from 'react';

const Badge = ({ type = 'default', label }) => {
  const styles = {
    sukses:     'text-emerald-700 bg-emerald-50 border-emerald-200',
    peringatan: 'text-orange-700 bg-orange-50 border-orange-200',
    bahaya:     'text-red-600 bg-red-50 border-red-200',
    info:       'text-primary bg-blue-50 border-blue-200',
    kuis:       'text-amber-700 bg-amber-50 border-amber-200',
    default:    'text-slate-600 bg-slate-100 border-slate-200',
    enrolled:   'text-white bg-emerald-500 border-emerald-500',
    draft:      'text-slate-500 bg-slate-50 border-slate-300',
    urgent:     'text-red-600 bg-red-50 border-red-200',
  };

  const selectedStyle = styles[type] || styles.default;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full border ${selectedStyle}`}>
      {label}
    </span>
  );
};

export default Badge;
