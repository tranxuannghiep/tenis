import { motion } from 'motion/react';
import { Plus, Beer, Trash2 } from 'lucide-react';
import { Match, Member } from '../types';

interface MatchesProps {
  matches: Match[];
  members: Member[];
  isLoggedIn: boolean;
  onCreateMatch: () => void;
  onAddBet: (match: Match) => void;
  onCompleteMatch: (match: Match) => void;
  onDeleteMatch: (id: string) => void;
}

export function Matches({ matches, members, isLoggedIn, onCreateMatch, onAddBet, onCompleteMatch, onDeleteMatch }: MatchesProps) {
  const pendingMatches = matches.filter(m => m.status === 'pending');

  return (
    <motion.div key="matches" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Matches</h1>
        <button 
          onClick={onCreateMatch}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} /> New Match
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {pendingMatches.map(match => (
          <div key={match.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative">
            {isLoggedIn && (
              <button 
                onClick={() => onDeleteMatch(match.id)}
                className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all z-10"
                title="Delete Match"
              >
                <Trash2 size={20} />
              </button>
            )}
            <div className="flex justify-between items-center mb-6 pr-10">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase">
                  {match.type}
                </span>
                <span className="text-slate-400 text-sm">{new Date(match.date).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1 text-amber-600 font-bold">
                <Beer size={18} /> {match.baseBeers}b
              </div>
            </div>

            <div className="flex items-center justify-center gap-8 mb-8">
              <div className="flex-1 text-center">
                <div className="text-2xl font-bold mb-2">
                  {match.players.teamA.map(id => members.find(m => m.id === id)?.name).join(' & ')}
                </div>
                <div className="text-slate-400 text-sm">Team A</div>
              </div>
              <div className="text-4xl font-black text-slate-200 italic">VS</div>
              <div className="flex-1 text-center">
                <div className="text-2xl font-bold mb-2">
                  {match.players.teamB.map(id => members.find(m => m.id === id)?.name).join(' & ')}
                </div>
                <div className="text-slate-400 text-sm">Team B</div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6 flex flex-wrap gap-4 justify-between items-center">
              <div className="flex gap-2">
                <button 
                  onClick={() => onAddBet(match)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                  <Plus size={16} /> Add Bet
                </button>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  {match.bets.length} bets placed
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => onCompleteMatch(match)}
                  className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-700 transition-colors"
                >
                  Finish Match
                </button>
              </div>
            </div>
          </div>
        ))}
        {pendingMatches.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            No pending matches. Create one to start!
          </div>
        )}
      </div>
    </motion.div>
  );
}
