import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Clock, ArrowLeft, ChevronRight, BookOpen, User, Zap, GraduationCap, CheckCircle, XCircle, BarChart3, Mail, Home, Share2 } from 'lucide-react';
import emailjs from '@emailjs/browser';

// ============================================================================
// SUBJECTS DATA - FIXED STRUCTURE
// ============================================================================
const subjectsData = {
  "हिन्दी (मुख्य - गोधूली)": {
    "गद्य खण्ड": ["श्रम विभाजन और जाति प्रथा", "विष के दाँत", "भारत से हम क्या सीखें", "नाखून क्यों बढ़ते हैं", "नागरी लिपि", "बहादुर", "परंपरा का मूल्यांकन", "जित-जित मैं निरखत हूँ", "आविन्यों", "मछली", "नौबतखाने में इबादत", "शिक्षा और संस्कृति"],
    "काव्य खण्ड": ["राम नाम बिनु बिरथे", "प्रेम अयनि श्री राधिका", "अति सूधो सनेह को मारग", "स्वदेशी", "भारतमाता", "जनतंत्र का जन्म", "हिरोशिमा", "एक वृक्ष की हत्या", "हमारी नींद", "अक्षर ज्ञान", "लौटकर आऊँगा फिर", "मेरे बिना तुम प्रभु"]
  },
  "हिन्दी SIL (द्वितीय भाषा - किशलय)": {
    "सभी अध्याय": ["तू जिंदा है तो…", "ईदगाह", "कर्मवीर", "बालगोबिन भगत", "हुंडरू का जलप्रपात", "बिहारी के दोहे", "ठेस", "बच्चे की दुआ", "अशोक का शस्त्र त्याग", "ईर्ष्या, तू न गई मेरे मन से", "कबीर के पद", "विक्रमशिला", "दीदी की डायरी", "पीपल", "दीनबंधु निराला", "खेमा", "खुशबू रचते हैं हाथ", "हौसले की उड़ान", "जननायक कर्पूरी ठाकुर", "झाँसी की रानी", "चिकित्सा का चक्कर", "सुदामा चरित", "राह भटके हिरण के बच्चे को"]
  },
  "उर्दू (درخشاں اور روشنی)": {
    "درخشاں (حصہ دوم)": ["حمد: خدا عزوجل", "افسانہ: بھابھی جان", "افسانہ: فرار", "افسانہ: کٹی ہوئی شاخ", "افسانہ: آشیانہ", "مضمون: عالمی حدت", "مضمون: ادب کی پہچان", "مضمون: اُردو ڈراما نِگاری", "انٹرویو: راجیندر سِنگ بیدی", "مکتوب: غالب", "مکتوب: شہباز", "مکتوب: مہندی افادی", "نظم: مناجات", "نظم: چکبست", "نظم: انڈیا گیٹ", "نظم: ہم نہیں جانتے", "مثنوی: زہر عشق", "مثنوی: गुलज़ार-ए-नसीम", "غزل: मुबारक अज़ीमाबादी", "غزل: अहमद फ़राज़", "غزل: परवीन शाकिر"],
    "روشنی (حصہ دوم)": ["सेकंड हैंड", "अर्जुन", "खाली संدूक", "वाट्रो के किनारे", "सूरज का घोड़ा"]
  },
  "गणित (Maths)": {
    "अध्याय": ["1. वास्तविक संख्याएँ", "2. बहुपद", "3. दो चरों वाले रैखिक समीकरण", "4. द्विघात समीकरण", "5. समांतर श्रेढ़ियाँ", "6. त्रिभुज", "7. निर्देशांक ज्यामिति", "8. त्रिकोणमिति का परिचय", "9. त्रिकोणमिति के अनुप्रयोग", "10. वृत्त", "11. वृत्तों से संबंधित क्षेत्रफल", "12. पृष्ठीय क्षेत्रफल और आयतन", "13. सांख्यिकी", "14. प्रायिकता"]
  },
  "विज्ञान (Science)": {
    "भौतिकी": ["प्रकाश: परावर्तन एवं अपवर्तन", "मानव नेत्र", "विद्युत", "विद्युत धारा के चुंबकीय प्रभाव", "ऊर्जा के स्रोत"],
    "रसायन शास्त्र": ["रासायनिक अभिक्रियाएँ", "अम्ल, क्षारक एवं लवण", "धातु एवं अधातु", "कार्बन एवं उसके यौगिक", "तत्वों का आवर्त वर्गीकरण"],
    "जीव विज्ञान": ["जैव प्रक्रम", "नियंत्रण एवं समन्वय", "जीव जनन कैसे करते हैं?", "आनुवंशिकता एवं जैव विकास", "हमारा पर्यावरण"]
  },
  "सामाजिक विज्ञान": {
    "इतिहास": ["यूरोप में राष्ट्रवाद", "भारत में राष्ट्रवाद", "भूमंडलीकृत विश्व", "औद्योगीकरण का युग", "मुद्रण संस्कृति"],
    "भूगोल": ["संसाधन एवं विकास", "वन एवं वन्यजीव", "जल संसाधन", "कृषि", "खनिज एवं ऊर्जा", "विनिर्माण उद्योग"],
    "राजनीति": ["सत्ता की साझेदारी", "संघवाद", "लोकतंत्र और विविधता", "जन-संघर्ष", "लोकतंत्र की चुनौतियाँ"],
    "अर्थशास्त्र": ["विकास", "भारतीय अर्थव्यवस्था के क्षेत्रक", "मुद्रा और साख", "वैश्वीकरण", "उपभोक्ता अधिकार"]
  },
  "संस्कृत (Piyusham)": {
    "अध्याय": ["मङ्गलम्", "पाटलिपुत्रवैभवम्", "अलसकथा", "नीतिश्لوकाः", "भारतीयसंस्काराः", "स्वामी दयानन्दः", "व्याघ्रपथिककथा", "कर्णस्य दानवीरता"]
  }
};

