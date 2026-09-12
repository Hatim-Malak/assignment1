import pool from "../config/db.js";


export const getAllTasks = async (req, res) => {

};

export const getTaskById = async (req, res) => {

};

export const createTask = async (req, res) => {
     const client = await pool.connect();
    try {
        const { title, description, project_id, assigned_to, status, priority, due_date } = req.body;
        
        if (req.user.role === 'Project Manager') {
            const projCheck = await client.query("SELECT created_by FROM projects WHERE id = $1", [project_id]);
            if (projCheck.rows.length === 0 || projCheck.rows[0].created_by !== req.user.id) {
                return res.status(403).json({ error: "Forbidden: You can only add tasks to your own projects" });
            }
        }

        await client.query('BEGIN');
        const result = await client.query(
            "INSERT INTO tasks (title, description, project_id, assigned_to, status, priority, due_date) VALUES ($1, $2, $3, $4, COALESCE($5, 'To Do'), COALESCE($6, 'Medium'), $7) RETURNING *",
            [title, description, project_id, assigned_to, status, priority, due_date]
        );
        
        const newTask = result.rows[0];
        await logTaskActivity(client, newTask.id, req.user.id, null, newTask.status);
        
        await client.query('COMMIT');
        res.status(201).json({ task: newTask });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        client.release();
    }
};

export const updateTask = async (req, res) => {

};

export const updateTaskStatus = async (req, res) => {

};

export const deleteTask = async (req, res) => {

};
