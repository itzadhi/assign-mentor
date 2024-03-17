import express from 'express';
import { createStudent } from '../controllers/studentController.js';

const router = express.Router();

// @desc  Create a student
router.route('/create').post(createStudent);

export default router;
