import { ElementNode, ElementText } from '@lightningtv/core';

export type VueNode = ElementNode | ElementText;

declare module '@lightningtv/core' {
  interface ElementText {
    skipFocus: true;
  }
}

export const comment = 'comment';
export interface CommentNode {
  id?: string;
  text: string;
  type: 'comment';
  parent?: ElementNode;
  skipFocus: boolean;
}
