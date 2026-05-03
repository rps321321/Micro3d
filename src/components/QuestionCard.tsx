import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, ArrowRight, RotateCcw, Brain, LayoutGrid, Layers, HelpCircle, Trophy } from 'lucide-react';
import { Question, QuestionType, UserProgress } from '../types';
import { ThreeViewer } from './ThreeViewer';
import { cn } from '../lib/utils';

import { sounds } from '../lib/sounds';

interface QuestionCardProps {
  question: Question;
  onAnswer: (correct: boolean) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [fillValue, setFillValue] = useState('');
  const [matchingResults, setMatchingResults] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleSubmit = (answer: any) => {
    let correct = false;
    if (question.type === QuestionType.MCQ || question.type === QuestionType.IMAGE || question.type === QuestionType.TRUE_FALSE || question.type === QuestionType.THREE_D) {
      correct = answer === question.correctAnswer;
    } else if (question.type === QuestionType.FILL_IN_BLANK) {
      correct = answer.toLowerCase().trim() === (question.correctAnswer as string).toLowerCase();
    } else if (question.type === QuestionType.MATCHING) {
      // Basic matching check
      correct = question.matchingPairs?.every(p => matchingResults[p.left] === p.right) ?? false;
    }
    
    setIsCorrect(correct);
    setShowFeedback(true);
    if (correct) {
      sounds.playCorrect();
    } else {
      sounds.playIncorrect();
    }
    onAnswer(correct);
  };

  const isSubmitDisabled = () => {
    if (showFeedback) return true;
    if (question.type === QuestionType.FILL_IN_BLANK) return fillValue.trim() === '';
    if (question.type === QuestionType.MATCHING) {
      const pairCount = question.matchingPairs?.length || 0;
      const matchedCount = Object.keys(matchingResults).length;
      return pairCount !== matchedCount || Object.values(matchingResults).some(v => v === '');
    }
    return !selected;
  };

