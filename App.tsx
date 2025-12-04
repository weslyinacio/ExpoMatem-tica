import React, { useState, useEffect } from 'react';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';
import Leaderboard from './components/Leaderboard';
import { GameStage, PlayerRecord, Question } from './types';
import { getRandomQuestions } from './services/questionBank';

const App: React.FC = () => {
  const [stage, setStage] = useState<GameStage>(GameStage.START);
  const [playerName, setPlayerName] = useState('');
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [lastScore, setLastScore] = useState(0);
  const [lastTimeSpent, setLastTimeSpent] = useState(0);
  const [leaderboard, setLeaderboard] = useState<PlayerRecord[]>([]);

  // Load leaderboard from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('expomatematica_leaderboard');
    if (saved) {
      try {
        setLeaderboard(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse leaderboard", e);
      }
    }
  }, []);

  const saveToLeaderboard = (name: string, score: number, time: number) => {
    const newRecord: PlayerRecord = {
      id: Date.now().toString(),
      name,
      score,
      timeSpentSeconds: time,
      timestamp: Date.now(),
    };
    
    const updated = [...leaderboard, newRecord];
    setLeaderboard(updated);
    localStorage.setItem('expomatematica_leaderboard', JSON.stringify(updated));
  };

  const handleStartGame = (name: string) => {
    setPlayerName(name);
    setCurrentQuestions(getRandomQuestions());
    setStage(GameStage.PLAYING);
  };

  const handleGameFinish = (score: number, timeSpent: number) => {
    setLastScore(score);
    setLastTimeSpent(timeSpent);
    saveToLeaderboard(playerName, score, timeSpent);
    setStage(GameStage.FINISHED);
  };

  const handleGoHome = () => {
    setPlayerName('');
    setStage(GameStage.START);
  };

  return (
    <>
      {stage === GameStage.START && (
        <StartScreen 
            onStart={handleStartGame} 
            onShowLeaderboard={() => setStage(GameStage.LEADERBOARD)}
        />
      )}

      {stage === GameStage.PLAYING && (
        <GameScreen 
            playerName={playerName} 
            questions={currentQuestions} 
            onFinish={handleGameFinish} 
        />
      )}

      {stage === GameStage.FINISHED && (
        <ResultScreen
            score={lastScore}
            totalQuestions={10}
            timeSpentSeconds={lastTimeSpent}
            playerName={playerName}
            onHome={handleGoHome}
        />
      )}

      {stage === GameStage.LEADERBOARD && (
        <Leaderboard 
            records={leaderboard} 
            onBack={() => setStage(GameStage.START)} 
        />
      )}
    </>
  );
};

export default App;