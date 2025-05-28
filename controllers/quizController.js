const { Quiz, QuizResult } = require('../models/Quiz');
const Course = require('../models/Course'); // To check if course exists
const Enrollment = require('../models/Enrollment'); // To ensure user is enrolled

// @desc    Create a new quiz
// @route   POST /api/quizzes
// @access  Private (Instructor/Admin only)
exports.createQuiz = async (req, res) => {
  const { courseId, title, questions } = req.body;
  const instructorId = req.user.id;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    // Ensure current user is the instructor of the course or an admin
    if (course.instructor.toString() !== instructorId && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized to create a quiz for this course' });
    }

    const newQuiz = new Quiz({
      course: courseId,
      title,
      questions,
    });

    const quiz = await newQuiz.save();
    res.status(201).json(quiz);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get quizzes for a specific course
// @route   GET /api/quizzes/course/:courseId
// @access  Private (Anyone enrolled in the course or instructor/admin)
exports.getQuizzesByCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    // Check if user is enrolled or is instructor/admin
    const isEnrolled = await Enrollment.findOne({ user: req.user.id, course: req.params.courseId });
    if (!isEnrolled && course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'You must be enrolled in this course or be the instructor/admin to view quizzes' });
    }

    const quizzes = await Quiz.find({ course: req.params.courseId });
    res.json(quizzes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get a single quiz by ID (without correct answers for students)
// @route   GET /api/quizzes/:id
// @access  Private (Anyone enrolled in the course or instructor/admin)
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }

    // Check if user is enrolled or is instructor/admin
    const isEnrolled = await Enrollment.findOne({ user: req.user.id, course: quiz.course });
    const course = await Course.findById(quiz.course);

    if (!isEnrolled && course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'You must be enrolled in this course or be the instructor/admin to view this quiz' });
    }

    // For students, remove correct answers before sending
    if (req.user.role === 'student') {
      const quizForStudent = JSON.parse(JSON.stringify(quiz)); // Deep copy
      quizForStudent.questions.forEach(q => delete q.correctAnswer);
      return res.json(quizForStudent);
    }

    res.json(quiz); // Instructor/Admin can see correct answers
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Quiz not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Submit quiz results
// @route   POST /api/quizzes/:id/submit
// @access  Private (Student only)
exports.submitQuiz = async (req, res) => {
  const quizId = req.params.id;
  const userId = req.user.id;
  const { answers } = req.body; // Array of { questionId, submittedAnswer }

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }

    // Check if user is enrolled in the course
    const enrollment = await Enrollment.findOne({ user: userId, course: quiz.course });
    if (!enrollment) {
      return res.status(403).json({ msg: 'You must be enrolled in this course to submit a quiz' });
    }

    let score = 0;
    const submittedAnswers = [];
    const totalQuestions = quiz.questions.length;

    quiz.questions.forEach(q => {
      const userAnswer = answers.find(a => a.questionId.toString() === q._id.toString());
      if (userAnswer) {
        const isCorrect = userAnswer.submittedAnswer === q.correctAnswer;
        if (isCorrect) {
          score++;
        }
        submittedAnswers.push({
          questionId: q._id,
          submittedAnswer: userAnswer.submittedAnswer,
          isCorrect: isCorrect,
        });
      } else {
        // If a question was skipped
        submittedAnswers.push({
          questionId: q._id,
          submittedAnswer: 'Not Answered', // Or null, depending on how you want to represent it
          isCorrect: false,
        });
      }
    });

    const newQuizResult = new QuizResult({
      quiz: quizId,
      user: userId,
      score,
      totalQuestions,
      answers: submittedAnswers,
    });

    const quizResult = await newQuizResult.save();
    res.status(201).json(quizResult);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get quiz results for a specific user
// @route   GET /api/quizzes/my-results
// @access  Private (Student only)
exports.getMyQuizResults = async (req, res) => {
  try {
    const quizResults = await QuizResult.find({ user: req.user.id })
      .populate('quiz', 'title course')
      .sort({ submittedAt: -1 });
    res.json(quizResults);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all quiz results for a specific quiz (for instructor/admin)
// @route   GET /api/quizzes/:quizId/results
// @access  Private (Instructor of the course or Admin)
exports.getQuizResultsByQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }

    const course = await Course.findById(quiz.course);
    if (!course) {
      return res.status(404).json({ msg: 'Associated course not found' });
    }

    // Ensure current user is the instructor of the course or an admin
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized to view results for this quiz' });
    }

    const quizResults = await QuizResult.find({ quiz: req.params.quizId })
      .populate('user', 'username email')
      .sort({ submittedAt: -1 });

    res.json(quizResults);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};