import type { Component } from 'svelte';

export interface GameDefinition {
  id: string;
  title: string;
  description: string;
  icon: Component;
  route: string;
  component: Component;
}

export interface BaseGameState {
  schemaVersion: number;
  startedAt: string | null;
  completedAt: string | null;
}
