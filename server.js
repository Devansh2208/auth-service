import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();

const app = express();

// Middleware to parse JSON bodies
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

// CALL THE FUNCTION
createAdminIfNotExists();

// Routes
app.use("/api/auth", authRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Auth Service API is running");
});

// Listen on Render port or local port
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});
