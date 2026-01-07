# 🚀 Quick Start Guide

## Step-by-Step Setup (5 minutes)

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click **"Add Project"**
3. Name it (e.g., "test-portal")
4. Click **"Create Project"**

### 3️⃣ Enable Firestore

1. In Firebase Console → **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in test mode"**
4. Choose your region
5. Click **"Enable"**

### 4️⃣ Get Firebase Config

1. Firebase Console → ⚙️ **"Project settings"**
2. Scroll to **"Your apps"**
3. Click web icon **`</>`**
4. Register app (name: "test-portal-web")
5. **Copy the config object**

### 5️⃣ Configure App

Open `src/firebase.js` and replace:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",              // ← Paste your values
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 6️⃣ Start App & Upload Questions

```bash
npm start
```

1. Browser opens to http://localhost:3000
2. Click **"🔧 Setup (First Time)"**
3. Click **"📤 Upload Questions to Firebase"**
4. Wait for ✅ success message

### 7️⃣ You're Ready! 🎉

**For Students:**
- Go to http://localhost:3000/test
- Enter name → Wait for admin → Take test

**For Admin:**
- Go to http://localhost:3000/admin
- Click **"▶ Start Test"** to begin
- Monitor results in real-time
- Click **"🔄 New Session"** to reset

---

## 🎯 URLs

- **Home**: http://localhost:3000
- **Student Test**: http://localhost:3000/test
- **Admin Dashboard**: http://localhost:3000/admin
- **Setup**: http://localhost:3000/setup

---

## ⚠️ Troubleshooting

**"Permission denied" error?**
- Check Firebase Console → Firestore → Rules
- Ensure rules allow read/write (test mode)

**Questions not loading?**
- Go to /setup and upload questions again
- Check browser console for errors

**Firebase config error?**
- Double-check `src/firebase.js` has correct values
- Ensure no quotes or spaces in config values

---

## 📱 Share with Students

Once deployed, share the `/test` URL with students:
- Local: `http://localhost:3000/test`
- Deployed: `https://your-app.web.app/test`

Keep `/admin` URL private for administrators only!
