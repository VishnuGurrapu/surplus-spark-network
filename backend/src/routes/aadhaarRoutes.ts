import express from 'express';
import rateLimit from 'express-rate-limit';
import { authenticate, authorizeRoles } from '../middleware/auth';
import { startAadhaarVerify, confirmAadhaarVerify, getAadhaarStatus } from '../controllers/aadhaarController';

const router = express.Router();

// Rate limiting for OTP generation
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 requests per window
  message: 'Too many OTP requests, please try again later',
});

router.post('/start-aadhaar-verify', authenticate, authorizeRoles('donor'), otpLimiter, startAadhaarVerify);
router.post('/confirm-aadhaar-verify', authenticate, authorizeRoles('donor'), confirmAadhaarVerify);
router.get('/aadhaar-status', authenticate, authorizeRoles('donor'), getAadhaarStatus);

export default router;
