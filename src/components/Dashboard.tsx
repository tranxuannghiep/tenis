import { motion } from 'motion/react';
import { Wallet, Users, Beer, Calendar, Trophy, X } from 'lucide-react';
import { Member, Match, Transaction } from '../types';

interface DashboardProps {
  members: Member[];
  matches: Match[];
  fund: Transaction[];
  isLoggedIn: boolean;
  onReset: () => void;
}

export function Dashboard({ members, matches, fund, isLoggedIn, onReset }: DashboardProps) {
  const totalFund = fund.reduce((acc, curr) => 
    curr.type === 'income' ? acc + curr.amount : acc - curr.amount, 0
  );

  return (
    <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 font-medium">Annual Fund Balance</span>
            <Wallet className="text-blue-600 w-5 h-5" />
          </div>
          <div className="text-4xl font-bold text-blue-600">
            {totalFund.toLocaleString('vi-VN')} <span className="text-lg font-normal text-slate-400">VND</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 font-medium">Total Members</span>
            <Users className="text-green-600 w-5 h-5" />
          </div>
          <div className="text-4xl font-bold text-green-600">{members.length}</div>
        </div>
      </div>

      {isLoggedIn && (
        <div className="mb-8 flex justify-end">
          <button 
            onClick={onReset}
            className="px-4 py-2 rounded-xl text-red-600 border border-red-100 hover:bg-red-50 transition-colors text-sm font-bold flex items-center gap-2"
          >
            <X size={16} /> Reset All Data
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Beer className="text-amber-500" />
            Beer Ranking
          </h2>
          <div className="space-y-4">
            {[...members].sort((a, b) => b.totalBeersLost - a.totalBeersLost).slice(0, 5).map((member, index) => (
              <div key={member.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${index === 0 ? 'bg-amber-100 text-amber-600' : 'bg-white text-slate-400'}`}>
                    {index + 1}
                  </span>
                  <span className="font-medium">{member.name}</span>
                </div>
                <span className="font-bold text-amber-600">{member.totalBeersLost}b</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Calendar className="text-blue-500" />
            Recent Matches
          </h2>
          <div className="space-y-4">
            {matches.slice(-3).reverse().map(match => (
              <div key={match.id} className="p-4 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{match.type}</span>
                  <span className="text-xs text-slate-400">{new Date(match.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className={`flex-1 text-center p-2 rounded-lg ${match.winner === 'teamA' ? 'bg-green-50 text-green-700 font-bold' : 'bg-slate-50'}`}>
                    {match.players.teamA.map(id => members.find(m => m.id === id)?.name).join(' & ')}
                  </div>
                  <span className="text-slate-300 font-bold italic">VS</span>
                  <div className={`flex-1 text-center p-2 rounded-lg ${match.winner === 'teamB' ? 'bg-green-50 text-green-700 font-bold' : 'bg-slate-50'}`}>
                    {match.players.teamB.map(id => members.find(m => m.id === id)?.name).join(' & ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
