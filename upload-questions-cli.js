// Node.js script to upload questions to Firebase
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBNCZTvyB7zOjgLfgSdakYRWg4SC2YY0Z4",
  authDomain: "test-30587.firebaseapp.com",
  projectId: "test-30587",
  storageBucket: "test-30587.firebasestorage.app",
  messagingSenderId: "485158061750",
  appId: "1:485158061750:web:a859abe3c3e638e29e4817",
  measurementId: "G-MQ9XJ1GSBR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// All 30 questions
const questions = [
  {
    question: "An AI system that consistently gives incorrect predictions due to biased training data is primarily failing in which AI characteristic?",
    optionA: "Intelligent action",
    optionB: "Perception",
    optionC: "Reasoning",
    optionD: "Data-driven decision making",
    correctAnswer: "D"
  },
  {
    question: "Why are AI decisions often considered more objective than human decisions?",
    optionA: "AI eliminates uncertainty entirely",
    optionB: "AI is unaffected by fatigue and emotional bias",
    optionC: "AI always predicts correctly",
    optionD: "AI mimics human emotions",
    correctAnswer: "B"
  },
  {
    question: "Which scenario BEST demonstrates the limitation known as \"lack of independent reasoning\" in AI systems?",
    optionA: "AI takes longer to compute large datasets",
    optionB: "AI misclassifies spam emails",
    optionC: "AI cannot explain why it made a decision beyond learned patterns",
    optionD: "AI fails due to hardware limitations",
    correctAnswer: "C"
  },
  {
    question: "If a chatbot gives fluent but factually incorrect answers, which concept best explains this behavior?",
    optionA: "Absence of moral reasoning",
    optionB: "Poor speech processing",
    optionC: "Algorithmic bias",
    optionD: "Pattern-based learning without true understanding",
    correctAnswer: "D"
  },
  {
    question: "Why is reinforcement learning particularly suitable for autonomous vehicles compared to supervised learning?",
    optionA: "It avoids neural networks",
    optionB: "It uses labeled road images",
    optionC: "It learns through continuous interaction and feedback",
    optionD: "It groups driving patterns",
    correctAnswer: "C"
  },
  {
    question: "In reinforcement learning, removing the reward signal would most likely result in:",
    optionA: "Improved exploration",
    optionB: "Faster convergence",
    optionC: "Supervised learning behavior",
    optionD: "Random behavior without optimization",
    correctAnswer: "D"
  },
  {
    question: "Customer segmentation is categorized as unsupervised learning because:",
    optionA: "Data has predefined labels",
    optionB: "Patterns are discovered without known target outputs",
    optionC: "Outputs are incorrect",
    optionD: "It avoids data preprocessing",
    correctAnswer: "B"
  },
  {
    question: "Which situation would MOST LIKELY degrade an AI system's performance?",
    optionA: "High computational power",
    optionB: "Deep neural networks",
    optionC: "Larger datasets",
    optionD: "Poor-quality or biased data",
    correctAnswer: "D"
  },
  {
    question: "Why does deep learning outperform traditional machine learning in image recognition tasks?",
    optionA: "It learns hierarchical representations automatically",
    optionB: "It requires fewer data",
    optionC: "It eliminates overfitting",
    optionD: "It avoids feature extraction entirely",
    correctAnswer: "A"
  },
  {
    question: "A deep learning system analyzing MRI scans is mainly leveraging which capability?",
    optionA: "Logical reasoning",
    optionB: "Language understanding",
    optionC: "Predictive analytics only",
    optionD: "Visual perception beyond human limits",
    correctAnswer: "D"
  },
  {
    question: "Which statement best differentiates Machine Learning (ML) from Deep Learning (DL)?",
    optionA: "ML ignores data relationships",
    optionB: "DL relies on multi-layer neural networks for complex patterns",
    optionC: "ML cannot improve over time",
    optionD: "DL uses shallow models",
    correctAnswer: "B"
  },
  {
    question: "Why is spam filtering an ideal supervised learning problem?",
    optionA: "It requires trial-and-error learning",
    optionB: "Spam emails evolve randomly",
    optionC: "Labels (spam/non-spam) are clearly defined",
    optionD: "No historical data exists",
    correctAnswer: "C"
  },
  {
    question: "An NLP system translating text while preserving context and intent demonstrates which advanced capability?",
    optionA: "Semantic understanding",
    optionB: "Syntax parsing only",
    optionC: "Image perception",
    optionD: "Clustering",
    correctAnswer: "A"
  },
  {
    question: "If an NLP model translates words correctly but fails to preserve meaning, which limitation is exposed?",
    optionA: "Lack of training data only",
    optionB: "Poor grammar rules",
    optionC: "Speech recognition failure",
    optionD: "Weak semantic modeling",
    correctAnswer: "D"
  },
  {
    question: "Which AI capability enables navigation systems to suggest alternative routes dynamically?",
    optionA: "Speech processing",
    optionB: "Natural language processing",
    optionC: "Predictive analytics",
    optionD: "Computer vision",
    correctAnswer: "C"
  },
  {
    question: "Why does predictive analytics deal with probabilities rather than certainties?",
    optionA: "AI avoids optimization",
    optionB: "Future outcomes depend on uncertain variables",
    optionC: "AI lacks speed",
    optionD: "Real-world data is deterministic",
    correctAnswer: "B"
  },
  {
    question: "Which ethical risk arises when AI systems learn historical discrimination patterns?",
    optionA: "Job displacement",
    optionB: "Algorithmic bias",
    optionC: "Data leakage",
    optionD: "Model overfitting",
    correctAnswer: "B"
  },
  {
    question: "Why is fairness difficult to guarantee in AI systems?",
    optionA: "AI systems lack accuracy",
    optionB: "AI models cannot be evaluated",
    optionC: "Bias can be embedded in data and algorithms",
    optionD: "Human judgment is absent",
    correctAnswer: "C"
  },
  {
    question: "An AI system that replaces clerical workers but creates demand for AI engineers illustrates which ethical concern?",
    optionA: "Surveillance misuse",
    optionB: "Data privacy",
    optionC: "Algorithmic transparency",
    optionD: "Job displacement and reskilling",
    correctAnswer: "D"
  },
  {
    question: "Why cannot AI systems perform value-based decision-making?",
    optionA: "It lacks emotions and moral intuition",
    optionB: "It lacks algorithms",
    optionC: "It lacks speed",
    optionD: "It lacks data",
    correctAnswer: "A"
  },
  {
    question: "Which company is known for its strong focus on bootstrapped growth without relying on external funding?",
    optionA: "Zoho Corporation",
    optionB: "Infosys",
    optionC: "Cognizant",
    optionD: "Wipro",
    correctAnswer: "A"
  },
  {
    question: "Which company was founded by N. R. Narayana Murthy and is globally recognized for corporate ethics and transparency?",
    optionA: "Tata Consultancy Services",
    optionB: "Infosys",
    optionC: "Capgemini",
    optionD: "Cognizant",
    correctAnswer: "B"
  },
  {
    question: "Which company is part of the Tata Group and is one of the largest IT service providers in the world?",
    optionA: "Infosys",
    optionB: "Zoho Corporation",
    optionC: "Tata Consultancy Services",
    optionD: "Accenture",
    correctAnswer: "C"
  },
  {
    question: "Which IT company is best known for offering an integrated suite of business software, including CRM, finance, HR, and email services under one ecosystem?",
    optionA: "Zoho Corporation",
    optionB: "Cognizant",
    optionC: "Infosys",
    optionD: "Wipro",
    correctAnswer: "A"
  },
  {
    question: "Which company originally began as the IT services arm of an Indian industrial conglomerate?",
    optionA: "Cognizant",
    optionB: "Tata Consultancy Services",
    optionC: "Capgemini",
    optionD: "Zoho Corporation",
    correctAnswer: "B"
  },
  {
    question: "Which IT company is headquartered in the United States but has a significant workforce and delivery presence in India?",
    optionA: "Infosys",
    optionB: "Cognizant",
    optionC: "Wipro",
    optionD: "Zoho Corporation",
    correctAnswer: "B"
  },
  {
    question: "Which company is widely known for providing digital transformation, consulting, and strategy services to global enterprises?",
    optionA: "Accenture",
    optionB: "Tata Consultancy Services",
    optionC: "Zoho Corporation",
    optionD: "Infosys",
    correctAnswer: "A"
  },
  {
    question: "Which company actively promotes a rural-first work culture and operates major offices outside India's metropolitan cities?",
    optionA: "Infosys",
    optionB: "Zoho Corporation",
    optionC: "Capgemini",
    optionD: "Cognizant",
    correctAnswer: "B"
  },
  {
    question: "Which IT company is most closely associated with large-scale campus recruitment across India every year?",
    optionA: "Zoho Corporation",
    optionB: "Tata Consultancy Services",
    optionC: "Accenture",
    optionD: "Capgemini",
    correctAnswer: "B"
  },
  {
    question: "Which company primarily delivers IT solutions across domains such as banking, healthcare, retail, and insurance for global clients?",
    optionA: "Zoho Corporation",
    optionB: "Cognizant",
    optionC: "Infosys",
    optionD: "Wipro",
    correctAnswer: "B"
  }
];

