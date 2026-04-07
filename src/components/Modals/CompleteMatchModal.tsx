import { Modal } from '../ui/Modal';
import { Member, Match } from '../../types';

interface CompleteMatchModalProps {
  selectedMatch: Match;
  resultData: any;
  setResultData: (data: any) => void;
  members: Member[];
  onComplete: (matchId: string, winner: 'teamA' | 'teamB', scoreA: number, scoreB: number) => void;
  onClose: () => void;
}

export function CompleteMatchModal({ selectedMatch, resultData, setResultData, members, onComplete, onClose }: CompleteMatchModalProps) {
  return (
    <Modal title="Complete Match" onClose={onClose}>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-8">
          <div className="text-center">
            <div className="font-bold mb-2 truncate">
              {selectedMatch.players.teamA.map(id => members.find(m => m.id === id)?.name).join(' & ')}
            </div>
            <input 
              type="number" 
              value={resultData.scoreA}
              onChange={(e) => {
                const val = e.target.value;
                const otherVal = resultData.scoreB;
                let winner = resultData.winner;
                if (val !== '' && otherVal !== '') {
                  winner = Number(val) > Number(otherVal) ? 'teamA' : 'teamB';
                }
                setResultData({...resultData, scoreA: val, winner});
              }}
              className="w-full text-center text-3xl font-black p-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
            <button 
              onClick={() => setResultData({...resultData, winner: 'teamA'})}
              className={`mt-4 w-full py-2 rounded-lg font-bold transition-all ${resultData.winner === 'teamA' ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-400'}`}
            >
              Winner
            </button>
          </div>
          <div className="text-center">
            <div className="font-bold mb-2 truncate">
              {selectedMatch.players.teamB.map(id => members.find(m => m.id === id)?.name).join(' & ')}
            </div>
            <input 
              type="number" 
              value={resultData.scoreB}
              onChange={(e) => {
                const val = e.target.value;
                const otherVal = resultData.scoreA;
                let winner = resultData.winner;
                if (val !== '' && otherVal !== '') {
                  winner = Number(val) > Number(otherVal) ? 'teamB' : 'teamA';
                }
                setResultData({...resultData, scoreB: val, winner});
              }}
              className="w-full text-center text-3xl font-black p-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
            <button 
              onClick={() => setResultData({...resultData, winner: 'teamB'})}
              className={`mt-4 w-full py-2 rounded-lg font-bold transition-all ${resultData.winner === 'teamB' ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-400'}`}
            >
              Winner
            </button>
          </div>
        </div>

        <button 
          onClick={() => {
            if (resultData.scoreA !== '' && resultData.scoreB !== '') {
              onComplete(
                selectedMatch.id, 
                resultData.winner, 
                Number(resultData.scoreA), 
                Number(resultData.scoreB)
              );
              onClose();
            }
          }}
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
        >
          Save Result
        </button>
      </div>
    </Modal>
  );
}
