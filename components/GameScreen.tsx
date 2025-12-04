import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { Clock, Flag, CheckCircle2, ArrowRight, AlertTriangle } from 'lucide-react';

interface GameScreenProps {
  playerName: string;
  questions: Question[];
  onFinish: (score: number, timeSpent: number) => void;
}

// 10 minutes = 10 * 60 seconds
const TOTAL_TIME_SECONDS = 10 * 60;

const GameScreen: React.FC<GameScreenProps> = ({ playerName, questions, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME_SECONDS);
  const [showGiveUpModal, setShowGiveUpModal] = useState(false);

  // Timer logic - Separate interval from completion check to avoid stale closures
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Check for time out
  useEffect(() => {
    if (timeLeft === 0) {
        handleFinish(true);
    }
  }, [timeLeft]);

  const handleFinish = (timeOut = false) => {
    const timeSpent = TOTAL_TIME_SECONDS - (timeOut ? 0 : timeLeft);
    onFinish(score, timeSpent);
  };

  const handleOptionClick = (option: number) => {
    setSelectedOption(option);
  };

  const submitAnswer = () => {
    if (selectedOption === null) return;

    const correct = selectedOption === questions[currentIndex].answer;
    
    // Calculate next score
    let nextScore = score;
    if (correct) {
      nextScore = score + 1;
      setScore(nextScore);
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null); // Reset selection
    } else {
      // Last question
      const timeSpent = TOTAL_TIME_SECONDS - timeLeft;
      onFinish(nextScore, timeSpent);
    }
  };

  // Triggered by button
  const handleGiveUpClick = () => {
    setShowGiveUpModal(true);
  };

  const confirmGiveUp = () => {
    const timeSpent = TOTAL_TIME_SECONDS - timeLeft;
    onFinish(0, timeSpent); // Rules: Score 0, keep time
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentIndex];
  const progressPercent = ((currentIndex) / questions.length) * 100;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 relative">
      {/* Give Up Modal */}
      {showGiveUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                <div className="flex flex-col items-center text-center">
                    <div className="bg-red-100 p-3 rounded-full mb-4">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Desistir do jogo?</h3>
                    <p className="text-gray-500 mb-6 text-sm">
                        Sua pontuação será zerada e o tempo atual será registrado no ranking.
                    </p>
                    <div className="flex w-full gap-3">
                        <button 
                            onClick={() => setShowGiveUpModal(false)}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-xl transition-colors"
                        >
                            Continuar
                        </button>
                        <button 
                            onClick={confirmGiveUp}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg shadow-red-200"
                        >
                            Desistir
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="w-full bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
            <div className="bg-indigo-100 text-indigo-700 font-bold px-3 py-1 rounded-full text-sm">
                {playerName}
            </div>
        </div>
        
        <div className={`flex items-center gap-2 font-mono text-xl font-bold ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-gray-700'}`}>
          <Clock className="w-6 h-6" />
          {formatTime(timeLeft)}
        </div>
        
        <button 
          onClick={handleGiveUpClick}
          className="flex items-center gap-1 text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors text-sm font-semibold"
        >
          <Flag className="w-4 h-4" />
          <span className="hidden sm:inline">Desistir</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200">
        <div 
          className="h-full bg-indigo-600 transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Game Area */}
      <div className="flex-1 w-full max-w-3xl p-4 flex flex-col items-center justify-center">
        <div className="bg-white w-full rounded-2xl shadow-xl p-6 md:p-10 border-b-4 border-indigo-200">
          
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-400 font-bold uppercase tracking-wider text-xs">
              Questão {currentIndex + 1} de {questions.length}
            </span>
            <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                currentQuestion.type === 'ADD' ? 'bg-blue-100 text-blue-700' :
                currentQuestion.type === 'SUB' ? 'bg-orange-100 text-orange-700' :
                currentQuestion.type === 'MULT' ? 'bg-purple-100 text-purple-700' :
                'bg-green-100 text-green-700'
            }`}>
                {currentQuestion.type === 'ADD' ? 'Adição' : 
                 currentQuestion.type === 'SUB' ? 'Subtração' :
                 currentQuestion.type === 'MULT' ? 'Multiplicação' : 'Divisão'}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 leading-snug">
            {currentQuestion.text}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {currentQuestion.options.map((option, idx) => (
                <button
                    key={idx}
                    onClick={() => handleOptionClick(option)}
                    className={`
                        p-6 text-xl rounded-xl font-bold border-2 transition-all shadow-sm
                        ${selectedOption === option 
                            ? 'bg-indigo-600 text-white border-indigo-600 scale-[1.02] shadow-md ring-4 ring-indigo-200' 
                            : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'}
                    `}
                >
                    {option}
                </button>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={submitAnswer}
              disabled={selectedOption === null}
              className={`
                rounded-xl px-8 py-4 font-bold text-lg shadow-lg flex items-center gap-2 transition-all
                ${selectedOption === null 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-xl hover:translate-y-[-2px] active:translate-y-[0px]'}
              `}
            >
              <span>{currentIndex === questions.length - 1 ? 'Finalizar' : 'Confirmar e Próxima'}</span>
              {currentIndex === questions.length - 1 ? <CheckCircle2 className="w-6 h-6" /> : <ArrowRight className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GameScreen;