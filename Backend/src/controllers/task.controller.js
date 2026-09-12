import pool from "../config/db.js";


export const getAllTasks = async (req, res) => {
    try {
        const { status, priority, start_date, end_date } = req.query;
        let query = "SELECT t.* FROM tasks t";
        const values = [];
        let whereClauses = [];
        
        if (req.user.role === 'Project Manager') {
            query += " JOIN projects p ON t.project_id = p.id";
            values.push(req.user.id);
            whereClauses.push(`p.created_by = $${values.length}`);
        } else if (req.user.role === 'Developer') {
            values.push(req.user.id);
            whereClauses.push(`t.assigned_to = $${values.length}`);
        }

        if (status) {
            values.push(status);
            whereClauses.push(`t.status = $${values.length}`);
        }
        if (priority) {
            values.push(priority);
            whereClauses.push(`t.priority = $${values.length}`);
        }
        if (start_date) {
            values.push(start_date);
            whereClauses.push(`t.due_date >= $${values.length}`);
        }
        if (end_date) {
            values.push(end_date);
            whereClauses.push(`t.due_date <= $${values.length}`);
        }

        if (whereClauses.length > 0) {
            query += " WHERE " + whereClauses.join(" AND ");
        }

        query += " ORDER BY t.created_at DESC";

        const result = await pool.query(query, values);
        res.json({ tasks: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }

};

export const getTaskById = async (req, res) => {
        try {
        const { id } = req.params;
        let query = "SELECT t.* FROM tasks t";
        const values = [id];
        let whereClauses = ["t.id = $1"];
        
        if (req.user.role === 'Project Manager') {
            query += " JOIN projects p ON t.project_id = p.id";
            values.push(req.user.id);
            whereClauses.push(`p.created_by = $${values.length}`);
        } else if (req.user.role === 'Developer') {
            values.push(req.user.id);
            whereClauses.push(`t.assigned_to = $${values.length}`);
        }

        query += " WHERE " + whereClauses.join(" AND ");
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Task not found or access denied" });
        }

        res.json({ task: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
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
