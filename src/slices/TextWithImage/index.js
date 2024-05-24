"use client";
import * as prismic from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { useState } from "react";

import { Bounded } from "@/components/Bounded";
import { PrismicRichText } from "@/components/PrismicRichText";
import { PrismicNextLink } from "@prismicio/next";
import styles from "@/styles/textWithImage.module.scss";

const ImageLeft = ({ slice }) => {
  const image = slice.primary.image;
  const [isHovered, setIsHovered] = useState(false);

  const richTextCustomRender = {
    paragraph: ({ children }) => <p style={{ color: slice.primary.textColor }}>{children}</p>,
    heading2: ({ children }) => <h2 style={{ color: slice.primary.textColor }}>{children}</h2>,
    // Add more custom rendering as needed
  };

  const buttonStyle = {
    backgroundColor: isHovered ? slice.primary.buttonHoverColor : slice.primary.buttonColor,
    padding: "1rem 2rem",
    border: "none",
    borderRadius: "50px",
    fontSize: "clamp(16px, 4vmin, 18px)",
    cursor: "pointer",
  };

  const buttonText = {
    color: isHovered ? slice.primary.textColor : slice.primary.backgroundColor,
    fontWeight: 'bold',
  }
  

  return (
    <section className={styles.textWithImage} style={{backgroundColor: slice.primary.backgroundColor}}>
      <Bounded as="section" className="bg-white">
        <div className={styles.container}>
          <div className={styles.imageContainer}>
            <div className={styles.imageBlob} style={{backgroundColor: slice.primary.blobColor}}></div>
            <PrismicNextImage field={image}/>
          </div>
          <div className={styles.textContainer}>
            <sup style={{color: slice.primary.textColor}}>{slice.primary.superText}</sup>
            <PrismicRichText field={slice.primary.text} components={richTextCustomRender}/>
            <p style={{color: slice.primary.textColor}}>{slice.primary.subText}</p>
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
        </div>
      </Bounded>
    </section>
  );
};

export default ImageLeft;
