"use client";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import PricingOptions from "@/components/PricingOptions";
import styles from "@/styles/pricing.module.scss";


/**
 * Props for `Pricing`.
 */
export type PricingProps = SliceComponentProps<Content.PricingSlice>;

/**
 * Component for "Pricing" Slices.
 */
const Pricing = ({ slice }: PricingProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}

      className={styles.pricingSection}
      style={{backgroundColor: slice.primary.background_color}}
    >
      <div className={styles.pricingContainer}>
        <div className={styles.pricingHeader} >
          <PrismicRichText field={slice.primary.title} />
          <PrismicRichText field={slice.primary.title_sub_text} />
        </div>
        <PricingOptions slice={slice}/>
      </div>
    </section>
  );
};

export default Pricing;
