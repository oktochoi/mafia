'use client';

import { useState } from 'react';
import { GameState, GameAction } from '@/lib/types';

interface RevealStepProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export default function RevealStep({ state, dispatch }: RevealStepProps) {
  const [revealed, setRevealed] = useState(false);

  const currentPlayer = state.players[state.currentRevealIndex];

  const handleNext = () => {
    setRevealed(false);
    dispatch({ type: 'NEXT_REVEAL' });
  };

  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'mafia':
        return {
          title: '마피아',
          description: '밤에 시민을 제거하세요',
          icon: 'ri-skull-line',
          color: 'text-red-400',
          bg: 'from-red-900/50 to-red-800/50',
          border: 'border-red-700/50'
        };
      case 'doctor':
        return {
          title: '의사',
          description: '밤에 한 명을 살릴 수 있습니다',
          icon: 'ri-heart-pulse-line',
          color: 'text-green-400',
          bg: 'from-green-900/50 to-green-800/50',
          border: 'border-green-700/50'
        };
      case 'police':
        return {
          title: '경찰',
          description: '밤에 한 명을 조사할 수 있습니다',
          icon: 'ri-shield-star-line',
          color: 'text-blue-400',
          bg: 'from-blue-900/50 to-blue-800/50',
          border: 'border-blue-700/50'
        };
      default:
        return {
          title: '시민',
          description: '마피아를 찾아내세요',
          icon: 'ri-user-smile-line',
          color: 'text-gray-400',
          bg: 'from-gray-800/50 to-gray-700/50',
          border: 'border-gray-600/50'
        };
    }
  };

  if (!currentPlayer) {
    return null;
  }

  const roleInfo = getRoleInfo(currentPlayer.role || 'citizen');

  if (!revealed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900 p-3 sm:p-4 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 text-center border border-gray-700/50">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 border border-indigo-700/50">
              <i className="ri-eye-off-line flex items-center justify-center text-indigo-400 text-3xl sm:text-4xl"></i>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-bold text-indigo-100 mb-3 sm:mb-4">역할 확인</h2>
            <p className="text-sm sm:text-base text-gray-400 mb-2">다음 플레이어</p>
            <p className="text-2xl sm:text-3xl font-bold text-indigo-200 mb-6 sm:mb-8">{currentPlayer.name}</p>
            
            <div className="bg-amber-900/20 border border-amber-700/50 rounded-xl p-3 sm:p-4 mb-6 sm:mb-8">
              <p className="text-amber-300 text-xs sm:text-sm">
                <i className="ri-information-line w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center mr-1 inline-block"></i>
                다른 사람이 보지 않도록 주의하세요
              </p>
            </div>

            <button
              onClick={() => setRevealed(true)}
              className="w-full py-3 sm:py-4 bg-gradient-to-r from-indigo-700 to-purple-800 text-white rounded-xl font-bold text-base sm:text-lg hover:from-indigo-800 hover:to-purple-900 transition-all shadow-lg whitespace-nowrap cursor-pointer border border-indigo-600/50"
            >
              역할 확인하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900 p-3 sm:p-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className={`bg-gradient-to-br ${roleInfo.bg} backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 text-center border ${roleInfo.border}`}>
          <div className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gray-900/30 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 border ${roleInfo.border}`}>
            <i className={`${roleInfo.icon} flex items-center justify-center ${roleInfo.color} text-3xl sm:text-4xl md:text-5xl`}></i>
          </div>
          
          <p className="text-sm sm:text-base text-gray-300 mb-2">{currentPlayer.name}님의 역할</p>
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 ${roleInfo.color}`}>{roleInfo.title}</h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-6 sm:mb-8">{roleInfo.description}</p>

          {currentPlayer.role === 'mafia' && (
            <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
              <p className="text-red-300 text-xs sm:text-sm font-semibold mb-2">동료 마피아</p>
              <p className="text-sm sm:text-base text-red-200">
                {state.players
                  .filter(p => p.role === 'mafia' && p.id !== currentPlayer.id)
                  .map(p => p.name)
                  .join(', ') || '없음'}
              </p>
            </div>
          )}

          <button
            onClick={handleNext}
            className="w-full py-3 sm:py-4 bg-gray-800 text-gray-200 rounded-xl font-bold text-base sm:text-lg hover:bg-gray-700 transition-all shadow-lg whitespace-nowrap cursor-pointer border border-gray-600/50"
          >
            {state.currentRevealIndex < state.players.length - 1 ? '다음 플레이어' : '게임 시작'}
          </button>
        </div>
      </div>
    </div>
  );
}