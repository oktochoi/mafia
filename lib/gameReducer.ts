
import { GameState, GameAction, Player, Role } from './types';

export const initialState: GameState = {
  players: [],
  settings: {
    mafiaCount: 1,
    hasDoctor: true,
    hasPolice: true,
    allowSelfVote: false,
    discussionTime: 180,
    firstDayKill: true,
    mafiaKnowEachOther: true,
  },
  phase: 'setup',
  currentRevealIndex: 0,
  nightActions: {
    mafiaTargetId: null,
    doctorSaveId: null,
    policeCheckId: null,
    policeCheckResult: null,
  },
  votes: [],
  history: [],
  currentRound: 1,
  currentVoterIndex: 0,
  winner: null,
  nightStep: 'intro',
};

function assignRoles(players: Player[], settings: any): Player[] {
  const roles: Role[] = [];
  
  for (let i = 0; i < settings.mafiaCount; i++) {
    roles.push('mafia');
  }
  
  if (settings.hasDoctor) roles.push('doctor');
  if (settings.hasPolice) roles.push('police');
  
  while (roles.length < players.length) {
    roles.push('citizen');
  }
  
  const shuffled = [...roles].sort(() => Math.random() - 0.5);
  
  return players.map((p, i) => ({
    ...p,
    role: shuffled[i],
    alive: true,
  }));
}

function checkWinner(players: Player[]): 'mafia' | 'citizen' | null {
  const alivePlayers = players.filter(p => p.alive);
  const aliveMafia = alivePlayers.filter(p => p.role === 'mafia').length;
  const aliveCitizens = alivePlayers.length - aliveMafia;
  
  if (aliveMafia === 0) return 'citizen';
  if (aliveMafia >= aliveCitizens) return 'mafia';
  return null;
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ADD_PLAYER':
      return {
        ...state,
        players: [
          ...state.players,
          {
            id: Date.now().toString(),
            name: action.name,
            role: null,
            alive: true,
          },
        ],
      };
      
    case 'REMOVE_PLAYER':
      return {
        ...state,
        players: state.players.filter(p => p.id !== action.id),
      };
      
    case 'UPDATE_PLAYER_NAME':
      return {
        ...state,
        players: state.players.map(p =>
          p.id === action.id ? { ...p, name: action.name } : p
        ),
      };
      
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.settings },
      };
      
    case 'START_GAME':
      return {
        ...state,
        players: assignRoles(state.players, state.settings),
        phase: 'reveal',
        currentRevealIndex: 0,
      };
      
    case 'NEXT_REVEAL':
      if (state.currentRevealIndex < state.players.length - 1) {
        return {
          ...state,
          currentRevealIndex: state.currentRevealIndex + 1,
        };
      } else {
        return {
          ...state,
          phase: 'night',
          nightStep: 'intro',
        };
      }
      
    case 'START_NIGHT':
      return {
        ...state,
        phase: 'night',
        nightStep: 'intro',
        nightActions: {
          mafiaTargetId: null,
          doctorSaveId: null,
          policeCheckId: null,
          policeCheckResult: null,
        },
      };
      
    case 'NEXT_NIGHT_STEP':
      const steps = ['intro', 'mafia', 'doctor', 'police', 'done'];
      const currentIndex = steps.indexOf(state.nightStep);
      let nextStep = steps[currentIndex + 1] as any;
      
      if (nextStep === 'doctor' && !state.settings.hasDoctor) {
        nextStep = 'police';
      }
      if (nextStep === 'police' && !state.settings.hasPolice) {
        nextStep = 'done';
      }
      
      return {
        ...state,
        nightStep: nextStep,
      };
      
    case 'SET_MAFIA_TARGET':
      return {
        ...state,
        nightActions: {
          ...state.nightActions,
          mafiaTargetId: action.targetId,
        },
      };
      
    case 'SET_DOCTOR_SAVE':
      return {
        ...state,
        nightActions: {
          ...state.nightActions,
          doctorSaveId: action.targetId,
        },
      };
      
    case 'SET_POLICE_CHECK':
      const target = state.players.find(p => p.id === action.targetId);
      return {
        ...state,
        nightActions: {
          ...state.nightActions,
          policeCheckId: action.targetId,
          policeCheckResult: target?.role === 'mafia',
        },
      };
      
    case 'START_DAY':
      let updatedPlayers = [...state.players];
      let nightKilled: string | null = null;
      let saved = false;
      
      if (state.nightActions.mafiaTargetId) {
        if (state.nightActions.mafiaTargetId === state.nightActions.doctorSaveId) {
          saved = true;
        } else {
          updatedPlayers = updatedPlayers.map(p =>
            p.id === state.nightActions.mafiaTargetId ? { ...p, alive: false } : p
          );
          nightKilled = state.nightActions.mafiaTargetId;
        }
      }
      
      const winner = checkWinner(updatedPlayers);
      
      return {
        ...state,
        players: updatedPlayers,
        phase: winner ? 'result' : 'day',
        winner,
        history: [
          ...state.history,
          {
            roundNo: state.currentRound,
            nightKilled,
            saved,
            votedOut: null,
          },
        ],
      };
      
    case 'START_VOTE':
      return {
        ...state,
        phase: 'vote',
        votes: [],
        currentVoterIndex: 0,
      };
      
    case 'CAST_VOTE':
      const newVotes = [...state.votes, { voterId: action.voterId, targetId: action.targetId }];
      const alivePlayers = state.players.filter(p => p.alive);
      
      if (newVotes.length < alivePlayers.length) {
        return {
          ...state,
          votes: newVotes,
          currentVoterIndex: state.currentVoterIndex + 1,
        };
      } else {
        return {
          ...state,
          votes: newVotes,
        };
      }
      
    case 'PROCESS_VOTE_RESULT':
      const voteCounts: { [key: string]: number } = {};
      state.votes.forEach(v => {
        voteCounts[v.targetId] = (voteCounts[v.targetId] || 0) + 1;
      });
      
      let maxVotes = 0;
      let votedOutId: string | null = null;
      
      Object.entries(voteCounts).forEach(([id, count]) => {
        if (count > maxVotes) {
          maxVotes = count;
          votedOutId = id;
        }
      });
      
      let playersAfterVote = state.players;
      if (votedOutId) {
        playersAfterVote = state.players.map(p =>
          p.id === votedOutId ? { ...p, alive: false } : p
        );
      }
      
      const voteWinner = checkWinner(playersAfterVote);
      
      const lastHistory = state.history[state.history.length - 1];
      const updatedHistory = [
        ...state.history.slice(0, -1),
        { ...lastHistory, votedOut: votedOutId },
      ];
      
      return {
        ...state,
        players: playersAfterVote,
        phase: voteWinner ? 'result' : 'day',
        winner: voteWinner,
        history: updatedHistory,
      };
      
    case 'NEXT_ROUND':
      return {
        ...state,
        phase: 'night',
        nightStep: 'intro',
        currentRound: state.currentRound + 1,
        nightActions: {
          mafiaTargetId: null,
          doctorSaveId: null,
          policeCheckId: null,
          policeCheckResult: null,
        },
        votes: [],
      };
      
    case 'NEW_GAME':
      return {
        ...initialState,
        players: state.players.map(p => ({ ...p, role: null, alive: true })),
      };
      
    default:
      return state;
  }
}
