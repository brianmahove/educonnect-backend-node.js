const Assignment = require('../models/Assignment');
const Course = require('../models/Course'); // To check if course exists
const Enrollment = require('../models/Enrollment'); // To ensure user is enrolled

// @desc    Submit an assignment
// @route   POST /api/assignments
// @access  Private (Student only)
exports.submitAssignment = async (req, res) => {
  const { courseId, title, description, submissionText, submissionFileUrl } = req.body;
  const userId = req.user.id;

  try {
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    // Check if user is enrolled in the course
    const enrollment = await Enrollment.findOne({ user: userId, course: courseId });
    if (!enrollment) {
      return res.status(403).json({ msg: 'You must be enrolled in this course to submit an assignment' });
    }

    // Optional: Prevent multiple submissions for the same assignment (if applicable)
    // You might want to define an 'assignment definition' model if you have specific assignments
    // For now, we allow multiple submissions, but a new entry is created each time.

    const newAssignment = new Assignment({
      course: courseId,
      user: userId,
      title,
      description,
      submissionText,
      submissionFileUrl,
    });

    const assignment = await newAssignment.save();
    res.status(201).json(assignment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get submitted assignments by the logged-in user
// @route   GET /api/assignments/my-submissions
// @access  Private (Student only)
exports.getSubmittedAssignmentsByUser = async (req, res) => {
  try {
    const assignments = await Assignment.find({ user: req.user.id })
      .populate('course', 'title')
      .sort({ submittedAt: -1 });
    res.json(assignments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all assignments for a specific course (for instructor)
// @route   GET /api/assignments/course/:courseId
// @access  Private (Instructor of the course or Admin)
exports.getAssignmentsByCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    // Ensure current user is the instructor of the course or an admin
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized to view assignments for this course' });
    }

    const assignments = await Assignment.find({ course: req.params.courseId })
      .populate('user', 'username email')
      .sort({ submittedAt: -1 });

    res.json(assignments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Grade an assignment
// @route   PUT /api/assignments/:id/grade
// @access  Private (Instructor of the course or Admin)
exports.gradeAssignment = async (req, res) => {
  const { grade, feedback } = req.body;

  try {
    let assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ msg: 'Assignment not found' });
    }

    const course = await Course.findById(assignment.course);
    if (!course) {
      return res.status(404).json({ msg: 'Associated course not found' });
    }

    // Ensure current user is the instructor of the course or an admin
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized to grade this assignment' });
    }

    assignment.grade = grade;
    assignment.feedback = feedback;

    await assignment.save();
    res.json(assignment);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Assignment not found' });
    }
    res.status(500).send('Server Error');
  }
};