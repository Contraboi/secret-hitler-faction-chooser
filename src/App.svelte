<script lang="ts">
  import PlayerCountSelect from "./lib/PlayerCountSelect.svelte";
  import CardRevealer from "./lib/CardRevealer.svelte";
  import { loadGame } from "./lib/game-state";

  let selected: number = -1;
  let gameState = loadGame();
  let continueLastGame = false;

  if (gameState) {
    continueLastGame = confirm(
      "You did not finished last game, do you wish to continue?",
    );
  }
</script>

<main>
  {#if selected === -1 && !continueLastGame}
    <h3>Please select player count</h3>
    <PlayerCountSelect bind:selected />
  {/if}

  {#if gameState && continueLastGame}
    <CardRevealer
      savedGame={gameState}
      playerCount={gameState?.numberOfPlayers}
    />
  {/if}

  {#if selected > -1 && !continueLastGame}
    <CardRevealer savedGame={null} playerCount={selected} />
  {/if}
</main>

<style></style>
