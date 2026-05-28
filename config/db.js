import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createConnection({

    host: process.env.HOST,

    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD,

    database: process.env.DB_NAME
});

const connectDB = () => {

    db.connect((err) => {

        if (err) {

            console.log(
                "Database connection error:",
                err
            );
        }

        console.log(
            "MySQL connected successfully"
        );
    });
};

export { db ,connectDB };

