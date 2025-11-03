import express from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth';

const router = express.Router();

// All routes require authentication and logistics role
router.use(authenticate);
router.use(authorizeRoles('logistics'));

// Get logistics dashboard data
router.get('/dashboard', (req, res) => {
  res.json({
    success: true,
    message: 'Logistics dashboard',
    data: {
      // Add logistics-specific data here
    }
  });
});

export default router;
