# TalentForHire – A Mini Hiring Platform

> A modern, feature-rich React application that empowers HR teams to efficiently manage jobs, candidates, and assessments with an intuitive interface and powerful functionality.

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4.19-646CFF?style=flat&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.17-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Simulation](#-api-simulation)
- [Data Management](#-data-management)
- [Available Scripts](#-available-scripts)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🎯 Jobs Management
- **CRUD Operations**: Create, edit, archive, and unarchive job postings
- **Smart Validation**: Title requirements and unique slug generation
- **Drag & Drop**: Intuitive reordering with optimistic UI updates and failure rollback
- **Advanced Filtering**: Filter and paginate jobs with server-like simulation
- **Deep Linking**: Direct access to job details via `/jobs/:jobId`

### 👥 Candidate Management
- **Virtualized Lists**: Efficiently handles 1000+ candidates with smooth scrolling
- **Powerful Search**: Search by name and email with real-time filtering
- **Stage Management**: Visual Kanban board for candidate stage transitions
- **Detailed Profiles**: Comprehensive candidate timelines at `/candidates/:id`
- **Interactive Notes**: Add notes with @mentions functionality

### 📝 Assessment System
- **Assessment Builder**: Create custom assessments for each job posting
- **Multiple Question Types**: 
  - Single choice (radio buttons)
  - Multiple choice (checkboxes)
  - Short and long text responses
  - Numeric inputs with range validation
  - File upload capabilities (stubbed)
- **Live Preview**: Real-time assessment form preview
- **Response Management**: Store and validate candidate responses with conditional logic
- **Persistent Storage**: All data saved locally using IndexedDB

### 🎨 User Experience
- **Responsive Design**: Optimized for desktop and mobile devices
- **Dark/Light Theme**: Theme switching with system preference detection
- **Toast Notifications**: Real-time feedback for user actions
- **Loading States**: Smooth loading experiences with skeleton screens
- **Error Handling**: Graceful error boundaries and user-friendly messages

---

## 🛠 Tech Stack

### Frontend Framework
- **React 18.3.1** - Modern React with concurrent features
- **TypeScript 5.8.3** - Type-safe development experience
- **Vite 5.4.19** - Lightning-fast build tool and dev server

### State Management & Data Fetching
- **Redux Toolkit 2.9.0** - Predictable state management
- **React Query 5.83.0** - Server state management and caching
- **React Hook Form 7.61.1** - Performant form handling
- **Zod 3.25.76** - Schema validation

### UI/UX Libraries
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled UI primitives
- **Shadcn/ui** - Beautiful, customizable component library
- **Lucide React** - Consistent icon library
- **Recharts 2.15.4** - Responsive chart library

### Data & API Simulation
- **MSW 2.11.2** - Mock Service Worker for API simulation
- **Dexie 4.2.0** - IndexedDB wrapper for local persistence
- **Axios 1.12.1** - HTTP client for API requests

### Development Tools
- **ESLint 9.32.0** - Code quality and consistency
- **PostCSS 8.5.6** - CSS processing
- **Autoprefixer 10.4.21** - CSS vendor prefixing

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn** or **bun**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/talentforhire.git
   cd talentforhire
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install
   
   # Using yarn
   yarn install
   
   # Using bun
   bun install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### First Run Experience

On your first visit, the application will:
- Initialize the local IndexedDB database
- Seed the database with sample data:
  - 25 diverse job postings (active, archived, draft, paused)
  - 1000 randomly generated candidates
  - 3+ pre-built assessments with various question types
- Set up the Mock Service Worker for API simulation

---

## 📁 Project Structure

```
talentForHire/
├── public/                 # Static assets
│   ├── favicon.ico
│   ├── mockServiceWorker.js # MSW worker file
│   └── placeholder.svg
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/             # Route components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── store/             # Redux store configuration
│   ├── types/             # TypeScript type definitions
│   ├── App.tsx            # Main application component
│   ├── index.css          # Global styles
│   ├── main.tsx           # Application entry point
│   └── store.ts           # Redux store setup
├── package.json
├── tailwind.config.ts     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

---

## 🗂 API Simulation

The application uses **Mock Service Worker (MSW)** to simulate a realistic backend API experience:

### Simulated Features
- **Artificial Latency**: 200-1200ms response times
- **Error Simulation**: 5-10% random error rate
- **RESTful Endpoints**: Standard HTTP methods and status codes
- **Data Persistence**: All changes persist across browser sessions

### Available Endpoints

#### Jobs
- `GET /api/jobs` - List jobs with filtering and pagination
- `POST /api/jobs` - Create a new job
- `PATCH /api/jobs/:id` - Update job details
- `PATCH /api/jobs/:id/reorder` - Reorder jobs

#### Candidates
- `GET /api/candidates` - List candidates with search and filters
- `POST /api/candidates` - Create a new candidate
- `PATCH /api/candidates/:id` - Update candidate information
- `GET /api/candidates/:id/timeline` - Get candidate activity timeline

#### Assessments
- `GET /api/assessments/:jobId` - Get assessment for a job
- `PUT /api/assessments/:jobId` - Update assessment configuration
- `POST /api/assessments/:jobId/submit` - Submit assessment response

---

## 💾 Data Management

### Local Persistence
- **IndexedDB**: Browser-based database for offline capability
- **Dexie**: Elegant wrapper providing a simple API
- **Auto-sync**: Changes automatically persist locally
- **State Restoration**: Application state restores on page refresh

### Data Models
- **Jobs**: Title, description, status, requirements, location
- **Candidates**: Personal info, stage, application history, notes
- **Assessments**: Questions, validation rules, scoring logic
- **Responses**: Candidate answers with timestamps and validation

---

## 📜 Available Scripts

In the project directory, you can run:

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build in development mode
npm run preview      # Preview production build
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
```

---

## 🌟 Key Features Walkthrough

### Dashboard
Access the main dashboard at `/dashboard` for an overview of:
- Recent job postings
- Candidate pipeline statistics
- Quick actions and navigation

### Job Management
1. Navigate to `/jobs` to view all job postings
2. Create new jobs with the "+ New Job" button
3. Edit existing jobs by clicking on job cards
4. Use drag-and-drop to reorder job priorities
5. Filter jobs by status, location, or other criteria

### Candidate Pipeline
1. Visit `/candidates` for the candidate management interface
2. Use the search bar to find specific candidates
3. Switch between list and Kanban board views
4. Drag candidates between different stages
5. Click on candidates for detailed profiles and timelines

### Assessment Builder
1. Access assessment builder via `/assessments/:jobId`
2. Add various question types using the intuitive interface
3. Preview assessments in real-time
4. Configure validation rules and conditional logic
5. Publish assessments for candidate completion

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style and patterns
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all linting checks pass

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built as part of a React Technical Assignment
- UI components powered by [Shadcn/ui](https://ui.shadcn.com/)
- Icons provided by [Lucide React](https://lucide.dev/)
- Design inspiration from modern hiring platforms

---

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/yourusername/talentforhire/issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

**Happy Hiring! 🎉**
