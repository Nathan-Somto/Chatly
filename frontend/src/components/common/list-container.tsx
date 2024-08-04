import React from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
export default function ListContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [parent] = useAutoAnimate({
    easing: "ease-out",
    duration: 350,
  });
  return (
    <section
      ref={parent}
      className="mt-8 px-3  space-y-1 lg:h-[calc(100vh-16*0.25rem)] lg:overflow-auto "
    >
      {children}
    </section>
  );
}
