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

}