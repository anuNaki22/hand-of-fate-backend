# Hand of Fate Backend - Server

This repository contains the backend server for the Hand of Fate game, built with Node.js, Express, and Socket.IO. It provides APIs for user authentication, game logic for player vs computer mode, real-time WebSocket communication for player vs player, and Leaderboard for non-computer players.

---

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Scripts](#scripts)
  - [Development Mode](#development-mode)
  - [Production Mode](#production-mode)
- [Dependencies](#dependencies)
  - [Core Dependencies](#core-dependencies)
  - [Development Dependencies](#development-dependencies)

---

## Getting Started

### Prerequisites

Ensure the following are installed on your system:

- **Node.js** (v16 or later)
- **npm** (Node Package Manager)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/hand-of-fate-backend.git
   cd hand-of-fate-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables by creating a `.env` file in the root directory.

---

### Environment Variables

Add the following variables to your `.env` file:

```env
DB_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret
PORT=your_server_port
```

Example:

```env
DB_URL=postgres://username:password@hostname:port/database
JWT_SECRET=supersecretkey
PORT=4000
```

If using Railway's PostgreSQL service, use the provided `DATABASE_URL` value.

---

## Scripts

### Development Mode

Run the server with live reload using `nodemon`:
```bash
npm run dev
```

### Production Mode

Run the server in production mode:
```bash
npm start
```

---

## Dependencies

### Core Dependencies

- **bcrypt**: Password hashing.
- **body-parser**: Parse incoming request bodies.
- **cors**: Enable cross-origin requests.
- **dotenv**: Manage environment variables.
- **express**: Web framework for APIs.
- **jsonwebtoken**: JSON Web Token authentication.
- **pg**: PostgreSQL client.
- **socket.io**: Real-time communication.

### Development Dependencies

- **nodemon**: Auto-restart server during development.

---

