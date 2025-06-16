import * as React from "react";
import { Toggle as TogglePrimitive } from "radix-ui";

export const Toggle = React.forwardRef(
  ({ children, ...props }, forwardedRef) => {
    return (
      <TogglePrimitive.Root {...props} ref={forwardedRef} className="bg-white text-blue-900 px-4 h-[35px] rounded flex items-center justify-center text-[15px] leading-none shadow-md hover:bg-blue-50 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-900">
        {children}
      </TogglePrimitive.Root>
    );
  },
);
