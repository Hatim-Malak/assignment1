import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Access token is required" });
    }

    try {
        const result = await pool.query("SELECT * FROM blacklisted_tokens WHERE token = $1", [token]);
        if (result.rows.length > 0) {
            return res.status(401).json({ error: "Token is blacklisted" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: "Invalid or expired access token" });
    }
};

export const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Forbidden: You do not have the required role to perform this action" });
        }
        next();
    };
};
