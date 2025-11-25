import express from "express";
import { 
  registerUser, 
  loginUser, 
  getColleges, 
  getCompanies 
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/authmiddleware.js";

const router = express.Router();

// Health check
router.get("/test", (req, res) => {
  res.json({ message: "Auth service is working!" });
});

// Auth
router.post("/register", registerUser);
router.post("/login", loginUser);

// New Routes
router.get("/colleges", getColleges);
router.get("/companies", getCompanies);

// Protected
router.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: "Protected route accessed successfully",
    user: req.user,
  });
});

export default router;
