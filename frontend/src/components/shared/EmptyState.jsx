import React from 'react';
import { FileQuestion } from 'lucide-react';

const EmptyState = ({ title = 'Data Kosong', description = 'Belum ada data untuk ditampilkan.', icon: Icon = FileQuestion }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="bg-slate-100 p-5 rounded-2xl mb-5">
        <Icon size={36} className="text-slate-400" />
      </div>
      <h3 className="text-lg font-medium text-slate-800 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xs leading-relaxed">{description}</p>
    </div>
  );
};

export default EmptyState;
