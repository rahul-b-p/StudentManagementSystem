import { Router } from 'express';
import { login, signup } from '../controllers';

export const router = Router();

// signup
router.post('/signup', signup);

// login
router.post('/login', login);