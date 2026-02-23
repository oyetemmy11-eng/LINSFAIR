# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

LINSFAIR is a React frontend for a dual-currency (NGN/USD) personal finance app. It is the client half of a full-stack application; the backend runs separately at `http://localhost:5000`.

Built with Create React App (react-scripts 5), React 19, React Router v6, and Axios.

## Commands

- **Dev server:** `npm start` (runs on http://localhost:3000)
- **Build:** `npm run build`
- **Tests:** `npm test` (Jest in watch mode via react-scripts)
- **Run a single test:** `npm test -- --testPathPattern=<pattern>` (e.g. `npm test -- --testPathPattern=App`)
- **Lint:** ESLint runs automatically during `npm start`; there is no separate lint script. CRA's built-in eslint config (`react-app` + `react-app/jest`) is used.

## Architecture

### Backend dependency

All API calls target `http://localhost:5000`. The backend (not in this repo) must be running for auth, wallet, and transaction features to work. API routes used:

- `POST /api/auth/login` and `POST /api/auth/register` — auth (returns JWT)
- `GET /api/wallet` and `PUT /api/wallet` — wallet balances
- `GET /api/transactions`, `POST /api/transactions`, `PUT /api/transactions/:id`, `DELETE /api/transactions/:id` — CRUD transactions

The base URL is hardcoded in each component/context file (not centralized).

### State management — React Context

Two context providers wrap the entire app (in `App.js`):

1. **AuthContext** (`src/context/AuthContext.js`) — manages JWT token (persisted in localStorage), exposes `login`, `register`, `logout`. Sets the `Authorization` header globally on `axios.defaults`.
2. **WalletContext** (`src/context/WalletContext.js`) — depends on AuthContext's `token`. Fetches and exposes `balances` (`nairaBalance`, `dollarBalance`) plus `fetchBalances` and `updateBalances`.

### Routing and auth flow

`App.js` renders `<AuthProvider>` → `<WalletProvider>` → `<AppContent>`. Inside `AppContent`, if no token exists the `<Login>` component is shown (no router). When authenticated, the `<Router>` mounts with three routes:

- `/` → Dashboard
- `/transactions` → Transactions
- `/add` → AddTransaction

### Key conventions

- Components are plain `.js` files (not TypeScript), one component per file in `src/components/`.
- CSS is per-component where it exists (`Login.css`, `Transactions.css`) or global (`App.css`, `index.css`).
- Transactions use MongoDB-style `_id` fields from the backend.
- Currency values are either `"NGN"` or `"USD"`; transaction types are `"income"` or `"expense"`.

### Known issues

- `src/components/Transactions.js` has a duplicate `export default Transactions;` at the end of the file (line 122), which will cause a build error.
- The backend API base URL (`http://localhost:5000`) is hardcoded across multiple files rather than using an environment variable.
