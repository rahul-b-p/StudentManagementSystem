import { Router } from 'express';
import { createStudent } from '../controllers';

export const router = Router();

// create student
router.post('/create-student', createStudent)