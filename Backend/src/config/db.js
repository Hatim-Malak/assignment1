import pkg from "pg"
import dotenv from "dotenv";

dotenv.config();

const {Pool} = pkg;

const pool = new Pool({
    user:process.env.USER,
    host:process.env.HOST,
    database:process.env.DATABASE,
    password:process.env.PASSWORD,
    port:process.env.DBPORT
})

pool.on("connect",() => {
    console.log("connection pool established with the database")
})

pool.on("error",() => {
    console.log("Error while connecting to the database")
})

pool.on("end",() => {
    console.log("connection pool disconnected from the database")
})

export default pool;