import * as React from "react";
import { Slider as SliderPrimitive } from "radix-ui";

export const Slider = React.forwardRef((props, forwardedRef) => {
	const value = props.value || props.defaultValue;

	return (
		<SliderPrimitive.Slider {...props} ref={forwardedRef} className="relative flex items-center select-none touch-none w-[200px]">
			<SliderPrimitive.Track className="relative flex-grow rounded-full h-[3px] bg-white">
				<SliderPrimitive.Range className="absolute h-full rounded-full bg-black/40" />
			</SliderPrimitive.Track>
			{value.map((_, i) => (
				<SliderPrimitive.Thumb key={i} className="block w-[20px] h-[20px] bg-white rounded-full shadow-md hover:bg-blue-50" />
			))}
		</SliderPrimitive.Slider>
	);
});


