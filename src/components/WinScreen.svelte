<script lang="ts">
  import { fly } from 'svelte/transition';
  import { Trophy } from 'lucide-svelte';
  import { Button } from './ui/button';

  interface Props {
    title: string;
    stats: { label: string; value: string }[];
    onPlayAgain: () => void;
  }

  let { title, stats, onPlayAgain }: Props = $props();
</script>

<div
  class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background px-6"
  transition:fly={{ y: 50, duration: 250 }}
>
  <Trophy class="mb-4 h-16 w-16 text-primary" />
  <h2 class="mb-2 text-3xl font-bold text-foreground">{title}</h2>

  {#if stats.length > 0}
    <ul class="mb-8 mt-4 w-full max-w-xs space-y-2">
      {#each stats as stat}
        <li class="flex justify-between text-sm text-foreground">
          <span class="text-muted-foreground">{stat.label}</span>
          <span class="font-semibold">{stat.value}</span>
        </li>
      {/each}
    </ul>
  {/if}

  <Button onclick={onPlayAgain} size="lg">Play Again</Button>
</div>
