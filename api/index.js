import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import router from './routes/user.route.js';

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

app.use("/api/user",router);