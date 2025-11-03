import express from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth';
import {
  getOverview,
  getAllUsers,
  verifyUser,
  getAnalytics,
  getActivityLogs,
  getDemandForecast,
} from '../controllers/adminController';

const router = express.Router();

router.use(authenticate);
router.use(authorizeRoles('admin'));

router.get('/overview', getOverview);
router.get('/users', getAllUsers);
router.patch('/verify-user/:id', verifyUser);
router.get('/analytics', getAnalytics);
router.get('/logs', getActivityLogs);
router.get('/forecast', getDemandForecast);

export default router;
