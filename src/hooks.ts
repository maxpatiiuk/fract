import type { Component, Node } from './index';
import type { IR, RA } from './types';
import { defined } from './types';

const hooksStore: Map<
  Component,
  {
    readonly hookStates: Readonly<
      [
        callback: Function,
        hookState: {
          readonly state: undefined | unknown;
          readonly onRemove?: (() => void) | undefined;
        }
      ]
    >[];
  }
> = new Map();

type Context = {
  readonly component: Component;
  readonly isFirstRender: boolean;
  hookIndex: number;
  readonly onRequestReRender: () => void;
};

let context: undefined | Context = undefined;

export function withHooks({
  component,
  isFirstRender,
  onRequestReRender,
}: {
  component: Component;
  isFirstRender: boolean;
  onRequestReRender: () => void;
}): { readonly node: Node; readonly onRemove: () => void } {
  context = {
    component,
    isFirstRender,
    hookIndex: 0,
    onRequestReRender,
  };
  const node = component();
  context = undefined;
  return {
    node,
    onRemove(): void {
      defined(hooksStore.get(component)).hookStates.forEach(
        ([_callback, { onRemove }]) => onRemove?.()
      );
      hooksStore.delete(component);
    },
  };
}

export const defineHook =
  <ARGUMENTS extends RA<unknown>, STATE extends IR<unknown>, RETURN>(
    callback: (
      hookState: {
        readonly state: STATE | undefined;
        readonly onRemove?: () => void;
        readonly onRequestReRender: () => void;
      },
      ...args: ARGUMENTS
    ) => RETURN
  ): ((...args: ARGUMENTS) => RETURN) =>
  (...args: ARGUMENTS) => {
    if (typeof context === 'undefined')
      throw new Error('Can not call hooks outside of a component');
    let componentState = hooksStore.get(context.component);
    const hookIndex =
      componentState?.hookStates.findIndex(([key]) => key === callback) ?? -1;
    let hookState = componentState?.hookStates[hookIndex]?.[1] as
      | {
          readonly state: STATE | undefined;
          readonly onRequestReRender: () => void;
        }
      | undefined;

    if (context.isFirstRender) {
      if (typeof componentState === 'undefined') {
        componentState = {
          hookStates: [],
        };
        hooksStore.set(context.component, componentState);
      }
      hookState = {
        state: undefined,
        onRequestReRender: context.onRequestReRender,
      };
      componentState.hookStates.push([callback, hookState]);
    } else if (
      typeof componentState === 'undefined' ||
      typeof hookState === 'undefined' ||
      hookIndex !== context.hookIndex
    )
      throw new Error('Hooks can not be called conditionally');

    context.hookIndex += 1;
    return callback(hookState, ...args);
  };
