import asyncHandler from '../middleware/asyncHandler.js';
import Mentor from '../models/MentorModel.js';
import Student from '../models/StudentModel.js';

// @desc    Create a Mentor
// @route   POST /mentor/create
// @access  Public
const createMentor = asyncHandler(async (req, res) => {
  const { name, email, assignedStudents } = req.body;
  const mentor = await Mentor.create({
    name,
    email,
    assignedStudents,
  });

  if (mentor) {
    res.status(201).json({
      _id: mentor._id,
      name: mentor.name,
      email: mentor.email,
      assignedStudents: mentor.assignedStudents,
    });
  } else {
    res.status(400);
    throw new Error('Invalid mentor data');
  }
});

// @desc    Assign Students to Mentor
// @route   POST /mentor/assign
// @access  Public
const assignStudentsToMentor = asyncHandler(async (req, res) => {
  const { mentorEmail, studentEmails } = req.body;

  const students = await Student.find({ email: studentEmails });

  //Checking whether the entered students list, if anyone have a mentor
  //Only assign students without mentor
  students.map((item) => {
    if (item?.assignedMentor?.length > 0) {
      throw new Error('Entered Student has already been assigned to mentor');
    }
  });

  const mentor = await Mentor.findOne({
    email: mentorEmail,
  });

  if (mentor) {
    //Assigning students id to mentor data
    const selectedStudents = students.map((item) => item?.email);
    mentor.assignedStudents = mentor.assignedStudents?.concat(selectedStudents);

    await mentor.save();

    //Updating Mentor id in Students data
    const updateOps = students.map((record) => {
      const updateOp = {
        updateOne: {
          filter: {
            email: record.email,
          },
          update: {
            assignedMentor: mentorEmail,
          },
        },
      };
      return updateOp;
    });

    await Student.bulkWrite(updateOps);

    res.status(201).json({
      _id: mentor._id,
      name: mentor.name,
      email: mentor.email,
      assignedStudents: mentor.assignedStudents,
    });
  } else {
    res.status(404);
    throw new Error('Mentor not found');
  }
});

// @desc    Get all students from a mentor
// @route   Get /mentor/students/:mentorEmail
// @access  Public
const getAllStudents = asyncHandler(async (req, res) => {
  const { mentorEmail } = req.params;

  const mentor = await Mentor.findOne({ email: mentorEmail });

  if (mentor) {
    const studentDetails = await Student.find(
      {
        email: mentor?.assignedStudents,
      },
      { _id: 0, name: 1, email: 1 }
    );

    res.status(201).json({
      _id: mentor._id,
      name: mentor.name,
      email: mentor.email,
      assignedStudents: studentDetails,
    });
  } else {
    res.status(404);
    throw new Error('Mentor not found');
  }
});

export { createMentor, assignStudentsToMentor, getAllStudents };
