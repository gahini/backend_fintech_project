import { Router } from 'express';
import { authenticate } from '@/shared/middleware/middleware.auth';
import {
  createOrder,
  initiatePayment,
  processDummyWebhook,
  getPaymentById,
  getOrderById,
} from '@/module/payment/api/controller/controller.payment';

const router = Router();

router.post('/orders', authenticate, createOrder);
router.post('/initiate', authenticate, initiatePayment);
router.post('/webhook/dummy', authenticate, processDummyWebhook);
router.get('/payments/:id', authenticate, getPaymentById);
router.get('/orders/:id', authenticate, getOrderById);

export default router;
