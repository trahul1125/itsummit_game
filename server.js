import express from 'express'
import cors from 'cors'
import sql from './db.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.static('.'))

// Create tables
await sql`
  CREATE TABLE IF NOT EXISTS scores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    organization VARCHAR(100),
    captured INTEGER,
    total_models INTEGER,
    game_time INTEGER,
    completion_rate DECIMAL,
    created_at TIMESTAMP DEFAULT NOW()
  )
`

// API Routes
app.post('/api/scores', async (req, res) => {
  const { name, organization, captured, totalModels, gameTime, completionRate } = req.body
  
  const result = await sql`
    INSERT INTO scores (name, organization, captured, total_models, game_time, completion_rate)
    VALUES (${name}, ${organization}, ${captured}, ${totalModels}, ${gameTime}, ${completionRate})
    RETURNING *
  `
  
  res.json(result[0])
})

app.get('/api/scores', async (req, res) => {
  const scores = await sql`
    SELECT * FROM scores 
    ORDER BY captured DESC, game_time ASC 
    LIMIT 20
  `
  res.json(scores)
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
