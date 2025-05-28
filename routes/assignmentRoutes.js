const express = require('express');
const {
  submitAssignment,
  getSubmittedAssignmentsByUser,
  getAssignmentsByCourse,
  gradeAssignment,
} = require('../controllers/assignmentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .post(protect, authorize('student'), submitAssignment);

router.get('/my-submissions', protect, authorize('student'), getSubmittedAssignmentsByUser);
router.get('/course/:courseId', protect, authorize('instructor', 'admin'), getAssignmentsByCourse);
router.put('/:id/grade', protect, authorize('instructor', 'admin'), gradeAssignment);

module.exports = router;