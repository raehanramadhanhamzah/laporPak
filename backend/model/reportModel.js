import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    address: {
      type: String,
      required: true,
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], 
        required: true,
      },
    },
  },
  photoUrl: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['menunggu', 'diproses', 'selesai'],
    default: 'menunggu',
  },
  reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

reportSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export const Report = mongoose.model('report', reportSchema);
