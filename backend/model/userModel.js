import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return v.trim().length > 0;
      },
      message: "Nama tidak boleh kosong"
    }    
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return v.trim().length > 0;
      },
      message: "Email tidak boleh kosong"
    }    
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return v.trim().length > 0;
      },
      message: "Password tidak boleh kosong"
    }    
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['pelapor', 'petugas'], 
    default: 'pelapor',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

export const User = mongoose.model('user', userSchema);