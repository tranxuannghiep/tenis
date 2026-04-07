import { ReactNode } from 'react';

export function NavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 px-3 py-2 md:px-4 md:py-3 rounded-xl transition-all ${
        active 
          ? 'text-blue-600 bg-blue-50 md:bg-blue-600 md:text-white shadow-sm' 
          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
      }`}
    >
      {icon}
      <span className="text-[10px] md:text-sm font-semibold">{label}</span>
    </button>
  );
}
