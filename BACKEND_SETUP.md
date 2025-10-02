# Backend Connection Setup Guide

## 🚀 Quick Start

### 1. Start the Backend Server

Open a terminal and navigate to the backend folder:

```bash
cd my-backend
npm start
```

The backend will run on **http://localhost:5000**

### 2. Start the Frontend (Vite)

Open another terminal in the project root:

```bash
npm run dev
```

The frontend will run on **http://localhost:5173**

---

## ✅ Testing the Connection

1. Sign in to your app using Google authentication
2. Navigate to **🔌 Test API** in the navbar
3. Click the test buttons to verify backend connectivity

---

## 📁 Project Structure

```
my-app/
├── src/
│   ├── api.js              ← API service for backend calls
│   ├── TestBackend.jsx     ← Test component for API
│   └── ...
├── my-backend/
│   ├── server.js           ← Express backend server
│   └── package.json
└── package.json
```

---

## 🔧 API Configuration

### Backend (`my-backend/server.js`)
- **Port:** 5000
- **CORS:** Configured for `http://localhost:5173`
- **Endpoints:**
  - `GET /` - Health check
  - `POST /user` - Create user

### Frontend (`src/api.js`)
- **Base URL:** `http://localhost:5000`
- Uses Axios for HTTP requests

---

## 🛠️ Adding New API Endpoints

### 1. Add route in backend (`my-backend/server.js`):

```javascript
app.get("/api/tasks", (req, res) => {
  res.json({ tasks: [] });
});
```

### 2. Add function in frontend (`src/api.js`):

```javascript
export const getTasks = () => API.get("/api/tasks");
```

### 3. Use in your components:

```javascript
import { getTasks } from './api';

const fetchTasks = async () => {
  const response = await getTasks();
  console.log(response.data);
};
```

---

## 🐛 Troubleshooting

### Backend not connecting?
- Make sure backend is running on port 5000
- Check CORS settings in `server.js`
- Verify `baseURL` in `src/api.js`

### Port already in use?
- Change port in `my-backend/server.js`
- Update `baseURL` in `src/api.js` to match

---

## 📦 Dependencies

### Backend
- express
- cors
- mongoose (for MongoDB)
- axios

### Frontend
- axios (already installed)
- react-router-dom
- firebase

---

Happy coding! 🎉
