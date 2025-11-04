import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Surplus from '../models/Surplus';
import Task from '../models/Task';
import { validationResult } from 'express-validator';
import Notification from '../models/Notification';
import User from '../models/User';

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
    // Only count donations that have been picked up by logistics (in-transit or delivered)
    const totalDonations = await Surplus.countDocuments({ 
      donorId: req.user?.userId,
      status: { $in: ['in-transit', 'delivered'] } 
    });
    
    const deliveredDonations = await Surplus.countDocuments({
      donorId: req.user?.userId,
      status: 'delivered',
    });

    const totalQuantity = await Surplus.aggregate([
      { 
        $match: { 
          donorId: req.user?.userId, 
          status: { $in: ['in-transit', 'delivered'] } 
        } 
      },
      { $group: { _id: null, total: { $sum: '$quantity' } } },
    ]);

    // Calculate badges based on picked-up donations only
    const badges = [];
    if (totalDonations >= 10) badges.push({ name: 'Bronze Donor', icon: '🥉' });
    if (totalDonations >= 50) badges.push({ name: 'Silver Donor', icon: '🥈' });
    if (totalDonations >= 100) badges.push({ name: 'Gold Donor', icon: '🥇' });

    res.json({
      success: true,
      data: {
        totalDonations, // Only picked-up donations (in-transit + delivered)
        deliveredDonations, // Only delivered donations
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

export const acceptSurplusRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const surplus = await Surplus.findOne({
      _id: id,
      donorId: req.user?.userId,
      status: 'claimed',
    }).populate('claimedBy', 'name');

    if (!surplus) {
      return res.status(404).json({ success: false, message: 'Surplus request not found' });
    }

    // Change status to 'accepted' - a new intermediate status
    // This prevents the buttons from showing again after reload
    surplus.status = 'accepted' as any; // TypeScript workaround
    await surplus.save();

    // Update task status to 'assigned' (ready for logistics to accept)
    const task = await Task.findOneAndUpdate(
      { surplusId: surplus._id },
      { status: 'assigned' },
      { new: true }
    );

    // Create notification for NGO
    const donor = await User.findById(req.user?.userId);
    await new Notification({
      userId: surplus.claimedBy,
      type: 'request_received',
      title: 'Request Accepted',
      message: `${donor?.name || 'Donor'} has accepted your request for: ${surplus.title}. Waiting for logistics to pick it up.`,
      data: {
        surplusId: surplus._id,
        donorId: req.user?.userId,
        taskId: task?._id,
      },
    }).save();

    res.json({
      success: true,
      message: 'Request accepted. Task is now available for logistics partners to pick up.',
      data: { surplus, task },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const rejectSurplusRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const surplus = await Surplus.findOne({
      _id: id,
      donorId: req.user?.userId,
      status: 'claimed',
    }).populate('claimedBy', 'name');

    if (!surplus) {
      return res.status(404).json({ success: false, message: 'Surplus request not found' });
    }

    const ngoId = surplus.claimedBy;

    // Reset surplus to available
    surplus.status = 'available';
    surplus.claimedBy = undefined;
    await surplus.save();

    // Delete associated task
    await Task.findOneAndDelete({ surplusId: surplus._id });

    // Create notification for NGO
    const donor = await User.findById(req.user?.userId);
    await new Notification({
      userId: ngoId,
      type: 'request_received',
      title: 'Request Declined',
      message: `${donor?.name || 'Donor'} has declined your request for: ${surplus.title}`,
      data: {
        surplusId: surplus._id,
        donorId: req.user?.userId,
      },
    }).save();

    res.json({
      success: true,
      message: 'Request rejected. Item is now available for other NGOs.',
      data: surplus,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generateImpactCard = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const surplus = await Surplus.findOne({
      _id: id,
      donorId: req.user?.userId,
      status: 'delivered',
    }).populate('claimedBy', 'name');

    if (!surplus) {
      return res.status(404).json({ success: false, message: 'Delivered donation not found' });
    }

    const donor = await User.findById(req.user?.userId);
    const totalDonations = await Surplus.countDocuments({
      donorId: req.user?.userId,
      status: 'delivered',
    });

    const totalImpact = await Surplus.aggregate([
      { $match: { donorId: req.user?.userId, status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$quantity' } } },
    ]);

    // Calculate estimated people helped based on category
    let peopleHelped = 0;
    if (surplus.category === 'food') {
      peopleHelped = Math.floor(surplus.quantity / 3);
    } else if (surplus.category === 'clothing') {
      peopleHelped = surplus.quantity;
    } else {
      peopleHelped = Math.floor(surplus.quantity / 2);
    }

    const impactCard = {
      donorName: donor?.name || 'Anonymous Donor',
      donationTitle: surplus.title,
      quantity: surplus.quantity,
      unit: surplus.unit,
      peopleHelped,
      ngoName: (surplus.claimedBy as any)?.name || 'NGO',
      date: surplus.updatedAt,
      totalDonations,
      totalImpact: totalImpact[0]?.total || 0,
      shareUrl: `${process.env.FRONTEND_URL}/donor/${req.user?.userId}`,
    };

    res.json({ success: true, data: impactCard });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPublicDonorProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { donorId } = req.params;

    const donor = await User.findById(donorId).select('name createdAt');
    if (!donor) {
      return res.status(404).json({ success: false, message: 'Donor not found' });
    }

    const totalDonations = await Surplus.countDocuments({
      donorId,
      status: 'delivered',
    });

    const categoryBreakdown = await Surplus.aggregate([
      { $match: { donorId, status: 'delivered' } },
      { $group: { _id: '$category', count: { $sum: 1 }, quantity: { $sum: '$quantity' } } },
    ]);

    const totalImpact = await Surplus.aggregate([
      { $match: { donorId, status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$quantity' } } },
    ]);

    // Calculate badges
    const badges = [];
    if (totalDonations >= 1) badges.push({ name: 'First Donation', icon: '🎉', description: 'Made your first donation' });
    if (totalDonations >= 5) badges.push({ name: 'Consistent Contributor', icon: '⭐', description: '5+ donations completed' });
    if (totalDonations >= 10) badges.push({ name: 'Bronze Donor', icon: '🥉', description: '10+ donations completed' });
    if (totalDonations >= 25) badges.push({ name: 'Silver Donor', icon: '🥈', description: '25+ donations completed' });
    if (totalDonations >= 50) badges.push({ name: 'Gold Donor', icon: '🥇', description: '50+ donations completed' });
    if (totalDonations >= 100) badges.push({ name: 'Impact Hero', icon: '🏆', description: '100+ donations completed' });

    // Estimate people helped
    let totalPeopleHelped = 0;
    categoryBreakdown.forEach((cat: any) => {
      if (cat._id === 'food') {
        totalPeopleHelped += Math.floor(cat.quantity / 3);
      } else if (cat._id === 'clothing') {
        totalPeopleHelped += cat.quantity;
      } else {
        totalPeopleHelped += Math.floor(cat.quantity / 2);
      }
    });

    res.json({
      success: true,
      data: {
        donorName: donor.name,
        memberSince: donor.createdAt,
        totalDonations,
        totalImpact: totalImpact[0]?.total || 0,
        totalPeopleHelped,
        categoryBreakdown,
        badges,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};