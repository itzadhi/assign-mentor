import Student from '../models/StudentModel.js';
import asyncHandler from '../middleware/asyncHandler.js';
import Mentor from '../models/MentorModel.js';

// @desc    Create a Student
// @route   POST /student/create
// @access  Public
const createStudent = asyncHandler(async (req, res) => {
  const { name, email, assignedMentor } = req.body;
  const student = await Student.create({
    name,
    email,
    assignedMentor,
  });

  if (student) {
    res.status(201).json({
      _id: student._id,
      name: student.name,
      email: student.email,
      assignedMentor: student.assignedMentor,
    });
  } else {
    res.status(400);
    throw new Error('Invalid student data');
  }
});

// @desc    Assign or Change Mentor for particular Student
// @route   PUT /student/assign-mentor
// @access  Public
const assignMentor = asyncHandler(async (req, res) => {
  const { mentorEmail, studentEmail } = req.body;

  //Get student and mentor from their unique email ids
  const student = await Student.findOne({ email: studentEmail });
  const mentor = await Mentor.findOne({ email: mentorEmail });

  if (student && mentor) {
    //Assign student email id in mentor data
    mentor.assignedStudents?.push(studentEmail);
    await mentor.save();

    //Update mentor email id in student data
    student.assignedMentor?.push(mentorEmail);
    await student.save();

    res.status(201).json({
      _id: student._id,
      name: student.name,
      email: student.email,
      assignedMentor: student.assignedMentor,
    });
  } else {
    res.status(404);
    throw new Error('Student or Mentor not found');
  }
});

// @desc    Get all previous mentors from a student
// @route   Get /student/mentors/:studentEmail
// @access  Public
const getAllMentors = asyncHandler(async (req, res) => {
  const { studentEmail } = req.params;

  const student = await Student.findOne({ email: studentEmail });

  if (student) {
    const mentorDetails = await Mentor.find(
      {
        email: student?.assignedMentor,
      },
      { _id: 0, name: 1, email: 1 }
    );

    res.status(201).json({
      _id: student._id,
      name: student.name,
      email: student.email,
      assignedMentor: mentorDetails,
    });
  } else {
    res.status(404);
    throw new Error('Student not found');
  }
});

export { createStudent, assignMentor, getAllMentors };
