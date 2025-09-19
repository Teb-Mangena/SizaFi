// routes/payment.js
import express from 'express';
import {
  initializePayment,
  verifyPayment,
  getPaymentHistory
} from '../controllers/payment.controller.js';
import { protectRoute } from '../middlewares/user.middleware.js';

const router = express.Router();

// All routes are protected
router.post('/initialize', protectRoute, initializePayment);
router.get('/verify/:reference', protectRoute, verifyPayment);
// router.post('/webhook', paymentWebhook); // This should not be protected
router.get('/history', protectRoute, getPaymentHistory);

export default router;