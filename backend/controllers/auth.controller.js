import User from "../models/user.model.js";
import { errorHandler } from "../utils/errorHandler.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from 'crypto'
import nodemailer from 'nodemailer'

export const signUp = async (req, res, next) => {
  try {
    const { username, email, password, profileImage } = req.body;

    //  Validate
    if (!username || !email || !password) {
      return next(errorHandler(400, "Please fill all fields"));
    }

    //  Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(errorHandler(400, "User already exists"));
    }

    //  Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //  Create user properly
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      profileImage,
    });

    await user.save();

    //  Remove password from response
    const { password: pass, ...userWithoutPassword } = user._doc;

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username && !email) {
      return next(errorHandler(400, "Please enter Email or Username"));
    }
    if (!password) {
      return next(errorHandler(400, "Please enter Password"));
    }
    const query = email ? {email:email} : {username:username}
    const user = await User.findOne(query);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(errorHandler(401, "invalid credentials"));
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.cookie("token", token, {
      httpOnly: true,
    });
    const { password: pass, ...userWithoutPassword } = user._doc;
    res
      .status(200)
      .json({
        success: true,
        message: "User  logged in successfully",
        userWithoutPassword,
      });
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const { email, username, profileImage } = req.body;

    const user = await User.findOne({ email });

    // If user already exists
    if (user) {
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET
      );

      const { password: pass, ...userData } = user._doc;

      return res
        .status(200)
        .cookie("token", token, { httpOnly: true })
        .json(userData);
    }

    // Create password for google users
    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);

    const hashPassword = await bcrypt.hash(generatedPassword, 10);

    // Create new user
    const newUser = new User({
      username:
        username.split(" ").join("").toLowerCase() +
        Math.random().toString(36).slice(-8),
      email,
      password: hashPassword,
      profileImage,
    });

    await newUser.save();

    const { password: pass, ...userData } = newUser._doc;

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET
    );

    res
      .status(201)
      .cookie("token", token, { httpOnly: true })
      .json(userData);

  } catch (error) {
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie('token')
    res.status(200).json({success:true, message:'Sign out successful'})
  } catch (error) {
    next(error)
  }
}

export const forgetPassword = async (req, res, next) => {
  try {
    const {email} = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(404, 'User not found'))
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save();
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASSWORD
      }
    })
    await transporter.sendMail({
      from: `"Hobb springs" <${process.env.GMAIL}`,
      to: user.email,
      subject: "Password reset",
      html: ` <h2>Password Reset</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>`
    })
    res.status(201).json({success:true, message: 'Reset link sent',resetUrl})
    
  } catch (error) {
    next(error)
  }
}

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({resetPasswordToken: token, resetPasswordExpire: { $gt: Date.now()}})
    if (!user) {
      return next(errorHandler(404, 'User not found'))
    }
    const hashPassword = await bcrypt.hash(password, 10)
    user.password = hashPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(200).json({success:true, message: "Password reset successful"})
  } catch (error) {
    next(error)
  }
}