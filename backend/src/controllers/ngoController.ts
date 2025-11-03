import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Surplus from '../models/Surplus';
import Request from '../models/Request';
import Task from '../models/Task';
import { validationResult } from 'express-validator';

export const getAvailableSurplus = async (req: AuthRequest, res: Response) => {
  try {
    const { category, search } = req.query;
    const query: any = { status: 'available' };

    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const surplus = await Surplus.find(query)
      .populate('donorId', 'name location donorType')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: surplus });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createRequest = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const request = new Request({
      ...req.body,
      ngoId: req.user?.userId,
    });

    await request.save();

    res.status(201).json({
      success: true,
      message: 'Request created successfully',
      data: request,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getNGORequests = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query;
    const query: any = { ngoId: req.user?.userId };

    if (status) query.status = status;

    const requests = await Request.find(query).sort({ createdAt: -1 });

    res.json({ success: true, data: requests });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateRequest = async (req: AuthRequest, res: Response) => {
  try {
    const request = await Request.findOneAndUpdate(
      { _id: req.params.id, ngoId: req.user?.userId },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    res.json({ success: true, message: 'Request updated', data: request });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const claimSurplus = async (req: AuthRequest, res: Response) => {
  try {
    const surplus = await Surplus.findById(req.params.id);

    if (!surplus) {
      return res.status(404).json({ success: false, message: 'Surplus not found' });
    }

    if (surplus.status !== 'available') {
      return res.status(400).json({ success: false, message: 'Surplus already claimed' });
    }

    surplus.status = 'claimed';
    surplus.claimedBy = req.user?.userId as any;
    await surplus.save();

    // Create delivery task
    const task = new Task({
      surplusId: surplus._id,
      donorId: surplus.donorId,
      ngoId: req.user?.userId,
      pickupLocation: surplus.location,
      deliveryLocation: req.body.deliveryLocation,
      status: 'pending',
    });
    await task.save();

    res.json({
      success: true,
      message: 'Surplus claimed successfully',
      data: { surplus, task },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getNGOImpact = async (req: AuthRequest, res: Response) => {
  try {
    const totalRequests = await Request.countDocuments({ ngoId: req.user?.userId });
    const fulfilledRequests = await Request.countDocuments({
      ngoId: req.user?.userId,
      status: 'fulfilled',
    });

    const receivedItems = await Surplus.countDocuments({
      claimedBy: req.user?.userId,
      status: 'delivered',
    });

    const totalQuantity = await Surplus.aggregate([
      { $match: { claimedBy: req.user?.userId, status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$quantity' } } },
    ]);

    res.json({
      success: true,
      data: {
        totalRequests,
        fulfilledRequests,
        receivedItems,
        totalQuantity: totalQuantity[0]?.total || 0,
        estimatedPeopleServed: (totalQuantity[0]?.total || 0) * 3, // Mock calculation
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
