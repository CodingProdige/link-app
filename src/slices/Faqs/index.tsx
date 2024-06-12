"use client";
import React, { useState } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import styles from "@/styles/faqsSlice.module.scss";
import { usePrismic } from "@/context/PrismicContext";
import { PrismicRichText } from "@/components/PrismicRichText";

/**
 * Props for `Faqs`.
 */
export type FaqsProps = SliceComponentProps<Content.FaqsSlice>;

/**
 * Component for "Faqs" Slices.
 */
const Faqs = ({ slice }: FaqsProps): JSX.Element => {
  const { faqs } = usePrismic();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const richTextCustomRender = {
    paragraph: ({ children }) => <p style={{ color: slice.primary.text_color, fontWeight: "400", fontSize: "1.2rem" }}>{children}</p>,
    // Add more custom rendering as needed
  };

  const toggleExpandable = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={styles.faqsSection}
      style={{ backgroundColor: slice.primary.background_color, color: slice.primary.text_color }}
    >
      <div className={styles.faqsInnerContainer}>
        <div className={styles.faqsHeader}>
          <sup className={styles.superText}>{slice.primary.super_text}</sup>
          <h2 className={styles.title}>{slice.primary.title}</h2>
          <p className={styles.subText}>{slice.primary.sub_text}</p>
        </div>
        <div className={styles.faqsExpandablesContainer}>
          {faqs?.data?.faq?.map((faq, index) => (
            <div
              key={index}
              className={`${styles.faqsExpandable} ${expandedIndex === index ? styles.expanded : ""}`}
              style={{ backgroundColor: slice.primary.cards_background_color}}
            >
              <div
                className={styles.faqsExpandableHeader}
                onClick={() => toggleExpandable(index)}
              >
                <p className={styles.question}>{faq.question}</p>
                <div className={styles.iconContainer}>
                  {expandedIndex === index ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-up" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"/>
                    </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
                      </svg>
                  )}
                </div>
              </div>
              {expandedIndex === index && (
                <div className={styles.faqsExpandableContent}>
                  <PrismicRichText field={faq.answer} components={richTextCustomRender} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faqs;
