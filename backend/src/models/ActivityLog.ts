import mongoose, { Document, Schema } from 'mongoose';

export interface IActivityLog extends Document {
  userId: mongoose.Types.ObjectId;
  action: string;
  resourceType: 'surplus' | 'request' | 'task' | 'user';
  resourceId?: mongoose.Types.ObjectId;
  metadata?: any;
  ipAddress?: string;
  createdAt: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    resourceType: {
      type: String,
      enum: ['surplus', 'request', 'task', 'user'],
      required: true,
    },
    resourceId: {
      type: Schema.Types.ObjectId,
    },
    metadata: Schema.Types.Mixed,
    ipAddress: String,
  },
  {
    timestamps: true,
  }
);

const ActivityLog = mongoose.model<IActivityLog>('ActivityLog', activityLogSchema);

export default ActivityLog;
