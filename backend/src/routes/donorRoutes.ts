import express from 'express';
import { body } from 'express-validator';
import { authenticate, authorizeRoles } from '../middleware/auth';
import {
  createSurplus,
  getDonorSurplus,
  getSurplusById,
  updateSurplus,
  getDonorImpact,
  trackDonation,
} from '../controllers/donorController';

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

router.post('/surplus', surplusValidation, createSurplus);
router.get('/surplus', getDonorSurplus);
router.get('/surplus/:id', getSurplusById);
router.patch('/surplus/:id', updateSurplus);
router.get('/impact', getDonorImpact);
router.get('/tracking/:id', trackDonation);

export default router;
