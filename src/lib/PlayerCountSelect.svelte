<script lang="ts">
  export let selected = -1;
</script>

<div class="container">
  {#each [5, 6, 7, 8, 9, 10] as playerCount}
    <button class="box" on:click={() => (selected = playerCount)}>
      {playerCount}
    </button>
  {/each}
</div>

<style>
  .container {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
  }
  .box {
    padding: 1rem;
  }
</style>
