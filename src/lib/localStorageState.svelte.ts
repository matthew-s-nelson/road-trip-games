export const storageAvailable = (() => {
  try {
    const key = '__rtg_test__';
    localStorage.setItem(key, '1');
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
})();

type Migrations = Record<number, (old: unknown) => unknown>;

export function createLocalStorageState<T extends { schemaVersion: number }>(
  key: string,
  initialValue: T,
  migrations: Migrations = {}
) {
  function loadState(): T {
    if (!storageAvailable) return initialValue;

    const raw = localStorage.getItem(key);
    if (!raw) return initialValue;

    const stored = JSON.parse(raw) as { schemaVersion?: number };
    const storedVersion = stored.schemaVersion ?? 0;
    const currentVersion = initialValue.schemaVersion;

    if (storedVersion === currentVersion) {
      return stored as T;
    }

    let state: unknown = stored;
    for (let v = storedVersion; v < currentVersion; v++) {
      if (migrations[v]) {
        state = migrations[v](state);
      } else {
        return initialValue;
      }
    }
    return state as T;
  }

  let value = $state<T>(loadState());

  $effect.root(() => {
    $effect(() => {
      if (!storageAvailable) return;
      localStorage.setItem(key, JSON.stringify(value));
    });
  });

  return {
    get value() {
      return value;
    },
    set value(v: T) {
      value = v;
    },
    reset() {
      value = initialValue;
    },
  };
}
