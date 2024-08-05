/*
 * Copyright 2023 Comcast Cable Communications Management, LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { assertTruthy } from '@lightningjs/renderer/utils';
import { markRaw } from '@vue/reactivity';
import {
  ElementNode,
  NodeType,
  type ElementText,
  log,
} from '@lightningtv/core';
import { type CommentNode, comment } from './types.js';

declare module '@lightningtv/core' {
  interface ElementNode {
    _rawNodes: (ElementNode | ElementText)[];
  }
}

function insertChild(
  parent: ElementNode,
  node: ElementNode | ElementText,
  beforeNode?: ElementNode | ElementText | null,
) {
  if (beforeNode) {
    // SolidJS can move nodes around in the children array.
    // We need to insert following DOM insertBefore which moves elements.
    removeChild(parent, node);
    const index = parent._rawNodes.indexOf(beforeNode);
    parent._rawNodes.splice(index, 0, node);
  } else {
    parent._rawNodes.push(node);
  }

  node.parent = parent;
}

function removeChild(parent: ElementNode, node: ElementNode | ElementText) {
  const nodeIndexToRemove = parent._rawNodes.indexOf(node);
  if (nodeIndexToRemove >= 0) {
    parent._rawNodes.splice(nodeIndexToRemove, 1);
  }
}

export default {
  createElement(name: string): ElementNode {
    const node = new ElementNode(name);
    node._rawNodes = [];
    markRaw(node);
    return node;
  },
  createText(text: string): ElementText {
    // A text node is just a string - not the <text> node
    return { _type: NodeType.Text, text, parent: undefined, skipFocus: true };
  },

  createComment(text: string): CommentNode {
    // v-if tags go into here
    return { _type: comment, text, parent: undefined, skipFocus: true };
  },
  setText(node: ElementText, value: string): void {
    log('Replace Text: ', node, value);
    node.text = value;
    const parent = node.parent;
    assertTruthy(parent);
    parent.text = parent.getText();
  },
  setElementText(node: ElementNode, value: string) {
    log('SetElementText: ', node, value);
    node.text = value;
    //node.children[0].text = value;
  },
  setProperty(
    node: ElementNode,
    name: string,
    prevValue: any,
    value: any,
  ): void {
    node[name] = value;
  },
  insert(
    node: ElementNode | ElementText,
    parent: ElementNode,
    anchor?: ElementNode | null,
  ): void {
    log('INSERT: ', parent, node, anchor);
    node._queueDelete = false;
    insertChild(parent, node, anchor);

    if (node instanceof ElementNode) {
      parent.insertChild(node, anchor);
      parent.rendered && node.render();
    } else if (parent.isTextNode()) {
      parent.insertChild(node, anchor);
      // TextNodes can be placed outside of <text> nodes when <Show> is used as placeholder
      parent.text = parent.getText();
    }
  },
  isTextNode(node: ElementNode): boolean {
    return node.isTextNode();
  },
  remove(node: ElementNode): void {
    log('REMOVE: ', node);
    removeChild(node.parent!, node);
    node._queueDelete = true;

    if (node instanceof ElementNode) {
      node.parent!.removeChild(node);

      // Solid replacesNodes to move them (via insert and remove),
      // so we need to wait for the next microtask to destroy the node
      // in the event it gets a new parent.
      queueMicrotask(() => node.destroy());
    }
  },
  querySelector(query: string) {
    return undefined; //getChildById(query);
  },
  setScopeId(node: ElementNode, id: string) {
    return (node.id = id);
  },
  parentNode(node: ElementNode): ElementNode | undefined {
    return node.parent;
  },
  nextSibling(
    node: ElementNode,
  ): ElementNode | ElementText | CommentNode | undefined {
    const children = node.parent!._rawNodes || [];
    const index = children.indexOf(node) + 1;
    if (index < children.length) {
      return children[index];
    }
    return undefined;
  },
};
