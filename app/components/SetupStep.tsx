'use client';

import { useState } from 'react';
import { GameState, GameAction } from '@/lib/types';

interface SetupStepProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export default function SetupStep({ state, dispatch }: SetupStepProps) {
  const [newPlayerName, setNewPlayerName] = useState('');

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      dispatch({ type: 'ADD_PLAYER', name: newPlayerName.trim() });
      setNewPlayerName('');
    }
  };

  const handleRemovePlayer = (id: string) => {
    dispatch({ type: 'REMOVE_PLAYER', id });
  };

  const handleStartGame = () => {
    if (state.players.length >= 4) {
      dispatch({ type: 'START_GAME' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900 p-3 sm:p-4 pb-16 sm:pb-20">
      <div className="max-w-2xl mx-auto pt-4 sm:pt-8">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-24 sm:h-24 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-red-700/50">
            <i className="ri-skull-line flex items-center justify-center text-red-400 text-3xl sm:text-5xl"></i>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-red-100 mb-2">마피아 게임</h1>
          <p className="text-sm sm:text-base text-gray-400">오프라인 파티용</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-700/50">
          <h2 className="text-lg sm:text-xl font-bold text-gray-100 mb-3 sm:mb-4 flex items-center">
            <i className="ri-team-line w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center mr-2 text-blue-400"></i>
            플레이어 추가
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-2 mb-4 sm:mb-6">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddPlayer()}
              placeholder="플레이어 이름 입력"
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              onClick={handleAddPlayer}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-700 text-white rounded-xl font-semibold hover:bg-blue-800 transition-all whitespace-nowrap cursor-pointer border border-blue-600/50 text-sm sm:text-base"
            >
              추가
            </button>
          </div>

          <div className="space-y-2">
            {state.players.map((player, index) => (
              <div
                key={player.id}
                className="flex items-center justify-between bg-gray-700/30 border border-gray-600/50 rounded-xl p-3 sm:p-4"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-600/50 rounded-full flex items-center justify-center border border-gray-500/50">
                    <span className="text-gray-300 font-bold text-sm sm:text-base">{index + 1}</span>
                  </div>
                  <span className="font-semibold text-sm sm:text-base text-gray-200">{player.name}</span>
                </div>
                <button
                  onClick={() => handleRemovePlayer(player.id)}
                  className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-red-400 hover:bg-red-900/30 rounded-lg transition-all cursor-pointer"
                >
                  <i className="ri-close-line w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center"></i>
                </button>
              </div>
            ))}
          </div>

          {state.players.length < 4 && (
            <p className="text-amber-400 text-xs sm:text-sm mt-3 sm:mt-4 text-center">
              최소 4명 이상의 플레이어가 필요합니다
            </p>
          )}
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-700/50">
          <h2 className="text-lg sm:text-xl font-bold text-gray-100 mb-3 sm:mb-4 flex items-center">
            <i className="ri-settings-3-line w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center mr-2 text-purple-400"></i>
            게임 설정
          </h2>

          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                마피아 수
              </label>
              <input
                type="number"
                min="1"
                max={Math.floor(state.players.length / 2)}
                value={state.settings.mafiaCount}
                onChange={(e) => dispatch({ 
                  type: 'UPDATE_SETTINGS', 
                  settings: { mafiaCount: parseInt(e.target.value) || 1 }
                })}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                토론 시간 (초)
              </label>
              <input
                type="number"
                min="30"
                max="600"
                step="30"
                value={state.settings.discussionTime}
                onChange={(e) => dispatch({ 
                  type: 'UPDATE_SETTINGS', 
                  settings: { discussionTime: parseInt(e.target.value) || 60 }
                })}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>

            <div className="flex items-center justify-between bg-gray-700/30 border border-gray-600/50 rounded-xl p-3 sm:p-4">
              <span className="text-sm sm:text-base text-gray-300 font-semibold">의사 포함</span>
              <button
                onClick={() => dispatch({ 
                  type: 'UPDATE_SETTINGS', 
                  settings: { hasDoctor: !state.settings.hasDoctor }
                })}
                className={`w-11 h-5 sm:w-12 sm:h-6 rounded-full transition-all cursor-pointer ${
                  state.settings.hasDoctor ? 'bg-green-600' : 'bg-gray-600'
                }`}
              >
                <div className={`w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full transition-all ${
                  state.settings.hasDoctor ? 'ml-5 sm:ml-6' : 'ml-1'
                }`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between bg-gray-700/30 border border-gray-600/50 rounded-xl p-3 sm:p-4">
              <span className="text-sm sm:text-base text-gray-300 font-semibold">경찰 포함</span>
              <button
                onClick={() => dispatch({ 
                  type: 'UPDATE_SETTINGS', 
                  settings: { hasPolice: !state.settings.hasPolice }
                })}
                className={`w-11 h-5 sm:w-12 sm:h-6 rounded-full transition-all cursor-pointer ${
                  state.settings.hasPolice ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <div className={`w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full transition-all ${
                  state.settings.hasPolice ? 'ml-5 sm:ml-6' : 'ml-1'
                }`}></div>
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleStartGame}
          disabled={state.players.length < 4}
          className="w-full py-3 sm:py-4 bg-gradient-to-r from-red-700 to-red-900 text-white rounded-xl font-bold text-base sm:text-lg hover:from-red-800 hover:to-red-950 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg whitespace-nowrap cursor-pointer border border-red-600/50"
        >
          게임 시작
        </button>
      </div>
    </div>
  );
}