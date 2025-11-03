import express from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth';

const router = express.Router();

// All routes require authentication and donor role
router.use(authenticate);
router.use(authorizeRoles('donor'));

// Get donor dashboard data
router.get('/dashboard', (req, res) => {
  res.json({
    success: true,
    message: 'Donor dashboard',
    data: {
      // Add donor-specific data here
    }
  });
});

export default router;
