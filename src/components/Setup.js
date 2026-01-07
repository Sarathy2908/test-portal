import React, { useState } from 'react';
import { uploadQuestions } from '../uploadQuestions';

function Setup() {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async () => {
    setUploading(true);
    setMessage('Uploading questions to Firebase...');
    
    const success = await uploadQuestions();
    
    if (success) {
      setMessage('✅ Questions uploaded successfully! You can now use the app.');
    } else {
      setMessage('❌ Error uploading questions. Check console for details.');
    }
    setUploading(false);
  };

  return (
    <div className="app-container">
      <div className="card">
        <div className="header">
          <h1>🔧 Setup</h1>
          <p>Upload questions to Firebase</p>
        </div>
        
        <div style={{ marginBottom: '20px', padding: '15px', background: '#fef3c7', borderRadius: '10px' }}>
          <strong>⚠️ Before uploading:</strong>
          <ol style={{ marginTop: '10px', marginLeft: '20px' }}>
            <li>Make sure you've configured Firebase in <code>src/firebase.js</code></li>
            <li>Ensure Firestore is enabled in your Firebase project</li>
            <li>This will upload 30 questions in randomized order</li>
          </ol>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : '📤 Upload Questions to Firebase'}
        </button>

        {message && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            background: message.includes('✅') ? '#d1fae5' : '#fee2e2',
            color: message.includes('✅') ? '#065f46' : '#991b1b',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}

        <div style={{ marginTop: '30px', padding: '15px', background: '#f8f9ff', borderRadius: '10px' }}>
          <h3 style={{ marginBottom: '10px', color: '#667eea' }}>📚 Firestore Structure</h3>
          <pre style={{ fontSize: '0.9rem', overflow: 'auto' }}>
{`Collections:
├── questions/
│   ├── q1, q2, q3... (30 questions)
│   └── Fields: question, optionA-D, correctAnswer, order
├── session/
│   └── current (active status)
└── users/
    └── [userId] (participant data)`}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default Setup;
