import { Router } from 'express';
import { createStudent, readAllStudentsByUser, updateStudent, updateUser } from '../controllers';
export const router = Router();

// update user
router.put('/update', updateUser);

// create student
router.post('/create-student', createStudent);

// read all students added by user
router.get('/read-students', readAllStudentsByUser);

// update a student
router.put('/update-student/:id', updateStudent);