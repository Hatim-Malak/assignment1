import pool from "../config/db.js";

export const getActivityLogs = async (req, res) => {
    try {
        const { role, id: userId } = req.user;
        let query = `
            SELECT a.*, t.title as task_title, u.username as modified_by, p.name as project_name
            FROM task_activity_logs a
            JOIN tasks t ON a.task_id = t.id
            JOIN projects p ON t.project_id = p.id
            LEFT JOIN users u ON a.user_id = u.id
        `;
        let values = [];
        
        if (role === 'Project Manager') {
            query += " WHERE p.created_by = $1";
            values.push(userId);
        } else if (role === 'Developer') {
            query += " WHERE t.assigned_to = $1";
            values.push(userId);
        }
        
        query += " ORDER BY a.created_at DESC";

        const result = await pool.query(query, values);
        res.json({ activities: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};
