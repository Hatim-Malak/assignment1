import pg from 'pg'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '../../.env') })

const { Pool } = pg

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.DBPORT,
})

const seedDatabase = async () => {
  let client;
  try {
    console.log('Connecting to the database...')
    client = await pool.connect()

    console.log('Creating schema from schema.sql...')
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8')
    await client.query(schemaSql)

    console.log('Clearing existing data...')
    await client.query(`
      TRUNCATE TABLE 
        task_activity_logs, 
        notifications, 
        tasks, 
        projects, 
        clients, 
        blacklisted_tokens, 
        users 
      RESTART IDENTITY CASCADE;
    `)

    console.log('Seeding Users (Password: password123)...')
    const defaultPassword = 'password123'
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(defaultPassword, salt)

    const userInsertQuery = `
      INSERT INTO users (username, password_hash, role) 
      VALUES ($1, $2, $3) RETURNING id, username, role;
    `
    const adminRes = await client.query(userInsertQuery, ['admin_user', passwordHash, 'Admin'])
    const pmRes = await client.query(userInsertQuery, ['project_manager', passwordHash, 'Project Manager'])
    const devRes = await client.query(userInsertQuery, ['dev_user', passwordHash, 'Developer'])
    
    const adminId = adminRes.rows[0].id
    const pmId = pmRes.rows[0].id
    const devId = devRes.rows[0].id

    console.log('Seeding Clients...')
    const clientInsertQuery = `
      INSERT INTO clients (name) 
      VALUES ($1) RETURNING id;
    `
    const client1Res = await client.query(clientInsertQuery, ['Acme Corp'])
    const client2Res = await client.query(clientInsertQuery, ['Globex Corporation'])
    
    const client1Id = client1Res.rows[0].id
    const client2Id = client2Res.rows[0].id

    console.log('Seeding Projects...')
    const projectInsertQuery = `
      INSERT INTO projects (name, description, client_id, created_by) 
      VALUES ($1, $2, $3, $4) RETURNING id;
    `
    const proj1Res = await client.query(projectInsertQuery, ['Website Redesign', 'Revamping the main Acme Corp website', client1Id, pmId])
    const proj2Res = await client.query(projectInsertQuery, ['Mobile App Beta', 'Internal testing for Globex app', client2Id, pmId])
    
    const proj1Id = proj1Res.rows[0].id
    const proj2Id = proj2Res.rows[0].id

    console.log('Seeding Tasks...')
    const taskInsertQuery = `
      INSERT INTO tasks (title, description, project_id, assigned_to, status, priority, due_date) 
      VALUES ($1, $2, $3, $4, $5, $6, $7);
    `
    
    await client.query(taskInsertQuery, [
      'Implement Login Page', 
      'Build the React login page and connect it to Zustand', 
      proj1Id, 
      devId, 
      'In Progress', 
      'High',
      new Date(Date.now() + 86400000 * 2) 
    ])

    await client.query(taskInsertQuery, [
      'Setup PostgreSQL Schema', 
      'Write the SQL definitions for tasks and projects', 
      proj1Id, 
      devId, 
      'Done', 
      'Critical',
      new Date(Date.now() - 86400000 * 1) 
    ])

    await client.query(taskInsertQuery, [
      'QA Mobile Build', 
      'Test the latest staging apk on Android', 
      proj2Id, 
      null, 
      'To Do', 
      'Medium',
      new Date(Date.now() + 86400000 * 7) 
    ])

    console.log('\nDatabase seeded successfully!')
    console.log('--------------------------------')
    console.log('Test Accounts (Password: password123)')
    console.log('Admin: admin_user')
    console.log('Project Manager: project_manager')
    console.log('Developer: dev_user')
    console.log('--------------------------------')

  } catch (error) {
    console.error(' Error seeding database:', error)
  } finally {
    if (client) {
      client.release()
    }
    await pool.end()
  }
}

seedDatabase()
