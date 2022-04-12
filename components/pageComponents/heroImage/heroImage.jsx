import { Image } from "react-bootstrap";
// import Styles from "./heroImage.module.scss";

const HeroImage = ({ src }) => {
  return (
    <>
      <section>
        <Image
          // src={src}
          src={src || "/images/HyattGoa.jpg"}
          className="heroImageHeight w-100"
          id="hero-image"
        />
      </section>
    </>
  );
};
export default HeroImage;
