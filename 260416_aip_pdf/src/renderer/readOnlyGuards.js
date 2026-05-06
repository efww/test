const BLOCKED_KEYS = new Set(["p", "s", "c"]);

export function installReadOnlyGuards({ onBlockedAction } = {}) {
  const report = (action, source) => {
    if (onBlockedAction) onBlockedAction({ action, source, ts: new Date().toISOString() });
  };

  document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    report("context_menu", "mouse");
  });

  document.addEventListener("dragstart", (event) => {
    event.preventDefault();
    report("drag", "mouse");
  });

  document.addEventListener("copy", (event) => {
    event.preventDefault();
    report("copy", "clipboard");
  });

  window.addEventListener("beforeprint", (event) => {
    event.preventDefault();
    report("print", "browser");
  });

  document.addEventListener("keydown", (event) => {
    if (!(event.ctrlKey || event.metaKey)) return;
    const key = event.key.toLowerCase();
    if (!BLOCKED_KEYS.has(key)) return;

    event.preventDefault();
    const action = key === "p" ? "print" : key === "s" ? "save" : "copy";
    report(action, "keyboard");
  });

  if (window.print) {
    window.print = () => report("print", "window");
  }
}
