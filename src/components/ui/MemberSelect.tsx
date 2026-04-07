import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Member } from '../../types';

export function MemberSelect({ members, value, onChange }: { members: Member[], value: string, onChange: (id: string) => void, key?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedMember = members.find(m => m.id === value);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-left flex justify-between items-center focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <span className={selectedMember ? 'text-slate-900' : 'text-slate-400'}>
          {selectedMember ? selectedMember.name : 'Select Member'}
        </span>
        <ChevronRight size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[110]" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 z-[120] overflow-hidden">
            <div className="max-h-64 overflow-y-auto">
              <button 
                onClick={() => {
                  onChange('');
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 text-slate-400 italic border-b border-slate-50"
              >
                None
              </button>
              {members.map(m => (
                <button 
                  key={m.id}
                  onClick={() => {
                    onChange(m.id);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-blue-50 transition-colors ${m.id === value ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-700'}`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
