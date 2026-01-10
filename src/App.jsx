import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import questionsData from './questions.json';
import emailjs from '@emailjs/browser';

const App = () => {
  const [step, setStep] = useState('home');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [userName, setUserName] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); 

  const subjectQuestions = questionsData[selectedSubject] || [];

  useEffect(() => {
    let timer;
    if (step === 'quiz' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && step === 'quiz') {
      handleSubmit();
    }
    return () => clearInterval(timer);
  }, [timeLeft, step]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  const handleSubjectSelect = (sub) => {
    setSelectedSubject(sub);
    setStep('form');
  };

  const startQuiz = () => {
    if (userName.trim() && subjectQuestions.length > 0) {
      setStep('quiz');
    } else if (subjectQuestions.length === 0) {
      alert("No questions found!");
    }
  };

  const handleAnswerClick = (option) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
    setIsAnswered(true);
    if (option === subjectQuestions[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion + 1 < subjectQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    setStep('result');
    sendEmail();
  };

  const sendEmail = () => {
    const templateParams = {
      name: userName,
      subject: selectedSubject,
      score: score,
      total: subjectQuestions.length,
      percentage: ((score / subjectQuestions.length) * 100).toFixed(2) + '%',
      to_email: 'shekheklakh592@gmail.com',
    };
    emailjs.send('service_qwy97mc', 'template_g81egth', templateParams, 'Zz0FS8Vg8CgMQrVh3')
      .then(() => console.log('Admin Notified!'))
      .catch((err) => console.error('Email Error', err));
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 font-sans">
      {/* Responsive Navbar */}
      <nav className="bg-white sticky top-0 z-50 border-b border-slate-200 px-4 py-3 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/IMG.jpg" alt="Logo" className="w-10 h-10 rounded-full border-2 border-indigo-600 object-cover" />
            <h1 className="font-black text-lg bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Akhlaque Quiz
            </h1>
          </div>
          
          {step === 'quiz' && (
            <div className={`font-mono font-bold px-3 py-1 rounded-lg border-2 ${timeLeft < 60 ? 'text-red-600 border-red-200 bg-red-50 animate-pulse' : 'text-indigo-600 border-indigo-200 bg-indigo-50'}`}>
              {formatTime(timeLeft)}
            </div>
          )}
        </div>
      </nav>

      <main className="w-full max-w-4xl mx-auto p-4 md:p-8">
        <AnimatePresence mode="wait">
          
          {/* HOME STEP */}
          {step === 'home' && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="pt-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-slate-800 mb-2">Select Subject</h2>
                <p className="text-slate-500 text-sm">Tap on a card to start your exam</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.keys(questionsData).map((sub) => (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    key={sub}
                    onClick={() => handleSubjectSelect(sub)}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center hover:border-indigo-500 transition-all"
                  >
                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center text-xl font-bold mb-3 uppercase">
                      {sub[0]}
                    </div>
                    <span className="font-bold text-slate-700 text-sm md:text-base">{sub}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* FORM STEP */}
          {step === 'form' && (
            <motion.div initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} className="max-w-md mx-auto mt-10">
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                <h2 className="text-2xl font-black text-center mb-6">Enter Your Details</h2>
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Candidate Name</label>
                    <input 
                      type="text" 
                      className="w-full mt-1 p-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none font-semibold transition-all"
                      placeholder="Type your name..." 
                      value={userName} 
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>
                  <button onClick={startQuiz} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-transform">
                    Start Exam
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* QUIZ STEP - Full Mobile View */}
          {step === 'quiz' && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="w-full">
              <div className="bg-white p-5 md:p-10 rounded-3xl shadow-lg border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold">
                    Q: {currentQuestion + 1} / {subjectQuestions.length}
                  </span>
                  <div className="flex-1 mx-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-indigo-600" animate={{ width: `${((currentQuestion + 1) / subjectQuestions.length) * 100}%` }} />
                  </div>
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-tight">
                  {subjectQuestions[currentQuestion]?.question}
                </h3>

                <div className="grid grid-cols-1 gap-3">
                  {subjectQuestions[currentQuestion]?.options.map((option, idx) => {
                    const isCorrect = option === subjectQuestions[currentQuestion].correctAnswer;
                    const isSelected = selectedAnswer === option;
                    let btnStyle = "w-full p-4 text-left border-2 rounded-xl font-semibold transition-all ";
                    
                    if (isAnswered) {
                      if (isCorrect) btnStyle += "bg-green-50 border-green-500 text-green-700";
                      else if (isSelected) btnStyle += "bg-red-50 border-red-500 text-red-700";
                      else btnStyle += "border-slate-100 text-slate-300";
                    } else {
                      btnStyle += "border-slate-100 active:bg-indigo-50 active:border-indigo-600 text-slate-600 shadow-sm";
                    }

                    return (
                      <button key={idx} onClick={() => handleAnswerClick(option)} disabled={isAnswered} className={btnStyle}>
                        <span className="inline-block w-8 text-indigo-400 font-bold">{String.fromCharCode(65 + idx)}.</span> {option}
                      </button>
                    );
                  })}
                </div>

                <button onClick={handleNext} disabled={!isAnswered} className={`w-full mt-8 py-4 rounded-xl font-black text-lg shadow-md transition-all ${isAnswered ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-slate-200 text-slate-400'}`}>
                  {currentQuestion === subjectQuestions.length - 1 ? 'Submit Final' : 'Next Question'}
                </button>
              </div>
            </motion.div>
          )}

          {/* RESULT STEP */}
          {step === 'result' && (
            <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} className="max-w-md mx-auto mt-10 bg-white p-10 rounded-[2.5rem] shadow-2xl text-center">
              <div className="text-5xl mb-4 text-green-500 italic font-black">Score!</div>
              <h2 className="text-2xl font-black text-slate-900 mb-6">{userName}</h2>
              <div className="flex gap-4 justify-center mb-8">
                <div className="bg-indigo-50 p-4 rounded-2xl w-28">
                  <div className="text-xs text-indigo-400 font-bold uppercase">Points</div>
                  <div className="text-2xl font-black text-indigo-600">{score}/{subjectQuestions.length}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-2xl w-28">
                  <div className="text-xs text-green-400 font-bold uppercase">Result</div>
                  <div className="text-2xl font-black text-green-600">{((score / subjectQuestions.length) * 100).toFixed(0)}%</div>
                </div>
              </div>
              <button onClick={() => window.location.reload()} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black shadow-lg">New Quiz</button>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
      <footer className="py-6 text-center text-slate-400 font-bold text-[10px] uppercase tracking-widest">
        Developed for Bihar Board 2026
      </footer>
    </div>
  );
};

export default App;