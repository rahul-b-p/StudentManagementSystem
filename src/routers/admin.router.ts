import { Router } from 'express';
import { updateUser } from '../controllers';

export const router = Router();

// update admin
router.put('/update', updateUser);