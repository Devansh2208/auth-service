import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { BANGALORE_COLLEGES } from "../utils/collegeList.js";
import { COMPANY_LIST } from "../utils/companyList.js";

// REGISTER USER

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, college, company } = req.body;

    // Required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    // Admin cannot signup here
    if (email === "admin@example.com") {
      return res.status(400).json({
        success: false,
        message: "This email cannot be used for signup",
      });
    }

    // At least one: college OR company
    if (!college && !company) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one: college or company",
      });
    }

    // Check existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Validate college
    let finalCollege = college || null;
    if (college) {
      if (BANGALORE_COLLEGES.includes(college)) {
        finalCollege = college;
      }
    }

    // Validate company
    let finalCompany = company || null;
    if (company) {
      if (COMPANY_LIST.includes(company)) {
        finalCompany = company;
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      college: finalCollege,
      company: finalCompany,
      role: "user",
    });

    // Token
    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        college: newUser.college,
        company: newUser.company,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(201).json({
      success: true,
      message: "Signup successful",
      token,
      user: newUser,
    });
  } catch (error) {
    console.error("Error in registerUser:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// LOGIN USER (ADMIN + USER BOTH)

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Fields required
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare passwords
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role, // admin or user
        college: user.college,
        company: user.company,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: user.role === "admin" ? "Admin login successful" : "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("Error in loginUser:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



//Get All Colleges

export const getColleges = (req, res) => {
  return res.json({
    success: true,
    colleges: BANGALORE_COLLEGES,
  });
};


export const getCompanies = (req, res) => {
  return res.json({
    success: true,
    companies: COMPANY_LIST,
  });
};
