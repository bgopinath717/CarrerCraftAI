import mongoose from 'mongoose';

const userSettingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    darkMode: {
      type: Boolean,
      default: false,
    },
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    publicPortfolio: {
      type: Boolean,
      default: true,
    },
    profileVisibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },
  },
  {
    timestamps: true,
  }
);

userSettingsSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    return ret;
  },
});

export const UserSettings = mongoose.model('UserSettings', userSettingsSchema);

