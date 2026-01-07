import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, doc, setDoc, getDocs, onSnapshot, query, orderBy } from 'firebase/firestore';

function AdminDashboard() {
  const [sessionActive, setSessionActive] = useState(false);
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Listen to session status
    const unsubscribe = onSnapshot(doc(db, 'session', 'current'), (doc) => {
      if (doc.exists()) {
        setSessionActive(doc.data().active || false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Listen to users
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersData = [];
      snapshot.forEach((doc) => {
        usersData.push({ id: doc.id, ...doc.data() });
      });
      setUsers(usersData);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const q = query(collection(db, 'questions'), orderBy('order'));
      const querySnapshot = await getDocs(q);
      const questionsData = [];
      querySnapshot.forEach((doc) => {
        questionsData.push({ id: doc.id, ...doc.data() });
      });
      setQuestions(questionsData);
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  };

  const handleStartSession = async () => {
    setLoading(true);
    try {
      await setDoc(doc(db, 'session', 'current'), {
        active: true,
        startTime: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error starting session:', error);
    }
    setLoading(false);
  };

  const handleStopSession = async () => {
    setLoading(true);
    try {
      await setDoc(doc(db, 'session', 'current'), {
        active: false,
        endTime: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error stopping session:', error);
    }
    setLoading(false);
  };

  const handleNewSession = async () => {
    if (!window.confirm('This will clear all user data and start a new session. Continue?')) {
      return;
    }

    setLoading(true);
    try {
      // Delete all users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const deletePromises = [];
      usersSnapshot.forEach((doc) => {
        deletePromises.push(doc.ref.delete());
      });
      await Promise.all(deletePromises);

      // Reset session
      await setDoc(doc(db, 'session', 'current'), {
        active: false,
        createdAt: new Date().toISOString()
      });

      alert('New session created successfully!');
    } catch (error) {
      console.error('Error creating new session:', error);
      alert('Error creating new session');
    }
    setLoading(false);
  };

  const completedUsers = users.filter(u => u.completed);
  const totalUsers = users.length;
  const averageScore = completedUsers.length > 0
    ? (completedUsers.reduce((sum, u) => sum + (u.score || 0), 0) / completedUsers.length).toFixed(1)
    : 0;

  return (
    <div className="app-container">
      <div className="card admin-container">
        <div className="admin-header">
          <div>
            <h1>🎯 Admin Dashboard</h1>
            <span className={`status-badge ${sessionActive ? 'status-active' : 'status-inactive'}`}>
              {sessionActive ? '● Active' : '● Inactive'}
            </span>
          </div>
          <div className="admin-controls">
            {!sessionActive ? (
              <button
                className="btn btn-success"
                onClick={handleStartSession}
                disabled={loading}
              >
                ▶ Start Test
              </button>
            ) : (
              <button
                className="btn btn-danger"
                onClick={handleStopSession}
                disabled={loading}
              >
                ⏸ Stop Test
              </button>
            )}
            <button
              className="btn btn-secondary"
              onClick={handleNewSession}
              disabled={loading}
            >
              🔄 New Session
            </button>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>{totalUsers}</h3>
            <p>Total Participants</p>
          </div>
          <div className="stat-card">
            <h3>{completedUsers.length}</h3>
            <p>Completed</p>
          </div>
          <div className="stat-card">
            <h3>{averageScore}</h3>
            <p>Average Score</p>
          </div>
          <div className="stat-card">
            <h3>{questions.length}</h3>
            <p>Total Questions</p>
          </div>
        </div>

        <div>
          <h2 style={{ marginBottom: '20px', color: '#667eea' }}>📊 Participant Results</h2>
          {users.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
              No participants yet. Share the test link with users.
            </p>
          ) : (
            <div className="results-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Score</th>
                    <th>Correct Answers</th>
                    <th>Status</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td><strong>{user.name}</strong></td>
                      <td>
                        <span style={{ 
                          color: user.completed ? '#10b981' : '#666',
                          fontWeight: 'bold',
                          fontSize: '1.1rem'
                        }}>
                          {user.completed ? `${user.score}/${user.totalQuestions || questions.length}` : '-'}
                        </span>
                      </td>
                      <td>{user.completed ? user.score : '-'}</td>
                      <td>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          background: user.completed ? '#d1fae5' : '#fef3c7',
                          color: user.completed ? '#065f46' : '#92400e'
                        }}>
                          {user.completed ? 'Completed' : 'In Progress'}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.9rem', color: '#666' }}>
                        {user.timestamp ? new Date(user.timestamp).toLocaleTimeString() : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div style={{ marginTop: '40px' }}>
          <h2 style={{ marginBottom: '20px', color: '#667eea' }}>📝 Questions & Answers</h2>
          {questions.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
              No questions loaded. Check Firebase configuration.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {questions.map((q, index) => (
                <div key={q.id} style={{
                  padding: '20px',
                  background: '#f8f9ff',
                  borderRadius: '10px',
                  border: '1px solid #e0e0e0'
                }}>
                  <div style={{ fontWeight: 'bold', color: '#667eea', marginBottom: '10px' }}>
                    Question {index + 1}
                  </div>
                  <div style={{ marginBottom: '15px', fontSize: '1.05rem' }}>
                    {q.question}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ padding: '10px', background: 'white', borderRadius: '5px' }}>
                      <strong>A.</strong> {q.optionA}
                    </div>
                    <div style={{ padding: '10px', background: 'white', borderRadius: '5px' }}>
                      <strong>B.</strong> {q.optionB}
                    </div>
                    <div style={{ padding: '10px', background: 'white', borderRadius: '5px' }}>
                      <strong>C.</strong> {q.optionC}
                    </div>
                    <div style={{ padding: '10px', background: 'white', borderRadius: '5px' }}>
                      <strong>D.</strong> {q.optionD}
                    </div>
                  </div>
                  <div style={{
                    padding: '10px',
                    background: '#d1fae5',
                    color: '#065f46',
                    borderRadius: '5px',
                    fontWeight: 'bold'
                  }}>
                    ✓ Correct Answer: {q.correctAnswer}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
