<script lang="ts">
  import { Button } from '../../components/ui/button';
  import { iSpyState, incrementGuess, recordCorrectGuess, giveUp } from './iSpyState.svelte';

  let game = $derived(iSpyState.value);
  let clue = $derived(game.activeClue);
  let players = $derived(game.players);
  let currentSpyIndex = $derived(game.currentSpyIndex);
  let guessCount = $derived(game.guessCount);
  let round = $derived(game.round);

  let selectingWinner = $state(false);

  let clueLabel = $derived(
    clue
      ? clue.type === 'color'
        ? `Something that is ${clue.value.toUpperCase()}`
        : `Something beginning with ${clue.value}`
      : null
  );

  function handleCorrect() {
    if (players.length === 0) {
      recordCorrectGuess(0);
      return;
    }
    const nonSpyCount = players.filter((_, i) => i !== currentSpyIndex).length;
    if (nonSpyCount === 1) {
      const winnerIndex = players.findIndex((_, i) => i !== currentSpyIndex);
      recordCorrectGuess(winnerIndex);
      return;
    }
    selectingWinner = true;
  }
</script>

<main class="flex flex-1 flex-col overflow-y-auto">
  <!-- Clue banner -->
  <div class="flex flex-col items-center justify-center px-6 py-10 text-center">
    <p class="mb-3 text-sm text-muted-foreground">I spy with my little eye...</p>
    {#if clueLabel}
      <p class="text-3xl font-bold leading-tight text-primary">{clueLabel}</p>
    {:else}
      <p class="text-xl italic text-muted-foreground">Waiting for spy to set clue...</p>
    {/if}
  </div>

  <!-- Round + guess counter -->
  <div class="px-4 pb-4">
    <div class="flex items-center justify-center gap-3 text-sm text-muted-foreground">
      <span>Round {round}</span>
      <span>·</span>
      <span>{guessCount} {guessCount === 1 ? 'guess' : 'guesses'}</span>
    </div>
  </div>

  <!-- Leaderboard (named mode only) -->
  {#if players.length > 0}
    <div class="mx-4 mb-4 rounded-lg border border-border bg-muted/30 px-4 py-3">
      <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Scores</p>
      <div class="space-y-1">
        {#each players as player, i}
          <div class="flex items-center justify-between text-sm">
            <span class="text-foreground">
              {player.name}
              {#if i === currentSpyIndex}
                <span class="ml-1 text-xs text-muted-foreground">(spy)</span>
              {/if}
            </span>
            <span class="font-semibold text-foreground">{player.score}</span>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Actions -->
  <div class="mt-auto space-y-3 px-4 pb-8">
    {#if selectingWinner}
      <p class="mb-1 text-center text-sm font-semibold text-foreground">Who guessed it?</p>
      {#each players as player, i}
        {#if i !== currentSpyIndex}
          <Button
            class="w-full"
            variant="outline"
            onclick={() => {
              selectingWinner = false;
              recordCorrectGuess(i);
            }}
          >
            {player.name}
          </Button>
        {/if}
      {/each}
      <Button class="w-full" variant="ghost" onclick={() => (selectingWinner = false)}>
        Cancel
      </Button>
    {:else}
      <Button class="w-full" variant="outline" onclick={incrementGuess}>One More Guess</Button>
      <Button class="w-full" onclick={handleCorrect}>Correct Guess!</Button>
      <Button class="w-full" variant="destructive" onclick={giveUp}>Give Up / Reveal</Button>
    {/if}
  </div>
</main>
