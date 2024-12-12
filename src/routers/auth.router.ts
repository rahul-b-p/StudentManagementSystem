import { Router } from 'express';
import { login, logout, signup } from '../controllers';
import { JwtAuthMiddleware } from '../middlewares';

export const router = Router();

// signup
router.post('/signup', signup);

// login
router.post('/login', login);

// logout not checked
router.post('/logout',JwtAuthMiddleware,logout);