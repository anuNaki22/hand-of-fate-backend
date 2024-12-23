-- ==================================================
-- DATABASE SETUP SCRIPT FOR ROCK-PAPER-SCISSORS GAME
-- ==================================================

-- 1. DROP EXISTING TABLES (if they exist) TO START FRESH
DROP TABLE IF EXISTS games CASCADE;
DROP TABLE IF EXISTS players CASCADE;

-- 2. CREATE PLAYERS TABLE
CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL
);

-- 3. CREATE GAMES TABLE
CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    player1 VARCHAR(50) NOT NULL,
    player2 VARCHAR(50) NOT NULL,
    player1_choice VARCHAR(10),
    player2_choice VARCHAR(10),
    winner VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player1) REFERENCES players(username) ON DELETE CASCADE,
    FOREIGN KEY (player2) REFERENCES players(username) ON DELETE CASCADE
);

-- ==================================================
-- TEST DATA INSERTION
-- ==================================================

-- 4. INSERT SAMPLE PLAYERS
INSERT INTO players (username) VALUES 
('player1'),
('player2'),
('player3');

-- 5. INSERT SAMPLE GAMES
INSERT INTO games (player1, player2, player1_choice, player2_choice, winner) VALUES
('player1', 'player2', 'rock', 'scissors', 'player1'),
('player2', 'player3', 'paper', 'rock', 'player2'),
('player1', 'player3', NULL, NULL, NULL);

-- ==================================================
-- COMMON QUERIES
-- ==================================================

-- 6. FETCH ALL PLAYERS
SELECT * FROM players;

-- 7. FETCH ALL GAMES
SELECT * FROM games;

-- 8. FIND A PLAYER BY USERNAME
SELECT * FROM players WHERE username = 'player1';

-- 9. FIND GAMES WHERE A SPECIFIC PLAYER PARTICIPATED
SELECT * FROM games 
WHERE player1 = 'player1' OR player2 = 'player1';

-- 10. UPDATE A GAME WITH PLAYER CHOICES
UPDATE games 
SET player1_choice = 'scissors', player2_choice = 'rock' 
WHERE id = 3;

-- 11. UPDATE A GAME WITH THE WINNER
UPDATE games 
SET winner = 'player3' 
WHERE id = 3;

-- 12. FETCH GAMES WHERE WINNER IS NOT DECIDED
SELECT * FROM games WHERE winner IS NULL;

-- 13. FETCH RECENT GAMES
SELECT * FROM games ORDER BY created_at DESC LIMIT 10;

-- 14. LIST PLAYERS WITH THE NUMBER OF GAMES PLAYED
SELECT 
    p.username, 
    COUNT(g.id) AS games_played
FROM players p
LEFT JOIN games g ON p.username = g.player1 OR p.username = g.player2
GROUP BY p.username;

-- ==================================================
-- UTILITY OPERATIONS
-- ==================================================

-- 15. DELETE ALL RECORDS FROM TABLES
TRUNCATE TABLE games, players RESTART IDENTITY CASCADE;

-- 16. DROP TABLES
-- Uncomment below to completely remove the tables
-- DROP TABLE IF EXISTS games, players CASCADE;
