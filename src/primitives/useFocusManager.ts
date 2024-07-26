import { activeElement } from '@lightningtv/vue';
import { watch, ref, onBeforeUnmount } from 'vue';
import { useFocusManager as useFocusManagerCore } from '@lightningtv/core';
import type { KeyMap, KeyHoldOptions, ElementNode } from '@lightningtv/core';

const focusPath = ref<ElementNode[]>();
const setFocusPath = (value: ElementNode[]) => {
  focusPath.value = value;
};
export { focusPath };

export const useFocusManager = (
  userKeyMap?: Partial<KeyMap>,
  keyHoldOptions?: KeyHoldOptions,
) => {
  const { cleanup, focusPath: focusPathCore } = useFocusManagerCore({
    userKeyMap,
    keyHoldOptions,
  });

  watch(
    activeElement,
    () => {
      setFocusPath([...focusPathCore()]);
    },
    { flush: 'post' },
  );
  onBeforeUnmount(cleanup);
};
