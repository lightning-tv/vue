<template>
  <node
    :onUp="handleUp"
    :onDown="handleDown"
    :forwardFocus="onGridFocus"
    :onSelectedChanged="selectedChanged"
    :onBeforeLayout="setupScroll"
    :style="[style, props.style]"
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

const attrs: Partial<ElementNode> = useAttrs();

const handleUp = chainFunctions(attrs.onUp, handleNavigation('up'));
const handleDown = chainFunctions(attrs.onDown, handleNavigation('down'));
const scroll = computed(() => withScrolling(false, attrs.y || attrs.style?.y));

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
  flexDirection: 'column',
  gap: 30,
  transition: {
    y: {
      easing: 'ease-in-out',
      duration: 250,
    },
  },
};
</script>
