import User from "../models/user.model.js";
import { errorHandler } from "../utils/errorHandler.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const getAllUsers = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return next(errorHandler(402, 'only admin can access all users'))
        }
        const users = await User.find().select("-password");
       
        const totalUsers = await User.countDocuments();
        res.status(200).json({success:true, users, totalUsers})

    } catch (error) {
        next(error)
    }
}

export const updateUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id)
        if (!user) {
            return next(errorHandler(404, 'User not found'))
        }
        if (req.user.id !== id) {
            return next(errorHandler(401, 'You are not allowed to update this user'))
        }
        if (req.body.oldPassword && req.body.newPassword) {
      const isMatch = await bcrypt.compare(req.body.oldPassword, user.password)
    
    if (!isMatch) {
      return next(errorHandler(404, 'Old password is incorrect'))
    }
    const hashPassword = await bcrypt.hash(req.body.newPassword,10)
    req.body.password = hashPassword;
  }
        const updatedUser  = await User.findByIdAndUpdate(id,{$set: req.body}, {new:true}).select("-password");
        
        res.status(201).json({success:true, message: 'User updated successfully', updatedUser})
        
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req, res, next) => {
  try {

    const id = req.params.id;

    const user = await User.findById(id);

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    if (req.user.id !== user._id.toString()) {
      return next(errorHandler(401, "You are not authorized to delete this user"));
    }
    

    await User.findByIdAndDelete(id);

    // clear authentication cookie
    res.clearCookie("token");

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (error) {
    next(error);
  }
};

