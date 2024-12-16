import { Router } from 'express';
import { createAdmin, readAllAdmins, readAllStudents, readAllStudentsByGrade, readAllUsers, updateUser, updateUserByAdmin } from '../controllers';

export const router = Router();

// create admin
router.post('/create-new', createAdmin);

// read all users
router.get('/read-users', readAllUsers);

// read all admins
router.get('/read-admins', readAllAdmins);

// update users by id
router.put('/update-user/:id',updateUserByAdmin)

//read all students
router.get('/read-students', readAllStudents);

// read students by grade
router.get('/read-students/grade',readAllStudentsByGrade);

