'use client';

import { GameState, GameAction } from '@/lib/types';

interface ResultPhaseProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export default function ResultPhase({ state, dispatch }: ResultPhaseProps) {
  const isMafiaWin = state.winner === 'mafia';
  const alivePlayers = state.players.filter(p => p.alive);
  const mafiaPlayers = state.players.filter(p => p.role === 'mafia');
  const aliveMafia = mafiaPlayers.filter(p => p.alive);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900 p-3 sm:p-4 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 border border-gray-700/50">
          <div className="text-center mb-6 sm:mb-8">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 border-2 ${
              isMafiaWin ? 'bg-red-900/30 border-red-700/50' : 'bg-green-900/30 border-green-700/50'
            }`}>
              <i className={`flex items-center justify-center text-3xl sm:text-4xl md:text-5xl ${
                isMafiaWin 
                  ? 'ri-skull-line text-red-400' 
                  : 'ri-trophy-line text-green-400'
              }`}></i>
            </div>
            
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 ${
              isMafiaWin ? 'text-red-400' : 'text-green-400'
            }`}>
              {isMafiaWin ? '마피아 승리!' : '시민 승리!'}
            </h2>
            
            <p className="text-sm sm:text-base md:text-lg text-gray-400">
              {isMafiaWin 
                ? '마피아가 마을을 장악했습니다' 
                : '모든 마피아를 제거했습니다'}
            </p>
          </div>

          <div className="bg-gray-700/30 border border-gray-600/50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-bold text-gray-100 mb-3 sm:mb-4 text-center">게임 통계</h3>
            
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="bg-gray-800/50 border border-gray-600/50 rounded-lg p-3 sm:p-4 text-center">
                <p className="text-xs sm:text-sm text-gray-400 mb-1">총 라운드</p>
                <p className="text-2xl sm:text-3xl font-bold text-indigo-400">{state.currentRound}</p>
              </div>
              <div className="bg-gray-800/50 border border-gray-600/50 rounded-lg p-3 sm:p-4 text-center">
                <p className="text-xs sm:text-sm text-gray-400 mb-1">생존자</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-400">{alivePlayers.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-red-900/20 border-2 border-red-700/50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-bold text-red-300 mb-3 sm:mb-4 flex items-center">
              <i className="ri-skull-line w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center mr-2"></i>
              마피아 명단
            </h3>
            <div className="space-y-2">
              {mafiaPlayers.map(player => (
                <div 
                  key={player.id} 
                  className={`p-2 sm:p-3 rounded-lg border ${
                    player.alive 
                      ? 'bg-red-900/30 border-red-700/50 text-red-200' 
                      : 'bg-gray-700/30 border-gray-600/50 text-gray-500 line-through'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm sm:text-base">{player.name}</span>
                    <span className="text-xs sm:text-sm">
                      {player.alive ? '생존' : '사망'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-900/20 border-2 border-blue-700/50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-bold text-blue-300 mb-3 sm:mb-4 flex items-center">
              <i className="ri-team-line w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center mr-2"></i>
              전체 역할 공개
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {state.players.map(player => {
                const roleInfo = {
                  mafia: { icon: 'ri-skull-line', color: 'text-red-400', bg: 'bg-red-900/20', border: 'border-red-700/50', label: '마피아' },
                  doctor: { icon: 'ri-heart-pulse-line', color: 'text-green-400', bg: 'bg-green-900/20', border: 'border-green-700/50', label: '의사' },
                  police: { icon: 'ri-shield-star-line', color: 'text-blue-400', bg: 'bg-blue-900/20', border: 'border-blue-700/50', label: '경찰' },
                  citizen: { icon: 'ri-user-smile-line', color: 'text-gray-400', bg: 'bg-gray-700/20', border: 'border-gray-600/50', label: '시민' },
                }[player.role || 'citizen'];

                return (
                  <div 
                    key={player.id} 
                    className={`p-2 sm:p-3 rounded-lg border ${
                      player.alive 
                        ? `${roleInfo.bg} ${roleInfo.border}` 
                        : 'bg-gray-700/20 border-gray-600/50 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <i className={`${roleInfo.icon} w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center ${roleInfo.color}`}></i>
                      <span className={`font-semibold text-xs sm:text-sm ${player.alive ? 'text-gray-200' : 'text-gray-500 line-through'}`}>
                        {player.name}
                      </span>
                    </div>
                    <p className={`text-xs ${roleInfo.color}`}>{roleInfo.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => dispatch({ type: 'NEW_GAME' })}
              className="w-full py-3 sm:py-4 bg-gradient-to-r from-indigo-700 to-purple-800 text-white rounded-xl font-bold text-base sm:text-lg hover:from-indigo-800 hover:to-purple-900 transition-all shadow-lg whitespace-nowrap cursor-pointer border border-indigo-600/50"
            >
              새 게임 시작
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}