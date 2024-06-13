import clsx from "clsx";
import styles from "@/styles/textSlice.module.scss"
import { PrismicRichText } from "@/components/PrismicRichText";

const Text = ({ slice }) => {

  const richTextCustomRender = {
    paragraph: ({ children }) => <p style={{ color: slice.primary.text_color, fontWeight: "400", fontSize: "1.2rem", marginBottom: "1rem" }}>{children}</p>,
    heading1: ({ children }) => <h1 style={{ color: slice.primary.text_color, fontWeight: "700", fontSize: "2.5rem", marginBottom: "1rem" }}>{children}</h1>,
    heading2: ({ children }) => <h2 style={{ color: slice.primary.text_color, fontWeight: "700", fontSize: "2rem", marginBottom: "1rem" }}>{children}</h2>,
    heading3: ({ children }) => <h3 style={{ color: slice.primary.text_color, fontWeight: "700", fontSize: "1.75rem" }}>{children}</h3>,
    // Add more custom rendering as needed
  };

  return (
    <div className={styles.textContainer}>
      <div className={styles.textInnerContainer}>
        <div className={slice.variation}>
          <PrismicRichText field={slice.primary.text} components={richTextCustomRender} />
        </div>
      </div>
      </div>
  );
};

export default Text;
