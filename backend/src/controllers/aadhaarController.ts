import { Request, Response } from 'express';
import MockAadhaar from '../models/MockAadhaar';
import User from '../models/User';
import { maskAadhaar, hashAadhaar, generateOTP, storeOTP, verifyOTP } from '../utils/aadhaarHelper';

export const startAadhaarVerify = async (req: Request, res: Response) => {
  try {
    const { aadhaar } = req.body;
    const userId = (req as any).user?.id;

    if (!aadhaar || aadhaar.length !== 12 || !/^\d{12}$/.test(aadhaar)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Aadhaar number. Must be 12 digits.',
      });
    }

    // Check if user is a donor
    const user = await User.findById(userId);
    if (!user || user.role !== 'donor') {
      return res.status(403).json({
        success: false,
        message: 'Aadhaar verification is only available for donors',
      });
    }

    // Check if already verified
    if (user.isAadhaarVerified) {
      return res.status(400).json({
        success: false,
        message: 'Aadhaar already verified',
      });
    }

    // Look up in mock database
    const mockRecord = await MockAadhaar.findOne({ aadhaar });
    
    if (!mockRecord) {
      return res.status(404).json({
        success: false,
        message: 'Aadhaar number not found in our records',
      });
    }

    // Generate and store OTP
    const otp = generateOTP();
    storeOTP(aadhaar, otp);

    // In production, send SMS via Twilio
    console.log(`📱 OTP for ${mockRecord.linkedPhone}: ${otp}`);
    console.log(`👤 Name: ${mockRecord.name}`);

    res.status(200).json({
      success: true,
      message: `OTP sent to your Aadhaar-linked phone number ending in ${mockRecord.linkedPhone.slice(-4)}`,
      data: {
        maskedPhone: `XXXXXX${mockRecord.linkedPhone.slice(-4)}`,
      },
    });
  } catch (error: any) {
    console.error('Start Aadhaar verify error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate Aadhaar verification',
    });
  }
};

export const confirmAadhaarVerify = async (req: Request, res: Response) => {
  try {
    const { aadhaar, otp } = req.body;
    const userId = (req as any).user?.id;

    if (!aadhaar || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Aadhaar and OTP are required',
      });
    }

    // Verify OTP
    const verification = verifyOTP(aadhaar, otp);
    
    if (!verification.success) {
      return res.status(400).json({
        success: false,
        message: verification.message,
      });
    }

    // Update user with Aadhaar verification
    const user = await User.findById(userId);
    
    if (!user || user.role !== 'donor') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    user.aadhaarMasked = maskAadhaar(aadhaar);
    user.aadhaarHash = hashAadhaar(aadhaar);
    user.isAadhaarVerified = true;
    user.aadhaarVerifiedAt = new Date();
    
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Aadhaar verified successfully',
      data: {
        aadhaarMasked: user.aadhaarMasked,
        isVerified: true,
        verifiedAt: user.aadhaarVerifiedAt,
      },
    });
  } catch (error: any) {
    console.error('Confirm Aadhaar verify error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify Aadhaar',
    });
  }
};

export const getAadhaarStatus = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const user = await User.findById(userId).select('aadhaarMasked isAadhaarVerified aadhaarVerifiedAt role');

    if (!user || user.role !== 'donor') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        aadhaarMasked: user.aadhaarMasked || null,
        isVerified: user.isAadhaarVerified || false,
        verifiedAt: user.aadhaarVerifiedAt || null,
      },
    });
  } catch (error: any) {
    console.error('Get Aadhaar status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get Aadhaar status',
    });
  }
};
