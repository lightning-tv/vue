import { ElementNode } from '@lightningtv/core';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties extends ElementNode {}
}
