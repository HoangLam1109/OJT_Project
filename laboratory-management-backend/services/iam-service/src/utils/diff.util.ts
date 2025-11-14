export function computeChanges<T extends object>(
  before: Partial<T> | null | undefined,
  after: Partial<T> | null | undefined,
  keys: (keyof T)[],
  extra?: Record<string, unknown>
): { oldValues?: Record<string, unknown>; newValues?: Record<string, unknown> } {
  if (!before && !after) {
    const onlyExtra = extra && Object.keys(extra).length ? { newValues: { ...extra } } : {};
    return onlyExtra;
  }

  const oldValues: Record<string, unknown> = {};
  const newValues: Record<string, unknown> = {};

  for (const key of keys) {
    const prev = before?.[key];
    const next = after?.[key];

    const isArray = Array.isArray(prev) || Array.isArray(next);
    const changed = isArray
      ? JSON.stringify(prev ?? null) !== JSON.stringify(next ?? null)
      : prev !== next;

    if (changed) {
      if (before) oldValues[key as string] = prev as unknown;
      if (after) newValues[key as string] = next as unknown;
    }
  }

  if (extra && Object.keys(extra).length) {
    for (const [k, v] of Object.entries(extra)) {
      newValues[k] = v;
    }
  }

  const result: { oldValues?: Record<string, unknown>; newValues?: Record<string, unknown> } = {};
  if (Object.keys(oldValues).length) result.oldValues = oldValues;
  if (Object.keys(newValues).length) result.newValues = newValues;
  return result;
}