import '@testing-library/jest-dom';

// Node.js 22+ provides a built-in `localStorage` that throws unless configured
// with `--localstorage-file`. Override it with an in-memory implementation so
// tests work without jsdom needing to replace it first.
class MemoryStorage implements Storage {
  private store: Map<string, string> = new Map();

  get length() {
    return this.store.size;
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

Object.defineProperty(globalThis, 'localStorage', {
  value: new MemoryStorage(),
  writable: true,
  configurable: true,
});
