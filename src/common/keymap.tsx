interface Hotkey {
  altKey: boolean;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/KeyboardEvent/code) */
  code: string;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/KeyboardEvent/ctrlKey) */
  ctrlKey: boolean;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/KeyboardEvent/key) */
  key: string;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/KeyboardEvent/metaKey) */
  metaKey: boolean;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/KeyboardEvent/shiftKey) */
  shiftKey: boolean;
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

class HotkeyManager {
  private locked = false;
  constructor(
    public hotkey: {
      set(Hotkey): void;
      get(): Hotkey;
    }
  ) {}

  handle(e: KeyboardEvent) {
    let h: Hotkey = this.hotkey.get();
    switch (e.type) {
      case "keydown":
        if (!this.locked) {
          this.locked = true;
          h = {} as Hotkey;
        }
        h.altKey = h.altKey || e.altKey;
        h.code =
          e.code &&
          ![
            "ShiftLeft",
            "ShiftRight",
            "ControlLeft",
            "ControlRight",
            "AltLeft",
            "AltRight",
            "MetaLeft",
            "MetaRight",
          ].includes(e.code)
            ? e.code
            : h.code;
        h.ctrlKey = h.ctrlKey || e.ctrlKey;
        h.key = h.key || e.key;
        h.metaKey = h.metaKey || e.metaKey;
        h.shiftKey = h.shiftKey || e.shiftKey;
        this.hotkey.set(h);
        break;
      case "keyup":
        if (!e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
          this.locked = false;
        }
        break;
      default:
        break;
    }
  }

  Symbols() {
    const h = this.hotkey.get();
    const symbols = [];
    if (h.ctrlKey) {
      symbols.push(KeyCode.Control);
    }
    if (h.metaKey) {
      symbols.push(KeyCode.Command);
    }
    if (h.altKey) {
      symbols.push(KeyCode.Option);
    }
    if (h.shiftKey) {
      symbols.push(KeyCode.Shift);
    }
    if (h.code) {
      switch (h.code) {
        case "Escape":
          symbols.push(KeyCode.Escape);
          break;
        case "Space":
          symbols.push(KeyCode.Space);
          break;
        case "Tab":
          symbols.push(KeyCode.Tab);
          break;
        case "Backspace":
          symbols.push(KeyCode.Backspase);
          break;
        case "CapsLock":
          symbols.push(KeyCode.Capslock);
          break;
        case "Enter":
          symbols.push(KeyCode.Enter);
          break;
        case "ArrowUp":
          symbols.push(KeyCode.ArrowUp);
          break;
        case "ArrowDown":
          symbols.push(KeyCode.ArrowDown);
          break;
        case "ArrowLeft":
          symbols.push(KeyCode.ArrowLeft);
          break;
        case "ArrowRight":
          symbols.push(KeyCode.ArrowRight);
          break;
        default:
          if (h.code.startsWith("Key")) {
            symbols.push(h.code.replace("Key", ""));
          } else if (h.code.startsWith("Digit")) {
            symbols.push(h.code.replace("Digit", ""));
          } else if (h.code.startsWith("Numpad")) {
            symbols.push(h.code.replace("Numpad", ""));
          }
          break;
      }
    }
    return symbols;
  }
}

function MatchHotkey(hotkey: Hotkey, e: KeyboardEvent): boolean {
  return (
    hotkey.altKey === e.altKey &&
    hotkey.code === e.code &&
    hotkey.ctrlKey === e.ctrlKey &&
    hotkey.metaKey === e.metaKey &&
    hotkey.shiftKey === e.shiftKey
  );
}

export { KeyCode, Hotkey, HotkeyManager, MatchHotkey };
