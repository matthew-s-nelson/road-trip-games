<script lang="ts">
  interface Props {
    open: boolean;
    children?: import('svelte').Snippet;
  }

  let { open, children }: Props = $props();
</script>

{#if open}
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="fixed inset-0 bg-foreground/50" aria-hidden="true"></div>
    <div
      class="relative z-50 w-full max-w-md rounded-lg bg-background p-6 shadow-lg"
      role="dialog"
      aria-modal="true"
    >
      {@render children?.()}
    </div>
  </div>
{/if}
