import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PageHeader = ({ title, subtitle, showBack = false, backTo = -1, actions }) => {
  const navigate = useNavigate();

  // Jika tidak ada aksi dan tidak ada tombol kembali, jangan render sama sekali
  if (!showBack && !actions) return null;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="flex items-center gap-3">
        {showBack && (
          <button 
            onClick={() => navigate(backTo)}
            className="p-2 hover:bg-slate-100 bg-white border border-slate-200 shadow-sm rounded-xl transition-colors flex items-center justify-center"
            title="Kembali"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
