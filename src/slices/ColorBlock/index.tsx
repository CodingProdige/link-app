"use client";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `ColorBlock`.
 */
export type ColorBlockProps = SliceComponentProps<Content.ColorBlockSlice>;

/**
 * Component for "ColorBlock" Slices.
 */
const ColorBlock = ({ slice }: ColorBlockProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for color_block (variation: {slice.variation})
      Slices
    </section>
  );
};

export default ColorBlock;
