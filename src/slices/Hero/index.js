"use client";  
import { useState } from "react";
import * as prismic from "@prismicio/client";
import { PrismicNextLink, PrismicNextImage } from "@prismicio/next";
import { Bounded } from "@/components/Bounded";
import { PrismicRichText } from "@prismicio/react";
import styles from "@/styles/hero.module.scss";

const Hero = ({ slice }) => {
  const [isHovered, setIsHovered] = useState(false);

  const richTextCustomRender = {
    paragraph: ({ children }) => <p style={{ color: slice.primary.textColor }}>{children}</p>,
    heading1: ({ children }) => <h1 style={{ color: slice.primary.textColor }}>{children}</h1>,
    // Add more custom rendering as needed
  };

  const buttonStyle = {
    backgroundColor: isHovered ? 'black' : slice.primary.buttonColor,
    padding: '1rem 2rem',
    border: 'none',
    borderRadius: '50px',
    fontSize: 'clamp(16px, 4vmin, 18px)',
    cursor: 'pointer',
    color: isHovered ? slice.primary.textColor : slice.primary.backgroundColor,
  };

  const buttonText = {
    color: isHovered ? slice.primary.textColor : slice.primary.backgroundColor,
    fontWeight: 'bold',
  }

  return (
    <section className={styles.hero} style={{ backgroundColor: slice.primary.backgroundColor }}>
      <Bounded yPadding="lg">
        <div className={styles.container} style={{ color: slice.primary.textColor}}>
          <div className={styles.textContainer}>
            <sup style={{ color: slice.primary.textColor }}>{slice.primary.superText}</sup>
            <PrismicRichText field={slice.primary.text} components={richTextCustomRender} />
            <p style={{ color: slice.primary.textColor }}>{slice.primary.subText}</p>
            <button
              style={buttonStyle}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <PrismicNextLink field={slice.primary.buttonLink}>
                <span style={buttonText}>{slice.primary.buttonText}</span>
              </PrismicNextLink>
            </button>
          </div>
          <div className={styles.imageContainer}>
            <div className={styles.imageBlob} style={{ backgroundColor: slice.primary.blobColor }}></div>
            <PrismicNextImage field={slice.primary.image} />
          </div>
        </div>
      </Bounded>
    </section>
  );
};

export default Hero;
