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
    try {
        const { id } = req.params;
        const result = await pool.query(
            "UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2 RETURNING *",
            [id, req.user.id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Notification not found" });
        }
        
        res.json({ notification: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }

};

export const markAllAsRead = async (req, res) => {

};

export const deleteNotification = async (req, res) => {

};
