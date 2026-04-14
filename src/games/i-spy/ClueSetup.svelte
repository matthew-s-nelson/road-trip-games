<script lang="ts">
  import { Button } from '../../components/ui/button';
  import { confirmClue, CLUE_COLORS, LETTERS } from './iSpyState.svelte';

  interface Props {
    spyName: string;
  }

  let { spyName }: Props = $props();

  let clueType = $state<'color' | 'letter' | null>(null);
  let clueValue = $state<string | null>(null);

  function selectType(type: 'color' | 'letter') {
    clueType = type;
    clueValue = null;
  }

  function handleConfirm() {
    if (!clueType || !clueValue) return;
    confirmClue({ type: clueType, value: clueValue });
  }
</script>

<main class="flex flex-1 flex-col overflow-y-auto px-4 py-6">
  <div class="mb-6 text-center">
    <p class="text-sm text-muted-foreground">
      <span class="font-semibold text-foreground">{spyName}</span>, pick something you can see.
    </p>
    <p class="mt-1 text-xs text-muted-foreground">Keep your item secret — don't enter it here.</p>
  </div>

  <!-- Step 1: choose clue type -->
  <div class="mb-6">
    <p class="mb-2 text-sm font-semibold text-foreground">Clue type</p>
    <div class="flex gap-2">
      <button
        class="flex-1 rounded-lg border-2 px-3 py-3 text-sm font-semibold transition-colors
          {clueType === 'color'
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-border bg-muted text-muted-foreground'}"
        onclick={() => selectType('color')}
      >
        Color
      </button>
      <button
        class="flex-1 rounded-lg border-2 px-3 py-3 text-sm font-semibold transition-colors
          {clueType === 'letter'
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-border bg-muted text-muted-foreground'}"
        onclick={() => selectType('letter')}
      >
        Letter
      </button>
    </div>
  </div>

  <!-- Step 2: pick value -->
  {#if clueType === 'color'}
    <div class="mb-6">
      <p class="mb-3 text-sm font-semibold text-foreground">Pick a color</p>
      <div class="grid grid-cols-4 gap-2">
        {#each CLUE_COLORS as color}
          <button
            class="flex flex-col items-center gap-1.5 rounded-lg border-2 p-2 transition-colors
              {clueValue === color.name
              ? 'border-primary bg-primary/10'
              : 'border-border bg-muted'}"
            onclick={() => (clueValue = color.name)}
          >
            <span
              class="h-8 w-8 rounded-full border border-border"
              style="background-color: {color.hex}"
            ></span>
            <span class="text-xs font-medium text-foreground">{color.name}</span>
          </button>
        {/each}
      </div>
    </div>
  {:else if clueType === 'letter'}
    <div class="mb-6">
      <p class="mb-3 text-sm font-semibold text-foreground">Pick a letter</p>
      <div class="grid grid-cols-5 gap-1.5">
        {#each LETTERS as letter}
          <button
            class="rounded-lg border-2 py-2.5 text-sm font-semibold transition-colors
              {clueValue === letter
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border bg-muted text-muted-foreground'}"
            onclick={() => (clueValue = letter)}
          >
            {letter}
          </button>
        {/each}
      </div>
    </div>
  {/if}

  <div class="mt-auto pt-4">
    <Button class="w-full" size="lg" disabled={!clueType || !clueValue} onclick={handleConfirm}>
      Confirm Clue
    </Button>
  </div>
</main>
