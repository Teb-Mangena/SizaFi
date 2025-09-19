import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { ENV } from '../lib/env.js';

export const protectRoute = async (req, res, next) => {
  try {
    // get token from cookies
    const token = req.cookies.jwt;

    if(!token){
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // verify token
    const decoded = jwt.verify(token, ENV.JWT_SECRET)

    if(!decoded){
      return res.status(401).json({ message: "Not authorized, token failed" });
    }

    const user = await User.findById(decoded.userId).select('-password');

    // attach user to request
    req.user = user;

    next();

  } catch (error) {
    console.log('Error in protectRoute:', error);
    return res.status(500).json({ message: "Server error" });
  }
}