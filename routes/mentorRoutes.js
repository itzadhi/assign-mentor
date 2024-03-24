import express from 'express';
import {
  assignStudentsToMentor,
  createMentor,
  getAllStudents,
} from '../controllers/mentorController.js';

const router = express.Router();

// @desc  Create a student
router.route('/create').post(createMentor);

// @desc  Assign Students to Mentor
router.route('/assign-students').put(assignStudentsToMentor);

// @desc  Get all students from a mentor
router.route('/students/:mentorEmail').get(getAllStudents);

export default router;
