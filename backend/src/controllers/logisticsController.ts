import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Task from '../models/Task';
import Surplus from '../models/Surplus';

export const getAvailableTasks = async (req: AuthRequest, res: Response) => {
  try {
    // Show tasks that are 'pending' OR 'assigned' (donor accepted, ready for pickup)
    const tasks = await Task.find({ 
      status: { $in: ['pending', 'assigned'] },
      logisticsPartnerId: { $exists: false } // Not yet claimed by any logistics partner
    })
      .populate('surplusId', 'title description quantity unit')
      .populate('donorId', 'name location phone')
      .populate('ngoId', 'name location phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: tasks });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query;
    const query: any = { logisticsPartnerId: req.user?.userId };

    if (status) query.status = status;

    const tasks = await Task.find(query)
      .populate('surplusId', 'title description quantity unit')
      .populate('donorId', 'name location phone')
      .populate('ngoId', 'name location phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: tasks });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const acceptTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (task.logisticsPartnerId) {
      return res.status(400).json({ success: false, message: 'Task already claimed by another partner' });
    }

    if (task.status !== 'pending' && task.status !== 'assigned') {
      return res.status(400).json({ success: false, message: 'Task is not available' });
    }

    // Assign logistics partner to task
    task.logisticsPartnerId = req.user?.userId as any;
    task.status = 'assigned';
    await task.save();

    // Update surplus to show it has a logistics partner assigned
    await Surplus.findByIdAndUpdate(task.surplusId, {
      logisticsPartnerId: req.user?.userId,
    });

    res.json({ 
      success: true, 
      message: 'Task accepted. Please proceed to pickup location.', 
      data: task 
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTaskStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const task = await Task.findOne({
      _id: req.params.id,
      logisticsPartnerId: req.user?.userId,
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    task.status = status;

    if (status === 'picked-up') {
      task.actualPickup = new Date();
      // ONLY NOW change surplus status to in-transit (donation is actually picked up)
      await Surplus.findByIdAndUpdate(task.surplusId, { status: 'in-transit' });
    } else if (status === 'delivered') {
      task.actualDelivery = new Date();
      task.status = 'delivered';
      // Change surplus status to delivered
      await Surplus.findByIdAndUpdate(task.surplusId, { status: 'delivered' });
    }

    await task.save();

    res.json({ success: true, message: 'Status updated', data: task });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPerformance = async (req: AuthRequest, res: Response) => {
  try {
    const totalTasks = await Task.countDocuments({ logisticsPartnerId: req.user?.userId });
    const completedTasks = await Task.countDocuments({
      logisticsPartnerId: req.user?.userId,
      status: 'delivered',
    });

    const onTimeTasks = await Task.countDocuments({
      logisticsPartnerId: req.user?.userId,
      status: 'delivered',
      $expr: { $lte: ['$actualDelivery', '$scheduledDelivery'] },
    });

    const rating = totalTasks > 0 ? ((completedTasks / totalTasks) * 5).toFixed(1) : '0.0';

    res.json({
      success: true,
      data: {
        totalTasks,
        completedTasks,
        onTimeTasks,
        rating,
        completionRate: totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : '0',
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
