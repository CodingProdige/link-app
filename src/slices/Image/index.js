"use client";
import * as prismic from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import clsx from "clsx";
import styles from "@/styles/imageSlice.module.scss";

import { Bounded } from "@/components/Bounded";

const Image = ({ slice, index }) => {
  const image = slice.primary.image;

  return (
    <div className={styles.imageSlice}>
      {prismic.isFilled.image(image) && (
        <div className={styles.imageContainer} style={{backgroundImage: `url("${slice.primary.image.url}")`}}>
        </div>
      )}
    </div>
  );
};

export default Image;
