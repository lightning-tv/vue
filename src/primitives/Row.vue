<template>
  <node
    :onLeft="handleLeft"
    :onRight="handleRight"
    :forwardFocus="onGridFocus"
    :onSelectedChanged="selectedChanged"
    :onBeforeLayout="setupScroll"
    :style="[style, props.style]"
  >
    <slot></slot>
  </node>
</template>

<script setup lang="ts">
import { type ElementNode } from '@lightningtv/core';
import {
  handleNavigation,
  onGridFocus,
  chainFunctions,
  withScrolling,
} from '@lightningtv/solid-ui/utils';
import { computed } from '@vue/reactivity';

const props = withDefaults(defineProps<ElementNode>(), {
  scrollIndex: Number,
  scroll: String,
  style: Object,
});

const handleLeft = chainFunctions(props.onLeft, handleNavigation('left'));
const handleRight = chainFunctions(props.onRight, handleNavigation('right'));
const scroll = computed(() => withScrolling(true, props.x));
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
