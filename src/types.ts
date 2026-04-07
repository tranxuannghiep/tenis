export interface Member {
  id: string;
  name: string;
  totalBeersLost: number;
  paidYears?: number[]; // Track which years the annual fund is paid
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  category: string;
  type: 'income' | 'expense';
  memberId?: string; // Optional: link to member for fund contributions
  year?: number; // Year the transaction applies to
}

export interface Bet {
  bettorId: string;
  team: 'teamA' | 'teamB';
  amount: number;
}

export interface Match {
  id: string;
  date: string;
  type: 'single' | 'double';
  players: {
    teamA: string[];
    teamB: string[];
  };
  bets: Bet[];
  winner: 'teamA' | 'teamB' | null;
  scoreA?: number;
  scoreB?: number;
  baseBeers: number;
  status: 'pending' | 'completed';
  completedAt?: string;
}
