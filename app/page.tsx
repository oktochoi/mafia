'use client';

import { useReducer } from 'react';
import { gameReducer, initialState } from '@/lib/gameReducer';
import SetupStep from './components/SetupStep';
import RevealStep from './components/RevealStep';
import NightPhase from './components/NightPhase';
import DayPhase from './components/DayPhase';
import VotePhase from './components/VotePhase';
import ResultPhase from './components/ResultPhase';

export default function Home() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <main>
      {state.phase === 'setup' && <SetupStep state={state} dispatch={dispatch} />}
      {state.phase === 'reveal' && <RevealStep state={state} dispatch={dispatch} />}
      {state.phase === 'night' && <NightPhase state={state} dispatch={dispatch} />}
      {state.phase === 'day' && <DayPhase state={state} dispatch={dispatch} />}
      {state.phase === 'vote' && <VotePhase state={state} dispatch={dispatch} />}
      {state.phase === 'result' && <ResultPhase state={state} dispatch={dispatch} />}
    </main>
  );
}
