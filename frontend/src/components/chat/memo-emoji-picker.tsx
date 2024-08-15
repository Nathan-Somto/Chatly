import EmojiPicker, { PickerProps } from "emoji-picker-react";
import { memo } from "react";

export const MemoEmojiPicker = memo(({ ...props }: PickerProps) => (
    <EmojiPicker {...props} />
  ));