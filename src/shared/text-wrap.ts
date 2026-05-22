export interface ToggleResult {
  replaceStart: number;
  replaceEnd: number;
  replacement: string;
  selectionStart: number;
  selectionEnd: number;
}

export function computeWrapperToggle(
  value: string,
  start: number,
  end: number,
  wrapper: string,
): ToggleResult | null {
  if (start === end) return null;

  const selected = value.slice(start, end);
  if (!selected) return null;

  const wLen = wrapper.length;

  if (selected.startsWith(wrapper) && selected.endsWith(wrapper) && selected.length >= 2 * wLen) {
    const inner = selected.slice(wLen, -wLen);
    return {
      replaceStart: start,
      replaceEnd: end,
      replacement: inner,
      selectionStart: start,
      selectionEnd: start + inner.length,
    };
  }

  if (
    start >= wLen &&
    end + wLen <= value.length &&
    value.slice(start - wLen, start) === wrapper &&
    value.slice(end, end + wLen) === wrapper
  ) {
    return {
      replaceStart: start - wLen,
      replaceEnd: end + wLen,
      replacement: selected,
      selectionStart: start - wLen,
      selectionEnd: start - wLen + selected.length,
    };
  }

  const wrapped = `${wrapper}${selected}${wrapper}`;
  return {
    replaceStart: start,
    replaceEnd: end,
    replacement: wrapped,
    selectionStart: start + wLen,
    selectionEnd: start + wLen + selected.length,
  };
}

function dispatchInput(element: HTMLElement | HTMLTextAreaElement): void {
  element.dispatchEvent(
    new InputEvent("input", { bubbles: true, composed: true, inputType: "insertText" }),
  );
}

export function wrapTextareaSelection(textarea: HTMLTextAreaElement, wrapper: string): boolean {
  const { selectionStart, selectionEnd, value } = textarea;
  if (selectionStart === null || selectionEnd === null) return false;

  const toggle = computeWrapperToggle(value, selectionStart, selectionEnd, wrapper);
  if (!toggle) return false;

  textarea.value =
    value.slice(0, toggle.replaceStart) + toggle.replacement + value.slice(toggle.replaceEnd);

  textarea.selectionStart = toggle.selectionStart;
  textarea.selectionEnd = toggle.selectionEnd;

  dispatchInput(textarea);
  return true;
}

function getSelectionForElement(element: HTMLElement): Selection | null {
  const root = element.getRootNode();
  if (root instanceof ShadowRoot && root.getSelection) {
    return root.getSelection();
  }
  return window.getSelection();
}

function getSelectionOffsets(
  element: HTMLElement,
  range: Range,
): { start: number; end: number } | null {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let offset = 0;
  let start: number | null = null;
  let end: number | null = null;

  let node = walker.nextNode() as Text | null;
  while (node) {
    if (node === range.startContainer) {
      start = offset + range.startOffset;
    }
    if (node === range.endContainer) {
      end = offset + range.endOffset;
    }
    if (start !== null && end !== null) break;
    offset += node.length;
    node = walker.nextNode() as Text | null;
  }

  if (start === null || end === null) return null;
  return { start, end };
}

function offsetToRange(element: HTMLElement, start: number, end: number): Range | null {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let offset = 0;
  let node = walker.nextNode() as Text | null;

  const range = document.createRange();
  let startSet = false;

  while (node) {
    const nextOffset = offset + node.length;

    if (!startSet && start <= nextOffset) {
      range.setStart(node, start - offset);
      startSet = true;
    }

    if (startSet && end <= nextOffset) {
      range.setEnd(node, end - offset);
      return range;
    }

    offset = nextOffset;
    node = walker.nextNode() as Text | null;
  }

  return null;
}

function setSelectionOffsets(
  element: HTMLElement,
  selection: Selection,
  start: number,
  end: number,
): void {
  const range = offsetToRange(element, start, end);
  if (!range) return;
  selection.removeAllRanges();
  selection.addRange(range);
}

function getElementText(element: HTMLElement): string {
  return element.textContent ?? "";
}

export function wrapContentEditableSelection(element: HTMLElement, wrapper: string): boolean {
  const selection = getSelectionForElement(element);
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return false;

  const range = selection.getRangeAt(0);
  if (!element.contains(range.commonAncestorContainer)) return false;

  const offsets = getSelectionOffsets(element, range);
  if (!offsets) return false;

  const text = getElementText(element);
  const toggle = computeWrapperToggle(text, offsets.start, offsets.end, wrapper);
  if (!toggle) return false;

  const replaceRange = offsetToRange(element, toggle.replaceStart, toggle.replaceEnd);
  if (!replaceRange) return false;

  replaceRange.deleteContents();
  replaceRange.insertNode(document.createTextNode(toggle.replacement));

  setSelectionOffsets(element, selection, toggle.selectionStart, toggle.selectionEnd);
  dispatchInput(element);
  return true;
}

export function wrapSelection(
  element: HTMLTextAreaElement | HTMLElement,
  wrapper: string,
): boolean {
  if (element instanceof HTMLTextAreaElement) {
    return wrapTextareaSelection(element, wrapper);
  }
  return wrapContentEditableSelection(element, wrapper);
}

export function getEditableFromEvent(
  event: KeyboardEvent,
): HTMLTextAreaElement | HTMLElement | null {
  for (const el of event.composedPath()) {
    if (el instanceof HTMLTextAreaElement) return el;
    if (el instanceof HTMLElement && el.isContentEditable) return el;
  }
  return null;
}

/** @deprecated use getEditableFromEvent */
export function getTextareaFromEvent(event: KeyboardEvent): HTMLTextAreaElement | null {
  const el = getEditableFromEvent(event);
  return el instanceof HTMLTextAreaElement ? el : null;
}

const COMMENT_CONTEXT_TAGS = new Set([
  "GR-COMMENT",
  "GR-TEXTAREA",
  "GR-SUGGESTION-TEXTAREA",
  "GR-REPLY-DIALOG",
  "GR-CHANGE-REPLY-DIALOG",
  "GR-CHANGE-COMMENT-THREAD",
  "GR-DIFF-COMMENT",
  "GR-THREAD-COMMENT",
  "GR-COMMENT-THREAD",
  "GR-INLINE-REPLY-BOX",
  "GR-REPLY-BOX",
]);

export function isCommentField(event: KeyboardEvent): boolean {
  return event
    .composedPath()
    .some((el) => el instanceof HTMLElement && COMMENT_CONTEXT_TAGS.has(el.tagName));
}

/** @deprecated use isCommentField */
export function isCommentTextarea(event: KeyboardEvent): boolean {
  return isCommentField(event);
}

export function isBacktickKey(event: KeyboardEvent): boolean {
  return event.key === "`" || event.code === "Backquote";
}
