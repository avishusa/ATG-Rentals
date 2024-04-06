import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';


dotenv.config();
mongoose.connect(process.env.x).then(()=>{
    console.log("Connected to MongoDB")
}).catch((err)=>{
    console.log(err);
})

const app = express();

app.listen(8801, ()=>{
    console.log('Server is running on port 8801')
});

app.get('/test',(req,res)=>{

    res.send("Avish")
})

app.use(express.json);

app.use("/api/user",userRouter);

app.use("/api/auth",authRouter);

app.use((req,res,err,next)=>{

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Message";
    return res.status(statusCode).json({
        success : false,
        statusCode,
        message,
    })
})