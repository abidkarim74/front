import express from "express";
import { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import prisma from "./db/prisma.js";
import authRoutes from "./routes/auth.routes.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


dotenv.config();

const app = express();
const PORT = 5000;


// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true 
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());


// Database Connection
async function connectDB() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully!");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
}
connectDB();


// Routes
app.use("/auth", authRoutes);


// DATABASE SHUTDOWN
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("🛑 Prisma disconnected");
  process.exit(0);
});


// SERVER LISTENING
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://127.0.0.1:${PORT}/`);
});
