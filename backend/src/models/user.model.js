import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullname : {
    type: String,
    required: true,
    trim: true
  },
  email : {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password : {
    type: String,
    required: true
  },
  role : {
    type: String,
    enum: ['user', 'admin', 'plumber', 'electrician', 'carpenter', 'painter', 'gardener', 'cleaner'],
    default: 'user'
  }
},{timestamps:true});

// login static method to authenticate u

const User = mongoose.model("User", userSchema);

export default User;