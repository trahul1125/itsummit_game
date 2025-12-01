// API client for game
class GameAPI {
  constructor(baseURL = 'http://localhost:3000') {
    this.baseURL = baseURL
    this.enabled = false // Disable by default for GitHub Pages
  }

  async saveScore(scoreData) {
    if (!this.enabled) throw new Error('API disabled')
    const response = await fetch(`${this.baseURL}/api/scores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scoreData)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(`API Error: ${error.error || response.statusText}`)
    }
    return response.json()
  }

  async getScores() {
    if (!this.enabled) throw new Error('API disabled')
    const response = await fetch(`${this.baseURL}/api/scores`)
    if (!response.ok) {
      const error = await response.json()
      throw new Error(`API Error: ${error.error || response.statusText}`)
    }
    return response.json()
  }

  enableAPI(baseURL) {
    this.baseURL = baseURL
    this.enabled = true
  }
}

window.GameAPI = GameAPI
