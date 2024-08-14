<template>
  <node
    v-bind="props"
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
import { ElementNode, type KeyHandler, type Styles } from '@lightningtv/core';
import {
  handleNavigation,
  onGridFocus,
  chainFunctions,
  withScrolling,
} from '@lightningtv/solid-ui/utils';

const props = defineProps<{
  scrollIndex?: number;
  selected?: number;
  scroll?: string;
  onBeforeLayout?: (elm: ElementNode, selected: ElementNode) => void;
  onUp?: KeyHandler;
  onDown?: KeyHandler;
  onSelectedChanged?: (
    container: ElementNode,
    activeElm: ElementNode,
    selectedIndex: number,
    lastSelectedIndex: number | undefined,
  ) => void;
  style?: Styles;
}>();

const handleUp = chainFunctions(props.onUp, handleNavigation('up'));
const handleDown = chainFunctions(props.onDown, handleNavigation('down'));
const scroll = withScrolling(false);

const selectedChanged = chainFunctions(
  props.onSelectedChanged,
  props.scroll !== 'none' ? scroll : undefined,
);

const setupScroll = props.selected
  ? chainFunctions(props.onBeforeLayout, (elm: ElementNode, selected) =>
      scroll(elm, selected),
    )
  : props.onBeforeLayout;

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
