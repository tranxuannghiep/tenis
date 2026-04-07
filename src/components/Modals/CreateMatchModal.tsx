import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { MemberSelect } from '../ui/MemberSelect';
import { Member } from '../../types';

interface CreateMatchModalProps {
  matchData: any;
  setMatchData: (data: any) => void;
  members: Member[];
  onCreate: (data: any) => void;
  onClose: () => void;
}

export function CreateMatchModal({ matchData, setMatchData, members, onCreate, onClose }: CreateMatchModalProps) {
  const [error, setError] = useState<string | null>(null);

  return (
    <Modal title="Create New Match" onClose={onClose}>
      <div className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
            {error}
          </div>
        )}
        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
          <button 
            onClick={() => setMatchData({...matchData, type: 'single', teamA: [], teamB: []})}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${matchData.type === 'single' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
          >
            Single (1-1)
          </button>
          <button 
            onClick={() => setMatchData({...matchData, type: 'double', teamA: [], teamB: []})}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${matchData.type === 'double' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
          >
            Double (2-2)
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Match Date</label>
          <input 
            type="date" 
            value={matchData.date}
            onChange={(e) => setMatchData({...matchData, date: e.target.value})}
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Team A</label>
            <div className="space-y-2">
              {Array.from({ length: matchData.type === 'single' ? 1 : 2 }).map((_, i) => (
                <MemberSelect 
                  key={`A-${i}`}
                  members={members}
                  value={matchData.teamA[i] || ''}
                  onChange={(id) => {
                    const newTeamA = [...matchData.teamA];
                    newTeamA[i] = id;
                    setMatchData({...matchData, teamA: newTeamA});
                  }}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Team B</label>
            <div className="space-y-2">
              {Array.from({ length: matchData.type === 'single' ? 1 : 2 }).map((_, i) => (
                <MemberSelect 
                  key={`B-${i}`}
                  members={members}
                  value={matchData.teamB[i] || ''}
                  onChange={(id) => {
                    const newTeamB = [...matchData.teamB];
                    newTeamB[i] = id;
                    setMatchData({...matchData, teamB: newTeamB});
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Base Beers</label>
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
            {[5, 10, 20].map(val => (
              <button 
                key={val}
                onClick={() => setMatchData({...matchData, baseBeers: val})}
                className={`flex-1 py-2 rounded-lg font-bold transition-all ${matchData.baseBeers === val ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500'}`}
              >
                {val}b
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={() => {
            const count = matchData.type === 'single' ? 1 : 2;
            const isTeamAValid = matchData.teamA.filter(id => id && id !== '').length === count;
            const isTeamBValid = matchData.teamB.filter(id => id && id !== '').length === count;
            
            if (isTeamAValid && isTeamBValid) {
              setError(null);
              onCreate({
                date: new Date(matchData.date).toISOString(),
                type: matchData.type,
                players: { 
                  teamA: matchData.teamA.filter(id => id), 
                  teamB: matchData.teamB.filter(id => id) 
                },
                bets: [],
                baseBeers: matchData.baseBeers
              });
              onClose();
            } else {
              setError(`Vui lòng chọn đủ ${count} cầu thủ cho mỗi đội!`);
            }
          }}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
        >
          Create Match
        </button>
      </div>
    </Modal>
  );
}
