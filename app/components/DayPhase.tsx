'use client';

import { useState, useEffect } from 'react';
import { GameState, GameAction } from '@/lib/types';

interface DayPhaseProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export default function DayPhase({ state, dispatch }: DayPhaseProps) {
  const [timeLeft, setTimeLeft] = useState(state.settings.discussionTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const lastHistory = state.history[state.history.length - 1];
  const killedPlayer = lastHistory?.nightKilled 
    ? state.players.find(p => p.id === lastHistory.nightKilled)
    : null;

  const alivePlayers = state.players.filter(p => p.alive);
  const deadPlayers = state.players.filter(p => !p.alive);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const policeResult = state.nightActions.policeCheckId 
    ? state.players.find(p => p.id === state.nightActions.policeCheckId)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900 p-3 sm:p-4 pb-16 sm:pb-20">
      <div className="max-w-2xl mx-auto pt-4 sm:pt-8">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-amber-700/50">
            <i className="ri-sun-line flex items-center justify-center text-amber-500 text-3xl sm:text-4xl"></i>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-amber-100 mb-2">낮 - {state.currentRound}라운드</h2>
          <p className="text-sm sm:text-base text-gray-400">토론 시간입니다</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-700/50">
          <h3 className="text-base sm:text-lg font-bold text-gray-100 mb-3 sm:mb-4 flex items-center">
            <i className="ri-information-line w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center mr-2 text-blue-400"></i>
            밤 결과
          </h3>
          
          {lastHistory?.saved ? (
            <div className="bg-green-900/30 border-2 border-green-700/50 rounded-xl p-4 mb-4">
              <p className="text-green-300 font-semibold text-center">
                <i className="ri-heart-pulse-line w-5 h-5 flex items-center justify-center mr-2 inline-block"></i>
                의사가 누군가를 살렸습니다!
              </p>
              <p className="text-green-400 text-center mt-2">아무도 죽지 않았습니다</p>
            </div>
          ) : killedPlayer ? (
            <div className="bg-red-900/30 border-2 border-red-700/50 rounded-xl p-4 mb-4">
              <p className="text-red-300 font-semibold text-center">
                <i className="ri-skull-line w-5 h-5 flex items-center justify-center mr-2 inline-block"></i>
                {killedPlayer.name}님이 마피아에게 제거되었습니다
              </p>
            </div>
          ) : (
            <div className="bg-gray-700/30 border-2 border-gray-600/50 rounded-xl p-4 mb-4">
              <p className="text-gray-300 text-center">아무도 죽지 않았습니다</p>
            </div>
          )}

          {policeResult && state.players.find(p => p.role === 'police' && p.alive) && (
            <div className="bg-blue-900/30 border-2 border-blue-700/50 rounded-xl p-3 sm:p-4">
              <p className="text-blue-300 font-semibold text-xs sm:text-sm mb-2">
                <i className="ri-shield-star-line w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center mr-1 inline-block"></i>
                경찰 조사 결과 (경찰만 확인)
              </p>
              <p className="text-sm sm:text-base text-blue-200">
                {policeResult.name}님은 
                <span className={state.nightActions.policeCheckResult ? 'text-red-400 font-bold' : 'text-green-400 font-bold'}>
                  {state.nightActions.policeCheckResult ? ' 마피아입니다' : ' 마피아가 아닙니다'}
                </span>
              </p>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-purple-700/50">
          <div className="text-center">
            <p className="text-xs sm:text-sm text-purple-300 mb-2">남은 토론 시간</p>
            <p className="text-4xl sm:text-5xl font-bold mb-2 text-purple-100">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </p>
            <div className="w-full bg-gray-700/50 rounded-full h-2 mt-4">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(timeLeft / state.settings.discussionTime) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-700/50">
          <h3 className="text-base sm:text-lg font-bold text-gray-100 mb-3 sm:mb-4 flex items-center">
            <i className="ri-user-line w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center mr-2 text-green-400"></i>
            생존자 ({alivePlayers.length}명)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {alivePlayers.map(player => (
              <div key={player.id} className="bg-green-900/20 border border-green-700/50 rounded-xl p-2 sm:p-3 text-center">
                <p className="font-semibold text-sm sm:text-base text-green-200">{player.name}</p>
              </div>
            ))}
          </div>
        </div>

        {deadPlayers.length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-700/50">
            <h3 className="text-base sm:text-lg font-bold text-gray-100 mb-3 sm:mb-4 flex items-center">
              <i className="ri-ghost-line w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center mr-2 text-gray-500"></i>
              사망자 ({deadPlayers.length}명)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {deadPlayers.map(player => (
                <div key={player.id} className="bg-gray-700/30 border border-gray-600/50 rounded-xl p-2 sm:p-3 text-center opacity-60">
                  <p className="font-semibold text-sm sm:text-base text-gray-500 line-through">{player.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => dispatch({ type: 'START_VOTE' })}
          className="w-full py-3 sm:py-4 bg-gradient-to-r from-red-700 to-red-900 text-white rounded-xl font-bold text-base sm:text-lg hover:from-red-800 hover:to-red-950 transition-all shadow-lg whitespace-nowrap cursor-pointer border border-red-600/50"
        >
          투표 시작하기
        </button>
      </div>
    </div>
  );
}