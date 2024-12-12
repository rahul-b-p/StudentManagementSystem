import { Router } from 'express';
import { login, logout, signup } from '../controllers';
import { JwtAuth, setAdmin, setUser } from '../middlewares';
import { loggers } from '../utils/winston.util';

export const router = Router();

// signup by user
router.post('/signup-user',setUser, signup);

// signup by admin
router.post('/signup-admin', setAdmin, signup);

// login
router.post('/login', login);

// logout not checked
router.post('/logout',JwtAuth,logout);