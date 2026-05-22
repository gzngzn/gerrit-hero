import type { Feature } from "../../shared/types";
import {
  getEditableFromEvent,
  isBacktickKey,
  isCommentField,
  wrapSelection,
} from "../../shared/text-wrap";

export const backtickCodeWrap: Feature = {
  id: "backtick-code-wrap",
  name: "Backtick Code Wrap",
  pages: ["global"],
  init() {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!isBacktickKey(event) || event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      if (!isCommentField(event)) return;

      const field = getEditableFromEvent(event);
      if (!field) return;
      if (field instanceof HTMLTextAreaElement && (field.readOnly || field.disabled)) return;

      if (wrapSelection(field, "`")) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);

    return () => document.removeEventListener("keydown", onKeyDown, true);
  },
};
