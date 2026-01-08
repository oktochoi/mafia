
export type Role = 'mafia' | 'citizen' | 'doctor' | 'police';

export type Phase = 'setup' | 'reveal' | 'night' | 'day' | 'vote' | 'result';

export interface Player {
  id: string;
  name: string;
  role: Role | null;
  alive: boolean;
}

export interface Settings {
  mafiaCount: number;
  hasDoctor: boolean;
  hasPolice: boolean;
  allowSelfVote: boolean;
  discussionTime: number;
  firstDayKill: boolean;
  mafiaKnowEachOther: boolean;
}

export interface NightActions {
  mafiaTargetId: string | null;
  doctorSaveId: string | null;
  policeCheckId: string | null;
  policeCheckResult: boolean | null;
}

export interface Vote {
  voterId: string;
  targetId: string;
}

export interface RoundHistory {
  roundNo: number;
  nightKilled: string | null;
  saved: boolean;
  votedOut: string | null;
}

export interface GameState {
  players: Player[];
  settings: Settings;
  phase: Phase;
  currentRevealIndex: number;
  nightActions: NightActions;
  votes: Vote[];
  history: RoundHistory[];
  currentRound: number;
  currentVoterIndex: number;
  winner: 'mafia' | 'citizen' | null;
  nightStep: 'intro' | 'mafia' | 'doctor' | 'police' | 'done';
}

export type GameAction =
  | { type: 'ADD_PLAYER'; name: string }
  | { type: 'REMOVE_PLAYER'; id: string }
  | { type: 'UPDATE_PLAYER_NAME'; id: string; name: string }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<Settings> }
  | { type: 'START_GAME' }
  | { type: 'NEXT_REVEAL' }
  | { type: 'START_NIGHT' }
  | { type: 'NEXT_NIGHT_STEP' }
  | { type: 'SET_MAFIA_TARGET'; targetId: string }
  | { type: 'SET_DOCTOR_SAVE'; targetId: string }
  | { type: 'SET_POLICE_CHECK'; targetId: string }
  | { type: 'START_DAY' }
  | { type: 'START_VOTE' }
  | { type: 'CAST_VOTE'; voterId: string; targetId: string }
  | { type: 'PROCESS_VOTE_RESULT' }
  | { type: 'NEW_GAME' }
  | { type: 'NEXT_ROUND' };
