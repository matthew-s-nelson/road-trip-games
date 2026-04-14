<script lang="ts">
  import { ChevronLeft } from 'lucide-svelte';
  import GameHeader from '../../components/GameHeader.svelte';
  import ProgressCounter from '../../components/ProgressCounter.svelte';
  import WinScreen from '../../components/WinScreen.svelte';
  import { Button } from '../../components/ui/button';
  import {
    alphabetState,
    markFound,
    goBack,
    resetGame,
    formatDuration,
    ALPHABET,
  } from './alphabetState.svelte';

  let currentIndex = $derived(alphabetState.value.currentIndex);
  let isComplete = $derived(alphabetState.value.completedAt !== null);
  let duration = $derived(
    alphabetState.value.startedAt && alphabetState.value.completedAt
      ? formatDuration(alphabetState.value.startedAt, alphabetState.value.completedAt)
      : ''
  );
</script>

<div class="flex min-h-dvh flex-col bg-background">
  <GameHeader title="Alphabet Game" onReset={resetGame} />

  {#if isComplete}
    <WinScreen
      title="A to Z Complete!"
      stats={duration ? [{ label: 'Time', value: duration }] : []}
      onPlayAgain={resetGame}
    />
  {/if}

  <main class="flex-1 overflow-y-auto px-4 py-4 space-y-4">
    <ProgressCounter current={currentIndex} total={26} label="letters found" />

    <div class="grid grid-cols-5 gap-2 sm:grid-cols-6">
      {#each ALPHABET as letter, i}
        {@const isCurrent = i === currentIndex}
        {@const isFound = i < currentIndex}
        <button
          class="relative flex aspect-square items-center justify-center rounded-lg text-lg font-bold transition-all
            {isCurrent
            ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background scale-105'
            : isFound
              ? 'bg-muted text-muted-foreground line-through'
              : 'bg-muted/40 text-muted-foreground/40 cursor-default'}"
          onclick={isCurrent ? markFound : undefined}
          disabled={!isCurrent}
          aria-label="{isFound ? 'Found' : isCurrent ? 'Current target' : 'Not yet'}: {letter}"
        >
          {letter}
        </button>
      {/each}
    </div>

    {#if currentIndex > 0}
      <div class="pt-2">
        <Button variant="outline" size="sm" onclick={goBack}>
          <ChevronLeft class="h-4 w-4" />
          Back
        </Button>
      </div>
    {/if}
  </main>
</div>
