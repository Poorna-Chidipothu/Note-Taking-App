import { Router } from "express";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User";
import Otp from "../models/Otp";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { generateLoginToken, generateToken } from "../utils/jwt";

dotenv.config({ quiet: true });

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET not set in environment variables");
}
if (!GOOGLE_CLIENT_ID) {
  throw new Error("GOOGLE_CLIENT_ID not set in environment variables");
}

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);


// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper: generate OTP
function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
}

// Request OTP (Signup)
router.post("/signup/request-otp", async (req, res) => {
  
  try {
    const { name, dob, email } = req.body;
    if (!name) return res.status(400).json({ error: "Name required" });
    if (!dob) return res.status(400).json({ error: "Date of Birth required" });
    if (!email) return res.status(400).json({ error: "Email required" });



    // cleanup old OTPs
    await Otp.deleteMany({ email });

    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    await Otp.create({ email, code, expiresAt });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code For Sign Up in NoteApp',
      text: `Your OTP for Sign Up is: ${code}`,
    };

    await transporter.sendMail(mailOptions);

    // console.log(`OTP for ${email}: ${code}`);

    res.json({ message: "OTP sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to request OTP" });
  }
});

// Step 2: Verify OTP & create user (Signup)
router.post("/signup/verify-otp", async (req, res) => {
    try {
        const { email, code, name, dob } = req.body;
        if (!email || !code) {
          return res.status(400).json({ error: "Email and OTP are required" });
        }
    
        const otpRecord = await Otp.findOne({ email, code });
        if (!otpRecord || otpRecord.expiresAt < new Date()) {
          return res.status(400).json({ error: "Invalid or expired OTP" });
        }
    
        // Upsert user
        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({ email, name, dob });
        }
    
        // Delete OTP after use
        await Otp.deleteMany({ email });

        const token = generateToken({ userId: (user._id as any).toString(), email: user.email });
    
        res.json({ message: "Signup success", token, user });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to verify OTP" });
      }
});

// Request OTP (Login)
router.post("/login/request-otp", async (req, res) => {
    try {
      const { email } = req.body;
  
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
  
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "No account found with this email" });
      }

      // Cleanup old OTPs
      await Otp.deleteMany({ email });
  
      // Generate OTP
      const code = generateOtp();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  
      // Save OTP in DB
      await Otp.create({ email, code, expiresAt });
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code For Login in NoteApp',
        text: `Your OTP for login is: ${code}`,
      };
      await transporter.sendMail(mailOptions);

      // console.log(`OTP for ${email}: ${code}`);
  
      return res.json({ message: "OTP sent successfully" });
    } catch (err) {
      console.error("OTP request error:", err);
      return res.status(500).json({ error: "Failed to send OTP" });
    }
  });

  // Verify OTP (Login)
  router.post("/login/verify-otp", async (req, res) => {
    try {
      const { email, code, keepLoggedIn } = req.body;
  
      const otpDoc = await Otp.findOne({ email, code });
      if (!otpDoc) {
        return res.status(400).json({ error: "Invalid OTP" });
      }
  
      if (otpDoc.expiresAt < new Date()) {
        return res.status(400).json({ error: "OTP expired" });
      }
  
      // OTP is valid → find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Delete OTP after use
      await Otp.deleteMany({ email });
  
      // Issue JWT
      const token = generateLoginToken({ userId: (user._id as any).toString(), email: user.email }, keepLoggedIn);
  
      return res.json({ token, user });
    } catch (err) {
      console.error("OTP verify error:", err);
      return res.status(500).json({ error: "Failed to verify OTP" });
    }
});

// Google Login
router.post("/google", async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken) return res.status(400).json({ error: "Google ID token required" });

        const ticket = await googleClient.verifyIdToken({
          idToken,
          audience: GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) return res.status(400).json({ error: "Invalid Google token" });

        const { sub: googleId, email, name } = payload;

        // Check user by email first
        let user = await User.findOne({ email });

        if (user) {
          if (!user.googleId) {
            user.googleId = googleId;
            await user.save();
          }
        } else {
          user = await User.create({ googleId, email, name });
        }

        // issue JWT for both cases
        const token = generateToken({ userId: (user._id as any).toString(), email: user.email });

        res.json({ token, user });
    } catch (err: any) {
        console.error("Google auth error:", err.message);
        res.status(500).json({ error: "Google authentication failed" });
    }
});

export default router;
