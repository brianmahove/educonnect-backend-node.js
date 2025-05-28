# EduConnect - A Full-Stack Mobile Learning Platform

## Project Overview

**EduConnect** is a comprehensive mobile application designed to facilitate online learning and collaboration between students and instructors. Built with a modern technology stack, it provides a seamless and interactive educational experience. This repository contains the full source code for both the Flutter mobile frontend and the Node.js / Express.js backend.

## Features

* **User Authentication & Authorization:**
    * Secure registration and login with JWT (JSON Web Tokens).
    * Support for distinct user roles (Student and Instructor).
    * Password hashing using `bcryptjs`.
* **Course Management:**
    * Browse and view details of available courses.
    * Instructors can create, update, and delete course listings.
* **Enrollment System:**
    * Students can enroll in courses.
    * Users can view their personalized list of enrolled courses.
* **Assignment Submission:**
    * Students can submit assignments (text-based, extensible for files).
    * Tracking of submitted assignments.
* **Interactive Quizzing Module:**
    * Instructors can create and manage quizzes with multiple-choice questions.
    * Students can take quizzes and receive instant results and performance feedback.
    * Tracking of quiz attempts and results.
* **RESTful API:** Robust backend API for all data interactions.

## Technologies Used

### Frontend (Mobile Application)

* **Framework:** Flutter (Dart)
* **State Management:** (Mention if you're using Provider, BLoC, Riverpod, etc. - otherwise, can omit or state "local state management")
* **HTTP Client:** `http` package
* **Local Storage:** `shared_preferences`

### Backend (API Server)

* **Runtime:** Node.js
* **Web Framework:** Express.js
* **Database:** MongoDB Atlas (Cloud-hosted NoSQL)
* **ODM:** Mongoose
* **Authentication:** `jsonwebtoken`, `bcryptjs`
* **Environment Variables:** `dotenv`
* **CORS:** `cors` middleware

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* Node.js (LTS version recommended)
* npm or Yarn
* MongoDB Atlas Account (or a local MongoDB instance)
* Flutter SDK (stable channel recommended)
* An IDE (VS Code, Android Studio, IntelliJ IDEA) with Flutter and Dart plugins
* An Android emulator, iOS simulator, or a physical device

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/YourUsername/educonnect.git](https://github.com/YourUsername/educonnect.git)
    cd educonnect
    ```

2.  **Backend Setup:**
    ```bash
    cd educonnect-backend
    npm install
    ```
    Create a `.env` file in the `educonnect-backend` directory and add your environment variables:
    ```dotenv
    PORT=5000
    MONGODB_URI=mongodb+srv://<your_username>:<your_password>@educonnect-cluster.ovs0ezb.mongodb.net/?retryWrites=true&w=majority&appName=educonnect-cluster
    JWT_SECRET=your_very_long_and_random_generated_secret_key_here
    ```
    *Replace `<your_username>`, `<your_password>`, and `your_very_long_and_random_generated_secret_key_here` with your actual MongoDB Atlas credentials and a strong, random JWT secret.*

    **Run the Backend:**
    ```bash
    npm start
    ```
    The backend server should now be running on `http://localhost:5000`.

3.  **Frontend Setup:**
    ```bash
    cd ../educonnect-app # Navigate back to the main project folder, then into the Flutter app
    flutter pub get
    ```
    **Adjust API Base URL:**
    In `lib/api/api_service.dart`, update the `_baseUrl` to match your backend's IP address and port:
    * For Android Emulator: `static const String _baseUrl = 'http://10.0.2.2:5000/api';`
    * For iOS Simulator/Web: `static const String _baseUrl = 'http://localhost:5000/api';`
    * For Physical Device: `static const String _baseUrl = 'http://YOUR_LOCAL_IP_ADDRESS:5000/api';`

    **Run the Frontend:**
    ```bash
    flutter run
    ```

## Project Structure

.
├── educonnect-backend/           # Node.js Express.js API
│   ├── controllers/              # Business logic for routes
│   ├── models/                   # Mongoose schemas
│   ├── middleware/               # Auth middleware, etc.
│   ├── routes/                   # API endpoints
│   ├── .env                      # Environment variables (local)
│   ├── server.js                 # Main backend entry point
│   └── package.json
└── educonnect-app/               # Flutter mobile application
├── lib/                      # Dart source code
│   ├── api/                  # API service layer
│   ├── models/               # Data models
│   ├── screens/              # Main UI pages/screens
│   ├── widgets/              # Reusable UI components
│   ├── utils/                # Utility functions, constants
│   └── main.dart             # App entry point
├── pubspec.yaml              # Flutter dependencies
└── pubspec.lock


## Contributing

Contributions are welcome! If you find a bug or have a feature request, please open an issue. If you'd like to contribute code, please fork the repository and submit a pull request.

## License

This project is licensed under the [Your License Here, e.g., MIT License] - see the `LICENSE` file for details.

## Contact

Your Name - [Your Email/LinkedIn Profile]

Project Link: [https://github.com/YourUsername/educonnect](https://github.com/YourUsername/educonnect)
