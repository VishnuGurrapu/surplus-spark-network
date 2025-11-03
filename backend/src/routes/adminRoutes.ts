import express from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth';

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(authorizeRoles('admin'));

// Get admin dashboard data
router.get('/dashboard', (req, res) => {
  res.json({
    success: true,
    message: 'Admin dashboard',
    data: {
      // Add admin-specific data here
    }
  });
});

export default router;
