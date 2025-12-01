class GistLeaderboard {
    constructor() {
        this.gistId = '376791d856d4aa07c5d96e569ea504d5';
        this.apiUrl = `https://api.github.com/gists/${this.gistId}`;
    }

    async saveScore(gameTime, captured, name, organization) {
        try {
            const scores = await this.loadScores();
            scores.push({
                name,
                organization,
                captured,
                totalModels: 15,
                gameTime,
                date: new Date().toLocaleDateString(),
                timestamp: Date.now()
            });
            
            scores.sort((a, b) => {
                if (b.captured !== a.captured) return b.captured - a.captured;
                return a.gameTime - b.gameTime;
            });
            
            await fetch(`https://api.github.com/gists/${this.gistId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    files: {
                        'leaderboard.json': {
                            content: JSON.stringify(scores.slice(0, 50), null, 2)
                        }
                    }
                })
            });
        } catch (e) {
            console.log('Score save failed, using local storage');
            localStorage.setItem('aiHunterBackup', JSON.stringify({ name, organization, captured, gameTime }));
        }
    }

    async loadScores() {
        try {
            const response = await fetch(`https://api.github.com/gists/${this.gistId}`);
            const gist = await response.json();
            return JSON.parse(gist.files['leaderboard.json'].content);
        } catch {
            return [];
        }
    }
}

window.leaderboard = new GistLeaderboard();
