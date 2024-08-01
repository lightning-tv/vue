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

const props: Partial<ElementNode> & { scrollIndex?: number; scroll?: string } =
  defineProps();

const handleUp = chainFunctions(props.onUp, handleNavigation('up'));
const handleDown = chainFunctions(props.onDown, handleNavigation('down'));
const scroll = computed(() => withScrolling(false, props.y || props.style?.y));

const selectedChanged = chainFunctions(
  props.onSelectedChanged,
  props.scroll !== 'none' ? scroll.value : undefined,
);

const setupScroll = chainFunctions(props.onBeforeLayout, (elm, selected) =>
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
