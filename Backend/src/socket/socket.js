import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

let io;
const activeUsersMap = new Map();

export const getActiveUserCount = () => activeUsersMap.size;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*", 
            methods: ["GET", "POST"]
        }
    });

    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token || socket.handshake.headers['authorization']?.split(' ')[1];
            
            if (!token) {
                return next(new Error("Authentication error"));
            }
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            
            const result = await pool.query("SELECT * FROM blacklisted_tokens WHERE token = $1", [token]);
            if (result.rows.length > 0) {
                return next(new Error("Token is blacklisted"));
            }

            socket.user = decoded;
            next();
        } catch (err) {
            next(new Error("Authentication error"));
        }
    });

    io.on("connection", (socket) => {
        const userId = socket.user.id;
        
        const currentCount = activeUsersMap.get(userId) || 0;
        activeUsersMap.set(userId, currentCount + 1);
        
        if (currentCount === 0) {
            io.to('admin_dashboard').emit('active_users_count', { count: activeUsersMap.size });
        }

        if (socket.user.role === 'Admin') {
            socket.join('admin_dashboard');
        }
        
        socket.join(`user_${userId}`);

        socket.on("disconnect", () => {
            const count = activeUsersMap.get(userId) || 0;
            if (count > 1) {
                activeUsersMap.set(userId, count - 1);
            } else {
                activeUsersMap.delete(userId);
                io.to('admin_dashboard').emit('active_users_count', { count: activeUsersMap.size });
            }
        });
    });

    return io;
};

export const emitTaskActivity = (projectId, assignedToId, eventData) => {
    if (!io) return;

    io.to('admin_dashboard').emit('task_activity', eventData);
    
    io.to(`project_${projectId}`).emit('task_activity', eventData);
    
    if (assignedToId) {
        io.to(`user_${assignedToId}`).emit('task_activity', eventData);
    }
};

export const emitNotification = (userId, notificationData) => {
    if (!io) return;
    io.to(`user_${userId}`).emit('new_notification', notificationData);
};

export const getIo = () => io;
