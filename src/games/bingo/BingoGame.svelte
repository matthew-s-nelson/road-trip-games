<script lang="ts">
  import GameHeader from '../../components/GameHeader.svelte';
  import WinScreen from '../../components/WinScreen.svelte';
  import PlayerSetup from '../../components/PlayerSetup.svelte';
  import ConfirmDialog from '../../components/ConfirmDialog.svelte';
  import BingoCard from './BingoCard.svelte';
  import {
    bingoState,
    startGame,
    toggleSquare,
    resetGame,
    formatDuration,
  } from './bingoState.svelte';

  let activePlayer = $state(0);
  let pendingToggle = $state<{ playerIndex: number; squareIndex: number } | null>(null);

  let phase = $derived(bingoState.value.phase);
  let cards = $derived(bingoState.value.cards);
  let winCondition = $derived(bingoState.value.winCondition);
  let winner = $derived(cards.find((c) => c.hasWon) ?? null);
  let duration = $derived(
    bingoState.value.startedAt && bingoState.value.completedAt
      ? formatDuration(bingoState.value.startedAt, bingoState.value.completedAt)
      : ''
  );

  // Clamp activePlayer when cards change (e.g. after reset)
  $effect(() => {
    if (activePlayer >= cards.length) activePlayer = 0;
  });

  let selectedWinCondition = $state<'line' | 'blackout'>('line');

  function handleStart(playerNames: string[]) {
    startGame(playerNames, selectedWinCondition);
    activePlayer = 0;
  }

  function handleToggle(squareIndex: number) {
    const card = cards[activePlayer];
    if (!card) return;

    if (card.squares[squareIndex].marked && squareIndex !== 12) {
      // Prompt before un-marking
      pendingToggle = { playerIndex: activePlayer, squareIndex };
    } else {
      toggleSquare(activePlayer, squareIndex);
    }
  }

  function confirmUnmark() {
    if (pendingToggle) {
      toggleSquare(pendingToggle.playerIndex, pendingToggle.squareIndex);
      pendingToggle = null;
    }
  }

  function cancelUnmark() {
    pendingToggle = null;
  }

  let markedCount = $derived(cards[activePlayer]?.squares.filter((s) => s.marked).length ?? 0);
</script>

<div class="flex min-h-dvh flex-col bg-background">
  {#if phase === 'setup'}
    <GameHeader title="Road Trip Bingo" onReset={resetGame} />

    <main class="flex-1 overflow-y-auto">
      <div class="px-4 pt-4 pb-2">
        <p class="text-sm text-muted-foreground mb-4">
          Each player gets a unique 5×5 card. Spot items out the window to mark them off!
        </p>

        <div class="mb-6">
          <p class="text-sm font-semibold text-foreground mb-2">Win condition</p>
          <div class="flex gap-2">
            <button
              class="flex-1 rounded-lg border-2 px-3 py-2.5 text-sm font-semibold transition-colors
                {selectedWinCondition === 'line'
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-muted text-muted-foreground'}"
              onclick={() => (selectedWinCondition = 'line')}
            >
              Line Bingo
            </button>
            <button
              class="flex-1 rounded-lg border-2 px-3 py-2.5 text-sm font-semibold transition-colors
                {selectedWinCondition === 'blackout'
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-muted text-muted-foreground'}"
              onclick={() => (selectedWinCondition = 'blackout')}
            >
              Blackout
            </button>
          </div>
          <p class="mt-1.5 text-xs text-muted-foreground">
            {selectedWinCondition === 'line'
              ? 'Complete any row, column, or diagonal.'
              : 'Mark every square on your card.'}
          </p>
        </div>
      </div>

      <PlayerSetup maxPlayers={6} onStart={handleStart} />
    </main>
  {:else}
    <GameHeader title="Road Trip Bingo" onReset={resetGame} />

    {#if winner}
      <WinScreen
        title="{winner.playerName} gets Bingo!"
        stats={[
          { label: 'Win condition', value: winCondition === 'line' ? 'Line Bingo' : 'Blackout' },
          ...(duration ? [{ label: 'Time', value: duration }] : []),
        ]}
        onPlayAgain={resetGame}
      />
    {/if}

    <!-- Player tabs -->
    {#if cards.length > 1}
      <div class="flex border-b border-border bg-background overflow-x-auto">
        {#each cards as card, i}
          <button
            class="flex-1 min-w-0 px-3 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors
              {activePlayer === i
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'}"
            onclick={() => (activePlayer = i)}
          >
            {card.playerName}
            {#if card.hasWon}
              <span class="ml-1 text-xs text-primary">★</span>
            {/if}
          </button>
        {/each}
      </div>
    {/if}

    <main class="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      {#if cards[activePlayer]}
        <div class="flex items-center justify-between">
          <p class="text-sm text-muted-foreground">
            <span class="font-semibold text-foreground">{markedCount}</span>
            {' / 25 '}
            squares marked
          </p>
          <span class="text-xs text-muted-foreground capitalize">
            {winCondition === 'line' ? 'Line Bingo' : 'Blackout'}
          </span>
        </div>

        <BingoCard card={cards[activePlayer]} onToggle={handleToggle} />
      {/if}
    </main>
  {/if}
</div>

<ConfirmDialog
  open={pendingToggle !== null}
  message="Un-mark this square?"
  onConfirm={confirmUnmark}
  onCancel={cancelUnmark}
/>
