import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, doc, getDocs, setDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

function UserTest() {
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [testCompleted, setTestCompleted] = useState(false);
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
    if (sessionActive && userId) {
      loadQuestions();
    }
  }, [sessionActive, userId]);

  const loadQuestions = async () => {
    setLoading(true);
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
    setLoading(false);
  };

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    if (!userName.trim()) return;

    const newUserId = Date.now().toString();
    setUserId(newUserId);

    try {
      await setDoc(doc(db, 'users', newUserId), {
        name: userName,
        timestamp: new Date().toISOString(),
        answers: {},
        score: 0,
        completed: false
      });
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleAnswerSelect = (option) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: option
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      if (!window.confirm('You have not answered all questions. Submit anyway?')) {
        return;
      }
    }

    let score = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        score++;
      }
    });

    try {
      await setDoc(doc(db, 'users', userId), {
        name: userName,
        timestamp: new Date().toISOString(),
        answers: answers,
        score: score,
        completed: true,
        totalQuestions: questions.length
      });
      setTestCompleted(true);
    } catch (error) {
      console.error('Error submitting test:', error);
    }
  };

  if (!userId) {
    return (
      <div className="app-container">
        <div className="card">
          <div className="header">
            <h1>📝 Test Portal</h1>
            <p>Enter your name to begin</p>
          </div>
          <form onSubmit={handleNameSubmit}>
            <div className="input-group">
              <label>Your Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Continue
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!sessionActive) {
    return (
      <div className="app-container">
        <div className="card">
          <div className="waiting-screen">
            <h2>⏳ Waiting for Test to Start</h2>
            <p>Hello, <strong>{userName}</strong>!</p>
            <p>The administrator will start the test shortly.</p>
            <div className="spinner"></div>
            <p style={{ color: '#666', marginTop: '20px' }}>
              Please wait... The test will begin automatically.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (testCompleted) {
    return (
      <div className="app-container">
        <div className="card">
          <div className="completion-screen">
            <h2>✅ Test Completed!</h2>
            <p>Thank you, <strong>{userName}</strong></p>
            <div className="score-display">
              {answers && questions.length > 0 
                ? `${Object.values(answers).filter((ans, idx) => ans === questions[idx]?.correctAnswer).length} / ${questions.length}`
                : '0 / 0'}
            </div>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>
              Your responses have been submitted successfully.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading || questions.length === 0) {
    return (
      <div className="app-container">
        <div className="card">
          <div className="waiting-screen">
            <h2>Loading Questions...</h2>
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="app-container">
      <div className="card">
        <div className="question-header">
          <div className="question-number">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <div style={{ color: '#666' }}>
            {userName}
          </div>
        </div>

        <div className="question-container">
          <div className="question-text">
            {currentQuestion.question}
          </div>

          <div className="options">
            {['A', 'B', 'C', 'D'].map((option) => (
              <div
                key={option}
                className={`option ${answers[currentQuestionIndex] === option ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(option)}
              >
                <strong>{option}.</strong> {currentQuestion[`option${option}`]}
              </div>
            ))}
          </div>
        </div>

        <div className="navigation">
          <button
            className="btn btn-secondary"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            ← Previous
          </button>
          
          {currentQuestionIndex === questions.length - 1 ? (
            <button
              className="btn btn-success"
              onClick={handleSubmit}
            >
              Submit Test
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleNext}
            >
              Next →
            </button>
          )}
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center', color: '#666' }}>
          Answered: {Object.keys(answers).length} / {questions.length}
        </div>
      </div>
    </div>
  );
}

export default UserTest;
