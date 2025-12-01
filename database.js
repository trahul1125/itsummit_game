// Simple SQLite-like database for AI Hunter Game
class GameDatabase {
    constructor() {
        this.dbName = 'aiHunterDB';
        this.tables = {
            scores: 'aiHunter_scores',
            players: 'aiHunter_players',
            captures: 'aiHunter_captures'
        };
    }

    // Initialize database
    init() {
        // Create tables if they don't exist
        this.createTables();
        return Promise.resolve();
    }

    createTables() {
        // Scores table
        if (!localStorage.getItem(this.tables.scores)) {
            localStorage.setItem(this.tables.scores, JSON.stringify([]));
        }
        
        // Players table
        if (!localStorage.getItem(this.tables.players)) {
            localStorage.setItem(this.tables.players, JSON.stringify([]));
        }
        
        // Captures table
        if (!localStorage.getItem(this.tables.captures)) {
            localStorage.setItem(this.tables.captures, JSON.stringify([]));
        }
    }

    // Save player score
    saveScore(playerData) {
        const scores = this.getScores();
        const newScore = {
            id: Date.now(),
            name: playerData.name,
            organization: playerData.organization,
            captured: playerData.captured,
            totalModels: playerData.totalModels,
            gameTime: playerData.gameTime,
            completionRate: playerData.completionRate,
            timestamp: Date.now(),
            date: new Date().toLocaleDateString()
        };
        
        scores.push(newScore);
        localStorage.setItem(this.tables.scores, JSON.stringify(scores));
        return newScore;
    }

    // Get all scores
    getScores() {
        const scores = localStorage.getItem(this.tables.scores);
        return scores ? JSON.parse(scores) : [];
    }

    // Get top scores
    getTopScores(limit = 10) {
        const scores = this.getScores();
        return scores
            .sort((a, b) => {
                if (b.captured !== a.captured) return b.captured - a.captured;
                return a.gameTime - b.gameTime;
            })
            .slice(0, limit);
    }
}

// Export for use in game
window.GameDatabase = GameDatabase;
