import express from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth';
import {
  getAvailableTasks,
  getMyTasks,
  acceptTask,
  updateTaskStatus,
  getPerformance,
} from '../controllers/logisticsController';

const router = express.Router();

router.use(authenticate);
router.use(authorizeRoles('logistics'));

router.get('/tasks', getAvailableTasks);
router.get('/my-tasks', getMyTasks);
router.post('/tasks/accept/:id', acceptTask);
router.patch('/tasks/status/:id', updateTaskStatus);
router.get('/performance', getPerformance);

export default router;
