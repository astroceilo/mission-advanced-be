import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModels.js";

import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";
import { sendResponse } from "../utils/response.js";

export const register = async (req, res) => {
  try {
    const { full_name, email, gender, phone, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return sendResponse(res, {
        success: false,
        message: "The email has been registered",
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      full_name,
      email,
      email_verification_token: emailVerificationToken,
      gender,
      phone,
      password: hashedPassword,
    });

    const verifyUrl = `http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}`;

    try {
      await sendEmail(
        email,
        "Verify your email",
        `<h3>Click link to verify:</h3>
      <a href="${verifyUrl}">${verifyUrl}</a>`,
      );
    } catch (err) {
      console.error("Email failed to send:", err.message);
    }

    return sendResponse(res, {
      success: true,
      message: "Register sent successfully. Please check your email for verification.",
      status: 201,
    });
  } catch (error) {
    return sendResponse(res, {
      success: false,
      message: error.message,
      status: 500,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // search/check user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return sendResponse(res, {
        success: false,
        message: "Email not found",
        status: 404,
      });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return sendResponse(res, {
        success: false,
        message: "Incorrect password",
        status: 401,
      });
    }

    // check status suspend
    if (user.status === "suspend") {
      return sendResponse(res, {
        success: false,
        message: "Your account has been suspended",
        status: 403,
      });
    }

    // check email verified
    if (!user.email_verified_at) {
      return sendResponse(res, {
        success: false,
        message: "Email not verified",
        status: 403,
      });
    }

    // generate token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    return sendResponse(res, {
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          gender: user.gender,
          phone: user.phone,
          role: user.role,
          status: user.status,
        },
        token,
      },
      status: 200,
    });
  } catch (error) {
    return sendResponse(res, {
      success: false,
      message: error.message,
      status: 500,
    });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.query;

  const user = await User.findOne({
    where: { email_verification_token: token },
  });

  if (!user) {
    return sendResponse(res, {
      success: false,
      message: "Invalid token",
      status: 404,
    });
  }

  user.email_verified_at = new Date();
  user.email_verification_token = null;
  await user.save();

  return sendResponse(res, {
    success: true,
    message: "Email successfully verified",
    status: 200,
  });
};
