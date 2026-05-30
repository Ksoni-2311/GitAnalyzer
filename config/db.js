import mysql from "mysql2";
import dotenv, { config } from 'dotenv'
dotenv.config()
console.log("Host",process.env.DB_HOST);

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});


const connectDB = () => {
    db.connect((err) => {
        if (err) {
            console.error("Database Connection Error:", err);
            return;
        }

        console.log("Database Connected Successfully");
    });
};

export { db, connectDB };