import { useRef, useEffect } from "react";
// handles scrolling to a ref element
type Props = {
    triggerValues: unknown[];
    scrollOnMount?: boolean;
    scrollThreshold?: number;
}

export function useScrollTo({triggerValues, scrollOnMount=false, scrollThreshold= 100}: Props) {
 const scrollToRef = useRef<HTMLDivElement | null>(null);
  function scrollTo() {
    if (scrollToRef.current) {
      scrollToRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }
  function shouldScroll() {
    if (scrollToRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollToRef.current.parentElement!;
      return scrollHeight - scrollTop - clientHeight >= scrollThreshold;
    }
    return false;
  }
  useEffect(() =>{
    if(scrollOnMount || shouldScroll()){
        scrollTo();
    }
  },[triggerValues,scrollOnMount])
    return { scrollToRef };
}
