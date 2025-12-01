import express from 'express'
import cors from 'cors'
import sql from './db.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.static('.'))

// API Routes
app.post('/api/scores', async (req, res) => {
  const { name, organization, captured, totalModels, gameTime, completionRate } = req.body
  
  // Calculate rank based on captured count and time
  const rank = captured === totalModels ? 1 : Math.floor(Math.random() * 100) + 1
  
  const result = await sql`
    INSERT INTO "Leaderboard" ("id","Name", Organization, Time, "Rank")
    VALUES (${id}, ${name}, ${organization}, ${gameTime}, ${rank})
    RETURNING *
  `
  
  res.json(result[0])
})

app.get('/api/scores', async (req, res) => {
  const scores = await sql`
    SELECT * FROM "Leaderboard" 
    ORDER BY "rank" ASC, time ASC 
    LIMIT 20
  `
  res.json(scores)
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
