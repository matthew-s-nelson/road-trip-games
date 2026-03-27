<script lang="ts">
  import { Sun, Moon } from 'lucide-svelte';
  import { Button } from './ui/button';
  import ConfirmDialog from './ConfirmDialog.svelte';
  import { toggleTheme, isDark } from '../lib/theme.svelte';

  interface Props {
    title: string;
    onReset: () => void;
  }

  let { title, onReset }: Props = $props();

  let confirmOpen = $state(false);
</script>

<header class="flex items-center justify-between border-b border-border bg-background px-4 py-3">
  <h1 class="text-lg font-semibold text-foreground">{title}</h1>
  <div class="flex items-center gap-2">
    <Button variant="ghost" size="sm" onclick={() => (confirmOpen = true)}>
      <span class="text-destructive">Reset</span>
    </Button>
    <Button variant="ghost" size="sm" onclick={toggleTheme} aria-label="Toggle theme">
      {#if isDark()}
        <Sun class="h-4 w-4 text-foreground" />
      {:else}
        <Moon class="h-4 w-4 text-foreground" />
      {/if}
    </Button>
  </div>
</header>

<ConfirmDialog
  open={confirmOpen}
  message="Reset all progress? This cannot be undone."
  onConfirm={() => {
    confirmOpen = false;
    onReset();
  }}
  onCancel={() => (confirmOpen = false)}
/>
