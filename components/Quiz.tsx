
import React, { useState } from 'react';
import { generateQuiz } from '../services/geminiService';
import { UserProfile, QuizQuestion, Subject } from '../types';

interface QuizProps {
  user: UserProfile;
}

const Quiz: React.FC<QuizProps> = ({ user }) => {
  const [subject, setSubject] = useState<Subject>('Mathematics');
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const startQuiz = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    try {
      const q = await generateQuiz(topic, user.standard, subject);
      setQuestions(q);
      setCurrentIndex(0);
      setScore(0);
      setIsFinished(false);
      setShowExplanation(false);
    } catch (e) {
      alert("Failed to generate quiz. Try again!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionSelect = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    setShowExplanation(true);
    if (idx === questions[currentIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      {!questions.length || isFinished ? (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center">
          {isFinished ? (
            <>
              <div className="text-6xl mb-6">🏆</div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Quiz Completed!</h3>
              <p className="text-slate-500 mb-6">You scored {score} out of {questions.length}</p>
              <div className="flex gap-4 justify-center">
                 <button onClick={() => setQuestions([])} className="bg-slate-100 text-slate-600 px-6 py-2 rounded-full font-bold">Try Another Topic</button>
                 <button onClick={startQuiz} className="bg-indigo-600 text-white px-6 py-2 rounded-full font-bold">Retake This Quiz</button>
              </div>
            </>
          ) : (
            <>
              <div className="text-5xl mb-6">📝</div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Topic Quiz Generator</h3>
              <p className="text-slate-500 mb-8">Test your knowledge on any topic from your syllabus.</p>
              
              <div className="space-y-4 max-w-sm mx-auto">
                <select 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value as Subject)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                >
                  <option>Mathematics</option>
                  <option>Science</option>
                  <option>Social Science</option>
                </select>
                <input
                  type="text"
                  placeholder="Enter topic (e.g., Photosynthesis)"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={startQuiz}
                  disabled={isLoading || !topic.trim()}
                  className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all"
                >
                  {isLoading ? 'Generating Questions...' : 'Start Quiz'}
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 bg-indigo-600 text-white flex justify-between items-center">
            <span className="font-bold">Question {currentIndex + 1} / {questions.length}</span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs">Score: {score}</span>
          </div>
          <div className="p-8">
            <h4 className="text-xl font-bold text-slate-800 mb-8">{questions[currentIndex].question}</h4>
            <div className="grid gap-4">
              {questions[currentIndex].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleOptionSelect(i)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    selectedOption === i 
                      ? (i === questions[currentIndex].correctAnswer ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500')
                      : (selectedOption !== null && i === questions[currentIndex].correctAnswer ? 'bg-green-100 border-green-500' : 'hover:bg-slate-50 border-slate-200')
                  }`}
                >
                  <span className="inline-block w-8 h-8 rounded-full bg-slate-100 text-center leading-8 mr-4 text-sm font-bold text-slate-500">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>

            {showExplanation && (
              <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-2xl">
                <p className="text-blue-800 font-bold mb-1">Explanation:</p>
                <p className="text-blue-700 text-sm leading-relaxed">{questions[currentIndex].explanation}</p>
                <button
                  onClick={nextQuestion}
                  className="mt-6 w-full bg-indigo-600 text-white p-3 rounded-xl font-bold hover:bg-indigo-700"
                >
                  {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
