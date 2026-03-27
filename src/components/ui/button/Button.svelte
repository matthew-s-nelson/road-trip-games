<script lang="ts">
  import { cn } from '$lib/utils';

  interface Props {
    variant?: 'default' | 'destructive' | 'outline' | 'ghost';
    size?: 'default' | 'sm' | 'lg';
    disabled?: boolean;
    class?: string;
    onclick?: (e: MouseEvent) => void;
    children?: import('svelte').Snippet;
    type?: 'button' | 'submit' | 'reset';
    'aria-label'?: string;
  }

  let {
    variant = 'default',
    size = 'default',
    disabled = false,
    class: className = '',
    onclick,
    children,
    type = 'button',
    'aria-label': ariaLabel,
  }: Props = $props();

  const base =
    'inline-flex items-center justify-center rounded font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50';

  const variants: Record<string, string> = {
    default: 'bg-primary text-primary-foreground hover:opacity-90',
    destructive: 'bg-destructive text-destructive-foreground hover:opacity-90',
    outline:
      'border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground text-foreground',
  };

  const sizes: Record<string, string> = {
    default: 'h-10 px-4 py-2 text-sm',
    sm: 'h-8 px-3 text-xs',
    lg: 'h-12 px-6 text-base',
  };
</script>

<button
  {type}
  {disabled}
  aria-label={ariaLabel}
  class={cn(base, variants[variant], sizes[size], className)}
  {onclick}
>
  {@render children?.()}
</button>
