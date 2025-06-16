import * as React from "react";
import { Select as SelectPrimitive } from "radix-ui";
import {
	CheckIcon,
	ChevronDownIcon,
	ChevronUpIcon,
} from "@radix-ui/react-icons";

export const Select = React.forwardRef(
	({ children, ...props }, forwardedRef) => {
		return (
			<SelectPrimitive.Root {...props}>
				<SelectPrimitive.Trigger ref={forwardedRef} className="inline-flex items-center justify-center rounded px-[15px] h-[35px] gap-[5px] text-[13px] leading-none bg-white text-blue-900 shadow-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-black data-[placeholder]:text-blue-700">
					<SelectPrimitive.Value />
					<SelectPrimitive.Icon className="text-blue-900">
						<ChevronDownIcon />
					</SelectPrimitive.Icon>
				</SelectPrimitive.Trigger>
				<SelectPrimitive.Portal>
					<SelectPrimitive.Content className="overflow-hidden bg-white rounded-lg shadow-[0_10px_38px_-10px_rgba(22,23,24,0.35),0_10px_20px_-15px_rgba(22,23,24,0.2)]">
						<SelectPrimitive.ScrollUpButton>
							<ChevronUpIcon />
						</SelectPrimitive.ScrollUpButton>
						<SelectPrimitive.Viewport className="p-[5px]">{children}</SelectPrimitive.Viewport>
						<SelectPrimitive.ScrollDownButton>
							<ChevronDownIcon />
						</SelectPrimitive.ScrollDownButton>
					</SelectPrimitive.Content>
				</SelectPrimitive.Portal>
			</SelectPrimitive.Root>
		);
	},
);

export const SelectItem = React.forwardRef(
	({ children, ...props }, forwardedRef) => {
		return (
			<SelectPrimitive.Item {...props} ref={forwardedRef} className="text-[13px] leading-none text-blue-900 rounded flex items-center h-[25px] px-[25px] pr-[35px] relative select-none data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-blue-700 data-[highlighted]:text-blue-50">
				<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
				<SelectPrimitive.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
					<CheckIcon />
				</SelectPrimitive.ItemIndicator>
			</SelectPrimitive.Item>
		);
	},
);
