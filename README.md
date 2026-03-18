# Orbit - The All-In-One AI-Powered Student Planner


Orbit is a comprehensive, full-stack web application designed from the ground up to be the definitive organizational tool for students. In the modern academic environment, a student's digital life is often fragmented across multiple platforms for scheduling, budgeting, task management, and note-taking. This project was built to solve that challenge by integrating these critical functions into a single, cohesive, and beautifully designed dashboard.

From high-level academic planning and financial tracking to daily task management and AI-powered study assistance, Orbit provides a unified solution to enhance student productivity and organization.

---

##  Key Features

The application is built around a secure user authentication system, providing a personalized and private dashboard for each student.

### For All Users
-    Secure Authentication & Branded Home Page:** A professional landing page serves as the authentication hub, featuring distinct, elegantly designed forms for user login and registration with robust, real-time validation. The entire application is secured with JSON Web Tokens (JWT).
-    Academically focused study sessions, and digital notebooks for organizing notes with rich content support (text, images, links).
-    Comprehensive Planning Dashboard:** This section extends beyond academics with a date-driven daily planner for life tasks and a dedicated space for setting and tracking long-term annual goals.
-    Intuitive Finance Dashboard:** A simple yet effective suite of tools for managing student finances, including account and subscription tracking with automated balance calculations and transaction logging.

### The AI Study Assistant (Standout Feature)
-    Seamless Integration: The assistant automatically gathers all notes a user has written for a selected course to use as its knowledge base.
-    Four Powerful Functions:
    1.  Generate Summary: Condenses all notes for a course into a concise, high-level summary.
    2.  Extract Key Concepts: Identifies and defines the most important terms from the notes.
    3.  Create Practice Quiz: Generates multiple-choice questions to help the user test their knowledge.
    4.  Generate Flashcards: Creates question-and-answer pairs perfect for quick revision.
-    Secure Implementation: All AI processing is handled on the backend via a secure, server-to-server API call, ensuring the secret third-party API key is never exposed.

---

##  Tech Stack

| Category | Technology |
| :--- | :--- |
| **Frontend** | Angular, TypeScript, RxJS, Reactive Forms |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (with Mongoose & MongoDB Atlas) |
| **Authentication**| JWT (JSON Web Tokens), bcrypt |
| **API Integration** | Google Generative AI (Gemini) or OpenAI |

---

##  Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites
-   [Node.js](https://nodejs.org/) (v18.x or later recommended)
-   [Angular CLI](https://angular.io/cli) installed globally (`npm install -g @angular/cli`)
-   A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) account
-   An API Key from either [Google AI Studio](https://aistudio.google.com/) or the [OpenAI Platform](https://platform.openai.com/)

### Installation Guide

1.  **Clone the repositories:**
    ```bash
    # Clone the backend
    git clone https://github.com/dharanesh-vn/orbit-backend-repo.git
    # Clone the frontend
    git clone https://github.com/dharanesh-vn/orbit-frontend-repo.git
    ```

2.  **Setup the Backend:**
    ```bash
    cd orbit-backend-repo
    npm install
    ```
    -   Create a `.env` file in the `backend` root directory.
    -   Add your MongoDB Atlas connection string, a JWT secret, and your chosen AI API key.

    **.env file structure:**
    ```
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_key
    GEMINI_API_KEY=your_google_ai_api_key_here
    ```

3.  **Setup the Frontend:**
    ```bash
    cd ../orbit-frontend-repo
    npm install
    ```

### Running the Application

You will need two separate terminals to run both the frontend and backend servers.

1.  **Run the Backend Server:**
    ```bash
    cd orbit-backend-repo
    npm run dev
    ```
    The server will be running on `http://localhost:5000`.

2.  **Run the Frontend Application:**
    ```bash
    cd orbit-frontend-repo
    ng serve
    ```
    The application will be available at `http://localhost:4200`.

---

## Conclusion

Orbit is a complete and robust full-stack application that demonstrates a wide range of modern web development skills, from backend API design and security to complex frontend state management and polished UI/UX design. It serves as a powerful testament to the capabilities of the MEAN stack in building real-world, feature-rich, and intelligent applications.
