# 🔄 SwapSkill: Peer-to-Peer Mastery Exchange

[![MERN Stack](https://img.shields.io/badge/MERN-Stack-blue.svg)](https://www.mongodb.com/mern-stack)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**SwapSkill** is a premium, elite peer-to-peer platform designed to bypass the traditional "pay-to-learn" gatekeeping of modern education. By matching experts through a bidirectional interest engine, SwapSkill turns knowledge into the primary currency of the digital age.

---

## 1. 🚀 Project Overview

### What is SwapSkill?
SwapSkill is a high-fidelity MERN stack application that facilitates direct skill exchanges between individuals. Instead of paying for expensive courses, users "swap" their expertise (e.g., teaching React in exchange for learning UI/UX Design).

### Why it was built
The modern upskilling landscape is fragmented and expensive. SwapSkill was built to democratize high-level expertise through reciprocity, focusing on community-driven growth rather than commercial transactions.

### Problem it solves
- **Financial Barriers**: Eliminates the high cost of bootcamps and certifications.
- **Passive Learning**: Transitions learners from passive video watching to active, 1-on-1 peer teaching.
- **Networking Gaps**: Automatically connects users with elite peers who have complementary skill sets.

### Unique Idea
The platform utilizes a **Bidirectional Mutual Interest** logic—ensuring that every match is a 100% efficient knowledge swap where both parties are simultaneously mentors and students.

---

## 2. 💡 Core Concept

### The Skill Exchange Model
SwapSkill operates on a "Double Coincidence of Wants" model applied to education:
1. **The Teach List**: Skills you have mastered and are willing to share.
2. **The Learn List**: Skills you aspire to acquire.

### Teach ↔ Learn System
Traditional platforms focus on one-way tutoring. SwapSkill creates a **reciprocity loop**. If User A teaches *Python* and wants to learn *Marketing*, and User B teaches *Marketing* and wants to learn *Python*, the system creates a high-priority match.

### Mutual Benefit Logic
Success is measured by "Knowledge ROI." Every session conducted results in synchronous growth for both users, creating a hyper-efficient learning ecosystem.

---

## 3. 🏗️ Architecture

### Frontend + Backend Flow
SwapSkill utilizes a decoupled architecture where the frontend and backend communicate via a RESTful API layer.

1.  **Request Initiation**: The React (Vite) frontend dispatches an asynchronous request (via `fetch` or `axios`) to the Node/Express backend.
2.  **Authentication**: Protected routes pass a JWT (JSON Web Token) in the `Authorization` header.
3.  **Controller Processing**: The Express router directs the request to a specific controller (e.g., `matchController.js`), which handles business logic and data retrieval.
4.  **Hybrid Data Layer**: The system attempts to fetch from **MongoDB Atlas**. If the connection is absent, a custom **Mock Data Fallback** middleware serves data from a local `data.json` file to ensure a zero-config developer experience.
5.  **Response**: The backend returns a structured JSON response (Success/Message/Data), which the React frontend consumes to update global context state (Auth, Notifications, Toasts).

---

## 4. 🔗 File & Component Connectivity

### 🎨 Key Frontend Files
- **`AuthContext.jsx`**: The heartbeat of the app. It persists user sessions and provides the `user` object to all protected components.
- **`Dashboard.jsx`**: The central hub that consumes `Match` and `Profile` data to provide a personalized experience.
- **`Chat.jsx`**: A real-time (polling or socket-ready) interface for direct peer communication.
- **`Session.jsx`**: Manages the Jitsi meet integration and session scheduling.
- **`SkillCurator.jsx`**: A specialized component for managing the Teach/Learn lists with AI suggestions.

### ⚙️ Key Backend Files
- **`routes/`**: Defensive gatekeeping. Defines all API paths and applies `auth` middleware.
- **`controllers/`**: The logic engine. Functions like `getMatches` perform the heavy lifting.
- **`server.js`**: The orchestrator. Handles DB connection logic, mock data fallbacks, and server initialization.

👉 **Connectivity Logic**: `Navbar.jsx` connects to `NotificationContext` to show live counts, while `App.jsx` orchestrates global route transitions using `AnimatePresence` and `location` keys.

---

## 5. ⚙️ Features (Detailed)

| Feature | Input | Process | Output |
| :--- | :--- | :--- | :--- |
| **Authentication** | Email/Password | Bcrypt hashing + JWT generation | Secure Session & Profile |
| **Matching System** | Teach/Learn Lists | Bidirectional overlap filtering | Prioritized Peer Matches |
| **Chat System** | Message Text | State persistence in Chat log | 1-on-1 Communication |
| **Session System** | "Start Session" | Jitsi Meeting ID generation | Live Video Exchange |
| **AI Curator** | Partial Skill Keywords | Keyword mapping & discovery | Related Skill Suggestions |
| **Notifications** | Event (Match/Session) | Persistent localStorage storage | Dynamic UI Bell Indicators |
| **Elite Chatbot** | Natural Text | Predefined response mapping | Instant Local Guidance |
| **Guest Preview** | Landing Page Visit | Mock data rendering | Interactive Product Tour |
| **Smart Search** | Search Input | Substring & Char-inclusion logic | Fuzzy Search Results |

---

## 6. 🧠 Matching Algorithm (The Core)

The "Secret Sauce" of SwapSkill is its **Mutual Interest Filtering**.

### Bidirectional Logic
Unlike typical search engines, the algorithm is restrictive to ensure quality. It filters candidates using a dual-check:
```javascript
const match = theyTeachWhatILearn && iTeachWhatTheyLearn;
```

### How it works internally:
1.  **Normalization**: All user input is converted to lower-case.
2.  **Filtration**: The system excludes the current user and looks for users whose `skillsTeach` intersect with the requester's `skillsLearn`.
3.  **Reciprocity Check**: It then verifies the inverse intersection.
4.  **Scoring**: A `matchScore` is calculated based on the total number of overlapping skills, ensuring the "best" swaps appear first.

---

## 7. 🤖 AI & Smart Features

### Skill Recommendation Logic
Using the `skillKeywords.js` utility, the system maps broad terms to specific mastery areas. Searching for "web" will intelligently suggest "frontend," "backend," and "fullstack" mastery paths.

### Fuzzy Search
The search architecture is built for human error. It uses a custom `fuzzyMatch` helper that checks for both substrings and character inclusion, ensuring that "Ract" still finds "React."

---

## 8. 🎨 UI/UX Design System

### Luxury SaaS Aesthetic
- **Color Palette**: A curated mix of **Burgundy (#800020)** for authority and **Blush Pink** for modern elegance.
- **Typography**: Utilizing bold, large-scale typography for clear information hierarchy.

### Interaction Design
- **Framer Motion**: Global route transitions, staggered hero entrances, and tactile card hover states.
- **Glassmorphism**: Subtle translucent backgrounds for a state-of-the-art feel.
- **Light & Dark Mode**: Persistent theme switching via `ThemeContext`.

---

## 9. 🗄️ Data Layer

### Hybrid Implementation
The platform is designed to be "Zero-Config" for evaluators:
1.  **MongoDB Atlas**: Default persistent storage for production-ready deployments.
2.  **JSON Storage (`data.json`)**: Automatic fallback. If MongoDB is unavailable, the server uses BFS (Base File System) polling to read/write state locally.
3.  **Why Fallback?**: To allow recruiters to review the full functionality without setting up a database cluster.

---

## 10. 🔌 APIs

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/auth/register` | POST | Register a new elite mastery account |
| `/api/profile/update` | POST | Refine Teach/Learn lists and bio |
| `/api/matches` | GET | Retrieve bidirectional matches |
| `/api/chat/:userId` | GET | Fetch message history with a peer |
| `/api/sessions/start` | POST | Generate Jitsi meeting link |
| `/api/skills/suggest` | GET | AI-powered skill curation hints |

---

## 11. 🧪 User Journey (Example Flow)

1.  **The Elite Entry**: User lands on the animated Hero, interacts with the guest preview, and registers.
2.  **Curating Mastery**: User adds "React" to *Teach* and "AI Engineering" to *Learn*.
3.  **Discovering Peers**: The Dashboard instantly shows User B who teaches "AI" and wants to learn "React."
4.  **Collaborative Chat**: Users exchange availability via the secure chat portal.
5.  **Elite Session**: A Jitsi session is launched directly within the app for a live knowledge swap.
6.  **Growth**: User updates their profile with newly learned mastery, triggering a new wave of matches.

---

## 12. 🚀 Installation & Setup

### Prerequisites
- Node.js (v16+)
- npm

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/SwapSkill.git
cd SwapSkill
```

### 2. Backend Setup
```bash
cd server
npm install
# Create .env with MONGODB_URI and PORT (5001)
npm run dev
```

### 3. Frontend Setup
```bash
cd ../client
npm install
npm run dev
```

---

## 13. 📱 Future Improvements
- **Real-time Notifications**: Transition from polling to WebSockets (Socket.io).
- **Advanced AI Chatbot**: Integrating LLMs for automated skill-roadmap generation.
- **Mobile Companion**: Developing a React Native application for on-the-go swapping.

---

## 14. 🎯 Why This Project is Valuable
SwapSkill is not just a coding exercise; it's a scalable solution to the rising cost of technical education. It demonstrates technical mastery of:
- **State Management**: Orchestrating complex data flows across multiple contexts.
- **Algorithm Design**: Solving the bidirectional exchange problem.
- **UI/UX Consistency**: Building a premium, brand-aligned design system.

---
*Developed with Passion & Elegance for the Mastery Circle.*
