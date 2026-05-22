import { describe, expect, it } from "vitest";
import {
  computeWrapperToggle,
  getEditableFromEvent,
  isCommentField,
  wrapContentEditableSelection,
  wrapTextareaSelection,
} from "../src/shared/text-wrap";

describe("computeWrapperToggle", () => {
  it("wraps plain selection", () => {
    expect(computeWrapperToggle("hello world", 6, 11, "`")).toEqual({
      replaceStart: 6,
      replaceEnd: 11,
      replacement: "`world`",
      selectionStart: 7,
      selectionEnd: 12,
    });
  });

  it("unwraps when selection includes backticks", () => {
    expect(computeWrapperToggle("hello `world`", 6, 13, "`")).toEqual({
      replaceStart: 6,
      replaceEnd: 13,
      replacement: "world",
      selectionStart: 6,
      selectionEnd: 11,
    });
  });

  it("unwraps when backticks are outside selection", () => {
    expect(computeWrapperToggle("hello `world`", 7, 12, "`")).toEqual({
      replaceStart: 6,
      replaceEnd: 13,
      replacement: "world",
      selectionStart: 6,
      selectionEnd: 11,
    });
  });
});

describe("wrapTextareaSelection", () => {
  it("wraps selected text with backticks", () => {
    const textarea = document.createElement("textarea");
    textarea.value = "hello world";
    textarea.selectionStart = 6;
    textarea.selectionEnd = 11;

    expect(wrapTextareaSelection(textarea, "`")).toBe(true);
    expect(textarea.value).toBe("hello `world`");
    expect(textarea.selectionStart).toBe(7);
    expect(textarea.selectionEnd).toBe(12);
  });

  it("unwraps already wrapped selection", () => {
    const textarea = document.createElement("textarea");
    textarea.value = "hello `world`";
    textarea.selectionStart = 7;
    textarea.selectionEnd = 12;

    expect(wrapTextareaSelection(textarea, "`")).toBe(true);
    expect(textarea.value).toBe("hello world");
    expect(textarea.selectionStart).toBe(6);
    expect(textarea.selectionEnd).toBe(11);
  });

  it("returns false when nothing is selected", () => {
    const textarea = document.createElement("textarea");
    textarea.value = "hello";
    textarea.selectionStart = 2;
    textarea.selectionEnd = 2;

    expect(wrapTextareaSelection(textarea, "`")).toBe(false);
    expect(textarea.value).toBe("hello");
  });
});

describe("wrapContentEditableSelection", () => {
  it("wraps selected text in contenteditable", () => {
    const div = document.createElement("div");
    div.contentEditable = "true";
    div.textContent = "hello world";
    document.body.append(div);

    const range = document.createRange();
    range.setStart(div.firstChild!, 6);
    range.setEnd(div.firstChild!, 11);
    const selection = window.getSelection()!;
    selection.removeAllRanges();
    selection.addRange(range);

    expect(wrapContentEditableSelection(div, "`")).toBe(true);
    expect(div.textContent).toBe("hello `world`");
    expect(selection.toString()).toBe("world");

    div.remove();
  });

  it("unwraps selected text in contenteditable", () => {
    const div = document.createElement("div");
    div.contentEditable = "true";
    div.textContent = "hello `world`";
    document.body.append(div);

    const range = document.createRange();
    range.setStart(div.firstChild!, 7);
    range.setEnd(div.firstChild!, 12);
    const selection = window.getSelection()!;
    selection.removeAllRanges();
    selection.addRange(range);

    expect(wrapContentEditableSelection(div, "`")).toBe(true);
    expect(div.textContent).toBe("hello world");
    expect(selection.toString()).toBe("world");

    div.remove();
  });
});

describe("isCommentField", () => {
  it("returns true inside gr-textarea", () => {
    const host = document.createElement("gr-textarea");
    const div = document.createElement("div");
    div.contentEditable = "true";
    host.append(div);
    document.body.append(host);

    const event = new KeyboardEvent("keydown", { key: "`", bubbles: true, composed: true });
    div.dispatchEvent(event);

    expect(isCommentField(event)).toBe(true);

    host.remove();
  });

  it("returns false for unrelated contenteditable", () => {
    const div = document.createElement("div");
    div.contentEditable = "true";
    document.body.append(div);

    const event = new KeyboardEvent("keydown", { key: "`", bubbles: true, composed: true });
    div.dispatchEvent(event);

    expect(isCommentField(event)).toBe(false);

    div.remove();
  });
});

describe("getEditableFromEvent", () => {
  it("finds contenteditable in composed path", () => {
    const div = document.createElement("div");
    div.contentEditable = "true";
    document.body.append(div);

    const event = new KeyboardEvent("keydown", { key: "`", bubbles: true, composed: true });
    div.dispatchEvent(event);

    expect(getEditableFromEvent(event)).toBe(div);

    div.remove();
  });
});
