import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectdb } from "./config/db.js";
import userRouter from "./routes/userRoute.js";

dotenv.config();

const app = express();


app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", "https://e-medical-reports-front.onrender.com"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());


app.use("/api/user", userRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  await connectdb();
  console.log(`Server running on port ${PORT}`);
});