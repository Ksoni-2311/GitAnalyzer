import express, { urlencoded } from 'express'
import mysql from 'mysql2'
import dotenv, { configDotenv } from 'dotenv'
import {connectDB} from './config/db.js';
import githubanalyserRoutes from './routes/github.api.routes.js'
dotenv.config()


const app=express();
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use('/api/v1',githubanalyserRoutes)

app.listen(process.env.PORT,()=>{
    connectDB();
    console.log(`App listen at ${process.env.PORT}`);
})