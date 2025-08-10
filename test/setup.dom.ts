import '@testing-library/jest-dom';

if (!Element.prototype.animate) {
  (Element.prototype as any).animate = function () {
    return {
      cancel() {},
      finish() {},
      play() {},
      pause() {},
      reverse() {},
      updatePlaybackRate() {},
      onfinish: null,
      oncancel: null,
      finished: Promise.resolve(),
      playState: 'finished',
    };
  };
}
if (!Element.prototype.getAnimations) {
  (Element.prototype as any).getAnimations = () => [];
}

class ResizeObserverMock {
  observe(_el: Element) {}
  unobserve(_el: Element) {}
  disconnect() {}
}
global.ResizeObserver = global.ResizeObserver || ResizeObserverMock;

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (q: string) => ({
    matches: /prefers-reduced-motion/.test(q) ? false : false,
    media: q,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {
      return false;
    },
  }),
});
