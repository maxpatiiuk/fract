// Record
export type R<V> = Record<string, V>;
// Immutable record
export type IR<V> = Readonly<Record<string, V>>;
// Immutable record with constrained keys
export type RR<K extends string | number | symbol, V> = Readonly<Record<K, V>>;
// Immutable Array
export type RA<V> = readonly V[];

/** Cast a type as defined. Throw at runtime if it is not defined */
export function defined<T>(value: T | undefined): T {
  if (typeof value === 'undefined') throw new Error('Value is not defined');
  else return value;
}

/** Filter undefined items out of the array */
export const filterArray = <T>(array: RA<T | undefined>): RA<T> =>
  array.filter((item): item is T => typeof item !== 'undefined');

export const ensure = <T>(value: T) => value;

declare global {
  // Fix Array.isArray() narrowing RA<T> to any[]
  interface ArrayConstructor {
    isArray(argument: ReadonlyArray<any> | any): argument is ReadonlyArray<any>;
  }
}
