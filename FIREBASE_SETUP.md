# 🔥 Firebase Backend Setup Guide

## What You Need to Do in Firebase

This guide explains everything you need to set up in Firebase Console for the test portal to work.

---

## 1. Create Firebase Project

### Steps:
1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `test-portal` (or your preferred name)
4. **Google Analytics**: You can disable it for this project (optional)
5. Click **"Create project"**
6. Wait for project creation (takes ~30 seconds)
7. Click **"Continue"** when ready

---

## 2. Enable Firestore Database

### Why?
Firestore is the real-time database that stores questions, user answers, and session data.

### Steps:
1. In Firebase Console, click **"Build"** in left sidebar
2. Click **"Firestore Database"**
3. Click **"Create database"** button
4. **Choose mode**:
   - For **development/testing**: Select **"Start in test mode"**
   - For **production**: Select **"Start in production mode"** (you'll add rules later)
5. **Select location**: Choose the region closest to your users
   - Example: `asia-south1` (Mumbai) for India
   - Example: `us-central1` for USA
6. Click **"Enable"**
7. Wait for database creation (~1 minute)

### What This Creates:
- A Firestore database with collections for:
  - `questions` - Stores all quiz questions
  - `users` - Stores participant data and answers
  - `session` - Controls when test is active/inactive

---

## 3. Set Up Firestore Security Rules

### Why?
Security rules control who can read/write data in your database.

### Steps:
1. In Firestore Database page, click **"Rules"** tab
2. Replace the existing rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Questions - everyone can read, no one can write (except via script)
    match /questions/{questionId} {
      allow read: if true;
      allow write: if false;
    }
    
    // Users - anyone can create/update, everyone can read
    match /users/{userId} {
      allow read: if true;
      allow create: if true;
      allow update: if true;
      allow delete: if false;
    }
    
    // Session - everyone can read, anyone can write (TODO: restrict to admin)
    match /session/{sessionId} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

3. Click **"Publish"**

### ⚠️ Important Notes:
- **Test mode** allows all reads/writes for 30 days - good for development
- **Production mode** requires proper rules - use the rules above
- For production, you should add authentication and restrict `/session` writes to admin only

---

## 4. Get Firebase Configuration

### Why?
Your React app needs these credentials to connect to Firebase.

### Steps:
1. Click the **gear icon** ⚙️ next to "Project Overview"
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **web icon** `</>` (looks like `</>`)
5. **Register app**:
   - App nickname: `test-portal-web`
   - Don't check "Firebase Hosting" (unless you plan to use it)
   - Click **"Register app"**
6. **Copy the config object** - it looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "test-portal-xxxxx.firebaseapp.com",
  projectId: "test-portal-xxxxx",
  storageBucket: "test-portal-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxx"
};
```

7. Click **"Continue to console"**

### Where to Use This:
Open `src/firebase.js` in your project and replace the placeholder config with your actual config.

---

## 5. Upload Questions to Firestore

### Why?
The app needs questions in the database before users can take the test.

### Steps:
1. Make sure you've configured `src/firebase.js` with your Firebase config
2. Start your React app:
   ```bash
   npm start
   ```
3. Navigate to: `http://localhost:3000/setup`
4. Click **"📤 Upload Questions to Firebase"**
5. Wait for success message: ✅ "Questions uploaded successfully!"

### What This Does:
- Uploads all 30 questions in **randomized order**
- Creates the `session/current` document
- Sets up the initial database structure

### Verify Upload:
1. Go to Firebase Console → Firestore Database
2. You should see:
   - `questions` collection with 30 documents (q1, q2, q3... q30)
   - `session` collection with 1 document (current)

---

## 6. Test the Setup

### Test Student Flow:
1. Go to `http://localhost:3000/test`
2. Enter a name
3. You should see "Waiting for test to start"

### Test Admin Flow:
1. Go to `http://localhost:3000/admin`
2. Click **"▶ Start Test"**
3. Go back to student view - test should now be active
4. Answer questions and submit
5. Check admin dashboard - you should see the result

