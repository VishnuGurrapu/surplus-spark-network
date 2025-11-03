import express from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth';

const router = express.Router();

// All routes require authentication and ngo role
router.use(authenticate);
router.use(authorizeRoles('ngo'));

// Get NGO dashboard data
router.get('/dashboard', (req, res) => {
  res.json({
    success: true,
    message: 'NGO dashboard',
    data: {
      // Add NGO-specific data here
    }
  });
});

export default router;
