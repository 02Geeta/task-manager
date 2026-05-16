# TaskFlow AI - Team Task Manager

A modern, AI-powered task management platform with stunning pastel UI and advanced collaboration features. Built with React, TypeScript, Tailwind CSS, and Supabase.

## 🌟 Core Features

### 🎨 Modern Landing Page
- Beautiful hero section with gradient backgrounds
- Feature showcase with icons
- Statistics and social proof
- Call-to-action sections
- Professional footer with links
- Fully responsive design

### User Authentication
- Secure signup and login with email/password
- JWT-based authentication
- Session persistence with localStorage

### Project Management
- Create multiple projects
- Project creators automatically become Admins
- Add/remove team members (Admin only)
- View all projects you're part of

### Task Management
- Create tasks with title, description, due date, and priority
- Assign tasks to team members
- Three-stage task board: To Do → In Progress → Done
- Update task status with drag-and-drop style workflow
- Visual indicators for overdue tasks
- Priority levels (Low, Medium, High)

### Dashboard & Analytics
- Total task count with interactive charts
- Tasks by status (To Do, In Progress, Done) - Bar & Pie charts
- Overdue tasks tracking
- Tasks per user statistics with line graph
- Team member overview
- Completion rate visualization
- Real-time team productivity metrics

### 🤖 AI-Powered Features
- **AI Task Assistant**: Generate smart task descriptions from brief input
- **Auto-Priority Detection**: AI suggests priority based on keywords (urgent, critical, etc.)
- **Smart Due Date Suggestions**: Automatically suggests deadlines
- **Task Breakdown**: AI generates subtasks for complex tasks
- **Smart Tags**: Auto-generates relevant tags (#frontend, #bug, #feature, etc.)
- **Enhanced Descriptions**: AI creates structured templates (Bug Fix, Feature, Design, etc.)
- **AI Insights Dashboard**: Real-time intelligent insights about:
  - Team performance and progress
  - Workload distribution analysis
  - Overdue task alerts
  - Work-in-progress optimization
  - Productivity recommendations

### 💬 Collaboration Features
- **Task Comments**: Real-time discussion threads on tasks
- **Activity Feed**: Track all project activities and changes
- **Real-time Notifications**: Smart alerts for important updates
- **Team Member Management**: Easy add/remove with role-based access

### 📅 Advanced Views
- **Calendar View**: Visual timeline with task deadlines
- **Kanban Board**: Drag-and-drop task management
- **Dashboard**: Analytics and insights
- **Activity Timeline**: Historical project activity

### 🔍 Search & Productivity
- **Advanced Search**: Find tasks instantly
- **Smart Filters**: Filter by status, priority, assignee, due date
- **Task Templates**: Pre-built workflows for common scenarios
- **Task Labels**: Color-coded labels for organization

### 📊 Analytics & Insights
- **Interactive Charts**: Bar, Pie, and Line charts
- **Completion Tracking**: Real-time progress metrics
- **Team Productivity**: Individual and team performance
- **Overdue Alerts**: Automatic deadline tracking

### Role-Based Access Control
**Admin:**
- Create and delete tasks
- Assign tasks to any member
- Add/remove team members
- Full project management

**Member:**
- View assigned tasks only
- Update status of their own tasks
- View project dashboard

## 🏗️ Architecture

### Frontend
- **Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS v4
- **Charts:** Recharts (Bar, Pie, Line charts)
- **Icons:** Lucide React
- **State Management:** React Hooks (useState, useEffect)
- **AI Features:** Pattern-matching intelligence (no external API)

### Backend
- **Runtime:** Deno (Supabase Edge Functions)
- **Server Framework:** Hono
- **Database:** Supabase (PostgreSQL)
- **Storage:** Key-Value store for flexible data structure
- **Authentication:** Supabase Auth with JWT

### API Architecture
Three-tier architecture:
```
Frontend ↔ Server (Edge Function) ↔ Database (Supabase)
```

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── App.tsx                     # Main application component
│   │   └── components/
│   │       ├── LandingPage.tsx         # Marketing landing page
│   │       ├── AuthForm.tsx            # Login/Signup form
│   │       ├── ProjectList.tsx         # Project sidebar
│   │       ├── TaskBoard.tsx           # Kanban-style task board
│   │       ├── Dashboard.tsx           # Analytics dashboard with charts
│   │       ├── CalendarView.tsx        # Calendar view for tasks
│   │       ├── ActivityFeed.tsx        # Project activity timeline
│   │       ├── TaskComments.tsx        # Task discussion threads
│   │       ├── Notifications.tsx       # Smart notification system
│   │       ├── SearchFilter.tsx        # Advanced search and filtering
│   │       ├── TaskTemplates.tsx       # Pre-built task workflows
│   │       ├── TaskLabels.tsx          # Label management system
│   │       ├── AITaskAssistant.tsx     # AI-powered task generator
│   │       ├── AIInsights.tsx          # AI insights and recommendations
│   │       ├── CreateProjectModal.tsx
│   │       ├── CreateTaskModal.tsx
│   │       └── ManageMembersModal.tsx
│   └── styles/
│       ├── theme.css               # Pastel design tokens
│       └── fonts.css               # Font imports
├── supabase/
│   └── functions/
│       └── server/
│           ├── index.tsx           # Main server with all API routes
│           └── kv_store.tsx        # Database utility (autogenerated)
└── utils/
    └── supabase/
        └── info.tsx                # Supabase config (autogenerated)
```

## 🚀 API Endpoints

### Authentication
- `POST /auth/signup` - Create new user account
- `POST /auth/login` - Login and get access token
- `GET /auth/session` - Get current user session

### Projects
- `POST /projects` - Create new project (creates user as Admin)
- `GET /projects` - Get all user's projects
- `POST /projects/:id/members` - Add member (Admin only)
- `DELETE /projects/:id/members/:memberId` - Remove member (Admin only)

### Tasks
- `POST /tasks` - Create task (Admin only)
- `GET /projects/:id/tasks` - Get project tasks (filtered by role)
- `PUT /tasks/:id` - Update task (Admin: all fields, Member: status only)
- `DELETE /tasks/:id` - Delete task (Admin only)

### Dashboard
- `GET /dashboard/:projectId` - Get analytics and statistics

## 🔐 Security Features

- JWT-based authentication
- Role-based access control enforced on backend
- Service role key never exposed to frontend
- CORS configured for secure cross-origin requests
- Password validation (minimum 6 characters)
- Email auto-confirmation (development mode)

## 📊 Database Schema

### Key-Value Store
The application uses Supabase's KV store with the following key patterns:

```
user:{userId}                    # User profile data
user:{userId}:projects           # Array of project IDs
project:{projectId}              # Project data
project:{projectId}:tasks        # Array of task IDs
task:{taskId}                    # Task data
```

## 🛠️ Local Development Setup

### Prerequisites
- Node.js 18+ or Bun
- Supabase account
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd team-task-manager
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Configure Supabase**
   - Create a new Supabase project at https://supabase.com
   - The application will automatically configure the connection
   - Supabase credentials are stored in environment variables

4. **Start development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Deploy Supabase Edge Function**
   - From the Figma Make settings page, deploy the edge function
   - This deploys the `/supabase/functions/server` to Supabase

## 🚢 Deployment to Railway

### Step 1: Prepare for Deployment

1. **Build the application**
   ```bash
   pnpm build
   ```

2. **Ensure Supabase Edge Function is deployed**
   - Deploy from Figma Make settings page
   - Verify the function is accessible at:
     `https://{projectId}.supabase.co/functions/v1/make-server-bfa263b0/health`

### Step 2: Deploy to Railway

1. **Create Railway account**
   - Visit https://railway.app
   - Sign up with GitHub

2. **Create new project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your repository

3. **Configure build settings**
   ```
   Build Command: pnpm install && pnpm build
   Start Command: pnpm preview
   ```

4. **Set environment variables** (if needed)
   - Railway auto-detects Vite apps
   - Supabase credentials are embedded in the code

5. **Deploy**
   - Railway will automatically build and deploy
   - Get your public URL from the Railway dashboard

### Step 3: Verify Deployment

1. Access your Railway URL
2. Test signup/login flow
3. Create a project and tasks
4. Verify all features work correctly

## 📝 Usage Guide

### Getting Started

1. **Sign Up**
   - Enter name, email, and password
   - Click "Sign Up"
   - Account is created and auto-confirmed

2. **Login**
   - Use your email and password
   - Click "Login"

3. **Create a Project**
   - Click "New Project"
   - Enter project name and description
   - You become the Admin automatically

4. **Add Team Members**
   - Click "Members" button
   - Enter member's email address
   - They must have an account first

5. **Create Tasks**
   - Click "New Task" (Admin only)
   - **Use AI Assistant**: Enter brief description like "Fix urgent login bug"
   - AI will suggest: priority, due date, enhanced description, subtasks
   - Click "Apply All Suggestions" to auto-fill the form
   - Assign to team member

6. **Manage Tasks**
   - View tasks in Kanban board
   - Click status buttons to move tasks
   - Admins can edit and delete
   - Members can update status of assigned tasks

7. **View Analytics**
   - Click "Dashboard" tab
   - Interactive charts showing task distribution
   - Completion rate pie chart
   - Team productivity line graph
   - **AI Insights**: Get intelligent recommendations about:
     - Project performance
     - Workload balance
     - Overdue tasks
     - Productivity optimization

## 🎯 Feature Checklist

### ✅ Core Features
- ✅ Modern AI-inspired landing page
- ✅ User Authentication (Signup, Login with JWT)
- ✅ Project Management (Create, Admin assignment)
- ✅ Add/Remove Members (Admin only)
- ✅ Task Management (Create, Update, Assign, Status tracking)
- ✅ Role-Based Access (Admin: full control, Member: view/update assigned tasks)
- ✅ RESTful APIs with proper error handling
- ✅ Database with relationships (Users → Projects → Tasks)

### ✅ Advanced Features
- ✅ AI Task Assistant with smart suggestions
- ✅ AI Insights Dashboard with recommendations
- ✅ Interactive Charts (Bar, Pie, Line)
- ✅ Task Comments & Discussions
- ✅ Activity Feed & History
- ✅ Smart Notifications System
- ✅ Advanced Search & Filtering
- ✅ Calendar View
- ✅ Task Templates (6 pre-built workflows)
- ✅ Task Labels & Tags
- ✅ Pastel Color Theme
- ✅ Smooth Animations
- ✅ Mobile Responsive Design
- ✅ Deployment ready (Railway compatible)

## 🔧 Technical Decisions

### Why Key-Value Store?
- Flexible schema for rapid prototyping
- Simple relationships managed in application code
- Perfect for small-to-medium scale applications
- Easy to understand and maintain

### Why Supabase Edge Functions?
- Built-in authentication
- Global CDN for low latency
- PostgreSQL database included
- Free tier suitable for prototypes

### Why Hono Framework?
- Lightweight and fast
- Express-like API (familiar)
- Built for edge runtimes
- Excellent TypeScript support

## 🐛 Known Limitations

- Email verification is auto-confirmed (no email server configured)
- Members must sign up before being added to projects
- No real-time updates (requires page refresh)
- No file attachments on tasks
- Basic search/filter functionality

## 🎯 AI Features in Detail

### AI Task Assistant
The AI Task Assistant analyzes your input and provides:

**Example Input:** "Fix urgent login bug"

**AI Generates:**
- **Priority:** High (detected "urgent")
- **Due Date:** 3 days from now (urgent tasks)
- **Enhanced Description:** Bug fix template with sections for:
  - Steps to reproduce
  - Expected vs actual behavior
  - Notes section
- **Subtasks:** 
  1. Reproduce the issue
  2. Identify root cause
  3. Implement fix
  4. Test the fix
  5. Deploy and verify
- **Tags:** #bug, #frontend (if mentioned)

**Supported Task Types:**
- 🐛 Bug Fixes
- ✨ New Features  
- 🎨 Design Tasks
- 🧪 Testing Tasks
- 📝 Documentation

### AI Insights Dashboard
Real-time intelligent analysis:
- **Performance Tracking:** Monitors completion rates
- **Workload Analysis:** Detects imbalanced task distribution
- **Risk Alerts:** Warns about high overdue rates
- **WIP Optimization:** Suggests focusing on completing tasks
- **Team Balance:** Recommends workload redistribution

## 🔄 Future Enhancements

- Advanced AI: Machine learning for better predictions
- Real-time collaboration with WebSockets
- Task comments and activity feed
- File attachments
- Advanced filtering and search
- Email notifications
- Drag-and-drop task reordering
- Sprint planning features
- Time tracking
- Mobile app
- Voice-to-task (AI speech recognition)

## 📄 License

This project is created for educational purposes as part of a coding assignment.

## 👨‍💻 Developer Notes

### Testing Accounts
Create at least 2 accounts to test role-based access:
1. Admin account (creates project)
2. Member account (gets added to project)

### Demo Flow
1. Signup as Admin
2. Create a project
3. Create some tasks
4. Signup as Member (different browser/incognito)
5. Login as Admin, add Member to project
6. Login as Member, view assigned tasks
7. Update task status as Member
8. View dashboard analytics

### Debugging
- Check browser console for frontend errors
- Backend logs available in Supabase dashboard
- All API calls include detailed error messages
- Use network tab to inspect API requests/responses

## 🎥 Demo Video

Record a 2-5 minute video showing:
1. Signup and login
2. Creating a project
3. Adding team members
4. Creating and managing tasks
5. Dashboard analytics
6. Role-based access (Admin vs Member views)
7. Deployed application URL

## 📞 Support

For issues or questions, please create an issue in the GitHub repository.

---

**Built with ❤️ using React, TypeScript, Tailwind CSS, and Supabase**
