<template>
  <node
    :onLeft="handleLeft"
    :onRight="handleRight"
    :forwardFocus="onGridFocus"
    :onSelectedChanged="selectedChanged"
    :onLayout="setupScroll"
    :style="[style, props.style]"
    :scroll="props.scroll"
    :scrollIndex="props.scrollIndex"
    :selected="props.selected"
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
  onLayout?: (elm: ElementNode, selected: ElementNode) => void;
  onLeft?: KeyHandler;
  onRight?: KeyHandler;
  onSelectedChanged?: (
    container: ElementNode,
    activeElm: ElementNode,
    selectedIndex: number,
    lastSelectedIndex: number | undefined,
  ) => void;
  style?: Styles;
}>();
const handleLeft = chainFunctions(props.onLeft, handleNavigation('left'));
const handleRight = chainFunctions(props.onRight, handleNavigation('right'));
const scroll = withScrolling(true);
const selectedChanged = chainFunctions(
  props.onSelectedChanged,
  props.scroll !== 'none' ? scroll : undefined,
);
const setupScroll = props.selected
  ? chainFunctions(props.onLayout, (elm: ElementNode, selected) =>
      scroll(elm, selected),
    )
  : props.onLayout;

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
