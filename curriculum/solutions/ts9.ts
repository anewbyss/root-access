function patch<T>(obj: T, changes: Partial<T>): T {
  return { ...obj, ...changes };
}
function redact<T, K extends keyof T>(obj: T, key: K): Omit<T, K> {
  const { [key]: _removed, ...rest } = obj;
  return rest as Omit<T, K>;
}
