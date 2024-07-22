import { watch } from 'vue';
import { Announcer } from './announcer.js';
import { focusPath } from '../useFocusManager.js';

export const useAnnouncer = () => {
  Announcer.setupTimers();
  watch(focusPath, Announcer.onFocusChange!);

  return Announcer;
};
