
import { Router } from 'express';
import { authenticate } from '@/shared/middleware/middleware.auth'; 
import { createUser, getUser, getAllUsers, updateUser, deleteUser, loginUser } from '@/module/company/controller/controller.user';

const router = Router();
import { refreshToken } from '@/module/company/controller/controller.user';

router.post('/login', loginUser);

// Create a new user (protected or public, depending on your use case)
router.post('/',  createUser);

// Get all users (protected)
router.get('/', authenticate, getAllUsers);

// Get a user by ID (protected)
router.get('/:id', authenticate, getUser);

// Update a user by ID (protected)
router.put('/:id', authenticate, updateUser);

// Delete a user by ID (protected)
router.delete('/:id', authenticate, deleteUser);
router.post('/refresh-token', refreshToken);

export default router;