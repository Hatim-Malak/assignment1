import pool from "../config/db.js";

export const getNotifications = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC", 
            [req.user.id]
        );
        res.json({ notifications: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const markAsRead = async (req, res) => {

};

export const markAllAsRead = async (req, res) => {

};

export const deleteNotification = async (req, res) => {

};
