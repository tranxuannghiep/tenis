import { motion } from 'motion/react';
import { Calendar, Plus } from 'lucide-react';
import { Transaction } from '../types';

interface FundProps {
  fund: Transaction[];
  fundYearFilter: number | 'all';
  setFundYearFilter: (year: number | 'all') => void;
  isLoggedIn: boolean;
  onNewTransaction: () => void;
  onLogin: () => void;
}

export function Fund({ fund, fundYearFilter, setFundYearFilter, isLoggedIn, onNewTransaction, onLogin }: FundProps) {
  const totalFund = fund.reduce((acc, curr) => 
    curr.type === 'income' ? acc + curr.amount : acc - curr.amount, 0
  );

  const years = Array.from(new Set(fund.map(t => t.year || new Date(t.date).getFullYear()))).sort((a: number, b: number) => b - a);

  return (
    <motion.div key="fund" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Annual Fund</h1>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200">
            <Calendar size={16} className="text-slate-400" />
            <select 
              value={fundYearFilter}
              onChange={(e) => setFundYearFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="bg-transparent border-none focus:ring-0 text-sm font-medium"
            >
              <option value="all">All Years</option>
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <button 
            onClick={() => {
              if (isLoggedIn) {
                onNewTransaction();
              } else {
                onLogin();
              }
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            <Plus size={20} /> New Transaction
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-slate-500 text-sm mb-1">Total Balance</div>
          <div className="text-2xl font-bold text-blue-600">{totalFund.toLocaleString('vi-VN')} VND</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-slate-500 text-sm mb-1">Total Income</div>
          <div className="text-2xl font-bold text-green-600">
            {fund.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0).toLocaleString('vi-VN')} VND
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-slate-500 text-sm mb-1">Total Expense</div>
          <div className="text-2xl font-bold text-red-600">
            {fund.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0).toLocaleString('vi-VN')} VND
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-600">Date/Year</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Description</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Category</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[...fund]
              .filter(t => fundYearFilter === 'all' || (t.year || new Date(t.date).getFullYear()) === fundYearFilter)
              .reverse()
              .map(t => (
              <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium">{new Date(t.date).toLocaleDateString()}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Year: {t.year || new Date(t.date).getFullYear()}</div>
                </td>
                <td className="px-6 py-4 font-medium">{t.description}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider">
                    {t.category}
                  </span>
                </td>
                <td className={`px-6 py-4 text-right font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString('vi-VN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
