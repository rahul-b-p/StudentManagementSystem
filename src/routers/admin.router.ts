import { Router } from 'express';
import { readAllAdmins, readAllStudents, readAllUsers, updateUser } from '../controllers';

export const router = Router();

// read all users
router.get('/read-users', readAllUsers);

// read all admins
router.get('/read-admins', readAllAdmins);

//read all students
router.get('/read-students', readAllStudents);