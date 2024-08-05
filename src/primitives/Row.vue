<template>
  <node
    :onLeft="handleLeft"
    :onRight="handleRight"
    :forwardFocus="onGridFocus"
    :onSelectedChanged="selectedChanged"
    :onBeforeLayout="setupScroll"
    :style="[style, attrs.style]"
  >
    <slot></slot>
  </node>
</template>

<script setup lang="ts">
import { ElementNode } from '@lightningtv/core';
import {
  handleNavigation,
  onGridFocus,
  chainFunctions,
  withScrolling,
} from '@lightningtv/solid-ui/utils';
import { computed } from '@vue/reactivity';
import { useAttrs } from 'vue';

const attrs: Partial<ElementNode> & { scroll?: string } = useAttrs();
const handleLeft = chainFunctions(attrs.onLeft, handleNavigation('left'));
const handleRight = chainFunctions(attrs.onRight, handleNavigation('right'));
const scroll = computed(() => withScrolling(true, attrs.x || attrs.style?.x));
const selectedChanged = chainFunctions(
  attrs.onSelectedChanged,
  attrs.scroll !== 'none' ? scroll.value : undefined,
);
const setupScroll = chainFunctions(attrs.onBeforeLayout, (elm, selected) =>
  scroll.value(elm, selected),
);

const style = {
  display: 'flex',
  flexBoundary: 'fixed',
  flexDirection: 'row',
  gap: 30,
  transition: {
    x: {
      easing: 'ease-in-out',
      duration: 250,
    },
  },
};
</script>
