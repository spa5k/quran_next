"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { timeFormatter } from "@/features/recitation/utils/timeFormatter";
import useTimeout from "@/hooks/useTimeout";
import { cn } from "@/lib/utils";
import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  const [showTooltip, setShowTooltip] = React.useState(false);

  const { reset: resetTimeout, clear: clearTimeout } = useTimeout(() => {
    setShowTooltip(false);
  }, 2000);

  const handlePointerDown = React.useCallback(() => {
    if (!showTooltip) {
      setShowTooltip(true);
    }
    clearTimeout();
  }, [showTooltip, clearTimeout]);

  const handlePointerUp = React.useCallback(() => {
    resetTimeout();
  }, [resetTimeout]);

  const handleMouseEnter = React.useCallback(() => {
    setShowTooltip(true);
    clearTimeout();
  }, [clearTimeout]);

  const handleMouseLeave = React.useCallback(() => {
    resetTimeout();
  }, [resetTimeout]);

  React.useEffect(() => {
    document.addEventListener("pointerup", handlePointerUp);
    return () => {
      document.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handlePointerUp]);

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center cursor-pointer",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary "
        onMouseEnter={handlePointerDown}
        onMouseLeave={handlePointerUp}
      >
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      <TooltipProvider>
        <Tooltip open={showTooltip}>
          <TooltipTrigger asChild>
            <SliderPrimitive.Thumb
              className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>{timeFormatter(props.value?.[0] || 0)}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </SliderPrimitive.Root>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
