import { motion } from 'motion/react';
import { Match, Member } from '../types';

interface HistoryProps {
  matches: Match[];
  members: Member[];
}

export function History({ matches, members }: HistoryProps) {
  const completedMatches = [...matches].filter(m => m.status === 'completed').reverse();

  return (
    <motion.div key="history" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <h1 className="text-3xl font-bold mb-8">Match History</h1>
      <div className="space-y-4">
        {completedMatches.map(match => (
          <div key={match.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-slate-400">{new Date(match.date).toLocaleString()}</span>
              <span className="text-sm font-bold text-green-600">Completed</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className={`flex-1 text-center p-4 rounded-2xl ${match.winner === 'teamA' ? 'bg-green-50 border-2 border-green-200' : 'bg-slate-50 border border-slate-100'}`}>
                <div className="font-bold text-lg">
                  {match.players.teamA.map(id => members.find(m => m.id === id)?.name).join(' & ')}
                </div>
                <div className="text-2xl font-black mt-2">{match.scoreA}</div>
                {match.winner === 'teamA' ? (
                  <div className="text-xs text-green-600 font-bold mt-1">WINNER</div>
                ) : (
                  <div className="text-xs text-red-600 font-bold mt-1">LOST {match.baseBeers}b</div>
                )}
              </div>
              <div className="text-xl font-black text-slate-200">VS</div>
              <div className={`flex-1 text-center p-4 rounded-2xl ${match.winner === 'teamB' ? 'bg-green-50 border-2 border-green-200' : 'bg-slate-50 border border-slate-100'}`}>
                <div className="font-bold text-lg">
                  {match.players.teamB.map(id => members.find(m => m.id === id)?.name).join(' & ')}
                </div>
                <div className="text-2xl font-black mt-2">{match.scoreB}</div>
                {match.winner === 'teamB' ? (
                  <div className="text-xs text-green-600 font-bold mt-1">WINNER</div>
                ) : (
                  <div className="text-xs text-red-600 font-bold mt-1">LOST {match.baseBeers}b</div>
                )}
              </div>
            </div>
            {match.bets.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-50">
                <div className="text-xs font-bold text-slate-400 uppercase mb-2">Betting Results</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {match.bets.map((bet, i) => {
                    const isWin = bet.team === match.winner;
                    const betTeamNames = match.players[bet.team].map(id => members.find(m => m.id === id)?.name).join(' & ');
                    return (
                      <div key={i} className={`flex justify-between items-center px-3 py-2 rounded-lg text-xs ${isWin ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        <div className="flex flex-col">
                          <span className="font-bold">{members.find(m => m.id === bet.bettorId)?.name}</span>
                          <span className="text-[10px] opacity-70">Bet on: {betTeamNames}</span>
                        </div>
                        <span className="font-bold">{isWin ? 'WON' : `LOST ${bet.amount}b`}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
