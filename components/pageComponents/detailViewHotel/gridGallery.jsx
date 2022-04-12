// import { Image, Modal } from "react-bootstrap";
import Carousel, { Modal, ModalGateway } from "react-images";
import Styles from "./gridGallery.module.scss";
import ImageGallery from "react-image-gallery";
import { Img } from "react-image";
import { useState } from "react";

const getImageGallery = (images) => {
  return images.map((image) => {
    return {
      original: `${process.env.cdn_url}${image.image_file}`,
      thumbnail: `${process.env.cdn_url}${image.image_file}`,

      renderItem: () => {
        return (
          <Img
            src={[
              `${process.env.cdn_url}${image.image_file}`,
              "/images/basic.png",
            ]}
            className={`${Styles.lightboxImg}`}
          />
        );
      },

      renderThumbInner: () => {
        return (
          <Img
            className={`${Styles.lightboxImg}`}
            src={[
              `${process.env.cdn_url}${image.image_file}`,
              "/images/basic.png",
            ]}
          />
        );
      },
    };
  });
};

const GridGallery = ({ images }) => {
  const imageGallery = getImageGallery(images);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  let content = [];

  images.forEach((image, i) => {
    if (i !== 0 && i < 6) {
      content.push(
        <li
          key={i}
          className={`cursor-pointer ${i === 1 ? Styles.highlightBox : ""}`}
          onClick={() => {
            setCurrentIndex(i);
            setShowImageGallery(true);
          }}
        >
          <Img
            className={`${Styles.img}`}
            src={[
              `${process.env.cdn_url}${image.image_file}`,
              "/images/basic.png",
            ]}
          />
        </li>
      );
    }
  });

  return (
    <>
      <div className="d-none d-lg-block">
        <ul className={`list-unstyled ${Styles.ulGrid}`}>
          {content.map((c) => c)}
        </ul>
      </div>
      <ModalGateway>
        {showImageGallery ? (
          <Modal onClose={() => setShowImageGallery(false)}>
            <ImageGallery
              items={imageGallery}
              showFullscreenButton={true}
              showIndex={true}
              startIndex={currentIndex}
            />
          </Modal>
        ) : null}
      </ModalGateway>

      <div className="d-lg-none">
        <ImageGallery
          items={imageGallery}
          showFullscreenButton={false}
          showIndex={true}
          startIndex={currentIndex}
          showThumbnails={false}
        />
      </div>
    </>
  );
};

export default GridGallery;
