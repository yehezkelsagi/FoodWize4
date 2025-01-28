import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";

interface MarqueeProps {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children?: React.ReactNode;
}

const Marquee = ({
  className,
  reverse,
  pauseOnHover,
  children,
}: MarqueeProps) => {
  const [duration, setDuration] = useState("20s");
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (marqueeRef.current) {
      const contentWidth = marqueeRef.current.scrollWidth;
      const containerWidth = marqueeRef.current.offsetWidth;
      const calculatedDuration = `${(contentWidth / containerWidth) * 20}s`;
      setDuration(calculatedDuration);
    }
  }, [children]);

  return (
    <div
      className={cn(
        "flex w-full overflow-hidden [--gap:1rem] [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <div
        ref={marqueeRef}
        className={cn(
          "flex min-w-full shrink-0 items-center justify-around gap-[--gap] py-4",
          "[animation:marquee_linear_infinite] [animation-duration:var(--duration,20s)]",
          reverse && "[animation-direction:reverse]",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
        style={{ "--duration": duration } as React.CSSProperties}
      >
        {children}
        {children}
      </div>
    </div>
  );
};

export default Marquee;