import { Router } from 'express';
import { login, logout, signup } from '../controllers';
import { JwtAuth } from '../middlewares';
import { loggers } from '../utils/winston.util';

export const router = Router();

// signup 
router.post('/signup', signup);

// login 
router.post('/login', login);

// logout not checked
router.post('/logout', JwtAuth, logout);