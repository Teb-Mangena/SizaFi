import express from 'express';
import { loginUser, logoutUser, signupUser } from '../controllers/user.controller.js';
import { protectRoute } from '../middlewares/user.middleware.js';

const router = express.Router();

router.post('/signup', signupUser);

router.post('/login', loginUser);

router.post('/logout', logoutUser);

router.get('/check',protectRoute, (req,res) => {
  res.status(200).json({message: "User is logged in", user: req.user});
})

export default router;