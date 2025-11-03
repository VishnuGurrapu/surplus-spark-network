import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/User';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth';
import { logActivity } from '../utils/activityLogger';
import mongoose from 'mongoose';

export const register = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array()); // Debug log
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { name, email, password, role, location, donorType, ngoRegistrationId, vehicleType } = req.body;

    console.log('Registration request:', { name, email, role, location, donorType, ngoRegistrationId, vehicleType }); // Debug log

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email already exists' 
      });
    }

    // Create user object based on role
    const userData: any = {
      name,
      email,
      password,
      role,
      location,
    };

    // Add role-specific fields
    if (role === 'donor' && donorType) {
      userData.donorType = donorType;
    } else if (role === 'ngo' && ngoRegistrationId) {
      userData.ngoRegistrationId = ngoRegistrationId;
    } else if (role === 'logistics' && vehicleType) {
      userData.vehicleType = vehicleType;
    }

    console.log('Creating user with data:', userData); // Debug log

    // Create new user
    const user = new User(userData);
    await user.save();

    // Log registration activity
    await logActivity({
      userId: user._id as mongoose.Types.ObjectId,
      action: 'register',
      resourceType: 'user',
      resourceId: user._id as mongoose.Types.ObjectId,
      description: `New ${role} account created: ${name}`,
      metadata: { email, role },
      ipAddress: req.ip,
    });

    // Generate token
    const token = generateToken({
      userId: String(user._id),
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          location: user.location,
          donorType: user.donorType,
          ngoRegistrationId: user.ngoRegistrationId,
          vehicleType: user.vehicleType,
        },
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration',
      error: error.message 
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Generate token
    const token = generateToken({
      userId: String(user._id),
      email: user.email,
      role: user.role,
    });

    // Log login activity
    await logActivity({
      userId: user._id as mongoose.Types.ObjectId,
      action: 'login',
      resourceType: 'auth',
      description: `User logged in: ${user.name}`,
      metadata: { email: user.email, role: user.role },
      ipAddress: req.ip,
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          location: user.location,
          donorType: user.donorType,
          ngoRegistrationId: user.ngoRegistrationId,
          vehicleType: user.vehicleType,
        },
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login',
      error: error.message 
    });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          location: user.location,
          donorType: user.donorType,
          ngoRegistrationId: user.ngoRegistrationId,
          vehicleType: user.vehicleType,
          isVerified: user.isVerified,
        },
      },
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    const { name, location, donorType, ngoRegistrationId, vehicleType } = req.body;
    
    const updateData: any = {};
    if (name) updateData.name = name;
    if (location) updateData.location = location;
    if (donorType) updateData.donorType = donorType;
    if (ngoRegistrationId) updateData.ngoRegistrationId = ngoRegistrationId;
    if (vehicleType) updateData.vehicleType = vehicleType;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          location: user.location,
          donorType: user.donorType,
          ngoRegistrationId: user.ngoRegistrationId,
          vehicleType: user.vehicleType,
          isVerified: user.isVerified,
        },
      },
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};
