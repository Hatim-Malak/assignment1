import jwt from "jsonwebtoken";

const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET || 'flsahfhghlerofkhrowowoeyr',
        { expiresIn: '7d' }
    );
    return { accessToken, refreshToken };
};

export const login = async(req,res) => {
    
}
export const refreshToken = async(req,res) => {

}
export const logout = async(req,res) => {

}
export const getCurrentUser = async(req,res) => {

}
export const getAllUsers = async(req,res) => {

}
export const createUser = async(req,res) => {
    try {
        const { username, password, role } = req.body;

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const result = await pool.query(
            "INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id, username, role, created_at",
            [username, passwordHash, role]
        );

        res.status(201).json({ user: result.rows[0]});
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: "Username already exists" });
        }
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}