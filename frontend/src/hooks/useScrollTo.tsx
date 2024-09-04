import { useRef, useEffect, useState } from "react";
// handles scrolling to a ref element
type Props = {
  scrollOnMount?: boolean;
};

export function useScrollTo({ scrollOnMount = true }: Props) {
  const [newMessage, setNewMessage] = useState(false);
  const scrollToRef = useRef<HTMLDivElement | null>(null);
  function scrollToBottom() {
    if (scrollToRef.current) {
      scrollToRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }
  function hasNewMessage() {
    setNewMessage(true);
  }
  function shouldAutoScroll() {
    if (scrollToRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        scrollToRef.current.parentElement!;
      return scrollHeight - scrollTop - clientHeight <= 100;
    }
    return false;
  }
  useEffect(() => {
    if (scrollOnMount || newMessage) {
      scrollToBottom();
      setNewMessage(false);
    }
  }, [scrollOnMount, newMessage]);
  return { scrollToRef, scrollToBottom, shouldAutoScroll, hasNewMessage };
}
