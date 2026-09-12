import pool from "../config/db.js";

const logTaskActivity = async (client, taskId, userId, oldStatus, newStatus) => {
    if (oldStatus !== newStatus) {
        await client.query(
            "INSERT INTO task_activity_logs (task_id, user_id, old_status, new_status) VALUES ($1, $2, $3, $4)",
            [taskId, userId, oldStatus, newStatus]
        );
    }
};

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
    const client = await pool.connect();
    try {
        const { id } = req.params;
        const { title, description, project_id, assigned_to, status, priority, due_date } = req.body;
        
        const existingResult = await client.query("SELECT t.*, p.created_by as project_created_by FROM tasks t JOIN projects p ON t.project_id = p.id WHERE t.id = $1", [id]);
        if (existingResult.rows.length === 0) {
            return res.status(404).json({ error: "Task not found" });
        }
        
        const existingTask = existingResult.rows[0];
        
        if (req.user.role === 'Project Manager' && existingTask.project_created_by !== req.user.id) {
            return res.status(403).json({ error: "Forbidden: You can only update tasks in your own projects" });
        }

        await client.query('BEGIN');
        const result = await client.query(
            "UPDATE tasks SET title = COALESCE($1, title), description = COALESCE($2, description), project_id = COALESCE($3, project_id), assigned_to = COALESCE($4, assigned_to), status = COALESCE($5, status), priority = COALESCE($6, priority), due_date = COALESCE($7, due_date) WHERE id = $8 RETURNING *",
            [title, description, project_id, assigned_to, status, priority, due_date, id]
        );
        
        const updatedTask = result.rows[0];
        if (status && status !== existingTask.status) {
            await logTaskActivity(client, updatedTask.id, req.user.id, existingTask.status, updatedTask.status);
        }
        
        await client.query('COMMIT');
        res.json({ task: updatedTask });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        client.release();
    }
};

export const updateTaskStatus = async (req, res) => {
    const client = await pool.connect();
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const existingResult = await client.query("SELECT t.*, p.created_by as project_created_by FROM tasks t JOIN projects p ON t.project_id = p.id WHERE t.id = $1", [id]);
        if (existingResult.rows.length === 0) {
            return res.status(404).json({ error: "Task not found" });
        }
        
        const existingTask = existingResult.rows[0];
        
        if (req.user.role === 'Project Manager' && existingTask.project_created_by !== req.user.id) {
            return res.status(403).json({ error: "Forbidden: You can only update tasks in your own projects" });
        }
        
        if (req.user.role === 'Developer' && existingTask.assigned_to !== req.user.id) {
             return res.status(403).json({ error: "Forbidden: You can only update status for your assigned tasks" });
        }

        await client.query('BEGIN');
        const result = await client.query(
            "UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *",
            [status, id]
        );
        
        const updatedTask = result.rows[0];
        if (status !== existingTask.status) {
            await logTaskActivity(client, updatedTask.id, req.user.id, existingTask.status, updatedTask.status);
        }
        
        await client.query('COMMIT');
        res.json({ task: updatedTask });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        client.release();
    }
};

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        
        const existingResult = await pool.query("SELECT t.*, p.created_by as project_created_by FROM tasks t JOIN projects p ON t.project_id = p.id WHERE t.id = $1", [id]);
        if (existingResult.rows.length === 0) {
            return res.status(404).json({ error: "Task not found" });
        }
        
        if (req.user.role === 'Project Manager' && existingResult.rows[0].project_created_by !== req.user.id) {
            return res.status(403).json({ error: "Forbidden: You can only delete tasks in your own projects" });
        }

        const result = await pool.query("DELETE FROM tasks WHERE id = $1 RETURNING *", [id]);
        res.json({ message: "Task deleted successfully", task: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }

};
