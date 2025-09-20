// controllers/payment.controller.js
import axios from 'axios';
import Payment from '../models/Payment.js';
import User from '../models/user.model.js';
import { ENV } from '../lib/env.js';

// Initialize payment
export const initializePayment = async (req, res) => {
  try {
    const { amount, workerId } = req.body;
    
    // Validate input
    if (!amount || !workerId) {
      return res.status(400).json({ error: 'Amount and worker ID are required' });
    }
    
    // Get worker details
    const worker = await User.findById(workerId);
    if (!worker || !['plumber', 'electrician', 'carpenter', 'painter', 'gardener', 'cleaner'].includes(worker.role)) {
      return res.status(404).json({ error: 'Worker not found' });
    }
    
    // Generate unique reference
    const reference = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create payment record
    const payment = new Payment({
      user: req.user._id,
      worker: workerId,
      amount,
      reference,
      status: 'pending'
    });
    await payment.save();
    
    // Initialize Paystack transaction using axios
    const paystackResponse = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: req.user.email,
        amount: amount * 100, // Convert to kobo
        reference,
        callback_url: `${ENV.FRONTEND_URL}/payment/verify`,
        metadata: {
          custom_fields: [
            {
              display_name: "Paid to",
              variable_name: "paid_to",
              value: worker.fullname
            },
            {
              display_name: "Service",
              variable_name: "service",
              value: worker.role
            }
          ]
        }
      },
      {
        headers: {
          Authorization: `Bearer ${ENV.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    res.json({
      authorization_url: paystackResponse.data.data.authorization_url,
      access_code: paystackResponse.data.data.access_code,
      reference: paystackResponse.data.data.reference
    });
  } catch (error) {
    console.error('Payment initialization error:', error);
    res.status(500).json({ error: 'Payment initialization failed' });
  }
};

// Verify payment
export const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;
    
    // Verify transaction with Paystack using axios
    const paystackResponse = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${ENV.PAYSTACK_SECRET_KEY}`
        }
      }
    );
    
    if (paystackResponse.data.data.status === 'success') {
      // Update payment status
      const payment = await Payment.findOneAndUpdate(
        { reference },
        { 
          status: 'success',
          paystackData: paystackResponse.data.data
        },
        { new: true }
      ).populate('user worker');
      
      res.json({ 
        success: true, 
        message: 'Payment verified successfully',
        payment 
      });
    } else {
      await Payment.findOneAndUpdate(
        { reference },
        { status: 'failed' }
      );
      
      res.json({ 
        success: false, 
        message: 'Payment verification failed' 
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
};

// Webhook endpoint for Paystack
export const paymentWebhook = async (req, res) => {
  try {
    // Validate webhook event
    const secret = ENV.PAYSTACK_SECRET_KEY;
    const signature = req.headers['x-paystack-signature'];
    
    if (!signature) {
      return res.status(400).send('No signature');
    }
    
    // For webhook verification, you'll need to implement signature validation
    // This is a simplified version
    const event = req.body;
    
    // Handle the event
    if (event.event === 'charge.success') {
      const { reference } = event.data;
      
      // Update payment status
      await Payment.findOneAndUpdate(
        { reference },
        { 
          status: 'success',
          paystackData: event.data
        }
      );
    }
    
    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Webhook error');
  }
};

// Get user payment history
export const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const payments = await Payment.find({ user: userId })
      .populate('worker', 'fullname role')
      .sort({ createdAt: -1 });
    
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
};

// Get worker's earnings and payment history
export const getWorkerEarnings = async (req, res) => {
  try {
    const workerId = req.user._id;

    // Ensure only workers can access this
    const worker = await User.findById(workerId);
    if (!worker || !['plumber', 'electrician', 'carpenter', 'painter', 'gardener', 'cleaner'].includes(worker.role)) {
      return res.status(403).json({ error: 'Access denied. Only workers can view earnings.' });
    }

    // Find all successful payments for this worker
    const payments = await Payment.find({ worker: workerId, status: 'success' })
      .populate('user', 'fullname email') // show who paid
      .sort({ createdAt: -1 });

    // Calculate total earnings
    const totalEarnings = payments.reduce((sum, p) => sum + p.amount, 0);

    res.json({
      worker: {
        id: worker._id,
        fullname: worker.fullname,
        role: worker.role
      },
      totalEarnings,
      payments
    });
  } catch (error) {
    console.error('Error fetching worker earnings:', error);
    res.status(500).json({ error: 'Failed to fetch worker earnings' });
  }
};
