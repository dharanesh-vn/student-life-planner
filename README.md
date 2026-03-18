Orbit - The All-In-One AI-Powered Student Planner
Orbit is a full-stack web application designed from the ground up to be the definitive organizational tool for students. It addresses the common problem of a scattered digital life by integrating academic management, personal planning, financial tracking, and an intelligent AI study assistant into a single, cohesive, and beautifully designed dashboard.
This project was built from scratch as a comprehensive demonstration of modern web development principles, featuring a decoupled architecture with a robust backend API and a dynamic, responsive frontend.
Live Application: https://orbit-frontend-repo.vercel.app/

Project Overview
The core mission of Orbit is to provide students with a single source of truth for their entire life. In a world where course schedules are in one app, to-do lists in another, budgets in a spreadsheet, and study notes are scattered, Orbit offers a unified solution. It is designed not just to store information, but to provide tools that actively help students become more organized, focused, and productive.
The application is built with a clean, modular, and scalable architecture, making it both powerful for the end-user and maintainable for the developer.
Key Features
Orbit is divided into four main sections, each targeting a critical area of a student's life.
1. Secure Authentication & Home Page
Custom Branded Home Page: A professional landing page that serves as the authentication hub, featuring distinct forms for login and registration.
Robust User Registration: A secure sign-up process with real-time, in-form validation for all fields, including a password strength checker that guides users to create strong, secure passwords.
JWT-Based Authentication: The entire application is secured with JSON Web Tokens. A secure token is generated upon login and used to authorize all subsequent API requests, ensuring users can only access their own private data.
2. Academic Dashboard
This is the core of the application, designed for complete academic management.
Course Management: Full CRUD (Create, Read, Update, Delete) functionality for courses, featuring a user-friendly form with a structured input for class schedules (days of the week and times).
Assignment & Exam Tracker: A powerful to-do list for academic work. Users can add assignments, link them to a specific course, and set due dates with validation that prevents selecting past dates.
Digital Notebooks: A complete, two-pane note-taking system integrated with the course management feature. Users can create, edit, and delete detailed notes for each course they are enrolled in.
Pomodoro Timer: A built-in study tool to promote focus, featuring customizable durations for work and break sessions. The timer's state is saved in the browser, allowing it to persist across page refreshes.
3. Planning Dashboard
This section focuses on personal organization and long-term goals.
Daily Planner: A date-driven to-do list for non-academic tasks. Users can select any day and manage a unique list of tasks, with the ability to mark them as complete.
Annual Goals: A dedicated space for setting and tracking long-term goals. Goals can be created with detailed descriptions, assigned to categories (e.g., Personal, Career), and their progress can be tracked by updating their status.
4. Finance Dashboard
A simple yet effective suite of tools for managing student finances.
Account & Subscription Tracking: Users can create multiple financial accounts and track recurring monthly subscriptions, with the dashboard automatically calculating total balances and monthly costs.
Transaction Logging: The core feature, allowing users to log income and expense transactions. When a transaction is logged against a specific account, the backend logic automatically and accurately updates the account's balance.
5. AI Study Assistant
The standout feature that transforms Orbit into an intelligent study partner.
Seamless Integration: The assistant automatically gathers all notes a user has written for a selected course to use as its knowledge base.
Four Powerful Functions:
Generate Summary: Condenses all notes for a course into a concise summary.
Extract Key Concepts: Identifies and defines the most important terms.
Create Practice Quiz: Generates multiple-choice questions based on the notes.
Generate Flashcards: Creates question-and-answer pairs for quick revision.
Secure Implementation: All AI processing is handled on the backend, ensuring the secret API key is never exposed to the user's browser.
Technical Architecture
Orbit is built using a modern, decoupled, three-tier architecture.
Frontend (Client): A dynamic Single-Page Application (SPA) built with Angular. It is responsible for rendering the UI and communicating with the backend via HTTPS API requests. It is deployed on Vercel for optimal performance and global availability.
Backend (Server): A secure RESTful API built with Node.js and Express.js. It handles all business logic, user authentication, and data processing. It is deployed on Render for reliable and scalable server management.
Database: A MongoDB NoSQL database hosted on MongoDB Atlas. It provides a flexible and scalable solution for storing all user and application data.
This separation of concerns ensures that the application is secure, maintainable, and scalable.
Technology Stack
Backend
Runtime: Node.js
Framework: Express.js
Database: MongoDB with Mongoose ODM
Authentication: JSON Web Tokens (JWT)
API Testing: Postman
Frontend
Framework: Angular
Language: TypeScript
State Management: RxJS (Observables, BehaviorSubject)
Forms: Angular Reactive Forms & Template-Driven Forms
Styling: CSS with a custom design system based on CSS Variables
Deployment
Frontend: Vercel
Backend: Render
Database: MongoDB Atlas
Getting Started
To run this project locally, you will need two terminals.
Backend Setup
Navigate to the backend directory.
Run npm install to install all dependencies.
Create a .env file and add your MONGO_URI, JWT_SECRET, and GEMINI_API_KEY.
Run npm run dev to start the server.
Frontend Setup
Navigate to the frontend directory.
Run npm install to install all dependencies.
Run ng serve to start the development server.
Open your browser to http://localhost:4200.
API Endpoints
The backend exposes a comprehensive REST API for all application features. All endpoints under /api/academic, /api/planning, /api/finance, and /api/ai are protected by JWT authentication.
POST /api/auth/register
POST /api/auth/login
GET, POST /api/academic/courses
PUT, DELETE /api/academic/courses/:id
GET, POST /api/academic/assignments
PUT, DELETE /api/academic/assignments/:id
...and many more for Notes, Tasks, Goals, Finances, and AI.
Conclusion
Orbit is a complete and robust full-stack application that demonstrates a wide range of modern web development skills, from backend API design and security to complex frontend state management and UI/UX design. It serves as a powerful testament to the capabilities of the MEAN stack in building real-world, feature-rich applications.
