export type OperationType = 'ADD' | 'SUB' | 'MULT' | 'DIV';

export interface Question {
  id: string;
  type: OperationType;
  text: string;
  answer: number;
  options: number[]; // Added for multiple choice
}

export interface PlayerRecord {
  id: string;
  name: string;
  score: number; // 0-10
  timeSpentSeconds: number;
  timestamp: number;
}

export enum GameStage {
  START = 'START',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED',
  LEADERBOARD = 'LEADERBOARD',
}

export interface GameState {
  stage: GameStage;
  playerName: string;
  currentQuestions: Question[];
  currentQuestionIndex: number;
  score: number;
  startTime: number;
  finalTimeSeconds: number;
}