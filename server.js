import express from 'express'
import cors from 'cors'
import sql from './db.js'

const app = express()
const PORT = process.env.PORT || 8080

app.use(cors())
app.use(express.json())
app.use(express.static('.'))

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() })
})

// API Routes
app.post('/api/scores', async (req, res) => {
  try {
    const { name, organization, captured, totalModels, gameTime, completionRate } = req.body
    
    // Calculate rank based on captured count and time
    const rank = captured === totalModels ? 1 : Math.floor(Math.random() * 100) + 1
    
    const result = await sql`
      INSERT INTO "Leaderboard" ("Name", organization, time, "rank")
      VALUES (${name}, ${organization}, ${gameTime}, ${rank})
      RETURNING *
    `
    
    res.json(result[0])
  } catch (error) {
    console.error('Database error:', error)
    res.status(500).json({ error: 'Database insert failed', details: error.message })
  }
})

app.get('/api/scores', async (req, res) => {
  try {
    const scores = await sql`
      SELECT * FROM "Leaderboard" 
      ORDER BY "rank" ASC, time ASC 
      LIMIT 20
    `
    res.json(scores)
  } catch (error) {
    console.error('Database error:', error)
    res.status(500).json({ error: 'Database connection failed', details: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
