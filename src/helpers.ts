export function error(message: string): never {
  throw new Error(message);
}

export const unCapitalize = <T extends string>(string: T): Uncapitalize<T> =>
  (string.charAt(0).toLowerCase() + string.slice(1)) as Uncapitalize<T>;
