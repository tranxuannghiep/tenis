import { Modal } from '../ui/Modal';
import { MemberSelect } from '../ui/MemberSelect';
import { Member, Match } from '../../types';

interface AddBetModalProps {
  selectedMatch: Match;
  betData: any;
  setBetData: (data: any) => void;
  members: Member[];
  onConfirm: (match: Match, bet: any) => void;
  onClose: () => void;
}

export function AddBetModal({ selectedMatch, betData, setBetData, members, onConfirm, onClose }: AddBetModalProps) {
  return (
    <Modal title="Place a Bet" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Who is betting?</label>
          <MemberSelect 
            members={members}
            value={betData.bettorId}
            onChange={(id) => setBetData({...betData, bettorId: id})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Betting on</label>
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
            <button 
              onClick={() => setBetData({...betData, team: 'teamA'})}
              className={`flex-1 py-2 rounded-lg font-bold transition-all ${betData.team === 'teamA' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
            >
              Team A
            </button>
            <button 
              onClick={() => setBetData({...betData, team: 'teamB'})}
              className={`flex-1 py-2 rounded-lg font-bold transition-all ${betData.team === 'teamB' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
            >
              Team B
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Amount (Beers)</label>
          <select 
            value={betData.amount}
            onChange={(e) => setBetData({...betData, amount: e.target.value})}
            className="w-full px-4 py-2 rounded-xl border border-slate-200"
          >
            {[5, 10, 15, 20].map(a => <option key={a} value={a}>{a}b</option>)}
          </select>
        </div>
        <button 
          onClick={() => {
            if (betData.bettorId) {
              onConfirm(selectedMatch, { 
                bettorId: betData.bettorId, 
                team: betData.team, 
                amount: Number(betData.amount) 
              });
              onClose();
            }
          }}
          disabled={!betData.bettorId}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          Confirm Bet
        </button>
      </div>
    </Modal>
  );
}
