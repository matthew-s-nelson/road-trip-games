<script lang="ts">
  import { cn } from '$lib/utils';

  interface Props {
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    class?: string;
    oninput?: (e: Event & { currentTarget: HTMLInputElement }) => void;
  }

  let {
    value = $bindable(''),
    placeholder = '',
    disabled = false,
    class: className = '',
    oninput,
  }: Props = $props();
</script>

<input
  bind:value
  {placeholder}
  {disabled}
  {oninput}
  class={cn(
    'flex h-10 w-full rounded border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
    className
  )}
/>
