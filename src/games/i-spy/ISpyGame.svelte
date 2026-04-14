<script lang="ts">
  import GameHeader from '../../components/GameHeader.svelte';
  import PlayerSetup from '../../components/PlayerSetup.svelte';
  import ClueSetup from './ClueSetup.svelte';
  import ActiveRound from './ActiveRound.svelte';
  import RoundEnd from './RoundEnd.svelte';
  import {
    iSpyState,
    startGame,
    beginClueSetup,
    beginGuessing,
    resetGame,
  } from './iSpyState.svelte';

  let phase = $derived(iSpyState.value.phase);
  let players = $derived(iSpyState.value.players);
  let currentSpyIndex = $derived(iSpyState.value.currentSpyIndex);
  let round = $derived(iSpyState.value.round);

  let spyName = $derived(players.length > 0 ? (players[currentSpyIndex]?.name ?? 'Spy') : 'Spy');
</script>

<div class="flex min-h-dvh flex-col bg-background">
  <GameHeader title="I Spy" onReset={resetGame} />

  {#if phase === 'setup'}
    <main class="flex-1 overflow-y-auto">
      <div class="px-4 pt-6 pb-2">
        <p class="text-sm text-muted-foreground">
          One player picks something they can see and gives a clue — color or letter. Everyone else
          guesses!
        </p>
      </div>

      <PlayerSetup maxPlayers={6} onStart={startGame} />

      <div class="px-4 pb-6">
        <button
          class="w-full py-2 text-center text-sm text-muted-foreground underline underline-offset-2"
          onclick={() => startGame([])}
        >
          Play without score tracking
        </button>
      </div>
    </main>
  {:else if phase === 'role-select'}
    <main class="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-8">
      <div class="mb-2 text-center">
        <span class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Round {round}
        </span>
        {#if players.length > 0}
          <p class="mt-1 text-lg font-bold text-foreground">{spyName}'s turn to spy</p>
        {/if}
        <p class="mt-1 text-sm text-muted-foreground">Who's looking at the phone right now?</p>
      </div>

      <div class="flex w-full max-w-xs flex-col gap-3">
        <button
          class="w-full rounded-xl border-2 border-primary bg-primary/10 px-4 py-5 text-center text-lg font-semibold text-primary transition-colors active:bg-primary/20"
          onclick={beginClueSetup}
        >
          I'm the Spy
        </button>
        <button
          class="w-full rounded-xl border-2 border-border bg-muted px-4 py-5 text-center text-lg font-semibold text-foreground transition-colors active:bg-muted/80"
          onclick={beginGuessing}
        >
          I'm Guessing
        </button>
      </div>
    </main>
  {:else if phase === 'clue-setup'}
    <ClueSetup {spyName} />
  {:else if phase === 'guessing'}
    <ActiveRound />
  {:else if phase === 'round-end'}
    <RoundEnd />
  {/if}
</div>
