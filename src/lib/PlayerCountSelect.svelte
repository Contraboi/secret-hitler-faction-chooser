<script lang="ts">
  import { possibleNumberOfPlayers } from "./game-state";
  export let selected = -1;
</script>

<div class="container">
  {#each possibleNumberOfPlayers as playerCount}
    <button class="box" on:click={() => (selected = playerCount)}>
      {playerCount}
    </button>
  {/each}
</div>

<style>
  .container {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }
  .box {
    padding: 1rem;
  }
</style>
