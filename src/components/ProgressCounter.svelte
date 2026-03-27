<script lang="ts">
  interface Props {
    current: number;
    total: number;
    label: string;
  }

  let { current, total, label }: Props = $props();
</script>

<p class="text-sm text-muted-foreground">
  <span class="font-semibold text-foreground">{current}</span>
  {' / '}
  <span class="font-semibold text-foreground">{total}</span>
  {' '}{label}
</p>
