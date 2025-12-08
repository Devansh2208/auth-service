import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// CREATE DEFAULT ADMIN IF NOT EXISTS
async function createAdminIfNotExists() {
  try {
    const admin = await User.findOne({ email: "admin@example.com" });

    if (!admin) {
      const hashedPassword = await bcrypt.hash("Admin@123", 10);

      await User.create({
        name: "Super Admin",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
        college: "Admin College",
        company: null,
      });

      console.log("Admin user created: admin@example.com / Admin@123");
    } else {
      console.log("Admin already exists");
    }
  } catch (err) {
    console.error("Error creating admin:", err.message);
  }
}

createAdminIfNotExists();

// Dummy API for UptimeRobot
app.get("/keepalive", (req, res) => {
  res.status(200).json({ status: "alive", service: "auth-service" });
});

// Routes
app.use("/api/auth", authRoutes);

// Root Route
app.get("/", (req, res) => {
  res.send("Auth Service API is running");
});

// Server Listen
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});
