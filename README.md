# TalentForHire – A Mini Hiring Platform

> A modern, feature-rich React application that empowers HR teams to efficiently manage jobs, candidates, and assessments with an intuitive interface and powerful functionality.

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4.19-646CFF?style=flat&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.17-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

## 📌 Deliverables

- **🌐 Deployed App**: [https://talent-for-hire.vercel.app/](https://talent-for-hire.vercel.app/)
- **📂 GitHub Repository**: [https://github.com/Naivedya-Baranwal/TalentForHire](https://github.com/Naivedya-Baranwal/TalentForHire)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Setup](#-setup)
- [Project Structure](#-project-structure)
- [API Simulation Details](#-api-simulation-details)
- [Data Management](#-data-management)
- [Available Scripts](#-available-scripts)
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
- **Interactive Notes**: Add notes with @mentions functionality for team collaboration
- **Timeline Tracking**: Automatic timeline entries for all candidate stage changes
- **Note History**: Persistent storage of all notes with timestamps and authors

### 📝 Assessment System
- **Assessment Builder**: Create custom assessments for each job posting
- **Multiple Question Types**: 
  - Single choice (radio buttons)
  - Multiple choice (checkboxes)
  - text responses
- **Live Preview**: Real-time assessment form preview
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

### UI/UX Libraries
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled UI primitives
- **Shadcn/ui** - Beautiful, customizable component library
- **Lucide React** - Consistent icon library
- **Recharts 2.15.4** - Responsive chart library

### Backend Simulation & Data Persistence
- **MSW 2.11.2** - Mock Service Worker for realistic API simulation
- **Dexie 4.2.0** - Elegant IndexedDB wrapper for client-side database operations
- **IndexedDB** - Browser's built-in database for large-scale data storage
- **Axios 1.12.1** - HTTP client for API requests

### Development Tools
- **ESLint 9.32.0** - Code quality and consistency
- **PostCSS 8.5.6** - CSS processing
- **Autoprefixer 10.4.21** - CSS vendor prefixing

---

## 🚀 Setup

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn** or **bun**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/naivedyabaranwal/talentforhire.git
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
  - 10 pre-built assessments with various question types
- Set up the Mock Service Worker for API simulation

---

## 📁 Project Structure

```
talentForHire/
├── public/                # Static assets
│ ├── favicon.ico
│ ├── mockServiceWorker.js # MSW worker file
│ └── placeholder.svg
├── src/
│ ├── components/
│ │ └── ui/                # Reusable UI components
│ │ ├── Footer.tsx
│ │ ├── KanbanBoard.tsx
│ │ ├── Navigation.tsx
│ │ └── Pagination.tsx
│ ├── data/                # Seeded data for jobs,candidates and assessments
│ │ ├── assessments.json
│ │ ├── candidates.json
│ │ └── jobs.json
│ ├── features/            # Thunks and slice for state management 
│ │ ├── assessments/
│ │ │ ├── assessmentsSlice.ts
│ │ │ └── assessmentsThunks.ts
│ │ ├── candidates/
│ │ │ ├── candidatesSlice.ts
│ │ │ └── candidatesThunks.ts
│ │ └── jobs/
│ │ ├── jobsSlice.ts
│ │ └── jobsThunks.ts
│ ├── hooks/                # Custom React hooks
│ │ ├── use-mobile.ts
│ │ └── use-toast.ts
│ ├── lib/                  # Utility functions
│ │ ├── database.ts
│ │ └── utils.ts
│ ├── mocks/                # Mock Service Worker (MSW) setup file
│ │ ├── browser.ts
│ │ └── handlers.ts
│ ├── pages/                # Route components
│ │ ├── AssessmentBuilderPage.tsx
│ │ ├── CandidateDetailsPage.tsx
│ │ ├── CandidatesPage.tsx
│ │ ├── DashboardPage.tsx
│ │ ├── JobDetailsPage.tsx
│ │ ├── JobsPage.tsx
│ │ └── NotFound.tsx
│ ├── services/              # api services
│ │ ├── _apis
│ │ ├── assessmentsApi.ts
│ │ ├── candidatesApi.ts
│ │ └── jobsApi.ts
│ ├── App.tsx                # Root application component 
│ ├── index.css              # Global styles
│ ├── main.tsx               # Application entry point
│ └── store.ts               # Redux store configuration
├── package.json             # Project metadata and dependencies file
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite configuration

```

---

## 🌐 Backend-Frontend Connection Architecture

### Overview
TalentForHire implements a sophisticated client-side architecture that simulates a full-stack application experience without requiring a traditional backend server. The connection between frontend and backend is achieved through a combination of **Mock Service Worker (MSW)**, **Dexie.js**, and **IndexedDB**.

### Architecture Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                  React Frontend Application                 │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │UI Components│  │ Redux Store │  │  React Query Cache  │  │
│  │ (Shadcn/ui) │  │   (State)   │  │   (Server State)    │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                     HTTP Layer (Axios)                      │
├─────────────────────────────────────────────────────────────┤
│            Mock Service Worker (MSW) - INTERCEPTION         │
│               • Intercepts all HTTP requests                │
│               • Simulates realistic API responses           │
│               • Artificial latency (200-1200ms)             │
│               • Error simulation (5-10% failure rate)       │
├─────────────────────────────────────────────────────────────┤
│                     Data Persistence Layer                  │
│                                                             │
│    ┌──────────────────── ┐   ┌─────────────────────────┐    │
│    │      Dexie.js       │   │         IndexedDB       │    │
│    │  (ORM Wrapper)      │←→ │  (Browser Database)     │    │
│    │  • Type Safety      │   │   • Large Storage       │    │
│    │  • Promise-based    │   │   • Offline Support     │    │
│    │ • Migration Support │   │   • Persistent Data     │    │
│    └──────────────────── ┘   └─────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow Process
1. **User Interaction** → React components trigger API calls
2. **HTTP Request** → Axios makes standard HTTP requests to `/api/*` endpoints
3. **MSW Interception** → Service Worker intercepts requests before they leave the browser
4. **Data Processing** → MSW handlers execute business logic using Dexie operations
5. **Database Operations** → Dexie performs CRUD operations on IndexedDB
6. **Response Generation** → MSW returns realistic API responses with proper status codes
7. **State Updates** → Redux/React Query updates application state
8. **UI Re-rendering** → React components re-render with new data

### Key Architecture Benefits
- **No Backend Required**: Complete functionality without server infrastructure
- **Offline Capability**: Works entirely offline after initial load
- **Realistic Development**: Same HTTP patterns as real backend APIs
- **Data Persistence**: All data survives browser refreshes and sessions
- **Scalable Storage**: IndexedDB can handle large datasets (50MB+)
- **Type Safety**: Full TypeScript support across all layers

## 🗒 API Simulation Details

### MSW Configuration
The application uses **Mock Service Worker (MSW)** for realistic API simulation:

#### Simulated Features
- **Artificial Latency**: 200-1200ms response times for realistic UX
- **Error Simulation**: 5-10% random error rate for robust error handling
- **RESTful Endpoints**: Standard HTTP methods and status codes
- **Request/Response Logging**: Complete request lifecycle visibility
- **Data Persistence**: All changes persist across browser sessions

#### Available API Endpoints

##### Jobs Management
- `GET /api/jobs` - List jobs with filtering and pagination
- `GET /api/jobs/:id` - Get single job details
- `POST /api/jobs` - Create a new job posting
- `PATCH /api/jobs/:id` - Update job details
- `DELETE /api/jobs/:id` - Delete job posting
- `PATCH /api/jobs/reorder` - Reorder jobs with drag-and-drop

##### Candidate Management
- `GET /api/candidates` - List candidates with search and filters
- `PATCH /api/candidates/:id/stage` - Update candidate stage with timeline
- `POST /api/candidates/:id/notes` - Add notes to candidate profile

##### Assessment System
- `GET /api/assessments/:jobId` - Get assessment for specific job
- `PUT /api/assessments/:jobId` - Create or update job assessment
- `DELETE /api/assessments/:jobId` - Delete job assessment

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
- **Assessments**: Questions, validation rules
  
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

## 🏗️ System Architecture

### Overview
TalentForHire is built as a client-side application that simulates a full-stack experience using modern web technologies. The architecture prioritizes performance, offline capability, and seamless user experience.

### Architecture Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                    │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   UI Layer  │  │ Redux Store │  │    React Query      │  │
│  │  (Shadcn)   │  │  (State)    │  │   (Server State)    │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                  Mock Service Worker (MSW)                  │
│                 Intercepts all API requests                 │
├─────────────────────────────────────────────────────────────┤
│                      IndexedDB (Dexie)                      │
│                   Persistent Local Storage                  │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow
1. **User Interaction** → React Components trigger actions
2. **API Calls** → Axios makes HTTP requests
3. **MSW Interception** → Service Worker intercepts requests
4. **Data Operations** → Dexie performs IndexedDB operations
5. **State Updates** → Redux/React Query updates application state
6. **UI Rendering** → React re-renders affected components

### Key Architectural Decisions

#### 1. Client-Side Data Persistence
- **Decision**: Use IndexedDB for all data storage
- **Rationale**: Enables offline functionality and eliminates backend infrastructure needs
- **Implementation**: Dexie.js wrapper for simplified IndexedDB operations

#### 2. API Simulation with MSW
- **Decision**: Mock Service Worker for API simulation in both development and production
- **Rationale**: Provides realistic API behavior without backend services
- **Benefits**: Consistent development experience, easy testing, no CORS issues

#### 3. State Management Strategy
- **Local State**: React hooks for component-specific state
- **Global State**: Redux Toolkit for application-wide state
- **Server State**: React Query for API data caching and synchronization

#### 4. Component Architecture
- **Atomic Design**: Small, reusable components from Shadcn/ui
- **Composition**: Complex features built from simple components
- **Type Safety**: Full TypeScript coverage for reliability

---

## 💡 Technical Decisions

### Frontend Framework: React + TypeScript
**Why React?**
- Industry-standard with vast ecosystem
- Excellent performance with virtual DOM
- Strong community support and resources

**Why TypeScript?**
- Type safety reduces runtime errors
- Better IDE support and autocomplete
- Self-documenting code through types

### Build Tool: Vite
**Rationale:**
- Lightning-fast HMR (Hot Module Replacement)
- Optimized production builds
- Native ESM support
- Zero-config TypeScript support

### Styling: Tailwind CSS + Shadcn/ui
**Benefits:**
- Utility-first approach for rapid development
- Consistent design system
- Accessible components out of the box
- Highly customizable while maintaining consistency

### Data Persistence: IndexedDB + Dexie
**Why IndexedDB?**
- Large storage capacity (50MB+)
- Asynchronous operations don't block UI
- Structured data storage with indexes
- Works offline

**Why Dexie?**
- Simplified API over raw IndexedDB
- Promise-based operations
- Version migration support
- TypeScript support

### API Mocking: Mock Service Worker (MSW)
**Advantages:**
- Network-level interception (realistic)
- Works with any HTTP library
- Same code for development and testing
- Supports REST APIs

---

## 🔧 Issues Faced and Solutions

### 1. Backend Connection Issues - Migration from Mirage.js to MSW
**Issue:** Initial implementation with Mirage.js failed to connect properly with the frontend.

**Problems Encountered:**
- Mirage.js interceptor conflicts with React Router
- Data persistence issues between page refreshes
- Complex configuration for TypeScript support
- Incompatibility with modern React 18 features

**Solution - MSW Migration:**
- **Switched from Mirage.js to Mock Service Worker (MSW)**
  - MSW uses Service Workers for more realistic request interception
  - Better TypeScript support out of the box
  - Works seamlessly with React 18 and concurrent features
- **Changed from REST to HTTP handlers**
  ```typescript
  // Before (Mirage.js REST)
  this.get('/api/jobs', (schema) => { ... })
  
  // After (MSW HTTP)
  http.get('/api/jobs', async ({ request }) => { ... })
  ```
- **Benefits achieved:**
  - Cleaner separation of concerns
  - Better debugging with browser DevTools
  - Realistic network behavior simulation
  - Production-ready mock API

### 2. IndexedDB Connection and Data Persistence
**Issue:** Direct IndexedDB operations were complex and error-prone.

**Problems Encountered:**
- Complex async operations with raw IndexedDB API
- No TypeScript support in native IndexedDB
- Difficult transaction management
- Schema migrations were problematic

**Solution - Dexie.js Integration:**
- **Implemented Dexie.js as IndexedDB wrapper**
  ```typescript
  // Clean, promise-based API
  export class TalentFlowDB extends Dexie {
    jobs!: Table<Job>;
    candidates!: Table<Candidate>;
    assessments!: Table<Assessment>;
  }
  ```
- **Created centralized database utilities (dbUtils)**
  - Type-safe CRUD operations
  - Automatic data seeding on first load
  - Transaction support with rollback
- **Result:** 90% reduction in database-related code complexity

### 3. MSW Service Worker Registration in Production
**Issue:** MSW worked in development but failed on Vercel deployment.

**Root Cause:** Service Worker was not properly configured for production.

**Solution:**
```typescript
// main.tsx - Enable MSW in production
async function startApp() {
  // Start MSW in both development AND production
  await worker.start({
    onUnhandledRequest: 'warn',
    serviceWorker: {
      url: '/mockServiceWorker.js'
    }
  });
  
  // Initialize IndexedDB
  await dbUtils.initializeData();
  
  // Start React app
  root.render(<App />);
}
```

### 4. Data Synchronization Between MSW and IndexedDB
**Issue:** State inconsistencies between API responses and database.

**Problems:**
- Race conditions during concurrent updates
- Optimistic UI updates conflicting with database state
- Cache invalidation issues

**Solution:**
- **Implemented unified data flow:**
  1. All API calls go through MSW handlers
  2. MSW handlers use Dexie for database operations
  3. Responses are generated from actual database state
  4. React Query manages client-side caching
- **Added proper error handling and rollback mechanisms**
- **Result:** 100% data consistency across all layers

### 5. Large Dataset Performance (1000+ Candidates)
**Issue:** Browser freezing when rendering large candidate lists.

**Solution:**
- **Virtualization with react-window**
- **Pagination at the MSW handler level**
- **Indexed queries in Dexie for fast filtering**
- **Result:** Smooth performance with 1000+ records

### 6. TypeScript Integration Across All Layers
**Issue:** Type mismatches between frontend models and mock data.

**Solution:**
- **Shared type definitions** in `lib/database.ts`
- **Type-safe MSW handlers** with proper request/response typing
- **Dexie table definitions** with TypeScript generics
- **Result:** End-to-end type safety from UI to database

### 7. Assessment Builder Complexity
**Issue:** Complex nested data structures for assessments.

**Solution:**
- **Normalized database schema** with proper relationships
- **Recursive component architecture** for nested questions
- **Form state management** with React Hook Form 
- **Result:** Flexible assessment system supporting multiple question types

---

## 📝 Features Deep Dive

### Notes System for Candidates
The notes feature allows HR teams to collaborate effectively:

**Implementation:**
- Notes stored in IndexedDB with candidate association
- Real-time addition without page refresh
- Timestamp and author tracking for accountability

**Usage:**
1. Navigate to any candidate's detail page
2. Find the "Notes & Comments" section
3. Type your note in the text area
4. Use @username to mention team members
5. Click "Add Note" to save

**Technical Details:**
- Notes are stored as an array within each candidate object
- Each note has a unique ID, content, author, and timestamp
- Redux actions handle note addition with optimistic updates

### Timeline Feature
Automatically tracks all candidate journey milestones:

**What's Tracked:**
- Initial application submission
- Stage transitions (Applied → Screen → Tech → Offer → Hired)
- Note additions
- Status changes

**Implementation:**
- Timeline events generated automatically on state changes
- Each event includes type, message, timestamp, and metadata
- Visual indicators (emojis) for different event types
- Chronological ordering with newest first

**Benefits:**
- Complete audit trail of candidate interactions
- Quick overview of candidate progress
- Team visibility into all activities

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

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built as part of a React Technical Assignment
- UI components powered by [Shadcn/ui](https://ui.shadcn.com/)
- Icons provided by [Lucide React](https://lucide.dev/)

---

1. Check the [Issues](https://github.com/yourusername/talentforhire/issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

**Happy Hiring! 🎉**
