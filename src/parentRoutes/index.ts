
import { Router } from 'express';
import userRoutes from '@/module/company/routes/routes.user';

const router = Router();

// Mount versioned API routes
router.use('/api/v1/users', userRoutes);


export default router;