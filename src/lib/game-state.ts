const playerRoles = ["hitler", "liberal", "fascist"] as const;
type Role = typeof playerRoles[number];
type PlayerRoleCount = Record<Role, number>;

export function loadGame(): GameState | null {
  try {
    const str = window.localStorage.getItem(GAME_STATE_KEY)

    if (!str) return null

    return JSON.parse(atob(str)) as GameState;
  } catch (e) {
    console.log(e)
    return null;
  }
}

function calculatePlayerDistribution(playerCount: number): PlayerRoleCount {
  if (playerCount < 5) {
    throw new Error('Minimum number of players is 5');
  }

  const hitler = 1;
  const liberals = Math.round(playerCount * 0.6);
  const fascists = playerCount - liberals - hitler;

  return {
    liberal: liberals,
    fascist: fascists,
    hitler
  };
}

const GAME_STATE_KEY = "shgsid"

export type GameState = {
  currentPlayer: number;
  numberOfPlayers: number;
  playerRoleCount: PlayerRoleCount;
  players: Record<number, Role>;
};

export function startGame(numberOfPlayers: number, gameState: GameState | null) {
  if (gameState) {
    numberOfPlayers = gameState.numberOfPlayers
  }

  const state: GameState = gameState ?? {
    numberOfPlayers,
    currentPlayer: 0,
    playerRoleCount: calculatePlayerDistribution(numberOfPlayers),
    players: {}
  };

  function revealNextPlayer() {
    if (state.currentPlayer === state.numberOfPlayers) return -1;

    state.currentPlayer++;
    saveGame()

    return state.currentPlayer;
  }

  function assignFactions() {
    let factions: Role[] = [];

    for (const type of playerRoles) {
      for (let i = 0; i < state.playerRoleCount[type]; i++) {
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

    saveGame()
  }

  function saveGame() {
    try {
      window.localStorage.setItem(GAME_STATE_KEY, btoa(JSON.stringify(state)))
    } catch (e) {
      console.log(e)
    }
  }

  function getPlayerFaction(player: number) {
    return state.players[player];
  }

  function isRevealPhaseDone() {
    return state.currentPlayer === state.numberOfPlayers;
  }

  assignFactions();

  return {
    revealNextPlayer,
    saveGame,
    loadGame,
    state,
    getPlayerFaction,
    isRevealPhaseDone
  };
}


