import React, { forwardRef } from 'react';
import { PrismicNextImage, PrismicNextImageProps } from "@prismicio/next";
import { ImageField } from "@prismicio/types";

type ForwardedPrismicNextImageProps = PrismicNextImageProps & {
  field: ImageField;
};

const ForwardedPrismicNextImage = forwardRef<HTMLDivElement, ForwardedPrismicNextImageProps>((props, ref) => (
  <div ref={ref}>
    <PrismicNextImage {...props} />
  </div>
));

ForwardedPrismicNextImage.displayName = 'ForwardedPrismicNextImage';

export default ForwardedPrismicNextImage;
