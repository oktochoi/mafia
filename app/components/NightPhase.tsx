
'use client';

import { useState } from 'react';
import { GameState, GameAction } from '@/lib/types';

interface NightPhaseProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export default function NightPhase({ state, dispatch }: NightPhaseProps) {
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);

  const alivePlayers = state.players.filter(p => p.alive);

  const handleNext = () => {
    if (state.nightStep === 'mafia' && selectedTarget) {
      dispatch({ type: 'SET_MAFIA_TARGET', targetId: selectedTarget });
    } else if (state.nightStep === 'doctor' && selectedTarget) {
      dispatch({ type: 'SET_DOCTOR_SAVE', targetId: selectedTarget });
    } else if (state.nightStep === 'police' && selectedTarget) {
      dispatch({ type: 'SET_POLICE_CHECK', targetId: selectedTarget });
    }

    setSelectedTarget(null);
    
    if (state.nightStep === 'done') {
      dispatch({ type: 'START_DAY' });
    } else {
      dispatch({ type: 'NEXT_NIGHT_STEP' });
    }
  };

  const renderIntro = () => (
    <div className="text-center">
      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
        <i className="ri-moon-line flex items-center justify-center text-indigo-200 text-3xl sm:text-4xl md:text-5xl"></i>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">밤이 되었습니다</h2>
      <p className="text-indigo-200 text-base sm:text-lg mb-6 sm:mb-8">모두 눈을 감아주세요</p>
      <button
        onClick={handleNext}
        className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-indigo-900 rounded-xl font-bold text-base sm:text-lg hover:bg-indigo-50 transition-all shadow-lg whitespace-nowrap cursor-pointer"
      >
        시작하기
      </button>
    </div>
  );

  const renderMafiaStep = () => {
    const mafiaPlayers = state.players.filter(p => p.role === 'mafia' && p.alive);
    const targets = alivePlayers.filter(p => p.role !== 'mafia');

    return (
      <div>
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <i className="ri-skull-line flex items-center justify-center text-red-200 text-3xl sm:text-4xl"></i>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">마피아 차례</h2>
          <p className="text-sm sm:text-base text-red-200">제거할 대상을 선택하세요</p>
          <div className="mt-3 sm:mt-4 text-red-300 text-xs sm:text-sm">
            마피아: {mafiaPlayers.map(p => p.name).join(', ')}
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
          {targets.map(player => (
            <button
              key={player.id}
              onClick={() => setSelectedTarget(player.id)}
              className={`w-full p-3 sm:p-4 rounded-xl font-semibold text-base sm:text-lg transition-all cursor-pointer whitespace-nowrap ${
                selectedTarget === player.id
                  ? 'bg-red-600 text-white shadow-lg scale-105'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {player.name}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={!selectedTarget}
          className="w-full py-3 sm:py-4 bg-white text-indigo-900 rounded-xl font-bold text-base sm:text-lg hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg whitespace-nowrap cursor-pointer"
        >
          선택 완료
        </button>
      </div>
    );
  };

  const renderDoctorStep = () => {
    const doctorPlayer = state.players.find(p => p.role === 'doctor' && p.alive);
    
    if (!doctorPlayer) {
      handleNext();
      return null;
    }

    return (
      <div>
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <i className="ri-heart-pulse-line flex items-center justify-center text-green-200 text-3xl sm:text-4xl"></i>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">의사 차례</h2>
          <p className="text-sm sm:text-base text-green-200">살릴 대상을 선택하세요</p>
          <div className="mt-3 sm:mt-4 text-green-300 text-xs sm:text-sm">
            의사: {doctorPlayer.name}
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
          {alivePlayers.map(player => (
            <button
              key={player.id}
              onClick={() => setSelectedTarget(player.id)}
              className={`w-full p-3 sm:p-4 rounded-xl font-semibold text-base sm:text-lg transition-all cursor-pointer whitespace-nowrap ${
                selectedTarget === player.id
                  ? 'bg-green-600 text-white shadow-lg scale-105'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {player.name}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={!selectedTarget}
          className="w-full py-3 sm:py-4 bg-white text-indigo-900 rounded-xl font-bold text-base sm:text-lg hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg whitespace-nowrap cursor-pointer"
        >
          선택 완료
        </button>
      </div>
    );
  };

  const renderPoliceStep = () => {
    const policePlayer = state.players.find(p => p.role === 'police' && p.alive);
    
    if (!policePlayer) {
      handleNext();
      return null;
    }

    const targets = alivePlayers.filter(p => p.role !== 'police');

    return (
      <div>
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <i className="ri-shield-star-line flex items-center justify-center text-blue-200 text-3xl sm:text-4xl"></i>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">경찰 차례</h2>
          <p className="text-sm sm:text-base text-blue-200">조사할 대상을 선택하세요</p>
          <div className="mt-3 sm:mt-4 text-blue-300 text-xs sm:text-sm">
            경찰: {policePlayer.name}
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
          {targets.map(player => (
            <button
              key={player.id}
              onClick={() => setSelectedTarget(player.id)}
              className={`w-full p-3 sm:p-4 rounded-xl font-semibold text-base sm:text-lg transition-all cursor-pointer whitespace-nowrap ${
                selectedTarget === player.id
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {player.name}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={!selectedTarget}
          className="w-full py-3 sm:py-4 bg-white text-indigo-900 rounded-xl font-bold text-base sm:text-lg hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg whitespace-nowrap cursor-pointer"
        >
          조사 완료
        </button>
      </div>
    );
  };

  const renderDone = () => (
    <div className="text-center">
      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
        <i className="ri-sun-line flex items-center justify-center text-yellow-200 text-3xl sm:text-4xl md:text-5xl"></i>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">밤이 지나갑니다</h2>
      <p className="text-indigo-200 text-base sm:text-lg mb-6 sm:mb-8">아침이 밝았습니다</p>
      <button
        onClick={handleNext}
        className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-indigo-900 rounded-xl font-bold text-base sm:text-lg hover:bg-indigo-50 transition-all shadow-lg whitespace-nowrap cursor-pointer"
      >
        낮으로 이동
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-gray-900 p-3 sm:p-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="bg-indigo-900/30 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 border border-indigo-800/50">
          {state.nightStep === 'intro' && renderIntro()}
          {state.nightStep === 'mafia' && renderMafiaStep()}
          {state.nightStep === 'doctor' && renderDoctorStep()}
          {state.nightStep === 'police' && renderPoliceStep()}
          {state.nightStep === 'done' && renderDone()}
        </div>
      </div>
    </div>
  );
}
