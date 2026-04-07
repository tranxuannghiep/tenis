import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Member, Transaction, Match } from './types';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Members } from './components/Members';
import { Fund } from './components/Fund';
import { Matches } from './components/Matches';
import { History } from './components/History';
import { Reports } from './components/Reports';
import { LoginModal } from './components/Modals/LoginModal';
import { AddMemberModal } from './components/Modals/AddMemberModal';
import { AddTransactionModal } from './components/Modals/AddTransactionModal';
import { CreateMatchModal } from './components/Modals/CreateMatchModal';
import { AddBetModal } from './components/Modals/AddBetModal';
import { CompleteMatchModal } from './components/Modals/CompleteMatchModal';
import { MemberHistoryModal } from './components/Modals/MemberHistoryModal';
import { ResetModal } from './components/Modals/ResetModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'members' | 'fund' | 'matches' | 'history' | 'reports'>('dashboard');
  const [members, setMembers] = useState<Member[]>([]);
  const [fund, setFund] = useState<Transaction[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isLoggedIn') === 'true';
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn.toString());
  }, [isLoggedIn]);

  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState<string | null>(null);

  // Modal State
  const [activeModal, setActiveModal] = useState<'addMember' | 'addTransaction' | 'createMatch' | 'addBet' | 'completeMatch' | 'reset' | 'login' | 'memberHistory' | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  // Form States
  const [memberName, setMemberName] = useState('');
  const [transactionData, setTransactionData] = useState({
    type: 'income' as 'income' | 'expense',
    amount: '',
    description: '',
    category: 'Other',
    memberId: '',
    year: new Date().getFullYear()
  });
  const [fundYearFilter, setFundYearFilter] = useState<number | 'all'>('all');

  const [matchData, setMatchData] = useState({
    type: 'single' as 'single' | 'double',
    teamA: [] as string[],
    teamB: [] as string[],
    date: new Date().toISOString().split('T')[0],
    baseBeers: 5
  });
  const [betData, setBetData] = useState({
    bettorId: '',
    team: 'teamA' as 'teamA' | 'teamB',
    amount: '5'
  });
  const [resultData, setResultData] = useState({
    winner: 'teamA' as 'teamA' | 'teamB',
    scoreA: '',
    scoreB: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [membersRes, fundRes, matchesRes] = await Promise.all([
        fetch('/api/members'),
        fetch('/api/fund'),
        fetch('/api/matches')
      ]);
      setMembers(await membersRes.json());
      setFund(await fundRes.json());
      setMatches(await matchesRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortedMembers = [...members].sort((a, b) => a.name.localeCompare(b.name, 'vi'));

  const addMember = async (name: string) => {
    if (!isLoggedIn) {
      setActiveModal('login');
      return;
    }
    if (!name) return;
    const res = await fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    const newMember = await res.json();
    setMembers([...members, newMember]);
  };

  const deleteMember = async (id: string) => {
    if (!isLoggedIn) {
      setActiveModal('login');
      return;
    }
    // if (!confirm('Are you sure you want to delete this member?')) return;
    await fetch(`/api/members/${id}`, { method: 'DELETE' });
    setMembers(members.filter(m => m.id !== id));
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    if (!isLoggedIn) {
      setActiveModal('login');
      return;
    }
    const res = await fetch('/api/fund', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction)
    });
    const newTransaction = await res.json();
    setFund([...fund, newTransaction]);
  };

  const createMatch = async (match: Omit<Match, 'id' | 'status' | 'winner'>) => {
    const res = await fetch('/api/matches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...match, status: 'pending', winner: null })
    });
    const newMatch = await res.json();
    setMatches([...matches, newMatch]);
  };

  const deleteMatch = async (id: string) => {
    if (!isLoggedIn) {
      setActiveModal('login');
      return;
    }
    // if (!confirm('Are you sure you want to delete this match?')) return;
    await fetch(`/api/matches/${id}`, { method: 'DELETE' });
    setMatches(matches.filter(m => m.id !== id));
  };

  const completeMatch = async (matchId: string, winner: 'teamA' | 'teamB', scoreA: number, scoreB: number) => {
    const res = await fetch(`/api/matches/${matchId}/result`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ winner, scoreA, scoreB })
    });
    const { match: updatedMatch, members: updatedMembers } = await res.json();
    setMatches(matches.map(m => m.id === matchId ? updatedMatch : m));
    setMembers(updatedMembers);
  };

  const toggleFund = async (memberId: string, year: number) => {
    const res = await fetch(`/api/members/${memberId}/toggle-fund`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ year })
    });
    const updatedMember = await res.json();
    setMembers(members.map(m => m.id === memberId ? updatedMember : m));
  };

  const resetData = async () => {
    if (!isLoggedIn) {
      setActiveModal('login');
      return;
    }
    const res = await fetch('/api/reset-data', { method: 'POST' });
    const { members: resetMembers } = await res.json();
    setMembers(resetMembers);
    setFund([]);
    setMatches([]);
    setActiveModal(null);
  };

  const handleLogin = () => {
    if (loginForm.username === 'admin' && loginForm.password === 'admin@123') {
      setIsLoggedIn(true);
      setActiveModal(null);
      setLoginForm({ username: '', password: '' });
      setLoginError(null);
    } else {
      setLoginError('Invalid credentials!');
    }
  };

  const totalFund = fund.reduce((acc, curr) => 
    curr.type === 'income' ? acc + curr.amount : acc - curr.amount, 0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20 md:pb-0 md:pl-72">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isLoggedIn={isLoggedIn} 
        onLogin={() => setActiveModal('login')} 
        onLogout={() => setIsLoggedIn(false)} 
      />

      <main className="p-4 md:p-8 max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <Dashboard 
              members={members} 
              matches={matches} 
              fund={fund} 
              isLoggedIn={isLoggedIn} 
              onReset={() => setActiveModal('reset')} 
            />
          )}

          {activeTab === 'members' && (
            <Members 
              members={members} 
              isLoggedIn={isLoggedIn} 
              onAddMember={() => setActiveModal('addMember')} 
              onQuickPay={(member) => {
                setTransactionData({
                  ...transactionData,
                  type: 'income',
                  memberId: member.id,
                  description: `Annual fund contribution from ${member.name}`,
                  category: 'Contribution'
                });
                setActiveModal('addTransaction');
              }} 
              onDeleteMember={deleteMember} 
              onViewHistory={(id) => {
                setSelectedMemberId(id);
                setActiveModal('memberHistory');
              }} 
            />
          )}

          {activeTab === 'fund' && (
            <Fund 
              fund={fund} 
              fundYearFilter={fundYearFilter} 
              setFundYearFilter={setFundYearFilter} 
              isLoggedIn={isLoggedIn} 
              onNewTransaction={() => setActiveModal('addTransaction')} 
              onLogin={() => setActiveModal('login')} 
            />
          )}

          {activeTab === 'matches' && (
            <Matches 
              matches={matches} 
              members={members} 
              onCreateMatch={() => setActiveModal('createMatch')} 
              onAddBet={(match) => {
                setSelectedMatch(match);
                setActiveModal('addBet');
              }} 
              onCompleteMatch={(match) => {
                setSelectedMatch(match);
                setActiveModal('completeMatch');
              }} 
              onDeleteMatch={deleteMatch}
              isLoggedIn={isLoggedIn}
            />
          )}

          {activeTab === 'history' && <History matches={matches} members={members} />}
          {activeTab === 'reports' && <Reports fund={fund} />}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {activeModal === 'login' && (
          <LoginModal 
            loginForm={loginForm} 
            setLoginForm={setLoginForm} 
            onLogin={handleLogin} 
            onClose={() => { setActiveModal(null); setLoginError(null); }} 
            error={loginError}
          />
        )}
        {activeModal === 'addMember' && (
          <AddMemberModal 
            memberName={memberName} 
            setMemberName={setMemberName} 
            onAdd={addMember} 
            onClose={() => setActiveModal(null)} 
          />
        )}
        {activeModal === 'addTransaction' && (
          <AddTransactionModal 
            transactionData={transactionData} 
            setTransactionData={setTransactionData} 
            members={sortedMembers} 
            onSave={addTransaction} 
            onClose={() => setActiveModal(null)} 
          />
        )}
        {activeModal === 'createMatch' && (
          <CreateMatchModal 
            matchData={matchData} 
            setMatchData={setMatchData} 
            members={sortedMembers} 
            onCreate={createMatch} 
            onClose={() => setActiveModal(null)} 
          />
        )}
        {activeModal === 'addBet' && selectedMatch && (
          <AddBetModal 
            selectedMatch={selectedMatch} 
            betData={betData} 
            setBetData={setBetData} 
            members={sortedMembers} 
            onConfirm={(match, bet) => {
              const newMatch = { 
                ...match, 
                bets: [...match.bets, bet] 
              };
              fetch(`/api/matches/${match.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMatch)
              }).then(() => {
                fetchData();
                setActiveModal(null);
                setSelectedMatch(null);
                setBetData({ bettorId: '', team: 'teamA', amount: '5' });
              });
            }} 
            onClose={() => { setActiveModal(null); setSelectedMatch(null); }} 
          />
        )}
        {activeModal === 'completeMatch' && selectedMatch && (
          <CompleteMatchModal 
            selectedMatch={selectedMatch} 
            resultData={resultData} 
            setResultData={setResultData} 
            members={members} 
            onComplete={completeMatch} 
            onClose={() => { setActiveModal(null); setSelectedMatch(null); }} 
          />
        )}
        {activeModal === 'memberHistory' && selectedMemberId && (
          <MemberHistoryModal 
            member={members.find(m => m.id === selectedMemberId)!} 
            fund={fund} 
            onClose={() => setActiveModal(null)} 
          />
        )}
        {activeModal === 'reset' && (
          <ResetModal 
            onReset={resetData} 
            onClose={() => setActiveModal(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
