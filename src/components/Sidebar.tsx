import { LayoutDashboard, Users, Wallet, Trophy, History, PieChart, LogIn, LogOut } from 'lucide-react';
import { NavItem } from './ui/NavItem';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export function Sidebar({ activeTab, setActiveTab, isLoggedIn, onLogin, onLogout }: SidebarProps) {
  return (
    <aside className="fixed bottom-0 left-0 right-0 md:right-auto md:top-0 md:bottom-0 md:w-72 bg-white border-t md:border-t-0 md:border-r border-slate-100 p-2 md:p-6 z-50 flex md:flex-col">
      <div className="hidden md:flex items-center gap-3 mb-10 px-4">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
          <Trophy size={24} />
        </div>
        <span className="text-xl font-black tracking-tight">CLBF4</span>
      </div>

      <nav className="flex md:flex-col justify-around md:gap-2">
        <NavItem 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')} 
          icon={<LayoutDashboard size={20} />} 
          label="Dashboard" 
        />
        <NavItem 
          active={activeTab === 'members'} 
          onClick={() => setActiveTab('members')} 
          icon={<Users size={20} />} 
          label="Members" 
        />
        <NavItem 
          active={activeTab === 'fund'} 
          onClick={() => setActiveTab('fund')} 
          icon={<Wallet size={20} />} 
          label="Fund" 
        />
        <NavItem 
          active={activeTab === 'matches'} 
          onClick={() => setActiveTab('matches')} 
          icon={<Trophy size={20} />} 
          label="Matches" 
        />
        <NavItem 
          active={activeTab === 'history'} 
          onClick={() => setActiveTab('history')} 
          icon={<History size={20} />} 
          label="History" 
        />
        <NavItem 
          active={activeTab === 'reports'} 
          onClick={() => setActiveTab('reports')} 
          icon={<PieChart size={20} />} 
          label="Reports" 
        />
      </nav>

      <div className="hidden md:block mt-auto pt-10">
        {!isLoggedIn ? (
          <button 
            onClick={onLogin}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-all font-semibold"
          >
            <LogIn size={20} /> Login
          </button>
        ) : (
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-semibold"
          >
            <LogOut size={20} /> Logout
          </button>
        )}
      </div>
    </aside>
  );
}
