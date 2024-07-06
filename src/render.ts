/* eslint-disable @typescript-eslint/unbound-method */
import { type VNode, createRenderer } from '@vue/runtime-core';
import nodeOps from './vueOps.js';
import { extend } from '@vue/shared';
import { Config, startLightningRenderer } from '@lightningtv/core';
const patchProp = nodeOps.setProperty;

export const createApp = function (
  code: VNode,
  node?: string | HTMLElement | undefined,
) {
  const renderer = startLightningRenderer(Config.rendererOptions, node);
  const rootNode = nodeOps.createElement('App');
  rootNode.lng = renderer.root!;
  rootNode.rendered = true;
  const app = baseCreateApp(code);
  return {
    app,
    rootNode,
    renderer,
  };
};

const { render, createApp: baseCreateApp } = createRenderer(
  extend({ patchProp }, nodeOps),
);

export { render };
export * from './vueOps.js';
export * from '@vue/runtime-core';
