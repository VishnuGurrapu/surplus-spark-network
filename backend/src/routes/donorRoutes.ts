import express from 'express';
import { body } from 'express-validator';
import { authenticate, authorizeRoles, requireVerification } from '../middleware/auth';
import {
  createSurplus,
  getDonorSurplus,
  getSurplusById,
  updateSurplus,
  getDonorImpact,
  trackDonation,
  acceptSurplusRequest,
  rejectSurplusRequest,
  generateImpactCard,
  getPublicDonorProfile,
} from '../controllers/donorController';
import { getDonorLeaderboard } from '../controllers/leaderboardController';

const router = express.Router();

router.use(authenticate);
router.use(authorizeRoles('donor'));

const surplusValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').isIn(['food', 'clothing', 'medical', 'educational', 'other']),
  body('quantity').isNumeric().withMessage('Quantity must be a number'),
  body('unit').trim().notEmpty().withMessage('Unit is required'),
  body('location.address').trim().notEmpty().withMessage('Address is required'),
];

router.post('/surplus', surplusValidation, requireVerification, createSurplus);
router.get('/surplus', getDonorSurplus);
router.get('/surplus/:id', getSurplusById);
router.patch('/surplus/:id', updateSurplus);
router.get('/impact', getDonorImpact);
router.get('/tracking/:id', trackDonation);
router.get('/leaderboard', getDonorLeaderboard);
router.post('/surplus/:id/accept', requireVerification, acceptSurplusRequest);
router.post('/surplus/:id/reject', requireVerification, rejectSurplusRequest);
router.get('/impact-card/:id', generateImpactCard);
router.get('/public-profile/:donorId', getPublicDonorProfile);

export default router;