// Shuffle function
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Upload function
async function uploadQuestions() {
  console.log('🚀 Starting upload to Firebase...\n');
  
  try {
    // Shuffle questions
    const shuffledQuestions = shuffleArray(questions);
    console.log(`📝 Shuffled ${shuffledQuestions.length} questions in random order\n`);
    
    // Upload each question
    console.log('⬆️  Uploading questions to Firestore...');
    for (let i = 0; i < shuffledQuestions.length; i++) {
      const question = shuffledQuestions[i];
      const docId = `q${i + 1}`;
      
      await setDoc(doc(db, 'questions', docId), {
        ...question,
        order: i + 1
      });
      
      process.stdout.write(`\r   Uploaded: ${i + 1}/${shuffledQuestions.length} questions`);
    }
    console.log('\n✅ All questions uploaded successfully!\n');
    
    // Initialize session
    console.log('🔧 Creating session document...');
    await setDoc(doc(db, 'session', 'current'), {
      active: false,
      createdAt: new Date().toISOString()
    });
    console.log('✅ Session initialized!\n');
    
    console.log('🎉 SUCCESS! Your Firebase database is ready!');
    console.log('\n📊 Database structure:');
    console.log('   ├── questions/ (30 documents)');
    console.log('   └── session/current');
    console.log('\n🚀 Next steps:');
    console.log('   1. Go to http://localhost:3000/admin');
    console.log('   2. Click "Start Test"');
    console.log('   3. Share http://localhost:3000/test with students\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('\n💡 Common fixes:');
    console.error('   1. Enable Firestore in Firebase Console');
    console.error('   2. Check internet connection');
    console.error('   3. Verify Firebase config is correct\n');
    process.exit(1);
  }
}

// Run the upload
uploadQuestions();
