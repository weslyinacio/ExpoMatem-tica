import React, { useState } from 'react';
import { Play, Brain } from 'lucide-react';

interface StartScreenProps {
  onStart: (name: string) => void;
  onShowLeaderboard: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, onShowLeaderboard }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor, digite seu nome para começar.');
      return;
    }
    onStart(name.trim());
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-lg w-full text-center relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-yellow-300 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-blue-300 rounded-full opacity-20 blur-xl"></div>

        <div className="flex justify-center mb-6 relative z-10">
          {/* 
            NOTE: For this to work, place the image file named 'logo.png' in your public folder.
            The 'mix-blend-multiply' class makes the white background of the image transparent 
            against the white background of this card, or interacts interesting with colors.
            If the card is white, multiply treats white as transparent.
           */}
          <img 
            src="logo.png" 
            alt="ExpoMatemática 2025" 
            className="w-64 md:w-80 object-contain hover:scale-105 transition-transform duration-300 mix-blend-multiply"
            onError={(e) => {
              // Fallback if image not found during dev
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML += '<h1 class="text-3xl font-bold text-gray-800">ExpoMatemática 2025</h1>';
            }}
          />
        </div>

        <p className="text-gray-500 mb-8 font-medium">
          Teste sua agilidade mental com problemas do cotidiano!
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
          <div className="text-left">
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
              Nome do Jogador
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 rounded-xl border-2 border-indigo-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none text-lg"
              placeholder="Ex: João Silva"
              autoComplete="off"
            />
            {error && <p className="text-red-500 text-sm mt-1 ml-1">{error}</p>}
          </div>

          <button
            type="submit"
            className="group mt-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-2"
          >
            <span>Iniciar Desafio</span>
            <Play className="w-5 h-5 fill-current" />
          </button>
        </form>

        <button
          onClick={onShowLeaderboard}
          className="mt-6 text-indigo-600 hover:text-indigo-800 font-semibold text-sm underline underline-offset-2 relative z-10"
        >
          Ver Ranking
        </button>

        <div className="mt-8 grid grid-cols-2 gap-4 text-xs text-gray-400 border-t border-gray-100 pt-6 relative z-10">
            <div className="flex flex-col items-center">
                <Brain className="w-5 h-5 mb-1" />
                <span>Raciocínio Rápido</span>
            </div>
            <div className="flex flex-col items-center">
                <span className="font-bold text-lg text-gray-600">10:00</span>
                <span>Tempo Limite</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;