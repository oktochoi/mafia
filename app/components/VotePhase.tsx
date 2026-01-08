'use client';

import { useState } from 'react';
import { GameState, GameAction } from '@/lib/types';

interface VotePhaseProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export default function VotePhase({ state, dispatch }: VotePhaseProps) {
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);

  const alivePlayers = state.players.filter(p => p.alive);
  const currentVoter = alivePlayers[state.currentVoterIndex];

  const handleVote = () => {
    if (!selectedTarget || !currentVoter) return;

    dispatch({ type: 'CAST_VOTE', voterId: currentVoter.id, targetId: selectedTarget });
    setSelectedTarget(null);

    // 모든 투표가 완료되면 결과 처리
    if (state.votes.length + 1 >= alivePlayers.length) {
      setTimeout(() => {
        dispatch({ type: 'PROCESS_VOTE_RESULT' });
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900 p-3 sm:p-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 border border-gray-700/50">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-orange-700/50">
              <i className="ri-hand-heart-line flex items-center justify-center text-orange-400 text-3xl sm:text-4xl"></i>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-orange-100 mb-2">투표 시간</h2>
            <p className="text-sm sm:text-base text-gray-400 mb-3 sm:mb-4">의심스러운 사람을 선택하세요</p>
            <div className="bg-orange-900/20 border border-orange-700/50 rounded-lg p-2 sm:p-3">
              <p className="text-sm sm:text-base text-orange-300 font-semibold">{currentVoter?.name}님의 차례</p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                {state.currentVoterIndex + 1} / {alivePlayers.length}
              </p>
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
            {alivePlayers
              .filter(p => p.id !== currentVoter?.id)
              .map(player => (
                <button
                  key={player.id}
                  onClick={() => setSelectedTarget(player.id)}
                  className={`w-full p-3 sm:p-4 rounded-xl font-semibold text-base sm:text-lg transition-all cursor-pointer whitespace-nowrap border ${
                    selectedTarget === player.id
                      ? 'bg-red-700 text-white shadow-lg scale-105 border-red-600'
                      : 'bg-gray-700/50 text-gray-200 hover:bg-gray-700 border-gray-600/50'
                  }`}
                >
                  {player.name}
                </button>
              ))}
          </div>

          {currentVoter ? (
            <button
              onClick={handleVote}
              disabled={!selectedTarget}
              className="w-full py-3 sm:py-4 bg-gradient-to-r from-orange-700 to-red-800 text-white rounded-xl font-bold text-base sm:text-lg hover:from-orange-800 hover:to-red-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg whitespace-nowrap cursor-pointer border border-orange-600/50"
            >
              투표하기
            </button>
          ) : (
            <div className="w-full py-3 sm:py-4 bg-gray-700 text-gray-400 rounded-xl font-bold text-base sm:text-lg text-center">
              투표 완료
            </div>
          )}
        </div>
      </div>
    </div>
  );
}