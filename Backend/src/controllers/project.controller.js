import pool from "../config/db.js";

export const getAllProjects = async (req, res) => {
};

export const getProjectById = async (req, res) => {
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