---

## 7. Optional: Enable Firebase Hosting (for Deployment)

### Why?
To deploy your app to a public URL instead of localhost.

### Steps:
1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init
   ```
   - Select: **Hosting**
   - Choose your project
   - Public directory: `build`
   - Single-page app: **Yes**
   - Overwrite index.html: **No**

4. Build your React app:
   ```bash
   npm run build
   ```

5. Deploy:
   ```bash
   firebase deploy
   ```

6. Your app will be live at: `https://your-project-id.web.app`

---

## 📊 Firestore Data Structure

After setup, your Firestore will have this structure:

```
📁 questions/
  📄 q1
    - question: "An AI system that consistently..."
    - optionA: "Intelligent action"
    - optionB: "Perception"
    - optionC: "Reasoning"
    - optionD: "Data-driven decision making"
    - correctAnswer: "D"
    - order: 1
  📄 q2
    - question: "Why are AI decisions..."
    - ...
  ... (30 questions total)

📁 session/
  📄 current
    - active: false
    - createdAt: "2024-01-07T..."
    - startTime: "2024-01-07T..." (when started)
    - endTime: "2024-01-07T..." (when stopped)

📁 users/
  📄 [userId-timestamp]
    - name: "John Doe"
    - timestamp: "2024-01-07T..."
    - answers: {0: "A", 1: "B", 2: "D", ...}
    - score: 25
    - completed: true
    - totalQuestions: 30
```

---

## 🔒 Security Best Practices

### For Production:

1. **Add Authentication**:
   - Enable Firebase Authentication
   - Require admin login for `/admin` route
   - Update security rules to check `request.auth`

2. **Restrict Session Writes**:
   ```javascript
   match /session/{sessionId} {
     allow read: if true;
     allow write: if request.auth != null && request.auth.token.admin == true;
   }
   ```

3. **Environment Variables**:
   - Move Firebase config to `.env` file
   - Don't commit `.env` to git
   - Use environment variables in production

4. **Rate Limiting**:
   - Enable Firebase App Check
   - Prevents abuse and spam

---

## 💰 Firebase Pricing

### Free Tier (Spark Plan):
- **Firestore**: 50,000 reads/day, 20,000 writes/day
- **Hosting**: 10 GB storage, 360 MB/day transfer
- **Perfect for**: Small classes, testing, development

### Estimated Usage:
- **30 students taking test**: ~900 reads, ~30 writes
- **Admin viewing results**: ~100 reads
- **Well within free tier!**

### If You Exceed Free Tier:
- Upgrade to Blaze (Pay-as-you-go)
- Set budget alerts in Firebase Console
- Very cheap for small-medium usage

---

## 🆘 Troubleshooting

### Error: "Missing or insufficient permissions"
**Solution**: Check Firestore Rules, ensure test mode or proper rules are set

### Error: "Firebase: No Firebase App '[DEFAULT]' has been created"
**Solution**: Check `src/firebase.js` has correct config and is imported

### Questions not showing up
**Solution**: 
1. Go to `/setup` and upload again
2. Check Firebase Console → Firestore → questions collection
3. Check browser console for errors

### "Waiting for test to start" not updating
**Solution**:
1. Check admin dashboard - is session active?
2. Check Firebase Console → session/current document
3. Refresh the page

---

## ✅ Checklist

Before going live, ensure:

- [ ] Firebase project created
- [ ] Firestore database enabled
- [ ] Security rules published
- [ ] Firebase config added to `src/firebase.js`
- [ ] Questions uploaded via `/setup`
- [ ] Test student flow works
- [ ] Admin dashboard works
- [ ] Session start/stop works
- [ ] Results display correctly
- [ ] Mobile responsive (test on phone)

---

## 📞 Need Help?

1. Check Firebase Console for errors
2. Check browser console (F12) for JavaScript errors
3. Verify Firestore rules allow your operations
4. Ensure Firebase config is correct
5. Try uploading questions again from `/setup`

---

**You're all set! 🎉 Start conducting tests!**
