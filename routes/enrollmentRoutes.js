const express = require('express');
const {
  enrollInCourse,
  getMyEnrollments,
  getAllEnrollments,
  removeEnrollment,
} = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .post(protect, authorize('student'), enrollInCourse) // Students enroll
  .get(protect, authorize('instructor', 'admin'), getAllEnrollments); // Instructors/Admins view all

router.get('/my-courses', protect, authorize('student'), getMyEnrollments); // Students view their courses
router.delete('/:id', protect, removeEnrollment); // Student or Admin can remove enrollment

module.exports = router;