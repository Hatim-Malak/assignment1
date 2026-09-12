import pool from "../config/db.js";

export const getAllClients = async (req, res) => {
};

export const getClientById = async (req, res) => {
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
};

export const deleteClient = async (req, res) => {

};
