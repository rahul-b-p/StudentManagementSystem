import { Router } from 'express';
import { login, logout, signup } from '../controllers';
import { JwtAuth } from '../middlewares';

export const router = Router();

// signup 
router.post('/signup-admin', signup);

// login 
router.post('/login-admin', login);

// logout not checked
router.post('/logout', JwtAuth, logout);