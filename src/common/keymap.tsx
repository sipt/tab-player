interface HotKey {
  altKey: boolean;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/KeyboardEvent/code) */
  readonly code: string;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/KeyboardEvent/ctrlKey) */
  readonly ctrlKey: boolean;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/KeyboardEvent/isComposing) */
  readonly isComposing: boolean;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/KeyboardEvent/key) */
  readonly key: string;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/KeyboardEvent/metaKey) */
  readonly metaKey: boolean;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/KeyboardEvent/shiftKey) */
  readonly shiftKey: boolean;
}

const KeyCode = {
  Escape: "􀆧",
  Tab: "􀅂",
  Backspase: "􁂈",
  Capslock: "􀆡",
  Command: "􀆔",
  Option: "􀆕",
  Shift: "􀆝",
  Alt: "􀆖",
  Control: "􀆍",
  Enter: "􀅇",
  Fn: "􀥌",
  Win: "􀚈",
  Space: "􁁺",
  ArrowUp: "􀄨",
  ArrowDown: "􀄩",
  ArrowLeft: "􀄪",
  ArrowRight: "􀄫",
};

function getKeyCode(e: KeyboardEvent) {}

export { KeyCode };
