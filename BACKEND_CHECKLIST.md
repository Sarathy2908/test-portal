# ✅ Firebase Backend Checklist

## What You Need to Do in Firebase Console

### 1. Create Project ✓
- [ ] Go to https://console.firebase.google.com/
- [ ] Click "Add project"
- [ ] Name: `test-portal` (or your choice)
- [ ] Disable Google Analytics (optional)
- [ ] Click "Create project"

### 2. Enable Firestore Database ✓
- [ ] Go to "Firestore Database" in left menu
- [ ] Click "Create database"
- [ ] Choose "Test mode" (for development)
- [ ] Select your region (e.g., asia-south1)
- [ ] Click "Enable"

### 3. Configure Security Rules ✓
- [ ] In Firestore, go to "Rules" tab
- [ ] Copy rules from `firestore.rules` file
- [ ] Click "Publish"

### 4. Get Firebase Config ✓
- [ ] Click gear icon → "Project settings"
- [ ] Scroll to "Your apps"
- [ ] Click web icon `</>`
- [ ] Register app: "test-portal-web"
- [ ] Copy the `firebaseConfig` object
- [ ] Paste into `src/firebase.js`

### 5. Upload Questions ✓
- [ ] Run `npm start`
- [ ] Go to http://localhost:3000/setup
- [ ] Click "Upload Questions to Firebase"
- [ ] Verify in Firestore: 30 questions uploaded

---

## Firebase Collections Structure

### `questions/` Collection
**Purpose**: Store all quiz questions

**Documents**: q1, q2, q3... q30

**Fields per document**:
```javascript
{
  question: string,        // Question text
  optionA: string,         // Option A text
  optionB: string,         // Option B text
  optionC: string,         // Option C text
  optionD: string,         // Option D text
  correctAnswer: string,   // "A", "B", "C", or "D"
  order: number           // 1-30 (randomized)
}
```

**Created by**: Upload script (`/setup` page)

---

### `session/` Collection
**Purpose**: Control test start/stop

**Documents**: current (single document)

**Fields**:
```javascript
{
  active: boolean,         // true = test running, false = waiting
  createdAt: string,       // ISO timestamp
  startTime: string,       // When admin started test
  endTime: string         // When admin stopped test
}
```

**Created by**: Upload script, modified by admin

---

### `users/` Collection
**Purpose**: Store participant data and answers

**Documents**: [userId] (timestamp-based)

**Fields per document**:
```javascript
{
  name: string,            // Participant name
  timestamp: string,       // When they joined
  answers: object,         // {0: "A", 1: "B", 2: "D", ...}
  score: number,           // Number of correct answers
  completed: boolean,      // true when submitted
  totalQuestions: number  // 30
}
```

**Created by**: Students when they enter name

---

## Security Rules Explained

```javascript
// Questions: Everyone reads, no one writes
match /questions/{questionId} {
  allow read: if true;
  allow write: if false;
}

// Users: Anyone creates/updates, everyone reads
match /users/{userId} {
  allow read: if true;
  allow create: if true;
  allow update: if true;
}

// Session: Everyone reads/writes
// TODO: Restrict writes to admin only
match /session/{sessionId} {
  allow read: if true;
  allow write: if true;
}
```

---

## Real-time Listeners

The app uses Firebase real-time listeners for instant updates:

1. **Session Status** (`session/current`)
   - Watched by: All users
   - Updates: When admin starts/stops test
   - Effect: Students see "waiting" or "test active"

2. **User Results** (`users/` collection)
   - Watched by: Admin dashboard
   - Updates: When students submit answers
   - Effect: Admin sees new results instantly

---

## Data Flow Examples

### When Student Takes Test:

1. Student enters name → Creates document in `users/`
2. Student waits → Watches `session/current.active`
3. Admin starts test → Updates `session/current.active = true`
4. Student sees questions → Reads from `questions/`
5. Student submits → Updates their `users/[userId]` document
6. Admin sees result → Real-time listener updates dashboard

### When Admin Manages Session:

1. Admin clicks "Start" → Sets `session/current.active = true`
2. All students see test start → Real-time listener triggers
3. Admin clicks "Stop" → Sets `session/current.active = false`
4. Admin clicks "New Session" → Deletes all `users/` docs

---

## Firebase Pricing (Free Tier)

**Spark Plan (Free)**:
- 50,000 document reads/day
- 20,000 document writes/day
- 1 GB storage

**Estimated Usage for 30 Students**:
- Reads: ~900 (questions) + ~100 (admin) = 1,000
- Writes: ~30 (user submissions) + ~5 (session) = 35
- Storage: < 1 MB

**Conclusion**: Free tier is more than enough!

---

## Optional: Firebase Hosting

To deploy your app to a public URL:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Build React app
npm run build

# Deploy
firebase deploy
```

Your app will be live at: `https://your-project-id.web.app`

---

## Troubleshooting

**Questions not loading?**
- Check Firestore → questions collection exists
- Check browser console for errors
- Re-upload from `/setup`

**"Permission denied" error?**
- Check Firestore Rules are published
- Ensure "Test mode" is enabled OR rules allow access

**Real-time updates not working?**
- Check internet connection
- Verify Firebase config in `src/firebase.js`
- Check browser console for WebSocket errors

---

## Production Recommendations

Before going live with real students:

1. **Add Authentication**
   - Enable Firebase Auth
   - Protect `/admin` route
   - Update security rules

2. **Restrict Session Writes**
   - Only authenticated admins can start/stop tests

3. **Add Monitoring**
   - Enable Firebase Analytics
   - Set up error tracking

4. **Backup Data**
   - Export Firestore data regularly
   - Keep backup of questions

5. **Set Budget Alerts**
   - In Firebase Console → Usage and billing
   - Set alert at $5 or $10

---

## ✅ Final Verification

Before sharing with students:

- [ ] Firebase project created
- [ ] Firestore enabled with rules
- [ ] Config added to `src/firebase.js`
- [ ] 30 questions uploaded
- [ ] Test student flow: name → wait → test → submit
- [ ] Test admin flow: start → monitor → stop → new session
- [ ] Mobile responsive (test on phone)
- [ ] Admin can see results in real-time
- [ ] Questions display correctly
- [ ] Scores calculate correctly

---

**All set! 🎉 Your test portal is ready to use!**
