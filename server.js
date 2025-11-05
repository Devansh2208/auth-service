import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();

// ✅ Middleware to parse JSON
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.get("/", (req, res) => res.send("Auth Service API is running 🚀"));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Auth Service running on port ${PORT}`));
