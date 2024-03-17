import Student from '../models/StudentModel';

// @desc    Create a Student
// @route   POST /student/create
// @access  Public
const createStudent = async (req, res) => {
  try {
    console.log('aaa', req?.params);
    res.status(201).send('ss');
  } catch (error) {
    res.status(500).send(error?.message);
  }
};

export { createStudent };
