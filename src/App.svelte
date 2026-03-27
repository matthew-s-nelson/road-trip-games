<script lang="ts">
  import Router from 'svelte-spa-router';
  import { TriangleAlert } from 'lucide-svelte';
  import HomeScreen from './screens/HomeScreen.svelte';
  import NotFound from './screens/NotFound.svelte';
  import { games } from './games/registry';
  import { storageAvailable } from './lib/localStorageState.svelte';

  const gameRoutes = Object.fromEntries(games.map((g) => [g.route, g.component]));

  const routes = {
    '/': HomeScreen,
    ...gameRoutes,
    '*': NotFound,
  };
</script>

{#if !storageAvailable}
  <div class="flex items-center gap-3 bg-destructive px-4 py-3 text-destructive-foreground">
    <TriangleAlert class="h-5 w-5 flex-shrink-0" />
    <p class="text-sm font-medium">
      <strong>Progress won't be saved.</strong> You may be in a private browsing window. Open this app
      in a regular browser tab to save your game progress.
    </p>
  </div>
{/if}

<Router {routes} />
