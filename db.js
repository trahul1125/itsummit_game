import postgres from 'postgres'
import dotenv from 'dotenv'

dotenv.config()

// Parse connection string manually to avoid IPv6 issues
const url = new URL(process.env.DATABASE_URL)
const sql = postgres({
  host: url.hostname,
  port: url.port,
  database: url.pathname.slice(1),
  username: url.username,
  password: url.password,
  ssl: 'require'
})

export default sql
