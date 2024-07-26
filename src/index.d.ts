import { ElementNode } from '@lightningtv/core';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties extends ElementNode {}
  interface ComponentCustomProps extends ElementNode {}
}

declare module 'vue' {
  interface ComponentCustomProperties extends ElementNode {}
  interface ComponentCustomProps extends ElementNode {}
}
