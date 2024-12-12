import { Router } from 'express';
import { createStudent, updateUser } from '../controllers';
export const router = Router();

// update user
router.put('/update', updateUser);

// create student
router.post('/create-student',  createStudent);