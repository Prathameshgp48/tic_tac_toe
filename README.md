Tic-Tac-Toe Game (Full-Stack Application)
Overview
This project is a full-stack Tic-Tac-Toe game built with a Vite-based frontend, Node.js backend, and a MongoDB database. Users can play against each other in near-real-time, track their game history, and view results. The backend API supports user registration, login, game start, move handling, and fetching match history.

Features
User Authentication

Register and log in using JWT-based authentication for secure access.
Near Real-time Gameplay

Users can make moves in a Tic-Tac-Toe game with real-time updates.
Match History

Users can view their recent match history, including wins, losses, and draws.
Game Status

Displays the status of ongoing, completed, or drawn games.
Move Timeline

Shows the sequence of moves made during a match, so users can track the game's progress.
Tech Stack
Frontend
React.js (Vite-based): For building the user interface efficiently.
Axios: For making API calls to interact with the backend.
Tailwind CSS: For styling the application with a responsive, utility-first approach.
Backend
Node.js & Express.js: For building the server and handling requests.
MongoDB: For storing user profiles and game data.
Authentication
JWT-based Authentication: For secure user registration and login.
Game Logic
Tic-Tac-Toe Game Logic: Handles move validation, checks for winners, and detects draws.
Getting Started
To run this project locally, follow the instructions below:

1. **Clone the Repository**

```bash
   git clone https://github.com/Prathameshgp48/tic_tac_toe.git
```

### 2. Set Up the Backend

1. **Navigate to the backend directory**:

   ```bash
   cd backend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up MongoDB**:

   - Ensure you have MongoDB running locally or use a cloud database service like MongoDB Atlas.
   - Set your MongoDB URI in the `.env` file according to following format:
     ```bash
     MONGODB_URI=mongodb+srv://username:password@cluster0.c32df.mongodb.net
     ```

4. **Run the backend**:

   ```bash
   npm start
   ```

   The backend will be running at `http://localhost:5000` or you can define the port of your choice

### 3. Set Up the Frontend

1. **Navigate to the frontend directory**:

   ```bash
   cd frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run the frontend**:

   ```bash
   npm run dev
   ```

   The frontend will be running at `http://localhost:5173`.

### 4. API Endpoints

- **User Routes**:

  - `POST /register`: Register a new user.
  - `POST /login`: Login a user and receive a JWT token.
  - `GET /profile`: Get the user profile (requires authentication).
  - `PATCH /update-profile`: Update user profile (requires authentication).

- **Game Routes**:
  - `POST /start-game`: Start a new game (requires authentication).
  - `POST /make-move`: Make a move in an ongoing game (requires authentication).
  - `GET /history`: Get the match history of the logged-in user (requires authentication).
  - `POST /active-games`: Get a list of active games (requires authentication).
  - `GET /:gameId`: Get current game details by game ID (requires authentication).

---

## Database Schema

The MongoDB schema consists of the following collections:

- **Users**:

  - `username`: String, unique.
  - `email`: String, unique.
  - `password`: String (hashed).
  - `profile`: Object (optional).

- **Games**:
  - `gameId`: String, unique.
  - `player1`: String (username).
  - `player2`: String (username).
  - `board`: Array (3x3 Tic-Tac-Toe grid).
  - `currentTurn`: String (current player's username).
  - `gameStatus`: String (`"ongoing"`, `"completed"`, `"draw"`).
  - `winner`: String (winner's username).
  - `moves`: Array of move objects (player, position, timestamp).

---

## Assumptions

- Users need to be authenticated before making any moves or accessing their profile and match history.
- The game uses standard Tic-Tac-Toe rules with a 3x3 grid, where two players can be able to play at alternate chances.
- The backend is responsible for maintaining game state, player turns, and checking for game completion (win or draw).
- Player matching his/her mark (X/ O) along row, column, or diagonal wins.
- If no player matches his/her mark and grid is full, then game draws.
- MongoDB is used to store user information and game data.
