<script lang="ts">
  import { MapPin } from 'lucide-svelte';
</script>

<main
  class="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center"
>
  <MapPin class="h-16 w-16 text-muted-foreground" />
  <h1 class="text-2xl font-bold text-foreground">Page Not Found</h1>
  <p class="text-muted-foreground">That route doesn't exist.</p>
  <a href="#/" class="text-primary underline">Back to home</a>
</main>
