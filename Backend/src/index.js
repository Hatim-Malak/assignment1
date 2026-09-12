import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import pool from "./config/db.js"
dotenv.config()

const app = express();
const port = process.env.PORT || 30001

app.use(express.json())
app.use(cors())

app.get("/",async (req,res) => {
    const result = await pool.query("SELECT current_database()");
    res.send(`The database name is ${result.rows[0].current_database}`)
})

app.listen(port,() => {
    console.log(`The backend is running on the port ${port}`)
})
