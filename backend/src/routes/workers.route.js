import express from 'express';
import { getAllWorkers, getWorkerById } from '../controllers/user.controller.js';
import { protectRoute } from '../middlewares/user.middleware.js';

const router = express.Router();

router.use(protectRoute);

router.get('/', getAllWorkers);

router.get('/:id', getWorkerById);

export default router;