<script lang="ts">
  import type { BingoCard } from './bingoState.svelte';

  interface Props {
    card: BingoCard;
    onToggle: (squareIndex: number) => void;
  }

  let { card, onToggle }: Props = $props();

  const winSet = $derived(new Set(card.winningIndices));
</script>

<div class="grid grid-cols-5 gap-1.5">
  {#each card.squares as square, i}
    {@const isFree = i === 12}
    {@const isWin = winSet.has(i)}
    <button
      class="relative flex aspect-square items-center justify-center rounded-lg p-1 text-center text-[11px] font-semibold leading-tight transition-all select-none
        {isFree
        ? 'bg-primary text-primary-foreground cursor-default'
        : isWin && square.marked
          ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-1 ring-offset-background'
          : square.marked
            ? 'bg-primary/20 text-primary ring-1 ring-primary/40'
            : 'bg-muted text-foreground hover:bg-accent active:scale-95'}"
      onclick={() => onToggle(i)}
      disabled={isFree}
      aria-label="{square.marked ? 'Marked' : 'Unmarked'}: {square.label}"
      aria-pressed={square.marked}
    >
      {square.label}
    </button>
  {/each}
</div>
