import { defineHook } from './hooks';
import type { RA } from './types';
import { defined } from './types';

export const useEffect = defineHook(
  (
    hookState: {
      state:
        | undefined
        | {
            dependencies: RA<unknown>;
            destructor: undefined | (() => void);
          };
      onRemove?: () => void;
    },
    callback: (() => void) | (() => () => void),
    dependencies: RA<unknown>
  ) => {
    if (typeof hookState.state === 'undefined') {
      hookState.state = {
        dependencies,
        destructor: callback() ?? undefined,
      };
      return;
    }

    if (hookState.state.dependencies.length !== dependencies.length)
      throw new Error(
        `useEffect dependency array length changed from ${hookState.state.dependencies.length} to ${dependencies.length}`
      );
    else if (
      hookState.state.dependencies.every((value, index) =>
        Object.is(value, dependencies[index])
      )
    )
      // Dependencies did not change
      return;

    hookState.state.destructor?.();

    hookState.state.dependencies = dependencies;
    hookState.state.destructor = callback() ?? undefined;

    hookState.onRemove = hookState.state.destructor;
  }
);

export const useMemo = defineHook(
  <T>(
    hookState: {
      state:
        | undefined
        | {
            dependencies: RA<unknown>;
            value: T;
          };
      onRemove?: () => void;
    },
    value: T,
    dependencies: RA<unknown>
  ): T => {
    if (
      typeof hookState.state !== 'undefined' &&
      hookState.state.dependencies.length !== dependencies.length
    )
      throw new Error(
        `useMemo dependency array length changed from ${hookState.state.dependencies.length} to ${dependencies.length}`
      );
    if (
      typeof hookState.state === 'undefined' ||
      hookState.state.dependencies.every((value, index) =>
        Object.is(value, dependencies[index])
      )
    )
      hookState.state = {
        dependencies,
        value,
      };

    return defined(hookState.state).value;
  }
);

export const useCallback = <T extends Function>(
  callback: T,
  dependencies: RA<unknown>
) => useMemo<T>(callback, dependencies);

export const useRef = <T>(defaultValue: T) =>
  useMemo<{ current: T }>({ current: defaultValue }, []);

export const useState = defineHook(
  <T>(
    hookState: {
      state:
        | {
            value: T;
          }
        | undefined;
      onRemove?: () => void;
      onRequestReRender: () => void;
    },
    defaultValue: T
  ): Readonly<[T, (newState: T | ((oldState: T) => T)) => void]> => {
    if (typeof hookState.state === 'undefined')
      hookState.state = { value: defaultValue };

    let destructorCalled = false;
    hookState.onRemove = (): void => {
      destructorCalled = true;
    };

    const setState = useCallback((newState: T | ((oldState: T) => T)): void => {
      if (destructorCalled)
        throw new Error('Attempting a state update on an unrendered component');

      const state =
        typeof newState === 'function'
          ? (newState as (oldState: T) => T)(defined(hookState.state).value)
          : newState;
      if (Object.is(state, hookState.state)) return;
      hookState.state = { value: state };
      hookState.onRequestReRender();
    }, []);

    return [hookState.state.value, setState];
  }
);
