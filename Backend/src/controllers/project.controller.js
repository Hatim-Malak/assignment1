import pool from "../config/db.js";

export const getAllProjects = async (req, res) => {
     try {
        let result;
        if (req.user.role === 'Admin') {
            result = await pool.query("SELECT * FROM projects ORDER BY created_at DESC");
        } else if (req.user.role === 'Project Manager') {
            result = await pool.query("SELECT * FROM projects WHERE created_by = $1 ORDER BY created_at DESC", [req.user.id]);
        } else {
            return res.status(403).json({ error: "Forbidden" });
        }
        res.json({ projects: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }

};

export const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM projects WHERE id = $1", [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Project not found" });
        }
        
        const project = result.rows[0];
        
        if (req.user.role === 'Project Manager' && project.created_by !== req.user.id) {
            return res.status(403).json({ error: "Forbidden: You can only view projects you created" });
        }
        
        res.json({ project });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const createProject = async (req, res) => {
    try {
        const { name, description, client_id } = req.body;
        
        const result = await pool.query(
            "INSERT INTO projects (name, description, client_id, created_by) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, description, client_id, req.user.id]
        );
        
        res.status(201).json({ project: result.rows[0] });
    } catch (err) {
        if (err.code === '23503') { 
            return res.status(400).json({ error: "Invalid client_id" });
        }
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateProject = async (req, res) => {
};

export const deleteProject = async (req, res) => {
};
