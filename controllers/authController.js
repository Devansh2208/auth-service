import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { BANGALORE_COLLEGES } from "../utils/collegeList.js";
import { COMPANY_LIST } from "../utils/companyList.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, college, company } = req.body;

    // 1. Required: name, email, password
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    // 2. Block admin email from signup
    if (email === "admin@example.com") {
      return res.status(400).json({
        success: false,
        message: "This email cannot be used for signup",
      });
    }

    // 3. At least one required → college OR company
    if (!college && !company) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one: college or company",
      });
    }

    // 4. Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // 5. Validate college → list OR custom
    let finalCollege = null;
    if (college) {
      if (BANGALORE_COLLEGES.includes(college)) {
        finalCollege = college; // selected from list
      } else {
        finalCollege = college; // custom typed
      }
    }

    // 6. Validate company → list OR custom
    let finalCompany = null;
    if (company) {
      if (COMPANY_LIST.includes(company)) {
        finalCompany = company; // selected from list
      } else {
        finalCompany = company; // custom typed
      }
    }

    // 7. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 8. Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      college: finalCollege,
      company: finalCompany,
      role: "user",
    });

    // 9. Generate JWT
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

    // 10. Send success response
    return res.status(201).json({
      success: true,
      message: "Signup successful",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        college: newUser.college,
        company: newUser.company,
        role: newUser.role,
      },
    });

  } catch (error) {
    console.error("❌ Error in registerUser:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
