<script lang="ts">
  import { startGame, type GameState } from "./game-state";

  export let playerCount = -1;
  export let savedGame: GameState | null = null;

  const game = startGame(playerCount ?? 5, savedGame);

  let currentPlayer = game.state.currentPlayer;
  let isRevealed = false;
  let isRevealPhaseDone = game.isRevealPhaseDone();

  function handleReveal() {
    currentPlayer = game.revealNextPlayer();
    isRevealed = true;
    isRevealPhaseDone = game.isRevealPhaseDone();
  }

  function peekPlayerFaction(player: string) {
    currentPlayer = parseInt(player);
    isRevealed = true;
  }

  function stopPeeking() {
    currentPlayer = -1;
    isRevealed = false;
  }
</script>

{#if !isRevealed && !game.isRevealPhaseDone()}
  <p>Players revaled {currentPlayer} / {game.state.numberOfPlayers}</p>
  <div
    tabindex="0"
    role="button"
    class="card padded-card"
    on:click={() => handleReveal()}
    on:keydown={(e) => {
      if (e.key === " " || e.key === "Enter") handleReveal();
    }}
  >
    <p>
      Player <strong>{currentPlayer + 1}</strong> Reveal your faction
    </p>
  </div>
{/if}

{#if isRevealed && !isRevealPhaseDone}
  <p>Players revaled {currentPlayer} / {game.state.numberOfPlayers}</p>
  <div
    tabindex="0"
    role="button"
    class="card padded-card revaled"
    on:click={() => {
      isRevealed = false;
      isRevealPhaseDone = game.isRevealPhaseDone();
    }}
    on:keydown={(e) => {
      if (e.key === " " || e.key === "Enter") {
        isRevealed = false;
        isRevealPhaseDone = game.isRevealPhaseDone();
      }
    }}
  >
    <strong class={game.getPlayerFaction(currentPlayer - 1)}
      >{game.getPlayerFaction(currentPlayer - 1)}</strong
    >
  </div>
{/if}

{#if isRevealPhaseDone}
  <div class="card-grid">
    {#each Object.keys(game.state.players) as key}
      <div
        tabindex="0"
        role="button"
        class="card revaled"
        on:click={() => {
          if (isRevealed) {
            stopPeeking();
          } else {
            peekPlayerFaction(key);
          }
        }}
        on:keydown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            if (isRevealed) {
              stopPeeking();
            } else {
              peekPlayerFaction(key);
            }
          }
        }}
      >
        {#if isRevealed && currentPlayer === parseInt(key)}
          <strong class={game.getPlayerFaction(parseInt(key))}
            >{game.getPlayerFaction(parseInt(key))}</strong
          >
        {:else}
          Player {parseInt(key) + 1}
        {/if}
      </div>
    {/each}
  </div>
{/if}

<style>
  .card-grid {
    width: 100%;
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }
  .card.revaled strong {
    text-transform: capitalize;
    font-size: 30px;
  }
  .hitler {
    color: maroon;
  }

  .liberal {
    color: green;
  }

  .fascist {
    color: #dc2626;
  }
</style>
