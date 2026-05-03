import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Settings2, BookOpen, Layers, Check, Brain, FlaskConical, Bug, Ghost } from 'lucide-react';
import { Topic, Difficulty, QuestionType, QuizConfig } from '../types';
import { cn } from '../lib/utils';
import { sounds } from '../lib/sounds';

const TOPIC_ICONS = {
  [Topic.BACTERIOLOGY]: Bug,
  [Topic.VIROLOGY]: FlaskConical,
  [Topic.MYCOLOGY]: Ghost,
  [Topic.PARASITOLOGY]: BookOpen,
};

export const QuizCustomizer: React.FC<{ onStart: (config: QuizConfig) => void }> = ({ onStart }) => {
  const [config, setConfig] = useState<QuizConfig>({
    topics: [Topic.BACTERIOLOGY, Topic.VIROLOGY],
    difficulties: [Difficulty.EASY, Difficulty.MEDIUM],
    questionTypes: [QuestionType.MCQ, QuestionType.TRUE_FALSE, QuestionType.THREE_D],
    count: 10
  });

  const toggle = <T,>(key: keyof QuizConfig, value: T) => {
    sounds.playClick();
    setConfig(prev => {
      const arr = prev[key] as T[];
      if (arr.includes(value)) {
        if (arr.length === 1) return prev; // Keep at least one
        return { ...prev, [key]: arr.filter(v => v !== value) };
      }
      return { ...prev, [key]: [...arr, value] };
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-12">
      <div className="text-center space-y-4">
        <motion.div
           initial={{ scale: 0.9, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="inline-flex p-4 bg-brand-prussian rounded-3xl shadow-xl shadow-brand-ink/10 mb-4"
        >
          <Settings2 className="w-8 h-8 text-white" />
        </motion.div>
        <h1 className="text-4xl font-black text-brand-ink tracking-tight">Configure Your Session</h1>
        <p className="text-brand-dusk max-w-md mx-auto">Select your focus areas, challenge level, and preferred interactive formats.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        {/* Topics */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-brand-ink font-bold uppercase tracking-wider text-sm">
            <Layers className="w-4 h-4" />
            Core Topics
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Object.values(Topic).map(topic => {
              const Icon = TOPIC_ICONS[topic];
              const isActive = config.topics.includes(topic);
              return (
                <button
                  key={topic}
                  onClick={() => toggle('topics', topic)}
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all group",
                    isActive ? "border-brand-prussian bg-brand-denim/10 text-brand-prussian shadow-lg shadow-brand-ink/5" : "border-brand-denim/10 bg-white hover:border-brand-denim/30 text-brand-dusk"
                  )}
                >
                  <Icon className={cn("w-6 h-6", isActive ? "text-brand-prussian" : "text-brand-denim group-hover:text-brand-dusk")} />
                  <span className="text-xs font-bold uppercase">{topic}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Difficulty */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-brand-ink font-bold uppercase tracking-wider text-sm">
            <Brain className="w-4 h-4" />
            Challenge Level
          </div>
          <div className="space-y-3">
            {Object.values(Difficulty).map(diff => (
              <button
                key={diff}
                onClick={() => toggle('difficulties', diff)}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all",
                  config.difficulties.includes(diff) ? "border-brand-prussian bg-brand-denim/10 text-brand-prussian" : "border-brand-denim/10 bg-white text-brand-dusk"
                )}
              >
                <span className="font-bold capitalize">{diff}</span>
                {config.difficulties.includes(diff) && <Check className="w-5 h-5 text-brand-prussian" />}
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="flex flex-col items-center gap-8 pt-8 px-4">
         <div className="flex flex-wrap justify-center gap-3">
            {Object.values(QuestionType).map(type => (
               <button
                  key={type}
                  onClick={() => toggle('questionTypes', type)}
                  className={cn(
                    "px-4 py-2 rounded-full text-[10px] md:text-xs font-bold border-2 transition-all uppercase tracking-widest",
                    config.questionTypes.includes(type) ? "border-brand-ink bg-brand-ink text-brand-alabaster" : "border-brand-denim/20 text-brand-denim"
                  )}
               >
                  {type.replace(/_/g, ' ')}
               </button>
            ))}
         </div>

        <button
          onClick={() => {
            sounds.playClick();
            onStart(config);
          }}
          className="w-full max-w-sm py-4 bg-brand-prussian text-brand-alabaster rounded-2xl font-black text-lg shadow-2xl shadow-brand-ink/20 hover:bg-brand-ink hover:-translate-y-1 transition-all uppercase tracking-tighter"
        >
          GENERATE QUIZ
        </button>
      </div>
    </div>
  );
};
