import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "Auth service is working!" });
});

router.post("/register", registerUser);
router.post("/login", loginUser);

// 🧩 Protected route example
router.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: "Protected route accessed successfully",
    user: req.user,
  });
});

export default router;
