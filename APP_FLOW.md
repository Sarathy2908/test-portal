# 📊 Application Flow

## Student Journey

```
1. User visits /test
   ↓
2. Enter Name
   ↓
3. Wait for Admin to Start Test
   ↓ (Admin clicks "Start Test")
4. Questions Load (30 questions)
   ↓
5. Answer Questions (one at a time)
   ↓
6. Submit Test
   ↓
7. View Score
```

## Admin Journey

```
1. Admin visits /admin
   ↓
2. View Dashboard (empty initially)
   ↓
3. Click "Start Test"
   ↓
4. Students can now take test
   ↓
5. Monitor results in real-time
   ↓
6. Click "Stop Test" (optional)
   ↓
7. Click "New Session" to reset
```

## Data Flow

```
Firebase Firestore
├── questions/ (30 docs)
│   └── Read by: Students, Admin
│
├── session/current
│   ├── active: true/false
│   └── Watched by: Everyone
│
└── users/
    ├── Created by: Students
    └── Read by: Admin
```

## Real-time Updates

- **Session Status**: All users watch `session/current`
- **User Results**: Admin watches `users/` collection
- **Questions**: Loaded once, cached in state

## Security

- Questions: Read-only
- Users: Anyone can create/update
- Session: Anyone can read/write (TODO: restrict to admin)
