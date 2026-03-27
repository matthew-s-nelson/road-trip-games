<script lang="ts">
  import { Button } from './ui/button';
  import { Input } from './ui/input';

  interface Props {
    maxPlayers: number;
    onStart: (playerNames: string[]) => void;
  }

  let { maxPlayers, onStart }: Props = $props();

  let names = $state<string[]>(['']);

  function addPlayer() {
    if (names.length < maxPlayers) {
      names = [...names, ''];
    }
  }

  function removePlayer(index: number) {
    names = names.filter((_, i) => i !== index);
  }

  function updateName(index: number, value: string) {
    names = names.map((n, i) => (i === index ? value : n));
  }

  const hasValidName = $derived(names.some((n) => n.trim().length > 0));

  function handleStart() {
    const validNames = names.filter((n) => n.trim().length > 0);
    onStart(validNames);
  }
</script>

<div class="flex flex-col gap-4 p-4">
  <h2 class="text-xl font-semibold text-foreground">Players</h2>

  {#each names as name, i}
    <div class="flex gap-2">
      <Input
        value={name}
        placeholder="Player {i + 1}"
        oninput={(e) => updateName(i, e.currentTarget.value)}
      />
      {#if names.length > 1}
        <Button
          variant="ghost"
          size="sm"
          onclick={() => removePlayer(i)}
          aria-label="Remove player"
        >
          &times;
        </Button>
      {/if}
    </div>
  {/each}

  {#if names.length < maxPlayers}
    <Button variant="outline" onclick={addPlayer}>Add Player</Button>
  {/if}

  <Button disabled={!hasValidName} onclick={handleStart} size="lg">Start Game</Button>
</div>
