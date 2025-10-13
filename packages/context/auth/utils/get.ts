export function getTypeSafe<
  T extends { [key: string]: any },
  Key extends keyof T
>(obj: T, key: Key) {
  return obj[key] as T[Key];
}
