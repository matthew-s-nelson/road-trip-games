<script lang="ts">
  import { PackageOpen } from 'lucide-svelte';
  import { Card } from '../components/ui/card';
  import { games } from '../games/registry';
</script>

<main class="min-h-screen bg-background px-4 py-8">
  <h1 class="mb-6 text-3xl font-bold text-foreground">Road Trip Games</h1>

  {#if games.length === 0}
    <div class="flex flex-col items-center gap-4 py-16 text-muted-foreground">
      <PackageOpen class="h-16 w-16" />
      <p class="text-lg">No games yet</p>
    </div>
  {:else}
    <div class="grid gap-4 sm:grid-cols-2">
      {#each games as game}
        <a href="#{game.route}" class="block no-underline">
          <Card class="flex items-start gap-4 p-4 transition-colors hover:bg-accent">
            <svelte:component this={game.icon} class="mt-0.5 h-6 w-6 flex-shrink-0 text-primary" />
            <div>
              <h2 class="font-semibold text-foreground">{game.title}</h2>
              <p class="mt-1 text-sm text-muted-foreground">{game.description}</p>
            </div>
          </Card>
        </a>
      {/each}
    </div>
  {/if}
</main>
