import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Incident from './Incident.js';
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  gender: {
  type: String,
  enum: ['male', 'female', 'other'], // ✅ lowercase values
  required: true,
},

  dob: { type: Date, required: true },

  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
});


// 🔒 Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// 🔍 Compare entered password with hashed one
userSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

userSchema.pre('deleteOne', { document: true }, async function (next) {
  await Incident.deleteMany({ studentId: this._id });
  next();
});


export default mongoose.model('User', userSchema);
