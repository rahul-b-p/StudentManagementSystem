import { Router } from 'express';
import { login, logout, signup } from '../controllers';
import { JwtAuth, adminAuth, userAuth } from '../middlewares';
import { loggers } from '../utils/winston.util';

export const router = Router();

// signup by admin
router.post('/signup-admin', adminAuth, signup);

// signup by user
router.post('/signup-user', userAuth, signup);

// login by admin
router.post('/login-admin',adminAuth, login);

// login by user
router.post('/login-user',userAuth, login);


// logout not checked
router.post('/logout',JwtAuth,logout);