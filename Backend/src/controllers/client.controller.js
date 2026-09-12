import pool from "../config/db.js";

export const getAllClients = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM clients ORDER BY created_at DESC");
        res.json({ clients: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getClientById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM clients WHERE id = $1", [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Client not found" });
        }
        
        res.json({ client: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const createClient = async (req, res) => {
    try {
        const { name } = req.body;
        
        const result = await pool.query(
            "INSERT INTO clients (name) VALUES ($1) RETURNING *",
            [name]
        );
        
        res.status(201).json({ client: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        
        const result = await pool.query(
            "UPDATE clients SET name = $1 WHERE id = $2 RETURNING *",
            [name, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Client not found" });
        }
        
        res.json({ client: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }    
};

export const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await pool.query("DELETE FROM clients WHERE id = $1 RETURNING *", [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Client not found" });
        }
        
        res.json({ message: "Client deleted successfully", client: result.rows[0] });
    } catch (err) {
        if (err.code === '23503') {
            return res.status(409).json({ error: "Cannot delete client because there are projects associated with it" });
        }
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }

};
