import { Config, type ElementNode } from '@lightningtv/core';
import { ref } from '@vue/reactivity';
import type { Ref } from '@vue/reactivity';
export const activeElement: Ref<ElementNode | undefined> = ref(undefined);
export const setActiveElement = (val: ElementNode) =>
  (activeElement.value = val);

Config.setActiveElement = setActiveElement;
