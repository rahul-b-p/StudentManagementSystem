import { Router } from 'express';
import { createAdmin, readAllAdmins, readAllStudents, readAllStudentsByGrade, readAllUsers, updateUser } from '../controllers';

export const router = Router();

// create admin
router.post('/create-new', createAdmin);

// read all users
router.get('/read-users', readAllUsers);

// read all admins
router.get('/read-admins', readAllAdmins);

//read all students
router.get('/read-students', readAllStudents);

// read students by grade
router.get('/read-students/grade',readAllStudentsByGrade)