  const renderQuestionType = () => {
    switch (question.type) {
      case QuestionType.THREE_D:
        return (
          <div className="space-y-6">
            <div className="w-full aspect-[4/3] md:h-[450px]">
              <ThreeViewer modelId={question.modelId || 'bacterium'} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {question.options?.map((opt) => (
                <button
                  key={opt}
                  onClick={() => !showFeedback && setSelected(opt)}
                  disabled={showFeedback}
                  className={cn(
                    "p-4 text-left rounded-xl border-2 transition-all duration-200",
                    selected === opt ? "border-brand-prussian bg-brand-denim/10 text-brand-prussian shadow-md shadow-brand-ink/5" : "border-brand-denim/10 bg-white hover:border-brand-denim/30 text-brand-dusk",
                    showFeedback && opt === question.correctAnswer && "border-green-500 bg-green-50 text-green-700",
                    showFeedback && selected === opt && opt !== question.correctAnswer && "border-red-500 bg-red-50 text-red-700"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );

      case QuestionType.MCQ:
      case QuestionType.TRUE_FALSE:
        return (
          <div className="grid grid-cols-1 gap-3">
            {question.options?.map((opt) => (
              <button
                key={opt}
                onClick={() => !showFeedback && setSelected(opt)}
                disabled={showFeedback}
                className={cn(
                  "p-4 text-left rounded-xl border-2 transition-all duration-200 flex justify-between items-center",
                  selected === opt ? "border-brand-prussian bg-brand-denim/10 shadow-md shadow-brand-ink/5" : "border-brand-denim/10 bg-white shadow-sm hover:border-brand-denim/30",
                  showFeedback && opt === question.correctAnswer && "border-green-500 bg-green-50",
                  showFeedback && selected === opt && opt !== question.correctAnswer && "border-red-500 bg-red-50"
                )}
              >
                <span className={cn(
                   showFeedback && opt === question.correctAnswer ? "text-green-700 font-medium" : "text-brand-ink"
                )}>{opt}</span>
                {showFeedback && opt === question.correctAnswer && <Check className="w-5 h-5 text-green-600" />}
                {showFeedback && selected === opt && opt !== question.correctAnswer && <X className="w-5 h-5 text-red-600" />}
              </button>
            ))}
          </div>
        );

      case QuestionType.FILL_IN_BLANK:
        return (
          <div className="space-y-4">
             <input
              type="text"
              value={fillValue}
              onChange={(e) => setFillValue(e.target.value)}
              disabled={showFeedback}
              placeholder="Type your answer here..."
              className="w-full p-4 rounded-xl border-2 border-brand-denim/10 focus:border-brand-prussian outline-none transition-all text-brand-ink"
            />
            {showFeedback && (
               <div className={cn("p-4 rounded-lg", isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800")}>
                  Correct answer: <span className="font-bold underline">{question.correctAnswer}</span>
               </div>
            )}
          </div>
        );

      case QuestionType.MATCHING:
        return (
          <div className="space-y-3">
            {question.matchingPairs?.map((pair) => {
              const isItemCorrect = matchingResults[pair.left] === pair.right;
              return (
                <div key={pair.left} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex-1 p-3 bg-brand-alabaster rounded-xl text-brand-ink font-bold border border-brand-denim/10 text-sm">
                    {pair.left}
                  </div>
                  <div className="hidden sm:block text-brand-denim">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  <div className="flex-1 relative">
                    <select
                      disabled={showFeedback}
                      value={matchingResults[pair.left] || ''}
                      className={cn(
                        "w-full p-3 bg-white border-2 rounded-xl outline-none transition-all appearance-none text-sm font-medium",
                        showFeedback 
                          ? (isItemCorrect ? "border-green-500 bg-green-50 text-green-700" : "border-red-500 bg-red-50 text-red-700")
                          : "border-brand-denim/10 focus:border-brand-prussian text-brand-dusk"
                      )}
                      onChange={(e) => setMatchingResults(prev => ({ ...prev, [pair.left]: e.target.value }))}
                    >
                      <option value="">Select match...</option>
                      {question.matchingPairs?.map(p => (
                        <option key={p.right} value={p.right}>{p.right}</option>
                      ))}
                    </select>
                    {showFeedback && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {isItemCorrect ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-red-600" />}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {showFeedback && !isCorrect && (
               <div className="mt-4 p-4 bg-brand-denim/5 rounded-xl border border-brand-denim/10 text-xs">
                  <div className="font-bold text-brand-prussian mb-2 uppercase tracking-widest">Correct Matches:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {question.matchingPairs?.map(p => (
                      <div key={p.left} className="flex gap-2">
                        <span className="text-brand-denim">• {p.left}:</span>
                        <span className="text-brand-ink font-bold">{p.right}</span>
                      </div>
                    ))}
                  </div>
               </div>
            )}
          </div>
        );

      default:
        return <div>Question type not implemented yet.</div>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-brand-denim/10 overflow-hidden"
    >
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <span className="px-3 py-1 bg-brand-denim/10 text-brand-prussian text-[10px] md:text-xs font-bold rounded-full uppercase tracking-wider">
            {question.topic}
          </span>
          <span className={cn(
             "px-3 py-1 text-[10px] md:text-xs font-bold rounded-full uppercase tracking-wider border",
             question.difficulty === 'easy' ? "bg-green-100 text-green-700 border-green-200" :
             question.difficulty === 'medium' ? "bg-brand-denim/5 text-brand-dusk border-brand-denim/20" : "bg-red-100 text-red-700 border-red-200"
          )}>
            {question.difficulty}
          </span>
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-brand-ink mb-8 leading-tight">
          {question.prompt}
        </h2>

        {renderQuestionType()}

        {!showFeedback && (
          <div className="mt-8 flex justify-end">
            <button
              id="submit-answer-btn"
              onClick={() => handleSubmit(question.type === QuestionType.FILL_IN_BLANK ? fillValue : selected)}
              disabled={isSubmitDisabled()}
              className="w-full md:w-auto px-8 py-3 bg-brand-prussian text-brand-alabaster rounded-xl font-bold hover:bg-brand-ink disabled:opacity-50 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-brand-ink/10"
            >
              Submit Answer
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-8 pt-8 border-t border-brand-denim/10"
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "p-3 rounded-2xl",
                  isCorrect ? "bg-green-500" : "bg-red-500"
                )}>
                  {isCorrect ? <Check className="w-6 h-6 text-white" /> : <X className="w-6 h-6 text-white" />}
                </div>
                <div>
                   <h3 className={cn("text-lg font-bold mb-1", isCorrect ? "text-green-700" : "text-red-700")}>
                    {isCorrect ? "Correct!" : "Keep learning!"}
                  </h3>
                  <p className="text-brand-dusk leading-relaxed">
                    {question.feedback}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
