import dotenv from "dotenv"
import express from "express"
import http from "http"
import cors from "cors"
import cookieParser from "cookie-parser"
import pool from "./config/db.js"
import userRoutes from "./routes/user.routes.js"
import clientRoutes from "./routes/client.routes.js"
import projectRoutes from "./routes/project.routes.js"
import taskRoutes from "./routes/task.routes.js"
import dashboardRoutes from "./routes/dashboard.routes.js"
import notificationRoutes from "./routes/notification.routes.js"
import activityRoutes from "./routes/activity.routes.js"
import { initSocket } from "./socket/socket.js"
import { startOverdueJob } from "./jobs/overdue.job.js"

dotenv.config()

const app = express();
const server = http.createServer(app);
const io = initSocket(server);
const port = process.env.PORT || 30001

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use("/api/users", userRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/activity", activityRoutes);

app.get("/",async (req,res) => {
    const result = await pool.query("SELECT current_database()");
    res.send(`The database name is ${result.rows[0].current_database}`)
})

server.listen(port,() => {
    console.log(`The backend is running on the port ${port}`)
    startOverdueJob()
})
