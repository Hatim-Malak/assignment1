import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import pool from "./config/db.js"
import userRoutes from "./routes/user.routes.js"
import clientRoutes from "./routes/client.routes.js"
dotenv.config()

const app = express();
const port = process.env.PORT || 30001

app.use(express.json())
app.use(cookieParser())
app.use(cors())

app.use("/api/users", userRoutes);
app.use("/api/clients", clientRoutes);

app.get("/",async (req,res) => {
    const result = await pool.query("SELECT current_database()");
    res.send(`The database name is ${result.rows[0].current_database}`)
})

app.listen(port,() => {
    console.log(`The backend is running on the port ${port}`)
})
