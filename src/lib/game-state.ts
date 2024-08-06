const playerFactions = ["hitler", "liberal", "fascist"] as const;
type Faction = typeof playerFactions[number];
type PlayerCount = Record<Faction, number>;

export const possiblePlayeroCounts = [5, 6, 7, 8, 9, 10] as const;

export function loadGame(): GameState | null {
  try {
    const str = window.localStorage.getItem(GAME_KEY)

    if (!str) return null

    return JSON.parse(atob(str)) as GameState;
  } catch (e) {
    console.log(e)
    return null;
  }
}

const gamePlayerPossibilites: Record<number, PlayerCount> = {
  5: {
    liberal: 3,
    fascist: 1,
    hitler: 1,
  },
  6: {
    liberal: 4,
    fascist: 1,
    hitler: 1,
  },
  7: {
    liberal: 4,
    fascist: 2,
    hitler: 1,
  },
  8: {
    liberal: 5,
    fascist: 2,
    hitler: 1,
  },
  9: {
    liberal: 5,
    fascist: 3,
    hitler: 1,
  },
  10: {
    liberal: 6,
    fascist: 3,
    hitler: 1,
  }
};

const GAME_KEY = "shgsid"

export type GameState = {
  currentPlayer: number;
  numberOfPlayers: number;
  playerCount: PlayerCount;
  players: Record<number, Faction>;
};

export function startGame(numberOfPlayers: number, gameState: GameState | null) {
  if (gameState) {
    numberOfPlayers = gameState.numberOfPlayers
  }

  if (numberOfPlayers < 5 || numberOfPlayers > 10) throw new Error("Number of players must be between 5 and 10");

  const state: GameState = gameState ?? {
    numberOfPlayers,
    currentPlayer: 0,
    playerCount: gamePlayerPossibilites[numberOfPlayers],
    players: {}
  };

  const usedPlayerTypes: PlayerCount = {
    liberal: 0,
    fascist: 0,
    hitler: 0,
  };

  function revealNextPlayer() {
    if (state.currentPlayer === state.numberOfPlayers) return -1;

    state.currentPlayer++;
    const faction = state.players[state.currentPlayer];
    usedPlayerTypes[faction]++;
    saveGame()

    return state.currentPlayer;
  }

  function assignFactions() {
    let factions: Faction[] = [];

    for (const type of playerFactions) {
      for (let i = 0; i < state.playerCount[type]; i++) {
        factions.push(type);
      }
    }

    // Shuffle factions using Fisher-Yates algorithm
    for (let i = factions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [factions[i], factions[j]] = [factions[j], factions[i]];
    }

    for (let i = 0; i < factions.length; i++) {
      state.players[i] = factions[i];
    }
  }

  function saveGame() {
    try {
      window.localStorage.setItem(GAME_KEY, btoa(JSON.stringify(state)))
    } catch (e) {
      console.log(e)
    }
  }


  function getPossiblePlayerCounts() {
    return Object.keys(gamePlayerPossibilites)
  }

  function getPlayerFaction(player: number) {
    return state.players[player];
  }

  function isRevealPhaseDone() {
    return state.currentPlayer === state.numberOfPlayers;
  }

  assignFactions();
  saveGame()

  return {
    revealNextPlayer,
    saveGame,
    loadGame,
    state,
    getPossiblePlayerCounts,
    getPlayerFaction,
    isRevealPhaseDone
  };
}


