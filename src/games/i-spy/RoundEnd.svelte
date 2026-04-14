<script lang="ts">
  import { Button } from '../../components/ui/button';
  import { iSpyState, nextRound } from './iSpyState.svelte';

  let state = $derived(iSpyState.value);
  let players = $derived(state.players);
  let lastWinnerIndex = $derived(state.lastRoundWinnerIndex);
  let currentSpyIndex = $derived(state.currentSpyIndex);
  let round = $derived(state.round);

  let winner = $derived(
    lastWinnerIndex !== null && players.length > 0 ? players[lastWinnerIndex] : null
  );

  // Preview next spy (mirrors nextRound logic)
  let nextSpyIndex = $derived(
    lastWinnerIndex !== null
      ? lastWinnerIndex
      : players.length > 1
        ? (currentSpyIndex + 1) % players.length
        : 0
  );

  let nextSpyName = $derived(players.length > 0 ? (players[nextSpyIndex]?.name ?? 'Spy') : 'Spy');

  // Leaderboard sorted descending by score
  let leaderboard = $derived(
    players.length > 0
      ? [...players.map((p, i) => ({ ...p, index: i }))].sort((a, b) => b.score - a.score)
      : []
  );
</script>

<main class="flex flex-1 flex-col overflow-y-auto px-4 py-6">
  <!-- Result banner -->
  <div class="mb-8 text-center">
    {#if winner}
      <p class="mb-1 text-2xl font-bold text-primary">{winner.name} guessed it!</p>
    {:else if lastWinnerIndex !== null}
      <p class="mb-1 text-2xl font-bold text-primary">Correct guess!</p>
    {:else}
      <p class="mb-1 text-2xl font-bold text-foreground">Spy reveals the answer!</p>
    {/if}
    <p class="text-sm text-muted-foreground">Round {round} complete</p>
  </div>

  <!-- Leaderboard -->
  {#if leaderboard.length > 0}
    <div class="mb-6 rounded-lg border border-border bg-muted/30 px-4 py-3">
      <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Scores</p>
      <div class="space-y-2">
        {#each leaderboard as entry, rank}
          <div class="flex items-center justify-between text-sm">
            <div class="flex items-center gap-2">
              <span class="w-5 text-xs text-muted-foreground">{rank + 1}.</span>
              <span class="text-foreground">{entry.name}</span>
              {#if entry.index === nextSpyIndex}
                <span class="text-xs text-muted-foreground">(next spy)</span>
              {/if}
            </div>
            <span class="font-semibold text-foreground">{entry.score}</span>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Next spy prompt -->
  <div class="mb-8 rounded-lg border border-primary/20 bg-primary/10 px-4 py-4 text-center">
    <p class="mb-1 text-sm text-muted-foreground">Next round</p>
    <p class="font-semibold text-foreground">Pass the phone to</p>
    <p class="text-xl font-bold text-primary">{nextSpyName}</p>
  </div>

  <div class="mt-auto">
    <Button class="w-full" size="lg" onclick={nextRound}>Start Next Round</Button>
  </div>
</main>
