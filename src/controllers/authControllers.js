import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModels.js";

import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";

export const register = async (req, res) => {
  try {
    const { full_name, email, password, gender, phone } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email sudah digunakan",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      full_name,
      email,
      password: hashedPassword,
      gender,
      phone,
      email_verification_token: verificationToken,
    });

    const verifyUrl = `http://localhost:3000/api/auth/verify?token=${verificationToken}`;

    await sendEmail(
      email,
      "Verify your email",
      `<h3>Click link to verify:</h3>
      <a href="${verifyUrl}">${verifyUrl}</a>`,
    );

    return res.status(201).json({
      success: true,
      message: "Register berhasil",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // search/check user
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Password salah",
      });
    }

    // check status suspend
    if (user.status === "suspend") {
      return res.status(403).json({
        success: false,
        message: "Akun anda disuspend",
      });
    }

    // check email verified
    if (!user.email_verified_at) {
      return res.status(403).json({
        success: false,
        message: "Email belum diverifikasi",
      });
    }
    
    // generate token
    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        {expiresIn: "1d",
    });

    return res.json({
      success: true,
      message: "Login berhasil",
      data: { token },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.query;

  const user = await User.findOne({
    where: { email_verification_token: token },
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Token tidak valid",
    });
  }

  user.email_verified_at = new Date();
  user.email_verification_token = null;
  await user.save();

  return res.json({
    success: true,
    message: "Email berhasil diverifikasi",
  });
};
