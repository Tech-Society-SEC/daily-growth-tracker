# 🚀 Daily Growth Tracker - Complete Setup Guide

## 📋 Prerequisites

Before starting, make sure you have:
- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git** (optional)

---

## 🛠️ Installation Steps

### Step 1: Install Frontend Dependencies

```bash
# In the project root
npm install
```

### Step 2: Install Backend Dependencies

```bash
cd my-backend
npm install dotenv
cd ..
```

---

## 🗄️ Database Setup

### Option A: Local MongoDB

1. **Install MongoDB** from [mongodb.com](https://www.mongodb.com/try/download/community)

2. **Start MongoDB:**
   ```bash
   # Windows
   mongod
   
   # Mac/Linux
   sudo systemctl start mongod
   ```

3. **Create `.env` file** in `my-backend/`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/daily-growth-tracker
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   ```

### Option B: MongoDB Atlas (Cloud)

1. **Create account** at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

2. **Create a cluster** (free tier available)

3. **Get connection string** and create `.env` file in `my-backend/`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/daily-growth-tracker
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   ```

---

## 🔥 Firebase Setup

Your app already uses Firebase for authentication. Make sure `src/firebase.js` is configured with your Firebase credentials.

If not set up yet:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a project
3. Enable Google Authentication
4. Get your config and update `src/firebase.js`

---

## ▶️ Running the Application

### Terminal 1: Start Backend

```bash
cd my-backend
npm start
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on http://localhost:5000
```

### Terminal 2: Start Frontend

```bash
# In project root
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

---

## 🧪 Testing the Connection

1. **Open browser** → `http://localhost:5173`
2. **Sign in** with Google
3. **Click "🔌 Test API"** in navbar
4. **Click test buttons** to verify backend connection

---

## 📁 Project Structure

```
my-app/
├── src/                          # Frontend React app
│   ├── api.js                    # API service (all backend calls)
│   ├── Auth.jsx                  # Authentication page
│   ├── Dashboard.jsx             # Main dashboard
│   ├── Profile.jsx               # User profile
│   ├── Leaderboard.jsx           # Leaderboard
│   ├── TestBackend.jsx           # API test page
│   └── firebase.js               # Firebase config
│
├── my-backend/                   # Backend Express server
│   ├── models/                   # MongoDB schemas
│   │   ├── User.js
│   │   ├── Task.js
│   │   ├── Progress.js
│   │   └── Achievement.js
│   ├── routes/                   # API routes
│   │   ├── userRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── progressRoutes.js
│   │   └── leaderboardRoutes.js
│   ├── server.js                 # Main server file
│   ├── .env                      # Environment variables (create this)
│   └── package.json
│
├── BACKEND_SETUP.md              # Backend setup guide
├── FULL_SETUP_GUIDE.md           # This file
└── package.json                  # Frontend dependencies
```

---

## 🎯 Available Features

### Frontend Routes
- `/` - Dashboard (requires login)
- `/auth` - Google sign-in page
- `/profile` - User profile editor
- `/leaderboard` - Global rankings
- `/adventure` - Adventure map
- `/game` - Game page
- `/ai-assistant` - AI assistant
- `/test-backend` - API testing page

### Backend API Endpoints

**Users:**
- `POST /api/users/profile` - Create/get user
- `GET /api/users/profile/:uid` - Get user profile
- `PUT /api/users/profile/:uid` - Update profile
- `PATCH /api/users/profile/:uid/stats` - Update XP/level

**Tasks:**
- `GET /api/tasks/:userId` - Get all tasks
- `POST /api/tasks` - Create task
- `PATCH /api/tasks/:taskId/complete` - Complete task
- `DELETE /api/tasks/:taskId` - Delete task

**Progress:**
- `POST /api/progress` - Save daily progress
- `GET /api/progress/:userId/summary/week` - Weekly stats
- `GET /api/progress/:userId/summary/month` - Monthly stats

**Leaderboard:**
- `GET /api/leaderboard/global` - Top users by points
- `GET /api/leaderboard/rank/:uid` - User's rank

See `my-backend/API_DOCUMENTATION.md` for full API docs.

---

## 🔧 Common Issues & Solutions

### Backend won't start
- **Check MongoDB is running:** `mongod` or check Atlas connection
- **Check .env file exists** in `my-backend/`
- **Install dotenv:** `npm install dotenv`

### Frontend can't connect to backend
- **Check backend is running** on port 5000
- **Check CORS settings** in `server.js`
- **Check API baseURL** in `src/api.js`

### MongoDB connection error
- **Local:** Make sure MongoDB service is running
- **Atlas:** Check connection string and whitelist your IP

### Port already in use
- **Change backend port** in `.env`: `PORT=5001`
- **Update frontend API** in `src/api.js` to match

---

## 📊 Using the API in Your Components

```javascript
import { 
  createTask, 
  completeTask, 
  getGlobalLeaderboard,
  getUserProfile 
} from './api';

// In your component
const handleCreateTask = async () => {
  try {
    const task = await createTask({
      userId: user.uid,
      title: "Morning workout",
      category: "fitness",
      priority: "high",
      points: 20
    });
    console.log("Task created:", task.data);
  } catch (error) {
    console.error("Error:", error);
  }
};
```

---

## 🎨 Next Steps

1. **Remove test page** when done testing (optional)
2. **Integrate API calls** into Dashboard, Profile, Leaderboard
3. **Add task management UI** to create/complete tasks
4. **Build progress tracking** visualizations
5. **Customize achievements** and rewards

---

## 📚 Resources

- **Backend API Docs:** `my-backend/API_DOCUMENTATION.md`
- **MongoDB Docs:** https://docs.mongodb.com/
- **Express Docs:** https://expressjs.com/
- **React Docs:** https://react.dev/

---

## 🆘 Need Help?

Check the console logs:
- **Frontend:** Browser DevTools Console (F12)
- **Backend:** Terminal where `npm start` is running

Both will show detailed error messages.

---

**Happy Coding! 🚀**
