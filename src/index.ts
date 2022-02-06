import type { ElementInstance } from './elements';
import { unCapitalize } from './helpers';
import * as hooks from './hookDefinitions';
import { withHooks } from './hooks';
import type { RA } from './types';

export type Props<
  TAG_NAME extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap
> =
  | ({
      [KEY in keyof HTMLElementTagNameMap[TAG_NAME] as HTMLElementTagNameMap[TAG_NAME][KEY] extends
        | string
        | number
        ? KEY
        : never]?: string;
    } & {
      [KEY in `on${Capitalize<string>}`]: (event: Event) => void;
    })
  | undefined;

export type Node =
  | undefined
  | NodeElement
  | string
  | RA<NodeElement | string | undefined>;

interface NodeElement extends ElementInstance<Props, Node> {}

function render(tree: Node): DocumentFragment {
  const fragment = new DocumentFragment();

  if (typeof tree === 'string') fragment.textContent = tree;
  else if (Array.isArray(tree)) fragment.append(...tree.map(render));
  else if (typeof tree === 'object') {
    const element = document.createElement(tree.tagName);
    if (typeof tree.children === 'string') element.textContent = tree.children;
    else if (Array.isArray(tree.children))
      element.append(...tree.children.map(render));
    else if (typeof tree.children === 'object')
      element.append(render(tree.children));

    Object.entries(tree.props ?? {}).forEach(([key, value]) => {
      if (key.startsWith('on') && key[2].toUpperCase() === key[2])
        element.addEventListener(
          unCapitalize(key.slice(2)),
          value as (event: Event) => void
        );
      else element.setAttribute(key, value as string);
    });

    fragment.append(element);
  }

  return fragment;
}

export type Component = () => Node;

export function Fract(component: Component, container: HTMLElement): void {
  // TODO: handle onRemove and onRequestReRender
  const { node, onRemove } = withHooks({
    component: component.bind(undefined),
    isFirstRender: true,
    onRequestReRender: () => console.error('ReRender Requested'),
  });
  void (() => onRemove);
  container.append(render(node));
}

const defaultExport = {
  render: Fract,
  ...hooks,
};

export default defaultExport;

export { el } from './elements';
