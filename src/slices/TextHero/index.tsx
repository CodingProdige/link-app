"use client"; 
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import styles from "@/styles/textHero.module.scss";
import { useState } from "react";

/**
 * Props for `TextHero`.
 */
export type TextHeroProps = SliceComponentProps<Content.TextHeroSlice>;

/**
 * Component for "TextHero" Slices.
 */
const TextHero = ({ slice }: TextHeroProps): JSX.Element => {
  const [isHovered, setIsHovered] = useState(false);

  const buttonStyle = {
    backgroundColor: isHovered ? slice.primary.button_hover_color : slice.primary.button_color,
    color: slice.primary.background_color,
    padding: "1rem 2rem",
    border: "none",
    borderRadius: "50px",
    fontSize: "1rem",
    cursor: "pointer",
  };


  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={styles.textHeroSection}
      style={{ backgroundColor: slice.primary.background_color, color: slice.primary.text_color }}
    >
      <div className={styles.textHeroInnerContainer}>
        <sup className={styles.superText}>{slice.primary.super_text}</sup>
        <h1 className={styles.title}>{slice.primary.title}</h1>
        <p className={styles.subText}>{slice.primary.sub_text}</p>
        <button 
          className={styles.ctaButton} 
          style={buttonStyle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)
          }>
            {slice.primary.button_text}
        </button>
      </div>
    </section>
  );
};

export default TextHero;
