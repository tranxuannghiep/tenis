import { Modal } from '../ui/Modal';
import { MemberSelect } from '../ui/MemberSelect';
import { Member } from '../../types';
import { CATEGORIES, formatVND, parseVND } from '../../constants';

interface AddTransactionModalProps {
  transactionData: any;
  setTransactionData: (data: any) => void;
  members: Member[];
  onSave: (data: any) => void;
  onClose: () => void;
}

export function AddTransactionModal({ transactionData, setTransactionData, members, onSave, onClose }: AddTransactionModalProps) {
  return (
    <Modal title="New Transaction" onClose={onClose}>
      <div className="space-y-4">
        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
          <button 
            onClick={() => setTransactionData({...transactionData, type: 'income'})}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${transactionData.type === 'income' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-500'}`}
          >
            Income
          </button>
          <button 
            onClick={() => setTransactionData({...transactionData, type: 'expense'})}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${transactionData.type === 'expense' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500'}`}
          >
            Expense
          </button>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Amount (VND)</label>
          <input 
            type="text" 
            value={formatVND(transactionData.amount)}
            onChange={(e) => setTransactionData({...transactionData, amount: parseVND(e.target.value)})}
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <input 
            type="text" 
            value={transactionData.description}
            onChange={(e) => setTransactionData({...transactionData, description: e.target.value})}
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="What is this for?"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
          <select 
            value={transactionData.category}
            onChange={(e) => setTransactionData({...transactionData, category: e.target.value})}
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
          <select 
            value={transactionData.year}
            onChange={(e) => setTransactionData({...transactionData, year: Number(e.target.value)})}
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {Array.from({length: 17}, (_, i) => 2024 + i).map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        {transactionData.type === 'income' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Member (Optional)</label>
            <MemberSelect 
              members={members}
              value={transactionData.memberId}
              onChange={(id) => setTransactionData({...transactionData, memberId: id})}
            />
          </div>
        )}
        <button 
          onClick={() => {
            onSave({
              date: new Date().toISOString(),
              amount: Number(transactionData.amount),
              description: transactionData.description,
              category: transactionData.category,
              type: transactionData.type,
              memberId: transactionData.memberId || undefined,
              year: transactionData.year
            });
            onClose();
          }}
          disabled={!transactionData.amount || !transactionData.description}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          Save Transaction
        </button>
      </div>
    </Modal>
  );
}
