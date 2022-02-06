import { Props, Node } from './index';

export type ElementInstance<
  PROPS extends undefined | Props,
  CHILDREN extends Node
> = {
  tagName: string;
  props: PROPS;
  children: CHILDREN;
};

type IntrinsicElement<
  PROPS extends undefined | Props,
  CHILDREN extends Node
> = (props: PROPS, children?: CHILDREN) => ElementInstance<PROPS, CHILDREN>;

type ChildType = boolean | 'string';

const defineElement =
  <CHILDREN extends ChildType, TAG_NAME extends keyof HTMLElementTagNameMap>({
    tagName,
    children: _,
  }: {
    tagName: TAG_NAME;
    children: boolean | 'string';
  }): IntrinsicElement<
    Props<TAG_NAME>,
    | undefined
    | (CHILDREN extends false
        ? undefined
        : CHILDREN extends true
        ? Node
        : CHILDREN extends 'string'
        ? string
        : never)
  > =>
  (props, children) => ({
    tagName,
    children,
    props,
  });

export const el = {
  b: defineElement({
    tagName: 'b',
    children: true,
  }),
  i: defineElement({
    tagName: 'i',
    children: true,
  }),
  br: defineElement({
    tagName: 'br',
    children: false,
  }),
  p: defineElement({
    tagName: 'p',
    children: true,
  }),
  input: defineElement({
    tagName: 'input',
    children: true,
  }),
};
