
import { Router } from 'express';
import userRoutes from '@/module/company/routes/routes.user';
import paymentRoutes from '@/module/payment/api/routes/routes.payment';

const router = Router();

// Mount versioned API routes
router.use('/api/v1/users', userRoutes);
router.use('/api/v1/payments', paymentRoutes);


export default router;