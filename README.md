# 📝 Test Portal - Kahoot-like Quiz Application

A mobile-responsive React application for conducting online tests with real-time admin dashboard and Firebase backend.

## ✨ Features

- **User Interface**
  - Name collection before test
  - Waiting screen until admin starts the test
  - Clean, mobile-responsive quiz interface
  - Progress tracking
  - Instant score display after submission

- **Admin Dashboard**
  - Start/Stop test sessions
  - Create new sessions (clears all data)
  - Real-time participant tracking
  - View all answers and scores
  - See correct answers for all questions
  - Statistics: total participants, completed tests, average score

- **Backend (Firebase)**
  - Real-time synchronization
  - Secure data storage
  - Session management
  - 30 questions in randomized order

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Setup

#### Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name (e.g., "test-portal")
4. Disable Google Analytics (optional)
5. Click "Create Project"

#### Enable Firestore Database

1. In Firebase Console, go to "Build" → "Firestore Database"
2. Click "Create database"
3. Choose "Start in **test mode**" (for development)
4. Select a location closest to you
5. Click "Enable"

#### Get Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ → "Project settings"
2. Scroll down to "Your apps" section
3. Click the web icon `</>`
4. Register your app with a nickname (e.g., "test-portal-web")
5. Copy the `firebaseConfig` object

#### Configure the App

1. Open `src/firebase.js`
2. Replace the placeholder config with your Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Upload Questions to Firebase

1. Start the development server:
```bash
npm start
```

2. Navigate to `http://localhost:3000/setup`
3. Click "Upload Questions to Firebase"
4. Wait for confirmation message

**This will:**
- Upload all 30 questions in randomized order
- Create the initial session document
- Set up the Firestore structure

### 4. Firestore Security Rules (Production)

For production, update your Firestore rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to questions for all users
    match /questions/{questionId} {
      allow read: if true;
      allow write: if false;
    }
    
    // Allow users to create and update their own data
    match /users/{userId} {
      allow read: if true;
      allow create: if true;
      allow update: if request.auth != null || true;
    }
    
    // Allow read access to session for all users
    // Only admins should write (implement admin auth)
    match /session/{sessionId} {
      allow read: if true;
      allow write: if true; // TODO: Add admin authentication
    }
  }
}
```

## 📱 Usage

### For Students

1. Visit `http://localhost:3000/test` (or your deployed URL)
2. Enter your name
3. Wait for admin to start the test
4. Answer all questions
5. Submit and view your score

### For Admin

1. Visit `http://localhost:3000/admin`
2. Click "Start Test" to enable the test for all users
3. Monitor participants in real-time
4. View scores and correct answers
5. Click "Stop Test" to prevent new submissions
6. Click "New Session" to clear all data and start fresh

## 🗂️ Firestore Structure

```
test-portal/
├── questions/
│   ├── q1
│   │   ├── question: string
│   │   ├── optionA: string
│   │   ├── optionB: string
│   │   ├── optionC: string
│   │   ├── optionD: string
│   │   ├── correctAnswer: string ("A", "B", "C", or "D")
│   │   └── order: number
│   ├── q2
│   └── ... (30 questions total)
│
├── session/
│   └── current
│       ├── active: boolean
│       ├── startTime: string (ISO)
│       └── endTime: string (ISO)
│
└── users/
    └── [userId]
        ├── name: string
        ├── timestamp: string (ISO)
        ├── answers: object {questionIndex: selectedOption}
        ├── score: number
        ├── completed: boolean
        └── totalQuestions: number
```

## 🎨 Customization

### Adding More Questions

Edit `src/uploadQuestions.js` and add questions in this format:

```javascript
{
  question: "Your question text?",
  optionA: "Option A text",
  optionB: "Option B text",
  optionC: "Option C text",
  optionD: "Option D text",
  correctAnswer: "A" // or "B", "C", "D"
}
```

Then re-run the upload from `/setup` page.

### Styling

- Main styles: `src/App.css`
- Global styles: `src/index.css`
- Colors: Modify gradient colors in CSS files

## 🔒 Security Considerations

1. **Admin Authentication**: Currently, anyone can access `/admin`. Implement Firebase Authentication for production.
2. **Firestore Rules**: Update security rules before deploying to production.
3. **Environment Variables**: Store Firebase config in `.env` file for production.

## 🚀 Deployment

### Deploy to Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase:
```bash
firebase init
```
- Select "Hosting"
- Choose your project
- Set public directory to `build`
- Configure as single-page app: Yes
- Don't overwrite index.html

4. Build and deploy:
```bash
npm run build
firebase deploy
```

### Deploy to Netlify/Vercel

1. Build the app:
```bash
npm run build
```

2. Deploy the `build` folder to your preferred hosting service.

## 📋 Question Topics

The app includes 30 questions covering:
- **AI Fundamentals** (20 questions)
  - AI characteristics and limitations
  - Machine Learning vs Deep Learning
  - Supervised, Unsupervised, and Reinforcement Learning
  - NLP and Computer Vision
  - Predictive Analytics
  - AI Ethics and Bias

- **IT Companies** (10 questions)
  - Zoho Corporation
  - Infosys
  - TCS (Tata Consultancy Services)
  - Cognizant
  - Accenture

## 🛠️ Tech Stack

- **Frontend**: React 18
- **Routing**: React Router v6
- **Backend**: Firebase Firestore
- **Styling**: Custom CSS with responsive design
- **Real-time**: Firebase real-time listeners

## 📞 Support

For issues or questions:
1. Check Firebase Console for errors
2. Check browser console for error messages
3. Ensure Firestore is properly configured
4. Verify Firebase config in `src/firebase.js`

## 📄 License

MIT License - Feel free to use and modify for your needs.
