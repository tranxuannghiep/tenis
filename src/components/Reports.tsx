import { motion } from 'motion/react';
import { Transaction } from '../types';
import { CATEGORIES } from '../constants';

interface ReportsProps {
  fund: Transaction[];
}

export function Reports({ fund }: ReportsProps) {
  const years = Array.from(new Set(fund.map(t => t.year || new Date(t.date).getFullYear()))).sort((a: number, b: number) => b - a);

  return (
    <motion.div key="reports" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <h1 className="text-3xl font-bold mb-8">Annual Reports</h1>
      
      <div className="space-y-8">
        {years.map((year: number) => {
          const yearTransactions = fund.filter(t => (t.year || new Date(t.date).getFullYear()) === year);
          const yearIncome = yearTransactions.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
          const yearExpense = yearTransactions.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);
          
          return (
            <div key={year} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold mb-6 text-slate-800">Year {year}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="text-blue-600 text-sm font-medium mb-1">Net Balance</div>
                  <div className="text-xl font-bold text-blue-700">{(yearIncome - yearExpense).toLocaleString('vi-VN')} VND</div>
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                  <div className="text-green-600 text-sm font-medium mb-1">Total Income</div>
                  <div className="text-xl font-bold text-green-700">{yearIncome.toLocaleString('vi-VN')} VND</div>
                </div>
                <div className="p-4 bg-red-50 rounded-xl">
                  <div className="text-red-600 text-sm font-medium mb-1">Total Expense</div>
                  <div className="text-xl font-bold text-red-700">{yearExpense.toLocaleString('vi-VN')} VND</div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Expense Breakdown</h3>
                {CATEGORIES.filter(c => c !== 'Contribution' && c !== 'Sponsorship').map(cat => {
                  const catTotal = yearTransactions.filter(t => t.type === 'expense' && t.category === cat).reduce((a, b) => a + b.amount, 0);
                  if (catTotal === 0) return null;
                  return (
                    <div key={cat} className="flex justify-between items-center p-3 rounded-lg bg-slate-50">
                      <span className="font-medium">{cat}</span>
                      <span className="font-bold text-red-600">{catTotal.toLocaleString('vi-VN')} VND</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
