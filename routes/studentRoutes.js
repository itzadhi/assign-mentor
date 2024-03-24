import express from 'express';
import {
  assignMentor,
  createStudent,
  getAllMentors,
} from '../controllers/studentController.js';

const router = express.Router();

// @desc  Create a student
router.route('/create').post(createStudent);

// @desc  Assign or Change Mentor for particular Student
router.route('/assign-mentor').put(assignMentor);

// @desc  Get all previous mentors from a student
router.route('/mentors/:studentEmail').get(getAllMentors);

export default router;
