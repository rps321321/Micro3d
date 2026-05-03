import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Brain, Trophy, History, Settings, ChevronLeft, LayoutDashboard, Microscope, ArrowRight } from 'lucide-react';
import { QuizCustomizer } from './components/QuizCustomizer';
import { QuestionCard } from './components/QuestionCard';
import { QUESTIONS } from './data/questions';
import { QuizConfig, UserProgress, Question, Topic } from './types';
import { updateProgress, getQuestionsForReview } from './lib/srs';
import { cn } from './lib/utils';
import { sounds } from './lib/sounds';

export default function App() {
  const [view, setView] = useState<'home' | 'config' | 'quiz' | 'stats'>('home');
  const [currentQuiz, setCurrentQuiz] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [progress, setProgress] = useState<Record<string, UserProgress>>(() => {
    const saved = localStorage.getItem('micromed_progress');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('micromed_progress', JSON.stringify(progress));
  }, [progress]);

  const startQuiz = (config: QuizConfig) => {
    let filtered = QUESTIONS.filter(q => 
      config.topics.includes(q.topic) && 
      config.difficulties.includes(q.difficulty) &&
      config.questionTypes.includes(q.type)
    );
    
    filtered = filtered.sort(() => Math.random() - 0.5).slice(0, config.count);
    
    if (filtered.length === 0) {
      alert("No questions found for these settings. Try broadening your selection!");
      return;
    }

    setCurrentQuiz(filtered);
    setCurrentIndex(0);
    setHasAnswered(false);
    setView('quiz');
  };

  const handleAnswer = (correct: boolean) => {
    const q = currentQuiz[currentIndex];
    setHasAnswered(true);
    setProgress(prev => ({
      ...prev,
      [q.id]: updateProgress(prev[q.id], q.id, correct)
    }));
  };

  const nextQuestion = () => {
    sounds.playClick();
    if (currentIndex < currentQuiz.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setHasAnswered(false);
    } else {
      setView('stats');
    }
  };

  const dueCount = getQuestionsForReview(QUESTIONS, progress).length;

  return (
    <div className="min-h-screen bg-brand-alabaster text-brand-ink font-sans selection:bg-brand-denim/20 selection:text-brand-ink">
      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 left-0 right-0 h-16 bg-white border-b border-brand-denim/20 flex items-center justify-between px-6 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-prussian rounded-lg flex items-center justify-center">
            <Microscope className="w-4 h-4 text-brand-alabaster" />
          </div>
          <span className="font-black tracking-tight text-brand-prussian uppercase text-sm">MicroMed</span>
        </div>
        <button className="text-brand-denim hover:text-brand-prussian">
          <Settings className="w-5 h-5" />
        </button>
      </header>

      {/* Navigation Rail (Desktop) */}
      <nav className="fixed left-0 top-0 bottom-0 w-20 bg-white border-r border-brand-denim/20 hidden md:flex flex-col items-center py-8 z-50">
        <div className="mb-12">
          <div className="w-12 h-12 bg-brand-prussian rounded-2xl flex items-center justify-center shadow-lg shadow-brand-ink/10">
             <Microscope className="w-6 h-6 text-brand-alabaster" />
          </div>
        </div>
        
        <div className="flex-1 flex flex-col gap-8">
          <NavIcon icon={Home} active={view === 'home'} onClick={() => setView('home')} label="Home" />
          <NavIcon icon={Brain} active={view === 'config'} onClick={() => setView('config')} label="Learn" />
          <NavIcon icon={Trophy} active={view === 'stats'} onClick={() => setView('stats')} label="Stats" />
        </div>

        <NavIcon icon={Settings} active={false} onClick={() => {}} label="Settings" />
      </nav>

      {/* Bottom Nav (Mobile) */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 h-16 bg-brand-ink/95 backdrop-blur-md rounded-2xl flex items-center justify-around px-4 z-50 shadow-2xl shadow-brand-ink/40 border border-white/10">
        <MobileNavIcon icon={Home} active={view === 'home'} onClick={() => setView('home')} />
        <MobileNavIcon icon={Brain} active={view === 'config'} onClick={() => setView('config')} />
        <MobileNavIcon icon={Trophy} active={view === 'stats'} onClick={() => setView('stats')} />
      </nav>

      {/* Main Content */}
      <main className="md:pl-20 min-h-screen pb-32 md:pb-12">
        <div className="max-w-6xl mx-auto py-8 md:py-12 px-4 md:px-6">
          <AnimatePresence mode="wait">
            {view === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-brand-ink mb-2">Welcome Back.</h1>
                    <p className="text-brand-dusk font-medium">Your microbiology companion for 2nd year medical students.</p>
                  </div>
                  <div className="bg-white p-4 rounded-3xl border border-brand-denim/20 flex items-center gap-4 shadow-sm w-full md:w-auto">
                    <div className="bg-brand-alabaster p-3 rounded-2xl">
                       <History className="w-6 h-6 text-brand-prussian" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-brand-ink">{dueCount}</div>
                      <div className="text-xs font-bold text-brand-denim uppercase tracking-widest">Items Due</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <DashboardCard 
                      title="Custom Quiz" 
                      desc="Target specific bacteria, viruses or fungi with custom difficulty."
                      icon={Settings}
                      color="blue"
                      onClick={() => setView('config')}
                   />
                   <DashboardCard 
                      title="Spaced Repetition" 
                      desc="Review items strategically to ensure long-term retention."
                      icon={Brain}
                      color="indigo"
                      onClick={() => {
                        const due = getQuestionsForReview(QUESTIONS, progress);
                        if (due.length > 0) {
                           setCurrentQuiz(due.sort(() => Math.random() - 0.5).slice(0, 10));
                           setCurrentIndex(0);
                           setView('quiz');
                        } else {
                           alert("No items due for review! Check back later.");
                        }
                      }}
                   />
                   <DashboardCard 
                      title="Leaderboard" 
                      desc="See how you compare with other med students in your community."
                      icon={Trophy}
                      color="amber"
                      onClick={() => setView('stats')}
                   />
                </div>

                <section className="space-y-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <LayoutDashboard className="w-5 h-5 text-blue-600" />
                    Recommended for You
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Placeholder for dynamic recommendations */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-blue-300 transition-colors cursor-pointer group">
                      <div className="flex justify-between items-start mb-4">
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase">High Performance</span>
                        <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <h4 className="text-lg font-bold mb-2">Bacteriology Masterclass</h4>
                      <p className="text-sm text-slate-500">You've mastered 80% of Gram-positive organisms. Try our advanced case studies.</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-blue-300 transition-colors cursor-pointer group">
                      <div className="flex justify-between items-start mb-4">
                         <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full uppercase">Focus Area</span>
                         <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <h4 className="text-lg font-bold mb-2">Complex Virology</h4>
                      <p className="text-sm text-slate-500">Retrotranscription pathways are proving tricky. Review HIV and HTLV mechanisms.</p>
                    </div>
                  </div>
                </section>
              </motion.div>
            )}

            {view === 'config' && (
              <motion.div key="config" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <button onClick={() => setView('home')} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold">
                  <ChevronLeft className="w-5 h-5" /> Back to Dashboard
                </button>
                <QuizCustomizer onStart={startQuiz} />
              </motion.div>
            )}

            {view === 'quiz' && currentQuiz.length > 0 && (
              <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                <div className="flex items-center justify-between">
                   <button onClick={() => setView('home')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold">
                    <ChevronLeft className="w-5 h-5" /> Quit
                  </button>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-48 bg-slate-200 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-blue-600" 
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentIndex + 1) / currentQuiz.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-black text-slate-400">
                      {currentIndex + 1} / {currentQuiz.length}
                    </span>
                  </div>
                </div>

                <QuestionCard 
                  key={currentQuiz[currentIndex].id}
                  question={currentQuiz[currentIndex]} 
                  onAnswer={handleAnswer} 
                />

                <AnimatePresence>
                  {hasAnswered && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-center mt-8 px-4"
                    >
                      <button
                        onClick={nextQuestion}
                        className="w-full max-w-sm px-12 py-4 bg-brand-ink text-brand-alabaster rounded-2xl font-black text-lg hover:bg-brand-prussian transition-all flex items-center justify-center gap-2 shadow-2xl shadow-brand-ink/20"
                      >
                        {currentIndex === currentQuiz.length - 1 ? 'Finish Quiz' : 'Next Question'}
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {view === 'stats' && (
              <motion.div key="stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                 <button onClick={() => setView('home')} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold">
                  <ChevronLeft className="w-5 h-5" /> Back to Home
                </button>
                <div className="text-center space-y-4">
                   <h1 className="text-4xl font-black">Learning Statistics</h1>
                   <p className="text-slate-500">Your journey through the microscopic world.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                   <StatBox label="Total Studied" value={Object.keys(progress).length} color="prussian" />
                   <StatBox label="Mastered (Lv 5)" value={Object.values(progress).filter(p => p.level === 5).length} color="dusk" />
                   <StatBox label="Current Streak" value="7 Days" color="denim" />
                   <StatBox label="Accuracy" value="78%" color="ink" />
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-200">
                   <h3 className="text-lg font-bold mb-6">Topic Progress</h3>
                   <div className="space-y-6">
                      {Object.values(Topic).map(topic => {
                        const count = Object.values(progress).filter(p => QUESTIONS.find(q => q.id === p.questionId)?.topic === topic).length;
                        const total = QUESTIONS.filter(q => q.topic === topic).length;
                        const percent = total > 0 ? (count / total) * 100 : 0;
                        return (
                          <div key={topic} className="space-y-2">
                             <div className="flex justify-between text-sm">
                                <span className="font-bold uppercase tracking-wider text-slate-500">{topic}</span>
                                <span className="font-black text-slate-800">{Math.round(percent)}%</span>
                             </div>
                             <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-blue-500 transition-all duration-1000" 
                                  style={{ width: `${percent}%` }}
                                />
                             </div>
                          </div>
                        )
                      })}
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function NavIcon({ icon: Icon, active, onClick, label }: { icon: any, active: boolean, onClick: () => void, label: string }) {
  const handleClick = () => {
    sounds.playClick();
    onClick();
  };

  return (
    <button 
      onClick={handleClick}
      className={cn(
        "relative flex items-center justify-center w-12 h-12 rounded-xl transition-all group",
        active ? "bg-brand-alabaster text-brand-prussian" : "text-brand-denim hover:bg-brand-alabaster hover:text-brand-prussian"
      )}
    >
      <Icon className="w-6 h-6" />
      {active && <motion.div layoutId="nav-pill" className="absolute left-[-20px] w-1 h-6 bg-brand-prussian rounded-r-full" />}
      
      {/* Tooltip */}
      <div className="absolute left-full ml-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-[-10px] group-hover:translate-x-0 z-50">
        <div className="relative bg-brand-ink text-brand-alabaster text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl">
          {label}
          {/* Arrow */}
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-brand-ink rotate-45" />
        </div>
      </div>
    </button>
  );
}

function DashboardCard({ title, desc, icon: Icon, color, onClick }: { title: string, desc: string, icon: any, color: 'blue' | 'indigo' | 'amber', onClick: () => void }) {
  const handleClick = () => {
    sounds.playClick();
    onClick();
  };

  const colors = {
    blue: 'bg-white text-brand-prussian border-brand-denim/10 hover:border-brand-prussian hover:shadow-xl hover:shadow-brand-ink/5',
    indigo: 'bg-white text-brand-prussian border-brand-denim/10 hover:border-brand-prussian hover:shadow-xl hover:shadow-brand-ink/5',
    amber: 'bg-white text-brand-prussian border-brand-denim/10 hover:border-brand-prussian hover:shadow-xl hover:shadow-brand-ink/5'
  };

  return (
    <button 
      onClick={handleClick}
      className={cn("p-8 rounded-[2rem] border transition-all text-left group", colors[color])}
    >
      <div className={cn("p-4 rounded-2xl w-fit mb-6 transition-transform group-hover:scale-110 bg-brand-prussian text-brand-alabaster")}>
         <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-black mb-2 text-brand-ink">{title}</h3>
      <p className="text-brand-dusk font-medium leading-relaxed">{desc}</p>
    </button>
  );
}

function StatBox({ label, value, color }: { label: string, value: string | number, color: string }) {
  const colorClasses: Record<string, string> = {
    prussian: 'text-brand-prussian',
    dusk: 'text-brand-dusk',
    denim: 'text-brand-denim',
    ink: 'text-brand-ink'
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-brand-denim/10 shadow-sm shadow-brand-ink/5">
      <div className="text-xs font-bold text-brand-denim uppercase tracking-widest mb-2">{label}</div>
      <div className={cn("text-3xl font-black", colorClasses[color] || 'text-brand-ink')}>{value}</div>
    </div>
  );
}

function MobileNavIcon({ icon: Icon, active, onClick }: { icon: any, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={() => { sounds.playClick(); onClick(); }}
      className={cn(
        "p-3 rounded-xl transition-all",
        active ? "bg-brand-alabaster text-brand-prussian" : "text-brand-alabaster/40"
      )}
    >
      <Icon className="w-6 h-6" />
    </button>
  );
}

