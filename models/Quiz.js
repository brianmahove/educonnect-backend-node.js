const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true }, // Store the correct option text
});

const quizSchema = mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  questions: [questionSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const quizResultSchema = mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
      submittedAnswer: { type: String, required: true },
      isCorrect: { type: Boolean, required: true },
    },
  ],
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = {
  Quiz: mongoose.model('Quiz', quizSchema),
  QuizResult: mongoose.model('QuizResult', quizResultSchema),
};