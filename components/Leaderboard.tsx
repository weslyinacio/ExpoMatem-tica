import React from 'react';
import { PlayerRecord } from '../types';
import { Trophy, ArrowLeft, Clock, Medal } from 'lucide-react';

interface LeaderboardProps {
  records: PlayerRecord[];
  onBack: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ records, onBack }) => {
  // Sort: Highest Score first, then Lowest Time
  const sortedRecords = [...records].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.timeSpentSeconds - b.timeSpentSeconds;
  });

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-indigo-900 p-4 md:p-8 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="bg-indigo-600 p-6 flex items-center justify-between shadow-md z-10">
          <button 
            onClick={onBack}
            className="text-white/80 hover:text-white transition-colors p-2 hover:bg-indigo-500 rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-300 fill-current" />
            <h2 className="text-2xl font-bold text-white tracking-wide">Ranking</h2>
          </div>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {sortedRecords.length === 0 ? (
            <div className="text-center py-20 opacity-50">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-xl text-gray-500 font-medium">Ainda não há recordes!</p>
              <p className="text-sm text-gray-400">Seja o primeiro a jogar.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedRecords.map((record, index) => {
                const isTop3 = index < 3;
                return (
                  <div 
                    key={record.id} 
                    className={`relative flex items-center p-4 rounded-xl border-2 transition-transform hover:scale-[1.01] group ${
                        index === 0 ? 'bg-yellow-50 border-yellow-200' :
                        index === 1 ? 'bg-gray-50 border-gray-200' :
                        index === 2 ? 'bg-orange-50 border-orange-200' :
                        'bg-white border-transparent shadow-sm'
                    }`}
                  >
                    <div className={`
                        flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mr-4
                        ${index === 0 ? 'bg-yellow-400 text-yellow-900' : 
                          index === 1 ? 'bg-gray-300 text-gray-800' : 
                          index === 2 ? 'bg-orange-300 text-orange-900' : 
                          'bg-indigo-100 text-indigo-600'}
                    `}>
                      {index + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 font-bold truncate text-lg">
                        {record.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(record.timestamp).toLocaleDateString('pt-BR')}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 md:gap-6">
                        <div className="text-right">
                            <span className="block text-2xl font-black text-gray-800 leading-none">
                                {record.score}
                                <span className="text-xs font-normal text-gray-400 ml-1">pts</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                            <Clock className="w-3 h-3 text-gray-500" />
                            <span className="text-sm font-mono font-medium text-gray-600">
                                {formatTime(record.timeSpentSeconds)}
                            </span>
                        </div>
                    </div>
                    
                    {isTop3 && (
                        <div className="absolute -top-1 -right-1">
                             <Medal className={`w-6 h-6 ${
                                 index === 0 ? 'text-yellow-500' : 
                                 index === 1 ? 'text-gray-400' : 
                                 'text-orange-500'
                             } fill-current`} />
                        </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;