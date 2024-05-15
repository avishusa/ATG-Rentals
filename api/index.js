import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import listingRouter from "./routes/listing.route.js";
import path from 'path';

dotenv.config();

mongoose
  .connect(process.env.x)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

  const __dirname=path.resolve()

const app = express();
app.use(express.json());

app.use(cookieParser());

app.listen(8801, () => {
  console.log("Server is running on port 8801");
});

app.get("/test", (req, res) => {
  res.send("Avish");
});

app.use("/api/user", userRouter);
app.use("/api/listing", listingRouter);
app.use("/api/auth", authRouter);

app.use(express.static(path.join(__dirname,'/client/dist')));
app.get('*',(req,res)=>{
  res.sendFile(path.join(__dirname,'client','dist','index.html'))
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Message";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
