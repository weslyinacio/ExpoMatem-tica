import React, { useEffect } from 'react';
import { Trophy, Home, Clock, Target } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResultScreenProps {
  score: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  playerName: string;
  onHome: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ 
  score, 
  totalQuestions, 
  timeSpentSeconds, 
  playerName,
  onHome 
}) => {

  useEffect(() => {
    if (score > 5) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    }
  }, [score]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const percentage = (score / totalQuestions) * 100;
  let message = '';
  let colorClass = '';

  if (percentage === 100) {
    message = 'Perfeito! Você é um gênio da matemática!';
    colorClass = 'text-green-600';
  } else if (percentage >= 70) {
    message = 'Excelente trabalho! Continue assim!';
    colorClass = 'text-indigo-600';
  } else if (percentage >= 50) {
    message = 'Bom esforço! Mas dá para melhorar.';
    colorClass = 'text-yellow-600';
  } else {
    message = 'Não desista! A prática leva à perfeição.';
    colorClass = 'text-red-600';
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-full h-2 ${
            percentage >= 70 ? 'bg-green-500' : percentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'
        }`}></div>

        <div className="mb-6 inline-flex p-4 rounded-full bg-indigo-50">
            <Trophy className="w-16 h-16 text-indigo-600" />
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-2">Resultado Final</h2>
        <p className="text-gray-500 mb-6 font-medium">Jogador: {playerName}</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-indigo-50 rounded-2xl p-4 flex flex-col items-center">
                <span className="text-indigo-400 mb-2"><Target className="w-6 h-6"/></span>
                <span className="text-3xl font-bold text-indigo-700">{score}/{totalQuestions}</span>
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wide">Acertos</span>
            </div>
            <div className="bg-purple-50 rounded-2xl p-4 flex flex-col items-center">
                <span className="text-purple-400 mb-2"><Clock className="w-6 h-6"/></span>
                <span className="text-3xl font-bold text-purple-700">{formatTime(timeSpentSeconds)}</span>
                <span className="text-xs font-semibold text-purple-400 uppercase tracking-wide">Tempo</span>
            </div>
        </div>

        <p className={`text-lg font-bold mb-8 ${colorClass}`}>
            {message}
        </p>

        <div className="flex flex-col gap-3">
            <button 
                onClick={onHome}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
                <Home className="w-5 h-5" />
                Voltar ao Início
            </button>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;