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
import { CommentNode, comment } from './types.js';

export default {
  createElement(name: string): ElementNode {
    const node = new ElementNode(name);
    markRaw(node);
    return node;
  },
  createText(text: string): ElementText {
    // A text node is just a string - not the <text> node
    return { type: NodeType.Text, text, parent: undefined, skipFocus: true };
  },

  createComment(text: string): CommentNode {
    // v-if tags go into here
    return { type: comment, text, parent: undefined, skipFocus: true };
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
    prevValue: any = true,
    value: any = true,
  ): void {
    node[name] = value;
  },
  insert(
    node: ElementNode,
    parent: ElementNode,
    anchor?: ElementNode | null,
  ): void {
    log('INSERT: ', parent, node, anchor);

    parent.children.insert(node, anchor);
    node._queueDelete = false;

    if (node instanceof ElementNode) {
      parent.rendered && node.render();
    } else if (parent.isTextNode()) {
      // TextNodes can be placed outside of <text> nodes when <Show> is used as placeholder
      parent.text = parent.getText();
    }
  },
  isTextNode(node: ElementNode): boolean {
    return node.isTextNode();
  },
  remove(node: ElementNode): void {
    log('REMOVE: ', node);
    node.parent!.children.remove(node);
    node._queueDelete = true;

    if (node instanceof ElementNode) {
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
    const children = node.parent!.children || [];
    const index = children.indexOf(node) + 1;
    if (index < children.length) {
      return children[index];
    }
    return undefined;
  },
};
