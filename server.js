import express from 'express'
import cors from 'cors'
import sql from './db.js'

const app = express()
const PORT = process.env.PORT || 8080

app.use(cors())
app.use(express.json())
app.use(express.static('.'))

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'AI Hunter API is running', timestamp: new Date().toISOString() })
})

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() })
})

// API Routes
app.post('/api/scores', async (req, res) => {
  try {
    const { name, organization, time, rank } = req.body
    
    const result = await sql`
      INSERT INTO "Leaderboard" ("Name", organization, time, rank)
      VALUES (${name}, ${organization}, ${time}, ${rank})
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
      ORDER BY rank ASC, time ASC 
      LIMIT 20
    `
    res.json(scores)
  } catch (error) {
    console.error('Database error:', error)
    res.status(500).json({ error: 'Database connection failed', details: error.message })
  }
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})
