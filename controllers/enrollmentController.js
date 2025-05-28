const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course'); // To check if course exists

// @desc    Enroll in a course
// @route   POST /api/enrollments
// @access  Private (Student only)
exports.enrollInCourse = async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user.id;

  try {
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    // Check if user is already enrolled
    let enrollment = await Enrollment.findOne({ user: userId, course: courseId });
    if (enrollment) {
      return res.status(400).json({ msg: 'You are already enrolled in this course' });
    }

    enrollment = new Enrollment({
      user: userId,
      course: courseId,
    });

    await enrollment.save();
    res.status(201).json({ msg: 'Enrolled successfully', enrollment });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get courses a user is enrolled in
// @route   GET /api/enrollments/my-courses
// @access  Private (Student only)
exports.getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user.id })
      .populate('course', 'title description instructor')
      .populate('user', 'username email'); // Optionally populate user details

    res.json(enrollments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all enrollments (for admin/instructor)
// @route   GET /api/enrollments
// @access  Private (Admin/Instructor)
exports.getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('course', 'title description')
      .populate('user', 'username email');
    res.json(enrollments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Remove enrollment (e.g., student drops course)
// @route   DELETE /api/enrollments/:id
// @access  Private (Student, only own enrollment)
exports.removeEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({ msg: 'Enrollment not found' });
    }

    // Ensure user is the owner of the enrollment or an admin
    if (enrollment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized to remove this enrollment' });
    }

    await Enrollment.deleteOne({ _id: req.params.id });
    res.json({ msg: 'Enrollment removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Enrollment not found' });
    }
    res.status(500).send('Server Error');
  }
};