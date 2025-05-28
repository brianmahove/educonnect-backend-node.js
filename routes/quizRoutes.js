const express = require('express');
const {
  createQuiz,
  getQuizzesByCourse,
  getQuizById,
  submitQuiz,
  getMyQuizResults,
  getQuizResultsByQuiz,
} = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .post(protect, authorize('instructor', 'admin'), createQuiz);

router.get('/course/:courseId', protect, getQuizzesByCourse);
router.get('/:id', protect, getQuizById);
router.post('/:id/submit', protect, authorize('student'), submitQuiz);
router.get('/my-results', protect, authorize('student'), getMyQuizResults);
router.get('/:quizId/results', protect, authorize('instructor', 'admin'), getQuizResultsByQuiz);

module.exports = router;