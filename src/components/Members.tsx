import { motion } from 'motion/react';
import { Plus, Beer, Wallet, Trash2, History, ChevronRight } from 'lucide-react';
import { Member } from '../types';

interface MembersProps {
  members: Member[];
  isLoggedIn: boolean;
  onAddMember: () => void;
  onQuickPay: (member: Member) => void;
  onDeleteMember: (id: string) => void;
  onViewHistory: (id: string) => void;
}

export function Members({ members, isLoggedIn, onAddMember, onQuickPay, onDeleteMember, onViewHistory }: MembersProps) {
  const sortedMembers = [...members].sort((a, b) => a.name.localeCompare(b.name, 'vi'));

  return (
    <motion.div key="members" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Members</h1>
        <button 
          onClick={onAddMember}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} /> Add Member
        </button>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-600 w-16">STT</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Name</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedMembers.map((member, index) => (
              <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-slate-400 font-medium">
                  {index + 1}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium">{member.name}</div>
                  <div className="text-xs text-slate-400"></div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {isLoggedIn && (
                      <button 
                        onClick={() => onQuickPay(member)}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-1"
                      >
                        <Wallet size={14} /> Quick Pay
                      </button>
                    )}
                    {isLoggedIn && (
                      <button 
                        onClick={() => onDeleteMember(member.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                    <button 
                      onClick={() => onViewHistory(member.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      title="View History"
                    >
                      <History size={18} />
                    </button>
                    <button className="text-slate-400 hover:text-blue-600 transition-colors">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
