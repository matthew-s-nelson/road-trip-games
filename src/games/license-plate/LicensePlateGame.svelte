<script lang="ts">
  import { fly } from 'svelte/transition';
  import { Trophy, Share2, ArrowUpDown } from 'lucide-svelte';
  import GameHeader from '../../components/GameHeader.svelte';
  import ProgressCounter from '../../components/ProgressCounter.svelte';
  import { Button } from '../../components/ui/button';
  import {
    licensePlateState,
    markFound,
    unmarkFound,
    resetGame,
    formatDuration,
    formatTime,
    US_STATES,
  } from './licensePlateState.svelte';

  let foundSort = $state<'alpha' | 'time'>('alpha');
  let copied = $state(false);

  let foundCount = $derived(Object.keys(licensePlateState.value.found).length);
  let isComplete = $derived(foundCount === 50);
  let unfoundStates = $derived(US_STATES.filter((s) => !(s in licensePlateState.value.found)));
  let foundStates = $derived(
    US_STATES.filter((s) => s in licensePlateState.value.found).map((s) => ({
      name: s,
      timestamp: licensePlateState.value.found[s],
    }))
  );
  let sortedFoundStates = $derived(
    foundSort === 'alpha'
      ? foundStates.slice().sort((a, b) => a.name.localeCompare(b.name))
      : foundStates.slice().sort((a, b) => b.timestamp.localeCompare(a.timestamp))
  );
  let lastFoundState = $derived(
    foundStates.reduce(
      (latest, s) => (!latest || s.timestamp > latest.timestamp ? s : latest),
      null as (typeof foundStates)[0] | null
    )
  );
  let duration = $derived(
    licensePlateState.value.startedAt && licensePlateState.value.completedAt
      ? formatDuration(licensePlateState.value.startedAt, licensePlateState.value.completedAt)
      : ''
  );

  async function handleShare() {
    const text = `I found all 50 license plates in ${duration}. Try to beat my time at ${window.location.href}`;
    if (navigator.share) {
      await navigator.share({ text });
    } else {
      await navigator.clipboard.writeText(text);
      copied = true;
      setTimeout(() => (copied = false), 2000);
    }
  }
</script>

<div class="flex min-h-dvh flex-col bg-background">
  <GameHeader title="License Plate" onReset={resetGame} />

  {#if isComplete}
    <div
      class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background px-6"
      transition:fly={{ y: 50, duration: 250 }}
    >
      <Trophy class="mb-4 h-16 w-16 text-primary" />
      <h2 class="mb-2 text-3xl font-bold text-foreground">All 50 Found!</h2>

      <ul class="mb-8 mt-4 w-full max-w-xs space-y-2">
        {#if duration}
          <li class="flex justify-between text-sm text-foreground">
            <span class="text-muted-foreground">Time</span>
            <span class="font-semibold">{duration}</span>
          </li>
        {/if}
        {#if lastFoundState}
          <li class="flex justify-between text-sm text-foreground">
            <span class="text-muted-foreground">Last found</span>
            <span class="font-semibold">{lastFoundState.name}</span>
          </li>
        {/if}
      </ul>

      <div class="flex flex-col items-stretch gap-3 w-full max-w-xs">
        <Button onclick={handleShare} size="lg" variant="outline">
          <Share2 class="mr-2 h-4 w-4" />
          {copied ? 'Copied!' : 'Share'}
        </Button>
        <Button onclick={resetGame} size="lg">Play Again</Button>
      </div>
    </div>
  {/if}

  <main class="flex-1 overflow-y-auto px-4 py-4 space-y-6">
    <ProgressCounter current={foundCount} total={50} label="states found" />

    <section>
      <h2 class="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Not Yet Found ({unfoundStates.length})
      </h2>
      <ul class="grid grid-cols-2 gap-2">
        {#each unfoundStates as state}
          <li>
            <button
              class="tap-pulse w-full rounded-lg border-2 border-border bg-surface px-3 py-4 text-center text-sm font-semibold text-foreground hover:border-ring hover:bg-accent"
              onclick={() => markFound(state)}
            >
              {state}
            </button>
          </li>
        {/each}
      </ul>
    </section>

    {#if foundCount > 0}
      <section>
        <div class="mb-2 flex items-center justify-between">
          <h2 class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Found ({foundCount})
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onclick={() => (foundSort = foundSort === 'alpha' ? 'time' : 'alpha')}
          >
            <ArrowUpDown class="h-3 w-3" />
            {foundSort === 'alpha' ? 'A–Z' : 'Time'}
          </Button>
        </div>
        <ul class="grid grid-cols-2 gap-2">
          {#each sortedFoundStates as { name, timestamp }}
            <li>
              <button
                class="tap-pulse w-full rounded-lg border border-primary bg-primary px-3 py-4 text-center hover:opacity-90"
                onclick={() => unmarkFound(name)}
              >
                <span class="block text-sm font-semibold text-primary-foreground">{name}</span>
                <span class="block text-xs text-primary-foreground">{formatTime(timestamp)}</span>
              </button>
            </li>
          {/each}
        </ul>
      </section>
    {/if}
  </main>
</div>
