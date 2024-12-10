import { Router } from 'express';
import { signup } from '../controllers';

export const router = Router();

// signup
router.post('/signup', signup)