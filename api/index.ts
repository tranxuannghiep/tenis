import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const MEMBERS_FILE = path.join(DATA_DIR, 'members.json');
const FUND_FILE = path.join(DATA_DIR, 'fund.json');
const MATCHES_FILE = path.join(DATA_DIR, 'matches.json');

async function ensureDataFiles() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    // Initial Members
    const initialMembers = [
      "Huy tay to", "Đạo", "Lâm", "Quyết", "Hùng con", 
      "Hùng mổ", "Chiêm", "Biên", "Tuân", "Tuấn", "Ngọc", "Yên"
    ].map((name, index) => ({ id: String(index + 1), name, totalBeersLost: 0, paidYears: [] }));

    try {
      await fs.access(MEMBERS_FILE);
    } catch {
      await fs.writeFile(MEMBERS_FILE, JSON.stringify(initialMembers, null, 2));
    }

    try {
      await fs.access(FUND_FILE);
    } catch {
      await fs.writeFile(FUND_FILE, JSON.stringify([], null, 2));
    }

    try {
      await fs.access(MATCHES_FILE);
    } catch {
      await fs.writeFile(MATCHES_FILE, JSON.stringify([], null, 2));
    }
  } catch (err) {
    console.error('Error ensuring data files:', err);
  }
}

async function startServer() {
  await ensureDataFiles();

  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/members', async (req, res) => {
    const data = await fs.readFile(MEMBERS_FILE, 'utf-8');
    res.json(JSON.parse(data));
  });

  app.post('/api/members', async (req, res) => {
    const { name } = req.body;
    const data = JSON.parse(await fs.readFile(MEMBERS_FILE, 'utf-8'));
    const newMember = {
      id: String(Date.now()),
      name,
      totalBeersLost: 0
    };
    data.push(newMember);
    await fs.writeFile(MEMBERS_FILE, JSON.stringify(data, null, 2));
    res.json(newMember);
  });

  app.get('/api/fund', async (req, res) => {
    const data = await fs.readFile(FUND_FILE, 'utf-8');
    res.json(JSON.parse(data));
  });

  app.post('/api/fund', async (req, res) => {
    const transaction = { ...req.body, id: String(Date.now()) };
    const data = JSON.parse(await fs.readFile(FUND_FILE, 'utf-8'));
    data.push(transaction);
    await fs.writeFile(FUND_FILE, JSON.stringify(data, null, 2));
    res.json(transaction);
  });

  app.get('/api/matches', async (req, res) => {
    const data = await fs.readFile(MATCHES_FILE, 'utf-8');
    res.json(JSON.parse(data));
  });

  app.post('/api/matches', async (req, res) => {
    const match = { ...req.body, id: String(Date.now()) };
    const data = JSON.parse(await fs.readFile(MATCHES_FILE, 'utf-8'));
    data.push(match);
    await fs.writeFile(MATCHES_FILE, JSON.stringify(data, null, 2));
    res.json(match);
  });

  app.put('/api/matches/:id', async (req, res) => {
    const { id } = req.params;
    const matches = JSON.parse(await fs.readFile(MATCHES_FILE, 'utf-8'));
    const index = matches.findIndex((m: any) => m.id === id);
    if (index === -1) return res.status(404).send('Match not found');
    matches[index] = { ...req.body, id }; // Ensure ID stays the same
    await fs.writeFile(MATCHES_FILE, JSON.stringify(matches, null, 2));
    res.json(matches[index]);
  });

  app.post('/api/matches/:id/result', async (req, res) => {
    const { id } = req.params;
    const { winner, scoreA, scoreB } = req.body; // 'teamA' or 'teamB'
    
    const matches = JSON.parse(await fs.readFile(MATCHES_FILE, 'utf-8'));
    const members = JSON.parse(await fs.readFile(MEMBERS_FILE, 'utf-8'));
    
    const matchIndex = matches.findIndex((m: any) => m.id === id);
    if (matchIndex === -1) return res.status(404).send('Match not found');
    
    const match = matches[matchIndex];
    match.winner = winner;
    match.scoreA = scoreA;
    match.scoreB = scoreB;
    match.status = 'completed';
    match.completedAt = new Date().toISOString();

    const losers = winner === 'teamA' ? match.players.teamB : match.players.teamA;
    const baseBeers = match.baseBeers;

    // Update losers' beer debt
    losers.forEach((loserId: string) => {
      const member = members.find((m: any) => m.id === loserId);
      if (member) member.totalBeersLost += baseBeers;
    });

    // Update bettors' beer debt
    if (match.bets) {
      match.bets.forEach((bet: any) => {
        if (bet.team !== winner) {
          const member = members.find((m: any) => m.id === bet.bettorId);
          if (member) member.totalBeersLost += bet.amount;
        }
      });
    }

    await fs.writeFile(MATCHES_FILE, JSON.stringify(matches, null, 2));
    await fs.writeFile(MEMBERS_FILE, JSON.stringify(members, null, 2));
    
    res.json({ match, members });
  });

  app.post('/api/members/:id/toggle-fund', async (req, res) => {
    const { id } = req.params;
    const { year } = req.body;
    const members = JSON.parse(await fs.readFile(MEMBERS_FILE, 'utf-8'));
    const memberIndex = members.findIndex((m: any) => m.id === id);
    if (memberIndex === -1) return res.status(404).send('Member not found');
    
    const member = members[memberIndex];
    if (!member.paidYears) member.paidYears = [];
    
    const yearIndex = member.paidYears.indexOf(year);
    if (yearIndex === -1) {
      member.paidYears.push(year);
    } else {
      member.paidYears.splice(yearIndex, 1);
    }
    
    await fs.writeFile(MEMBERS_FILE, JSON.stringify(members, null, 2));
    res.json(member);
  });

  app.delete('/api/members/:id', async (req, res) => {
    const { id } = req.params;
    let members = JSON.parse(await fs.readFile(MEMBERS_FILE, 'utf-8'));
    members = members.filter((m: any) => m.id !== id);
    await fs.writeFile(MEMBERS_FILE, JSON.stringify(members, null, 2));
    res.json({ message: 'Member deleted successfully' });
  });

  app.post('/api/reset-data', async (req, res) => {
    const members = JSON.parse(await fs.readFile(MEMBERS_FILE, 'utf-8'));
    const resetMembers = members.map((m: any) => ({ ...m, totalBeersLost: 0, paidYears: [] }));
    
    await fs.writeFile(MEMBERS_FILE, JSON.stringify(resetMembers, null, 2));
    await fs.writeFile(FUND_FILE, JSON.stringify([], null, 2));
    await fs.writeFile(MATCHES_FILE, JSON.stringify([], null, 2));
    
    res.json({ message: 'Data reset successfully', members: resetMembers });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
