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
      style={{backgroundColor: slice.primary.background_color, padding: '7rem 0'}}
    >
    </section>
  );
};

export default ColorBlock;
