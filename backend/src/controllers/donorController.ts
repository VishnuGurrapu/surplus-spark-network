import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Surplus from '../models/Surplus';
import Task from '../models/Task';
import { validationResult } from 'express-validator';

export const createSurplus = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const surplus = new Surplus({
      ...req.body,
      donorId: req.user?.userId,
    });

    await surplus.save();

    res.status(201).json({
      success: true,
      message: 'Surplus item created successfully',
      data: surplus,
    });
  } catch (error: any) {
    console.error('Create surplus error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDonorSurplus = async (req: AuthRequest, res: Response) => {
  try {
    const { status, category } = req.query;
    const query: any = { donorId: req.user?.userId };

    if (status) query.status = status;
    if (category) query.category = category;

    const surplus = await Surplus.find(query)
      .populate('claimedBy', 'name email')
      .populate('logisticsPartnerId', 'name email vehicleType')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: surplus });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSurplusById = async (req: AuthRequest, res: Response) => {
  try {
    const surplus = await Surplus.findOne({
      _id: req.params.id,
      donorId: req.user?.userId,
    })
      .populate('claimedBy', 'name email')
      .populate('logisticsPartnerId', 'name email vehicleType');

    if (!surplus) {
      return res.status(404).json({ success: false, message: 'Surplus not found' });
    }

    res.json({ success: true, data: surplus });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSurplus = async (req: AuthRequest, res: Response) => {
  try {
    const surplus = await Surplus.findOneAndUpdate(
      { _id: req.params.id, donorId: req.user?.userId },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!surplus) {
      return res.status(404).json({ success: false, message: 'Surplus not found' });
    }

    res.json({ success: true, message: 'Surplus updated', data: surplus });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDonorImpact = async (req: AuthRequest, res: Response) => {
  try {
    const totalDonations = await Surplus.countDocuments({ donorId: req.user?.userId });
    const deliveredDonations = await Surplus.countDocuments({
      donorId: req.user?.userId,
      status: 'delivered',
    });

    const totalQuantity = await Surplus.aggregate([
      { $match: { donorId: req.user?.userId, status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$quantity' } } },
    ]);

    // Calculate badges
    const badges = [];
    if (deliveredDonations >= 10) badges.push({ name: 'Bronze Donor', icon: '🥉' });
    if (deliveredDonations >= 50) badges.push({ name: 'Silver Donor', icon: '🥈' });
    if (deliveredDonations >= 100) badges.push({ name: 'Gold Donor', icon: '🥇' });

    res.json({
      success: true,
      data: {
        totalDonations,
        deliveredDonations,
        totalQuantity: totalQuantity[0]?.total || 0,
        badges,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const trackDonation = async (req: AuthRequest, res: Response) => {
  try {
    const surplus = await Surplus.findOne({
      _id: req.params.id,
      donorId: req.user?.userId,
    });

    if (!surplus) {
      return res.status(404).json({ success: false, message: 'Surplus not found' });
    }

    const task = await Task.findOne({ surplusId: surplus._id })
      .populate('logisticsPartnerId', 'name email phone vehicleType')
      .populate('ngoId', 'name email location');

    res.json({
      success: true,
      data: {
        surplus,
        task,
        timeline: {
          created: surplus.createdAt,
          claimed: surplus.status !== 'available' ? surplus.updatedAt : null,
          pickedUp: task?.actualPickup,
          delivered: task?.actualDelivery,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