const App = () => {
  const [step, setStep] = useState('splash');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [studentName, setStudentName] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20 * 60); 
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Randomize Options
  const currentShuffledOptions = useMemo(() => {
    if (questions.length > 0 && questions[currentQuestion]) {
      return [...questions[currentQuestion].options].sort(() => Math.random() - 0.5);
    }
    return [];
  }, [questions, currentQuestion]);

  useEffect(() => {
    if (step === 'splash') {
      const timer = setTimeout(() => setStep('home'), 2800);
      return () => clearTimeout(timer);
    }
  }, [step]);

  useEffect(() => {
    let timer;
    if (step === 'quiz' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) handleFinishQuiz();
    return () => clearInterval(timer);
  }, [timeLeft, step]);

  useEffect(() => {
    if (!selectedChapter || (step !== 'name' && step !== 'quiz')) return;
    setLoading(true);
    const subjectFileMap = {
      "हिन्दी (मुख्य - गोधूली)": "/Data/Hindi.json",
      "हिन्दी SIL (द्वितीय भाषा - किशलय)": "/Data/Hindi-sil.json",
      "गणित (Maths)": "/Data/Math.json",
      "विज्ञान (Science)": "/Data/Science.json",
      "सामाजिक विज्ञान": "/Data/Sst.json",
      "संस्कृत (Piyusham)": "/Data/Sanskrit.json",
      "उर्दू (درخشاں اور روشنی)": "/Data/Urdu.json"
    };
    fetch(subjectFileMap[selectedSubject])
      .then(res => res.json())
      .then(data => {
        let foundQuestions = null;
        const clean = (str) => str ? str.toString().replace(/[0-9]/g, '').replace(/[.\s]/g, '').replace(/[…...]/g, '').trim() : "";
        const targetClean = clean(selectedChapter);
        const deepFind = (obj) => {
          if (!obj || foundQuestions) return;
          for (let key in obj) {
            if (clean(key).includes(targetClean) || targetClean.includes(clean(key))) {
              if (Array.isArray(obj[key])) { foundQuestions = obj[key]; return; }
            }
            if (typeof obj[key] === 'object' && obj[key] !== null) deepFind(obj[key]);
          }
        };
        deepFind(data);
        if (foundQuestions) setQuestions(foundQuestions);
      })
      .finally(() => setLoading(false));
  }, [selectedChapter, selectedSubject, step]);

  const handleOptionClick = (opt) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);
    if (opt === questions[currentQuestion].correctAnswer) setScore(s => s + 1);
    else setWrongAnswers(w => w + 1);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(c => c + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else handleFinishQuiz();
  };

  // --- UPDATED EMAIL LOGIC ---
  const handleFinishQuiz = () => {
    setStep('result');
    const percentage = ((score / questions.length) * 100).toFixed(2);
    
    const templateParams = {
      name: studentName,
      subject: selectedSubject,
      chapter: selectedChapter,
      score: score,
      total: questions.length,
      wrong: wrongAnswers,
      percentage: percentage + "%",
      to_email: "shekheklakh592@gmail.com",
    };

    emailjs.send(
      'service_qwy97mc', 
      'template_g81egth', 
      templateParams, 
      'Zz0FS8Vg8CgMQrVh3'
    ).then(() => {
        console.log("Email sent successfully!");
    }).catch((error) => {
        console.error("Email send failed:", error);
    });
  };

  return (
    <div className="min-h-screen bg-[#020308] text-slate-100 overflow-x-hidden font-sans selection:bg-cyan-500/30">
      
      {/* --- ADVANCED NAVBAR --- */}
      {step !== 'splash' && (
        <nav className="fixed top-0 w-full z-50 bg-black/60 backdrop-blur-xl border-b border-white/5 px-5 py-3 flex justify-between items-center shadow-2xl">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
            <div className="relative group">
               <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000"></div>
               <img src="/IMG.jpg" alt="Akhlaque" className="relative w-10 h-10 rounded-full border border-white/20 object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tighter leading-none bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent italic">AKHLAQUE</span>
              <span className="text-[10px] font-bold text-cyan-500 tracking-[0.2em] uppercase">TOPPER Quiz</span>
            </div>
          </motion.div>

          {/* BLINKING HOME BUTTON */}
          <motion.button 
            onClick={() => window.location.reload()}
            whileTap={{ scale: 0.9 }}
            className="relative flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl group overflow-hidden"
          >
             <motion.div 
               animate={{ opacity: [1, 0.3, 1] }} 
               transition={{ duration: 1.5, repeat: Infinity }}
               className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]"
             />
             <Home size={18} className="text-white group-hover:text-cyan-400 transition-colors" />
             <span className="text-xs font-black tracking-widest uppercase hidden sm:inline">Home</span>
             <motion.div 
                animate={{ x: ['-100%', '200%'] }} 
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
             />
          </motion.button>
        </nav>
      )}

      <AnimatePresence mode="wait">
        
        {/* --- SPLASH --- */}
        {step === 'splash' && (
          <motion.div key="splash" exit={{ opacity: 0, scale: 1.1 }} className="fixed inset-0 flex flex-col items-center justify-center bg-[#020308] z-[60]">
             <motion.div 
               animate={{ rotateY: 360 }} 
               transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
               className="mb-8"
             >
               <GraduationCap size={100} className="text-cyan-500 drop-shadow-[0_0_20px_rgba(6,182,212,0.6)]" />
             </motion.div>
             <h1 className="text-5xl font-black italic tracking-tighter">TOPPER<span className="text-cyan-500">QUIZ</span></h1>
             <p className="text-slate-500 tracking-[0.5em] text-[10px] mt-4 uppercase font-bold">Bihar Board Edition 2026</p>
          </motion.div>
        )}

        {/* --- HOME --- */}
        {step === 'home' && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 pt-28 max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-10">
                <div className="h-14 w-2 bg-cyan-500 rounded-full shadow-[0_0_15px_#22d3ee]"></div>
                <h1 className="text-4xl font-black leading-none uppercase">अपना पसंदीदा <br/><span className="text-cyan-500">विषय</span> चुनें</h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Object.keys(subjectsData).map((sub, i) => (
                <motion.button 
                  key={sub} 
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setSelectedSubject(sub); setStep('chapters'); }}
                  className="relative group p-8 rounded-[2rem] bg-slate-900/40 border border-white/5 overflow-hidden text-left"
                >
                  <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-20 transition-opacity">
                      <BookOpen size={120} />
                  </div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-6 shadow-lg">
                      <Zap size={24} className="text-white" />
                    </div>
                    <h3 className="text-xl font-black leading-tight group-hover:text-cyan-400 transition-colors uppercase">{sub}</h3>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* --- CHAPTERS --- */}
        {step === 'chapters' && (
          <motion.div key="chapters" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="p-6 pt-28 max-w-4xl mx-auto pb-20">
            <button onClick={() => setStep('home')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
               <ArrowLeft size={20}/> वापस जाएँ
            </button>
            <h2 className="text-3xl font-black mb-10 border-b border-white/10 pb-6 uppercase tracking-tight">{selectedSubject}</h2>
            {Object.entries(subjectsData[selectedSubject]).map(([category, list]) => (
              <div key={category} className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-[2px] w-8 bg-fuchsia-500"></div>
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-fuchsia-500">{category}</p>
                </div>
                <div className="grid gap-4">
                  {list.map((ch, idx) => (
                    <motion.button 
                      key={ch}
                      whileHover={{ x: 10 }}
                      onClick={() => { setSelectedChapter(ch); setStep('name'); }}
                      className="p-5 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center group hover:bg-cyan-500/10 transition-all"
                    >
                      <span className="font-bold text-lg leading-tight"><span className="text-cyan-500 mr-3 opacity-50">{idx+1}.</span>{ch}</span>
                      <ChevronRight size={20} className="text-slate-700 group-hover:text-cyan-400" />
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* --- NAME INPUT --- */}
        {step === 'name' && (
          <div className="flex items-center justify-center min-h-screen">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md">
                <div className="bg-slate-900/80 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 text-center shadow-3xl">
                  <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-700 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-cyan-500/20">
                    <User size={40} />
                  </div>
                  <h2 className="text-2xl font-black mb-2 italic">WELCOME STUDENT</h2>
                  <p className="text-slate-500 text-sm mb-8 uppercase tracking-widest">अपनी पहचान दर्ज करें</p>
                  <input 
                    type="text" value={studentName} onChange={e => setStudentName(e.target.value)}
                    className="w-full bg-black p-5 rounded-2xl text-center outline-none border-2 border-white/5 focus:border-cyan-500 mb-8 text-xl font-bold text-cyan-400 transition-all" 
                    placeholder="आपका नाम यहाँ..." 
                  />
                  <button 
                    disabled={!studentName.trim() || loading} 
                    onClick={() => setStep('quiz')}
                    className="w-full py-5 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 rounded-2xl font-black text-xl shadow-xl shadow-blue-500/20 active:scale-95 transition-transform"
                  >
                    {loading ? "लोड हो रहा है..." : "START QUIZ"}
                  </button>
                </div>
            </motion.div>
          </div>
        )}

        {/* --- QUIZ SCREEN --- */}
        {step === 'quiz' && (
            <div className="p-4 pt-18 max-w-2xl mx-auto pb-20">
                <div className="flex gap-3 mb-2">
                    <div className="flex-1 bg-white/5 p-4 rounded-3xl border border-white/5 flex items-center justify-between">
                        <span className="text-xs font-black text-slate-500 uppercase">Progress</span>
                        <span className="text-lg font-black">{currentQuestion + 1} / {questions.length}</span>
                    </div>
                    <div className="flex-1 bg-red-500/5 p-4 rounded-3xl border border-red-500/10 flex items-center justify-between text-red-400">
                        <Clock size={18} />
                        <span className="text-lg font-black tracking-tighter">
                          {Math.floor(timeLeft/60)}:{(timeLeft%60).toString().padStart(2,'0')}
                        </span>
                    </div>
                </div>

                <motion.div 
                  key={currentQuestion}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-slate-900 to-black p-7 rounded-[2.5rem] mb-4 border border-white/10 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute -top-1 -left-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black px-2 py-1 rounded-br-2xl rounded-tl-[2.4rem] text-2xl italic shadow-lg">Q</div>
                    <p className="text-2xl font-black leading-snug pt-2">{questions[currentQuestion]?.question}</p>
                </motion.div>

                <div className="grid gap-4">
                    {currentShuffledOptions.map((opt, i) => (
                        <motion.button 
                            key={i}
                            whileTap={{ scale: 0.97 }}
                            disabled={isAnswered} 
                            onClick={() => handleOptionClick(opt)}
                            className={`group p-6 rounded-[1.5rem] border-2 text-left text-lg font-bold transition-all flex justify-between items-center ${
                                isAnswered 
                                ? opt === questions[currentQuestion].correctAnswer ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : opt === selectedOption ? 'bg-red-500/20 border-red-500 text-red-400' : 'opacity-30 border-transparent'
                                : 'bg-slate-900 border-white/5 hover:border-cyan-500/40 hover:bg-slate-800'
                            }`}
                        >
                            <span className="flex items-center gap-4">
                               <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${isAnswered ? 'bg-white/5' : 'bg-white/5 group-hover:bg-cyan-500 group-hover:text-black'}`}>{String.fromCharCode(65 + i)}</span>
                               {opt}
                            </span>
                            {isAnswered && opt === questions[currentQuestion].correctAnswer && <CheckCircle className="text-emerald-400" size={24} />}
                        </motion.button>
                    ))}
                </div>

                {isAnswered && (
                    <motion.button 
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      onClick={handleNext} 
                      className="mt-4 w-full py-6 bg-white text-black font-black rounded-[2rem] flex items-center justify-center gap-3 text-2xl shadow-2xl hover:bg-cyan-400 transition-colors"
                    >
                        {currentQuestion === questions.length - 1 ? "FINISH QUIZ" : "NEXT QUESTION"} <ChevronRight />
                    </motion.button>
                )}
            </div>
        )}

        {/* --- RESULT --- */}
        {step === 'result' && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-4xl mx-auto pt-18 scrollbar-hide ">
            <div className="bg-slate-900/80 border border-white/10 p-5 text-center shadow-3xl relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500"></div>

              <div className="relative w-40 h-40 mx-auto mb-3">
                  <div className="absolute inset-0 bg-cyan-500 blur-[40px] opacity-20 animate-pulse"></div>
                  <div className="relative w-full h-full bg-gradient-to-br from-slate-800 to-black rounded-full border-4 border-white/10 flex items-center justify-center">
                      <Trophy size={80} className="text-yellow-500 drop-shadow-lg" />
                  </div>
              </div>

              <div className={`text-sm font-black mb-2 px-4 py-2 rounded-2xl inline-block ${((score / questions.length) * 100) < 70 ? 'bg-red-500/10 text-yellow-500 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                 {((score / questions.length) * 100) < 70 ? "आपको और मेहनत करने की जरुरत है |" : "बहुत शानदार प्रदर्शन!"}
              </div>
              
              <h2 className="text-5xl font-black mb-2 uppercase tracking-tight italic">{studentName}</h2>
              <p className="text-slate-500 mb-10 font-bold uppercase tracking-widest">{selectedChapter}</p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  { label: 'सही उत्तर', val: score, color: 'text-emerald-400', icon: CheckCircle },
                  { label: 'गलत उत्तर', val: wrongAnswers, color: 'text-red-400', icon: XCircle },
                  { label: 'कुल स्कोर', val: ((score / questions.length) * 100).toFixed(0) + '%', color: 'text-cyan-400', icon: BarChart3 },
                  { label: 'समय लगा', val: '20:00', color: 'text-white', icon: Clock }
                ].map((item, idx) => (
                  <div key={idx} className="bg-black/40 p-6 rounded-3xl border border-white/5">
                    <item.icon size={20} className="mx-auto mb-3 opacity-30"/>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black mb-1">{item.label}</p>
                    <p className={`text-3xl font-black tracking-tighter ${item.color}`}>{item.val}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                  <button onClick={() => window.location.reload()} className="flex-1 py-6 bg-white text-black rounded-[2rem] font-black text-xl hover:bg-cyan-400 transition-colors active:scale-95">
                    RESTART
                  </button>
                  <button className="w-20 bg-white/5 rounded-[2rem] flex items-center justify-center border border-white/10 text-white">
                    <Share2 />
                  </button>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default App;
