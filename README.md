# Table Tennis Team Manager

A comprehensive web application for managing members, match betting (in "beers" - b), and annual fund tracking for a table tennis team.

## Features

- **Member Management**: Add and track team members.
- **Annual Fund Tracking**: Record income and expenditures with category-based reporting.
- **Match Setup**: Create Single (1-1) or Double (2-2) matches.
- **Betting System**: Place bets on matches and automatically calculate beer debts.
- **Leaderboard**: Real-time beer ranking and fund balance dashboard.
- **Data Persistence**: All data is stored in local JSON files (`data/*.json`).

## How to Run Locally

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (comes with Node.js)

### Installation

1. Clone or download the source code.
2. Open your terminal in the project root directory.
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

1. Start the development server (runs both backend and frontend):
   ```bash
   npm run dev
   ```
2. Open your browser and navigate to `http://localhost:3000`.

### Production Build

1. Build the frontend assets:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   npm start
   ```

## Data Storage

The application uses a local `data/` directory to store:
- `members.json`: Team member list and beer statistics.
- `fund.json`: Financial transactions.
- `matches.json`: Match history and pending matches.
