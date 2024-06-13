"use client";
import * as prismic from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { useState } from "react";

import { Bounded } from "@/components/Bounded";
import { PrismicRichText } from "@/components/PrismicRichText";
import { PrismicNextLink } from "@prismicio/next";
import styles from "@/styles/textWithImage.module.scss";
import { list } from "firebase/storage";

const TextWithImage = ({ slice }) => {
  const image = slice.primary.image;
  const [isHovered, setIsHovered] = useState(false);

  const richTextCustomRender = {
    paragraph: ({ children }) => <p style={{ 
      color: slice.primary.textColor, 
      marginBottom: "1rem",
    }}>
        {children}
      </p>,
    heading2: ({ children }) => <h2 style={{ color: slice.primary.textColor }}>{children}</h2>,
    list: ({ children }) => <ul style={{ color: slice.primary.textColor, paddingLeft: "1rem" }}>{children}</ul>,
    listItem: ({ children }) => <li style={{ color: slice.primary.textColor, marginBottom: "1rem" }}>{children}</li>,
    // Add more custom rendering as needed
  };

  const buttonStyle = {
    backgroundColor: isHovered ? slice.primary.buttonHoverColor : slice.primary.buttonColor,
    color: slice.primary.backgroundColor,
    padding: "1rem 2rem",
    border: "none",
    borderRadius: "50px",
    fontSize: "1rem",
    fontWeight: "700",
    cursor: "pointer",
  };


  const renderVariation = () => {
    switch(slice.variation) {
      case 'withButton':
        return (
          <>
            <div className={styles.imageContainer}>
              {
                slice.primary.show_blob && (
                  <div className={styles.imageBlob} style={{ backgroundColor: slice.primary.blobColor }}></div>
                )
              }
              <PrismicNextImage field={image} />
            </div>
            <div className={styles.textContainer}>
              <sup style={{ color: slice.primary.textColor }}>{slice.primary.superText}</sup>
              <PrismicRichText field={slice.primary.text} components={richTextCustomRender} />
              {
                slice.primary.subText && (
                  <p style={{ color: slice.primary.textColor }}>{slice.primary.subText}</p>
                )
              }
              {
                slice.primary.sub_richtext && (
                  <PrismicRichText field={slice.primary.sub_richtext} components={richTextCustomRender} />
                )
              }
              {
                slice.primary.buttonText && (
                    <PrismicNextLink 
                      style={buttonStyle}
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                      field={slice.primary.buttonLink}
                    >
                      {slice.primary.buttonText}
                    </PrismicNextLink>
                )
              }
            </div>
          </>
        );
      case 'textWithButtonImageRight':
        return (
          <>
            <div className={styles.textContainer}>
              <sup style={{ color: slice.primary.textColor }}>{slice.primary.superText}</sup>
              <PrismicRichText field={slice.primary.text} components={richTextCustomRender} />
              {
                slice.primary.subText && (
                  <p style={{ color: slice.primary.textColor }}>{slice.primary.subText}</p>
                )
              }
              {
                slice.primary.sub_richtext && (
                  <PrismicRichText field={slice.primary.sub_richtext} components={richTextCustomRender}/>
                )
              }              {
                slice.primary.buttonText && (
                    <PrismicNextLink 
                      style={buttonStyle}
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                      field={slice.primary.buttonLink}
                    >
                      {slice.primary.buttonText}
                    </PrismicNextLink>
                )
              }
            </div>
            <div className={styles.imageContainer}>
              {
                slice.primary.show_blob && (
                  <div className={styles.imageBlob} style={{ backgroundColor: slice.primary.blobColor }}></div>
                )
              }              
              <PrismicNextImage field={image} />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <section className={styles.textWithImage} style={{ backgroundColor: slice.primary.backgroundColor }}>
      <Bounded as="section" className="bg-white">
        <div className={styles.container}>
          {renderVariation()}
        </div>
      </Bounded>
    </section>
  );
};

export default TextWithImage;
