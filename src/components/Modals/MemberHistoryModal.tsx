import { Calendar } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Member, Transaction } from '../../types';

interface MemberHistoryModalProps {
  member: Member;
  fund: Transaction[];
  onClose: () => void;
}

export function MemberHistoryModal({ member, fund, onClose }: MemberHistoryModalProps) {
  const history = fund
    .filter(t => t.memberId === member.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalContributed = fund
    .filter(t => t.memberId === member.id && t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <Modal title={`Payment History - ${member.name}`} onClose={onClose}>
      <div className="space-y-4">
        <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-3">
          {history.map(t => (
            <div key={t.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <div className="flex justify-between items-start mb-1">
                <div className="font-semibold text-slate-700">
                  {t.description} {t.year && <span className="text-blue-600 ml-1">({t.year})</span>}
                </div>
                <div className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString('vi-VN')} VND
                </div>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-400">
                <div className="flex items-center gap-1">
                  <Calendar size={12} /> {new Date(t.date).toLocaleDateString('vi-VN')}
                </div>
                <div className="px-2 py-0.5 rounded-md bg-white border border-slate-100">
                  {t.category}
                </div>
              </div>
            </div>
          ))}
          {history.length === 0 && (
            <div className="text-center py-8 text-slate-400 italic">
              No payment history found for this member.
            </div>
          )}
        </div>
        <div className="pt-4 border-t border-slate-100">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">Total Contributed:</span>
            <span className="text-xl font-bold text-blue-600">
              {totalContributed.toLocaleString('vi-VN')} VND
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
