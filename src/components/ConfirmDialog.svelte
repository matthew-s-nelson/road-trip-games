<script lang="ts">
  import { Dialog } from './ui/dialog';
  import { Button } from './ui/button';

  interface Props {
    open: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
  }

  let { open, message, onConfirm, onCancel }: Props = $props();
</script>

<Dialog {open}>
  <p class="mb-6 text-foreground">{message}</p>
  <div class="flex justify-end gap-2">
    <Button variant="outline" onclick={onCancel}>Cancel</Button>
    <Button variant="destructive" onclick={onConfirm}>Confirm</Button>
  </div>
</Dialog>
