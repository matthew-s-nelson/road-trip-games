import type { Component } from 'svelte';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = Component<any, any, any> | (new (...args: any[]) => any);

export interface GameDefinition {
  id: string;
  title: string;
  description: string;
  icon: AnyComponent;
  route: string;
  component: Component;
}

export interface BaseGameState {
  schemaVersion: number;
  startedAt: string | null;
  completedAt: string | null;
}
