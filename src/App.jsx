import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Clock, ArrowLeft, ChevronRight, BookOpen, User, Zap, GraduationCap, CheckCircle, XCircle, BarChart3, Mail } from 'lucide-react';
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

  // 🔥 नया फीचर: ऑप्शंस को रैंडमली शफल करने का लॉजिक
  const currentShuffledOptions = useMemo(() => {
    if (questions.length > 0 && questions[currentQuestion]) {
      return [...questions[currentQuestion].options].sort(() => Math.random() - 0.5);
    }
    return [];
  }, [questions, currentQuestion]);

  useEffect(() => {
    if (step === 'splash') {
      const timer = setTimeout(() => setStep('home'), 2000);
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
    if (!selectedChapter || step !== 'name') return;
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

    fetch(subjectFileMap[selectedSubject] || "/Data/Urdu.json")
      .then(res => res.json())
      .then(data => {
        let found = null;
        const cleanChapter = selectedChapter.trim();
        const deepSearch = (obj) => {
          if (obj[cleanChapter]) { found = obj[cleanChapter]; return; }
          for (let key in obj) {
            if (typeof obj[key] === 'object' && !Array.isArray(obj[key]) && obj[key] !== null) deepSearch(obj[key]);
          }
        };
        deepSearch(data);
        if (found) { setQuestions(found); setCurrentQuestion(0); }
      })
      .finally(() => setLoading(false));
  }, [selectedChapter, step]);

  const handleOptionClick = (opt) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);
    if (opt === questions[currentQuestion].correctAnswer) {
      setScore(s => s + 1);
    } else {
      setWrongAnswers(w => w + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(c => c + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      handleFinishQuiz();
    }
  };

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
      percentage: percentage + '%',
      to_email: 'shekheklakh592@gmail.com',
    };
    emailjs.send('service_qwy97mc', 'template_g81egth', templateParams, 'Zz0FS8Vg8CgMQrVh3');
  };

  return (
    <div className="min-h-screen bg-[#050510] text-slate-100 font-sans">
      <AnimatePresence mode="wait">
        
        {step === 'splash' && (
          <motion.div key="splash" exit={{ opacity: 0 }} className="fixed inset-0 flex flex-col items-center justify-center bg-[#050510] z-50">
            <GraduationCap size={100} className="text-cyan-400 mb-6" />
            <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent italic">TOPPER QUIZ</h1>
            <p className="text-slate-500 mt-4 tracking-widest uppercase text-sm">बिहार बोर्ड स्पेशल</p>
          </motion.div>
        )}

        {step === 'home' && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 max-w-6xl mx-auto pt-10">
             <h1 className="text-4xl font-black text-white mb-2">अपना <span className="text-cyan-400">विषय</span> चुनें</h1>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
               {Object.keys(subjectsData).map((sub) => (
                 <motion.button whileHover={{ y: -8 }} key={sub} onClick={() => { setSelectedSubject(sub); setStep('chapters'); }}
                   className="p-8 bg-slate-900/40 border border-white/5 rounded-[2rem] hover:border-cyan-500/50 text-left transition-all">
                   <div className="bg-cyan-500/10 p-4 rounded-2xl w-fit mb-6 text-cyan-400"><BookOpen /></div>
                   <span className="text-xl font-black block text-white">{sub}</span>
                 </motion.button>
               ))}
             </div>
          </motion.div>
        )}

        {step === 'chapters' && (
          <motion.div key="chapters" className="p-6 max-w-4xl mx-auto">
            <button onClick={() => setStep('home')} className="flex items-center gap-2 text-cyan-400 mb-6 font-bold"><ArrowLeft size={18}/> पीछे जाएँ</button>
            <h2 className="text-3xl font-black mb-8 text-white">{selectedSubject}</h2>
            {Object.entries(subjectsData[selectedSubject]).map(([category, list]) => (
              <div key={category} className="mb-10">
                <h3 className="text-xs font-black uppercase text-slate-500 mb-4 tracking-widest flex items-center gap-2"><Zap size={14} className="text-yellow-500"/> {category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {list.map(ch => (
                    <button key={ch} onClick={() => { setSelectedChapter(ch); setStep('name'); }}
                      className="p-5 bg-slate-900/60 rounded-2xl border border-white/5 text-left hover:bg-slate-800 transition-all font-bold">{ch}</button>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {step === 'name' && (
          <div className="flex items-center justify-center min-h-[80vh] p-6">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md bg-slate-900/80 p-10 rounded-[2.5rem] border border-white/10 text-center shadow-2xl backdrop-blur-xl">
              <User size={40} className="mx-auto mb-6 text-cyan-400" />
              <h2 className="text-2xl font-black mb-8 text-white">अपना नाम लिखें</h2>
              <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)}
                className="w-full bg-black/40 p-5 rounded-2xl text-center outline-none border-2 border-transparent focus:border-cyan-500 mb-8 text-xl font-bold text-cyan-400" placeholder="यहाँ नाम लिखें..." />
              <button disabled={!studentName.trim() || loading} onClick={() => setStep('quiz')}
                className="w-full py-5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl font-black text-xl disabled:opacity-30">
                {loading ? "लोड हो रहा है..." : "टेस्ट शुरू करें"}
              </button>
            </motion.div>
          </div>
        )}

        {step === 'quiz' && (
            <div className="p-4 max-w-3xl mx-auto pt-6">
                <div className="flex justify-between items-center bg-slate-900/80 backdrop-blur-md p-5 rounded-[1.5rem] mb-6 border border-white/10 sticky top-4 z-10">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-cyan-500/20 flex items-center justify-center font-black text-cyan-400">{currentQuestion + 1}</div>
                        <div className="text-sm font-bold text-slate-400">सवाल {questions.length} में से</div>
                    </div>
                    <div className="bg-black/40 px-5 py-2 rounded-full border border-white/5 flex items-center gap-3 text-yellow-500 font-black">
                        <Clock size={16} /> {Math.floor(timeLeft/60)}:{(timeLeft%60).toString().padStart(2,'0')}
                    </div>
                </div>

                <motion.div key={currentQuestion} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-slate-900 p-8 rounded-[2rem] mb-6 text-2xl font-black leading-relaxed border border-white/5 shadow-xl text-white">
                    {questions[currentQuestion]?.question}
                </motion.div>

                {/* यहाँ currentShuffledOptions का इस्तेमाल हो रहा है */}
                <div className="grid gap-4">
                    {currentShuffledOptions.map((opt, i) => (
                        <button key={i} disabled={isAnswered} onClick={() => handleOptionClick(opt)}
                            className={`p-6 rounded-2xl border-2 text-left text-lg font-bold transition-all flex justify-between items-center group ${
                                isAnswered 
                                ? opt === questions[currentQuestion].correctAnswer ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400' : opt === selectedOption ? 'bg-red-600/20 border-red-500 text-red-400' : 'opacity-40 border-transparent text-slate-500'
                                : 'bg-slate-900 border-white/5 hover:border-cyan-500 hover:bg-slate-800'
                            }`}>
                            {opt}
                            {isAnswered && opt === questions[currentQuestion].correctAnswer && <CheckCircle size={22} />}
                        </button>
                    ))}
                </div>

                {isAnswered && (
                    <motion.button initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onClick={handleNext} className="mt-10 w-full py-5 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-2 text-xl shadow-2xl">
                        {currentQuestion === questions.length - 1 ? "रिज़ल्ट देखें" : "अगला सवाल"} <ChevronRight />
                    </motion.button>
                )}
            </div>
        )}

        {step === 'result' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto p-6 pt-12">
            <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 md:p-14 shadow-2xl text-center">
              <h2 className="text-4xl font-black mb-2 text-white italic">{studentName}</h2>
              <p className="text-slate-400 mb-10">{selectedChapter}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-[2rem]">
                  <CheckCircle className="mx-auto mb-2 text-emerald-400" />
                  <p className="text-xs font-bold text-slate-500 uppercase">सही</p>
                  <p className="text-4xl font-black text-emerald-400">{score}</p>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 p-8 rounded-[2rem]">
                  <XCircle className="mx-auto mb-2 text-red-400" />
                  <p className="text-xs font-bold text-slate-500 uppercase">गलत</p>
                  <p className="text-4xl font-black text-red-400">{wrongAnswers}</p>
                </div>
                <div className="bg-blue-500/5 border border-blue-500/20 p-8 rounded-[2rem]">
                  <BarChart3 className="mx-auto mb-2 text-blue-400" />
                  <p className="text-xs font-bold text-slate-500 uppercase">प्रतिशत</p>
                  <p className="text-4xl font-black text-blue-400">{((score / questions.length) * 100).toFixed(1)}%</p>
                </div>
              </div>

              <button onClick={() => window.location.reload()} className="w-full py-6 bg-gradient-to-r from-cyan-600 to-blue-700 text-white rounded-3xl font-black text-xl shadow-xl">मुख्य मेनू</button>
              <div className="mt-6 text-slate-500 text-sm flex items-center justify-center gap-2 italic"><Mail size={14}/> एडमिन को रिपोर्ट भेज दी गई है</div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default App;