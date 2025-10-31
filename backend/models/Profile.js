import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  avatar: { type: String, default: '' },
  joined: { type: Date, default: Date.now }
});

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
