import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

//  Middleware to parse JSON bodies
app.use(express.json());

//  Connect to MongoDB
connectDB();

//  Routes
app.use("/api/auth", authRoutes);

//  Root route to verify service is running
app.get("/", (req, res) => {
  res.send("Auth Service API is running 🚀");
});

//  Listen on Render-provided port or fallback for local dev
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Auth Service running on port ${PORT}`);
});
