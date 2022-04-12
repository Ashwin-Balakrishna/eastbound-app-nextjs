import { Card, Col, Image } from "react-bootstrap";
import Styles from "./galleryCard.module.scss";

const GalleryCard = ({ src, title, className }) => {
  return (
    <Col xs={12} className={className}>
      <Card className="border-0 rounded-10">
        <Image
          src={src}
          className={`w-100 position-static rounded-10 ${Styles.galleryImgHeight}`}
        />
        <Card.ImgOverlay className="text-white grad-black d-flex flex-column justify-content-end rounded-10">
          <Card.Title>{title}</Card.Title>
        </Card.ImgOverlay>
      </Card>
    </Col>
  );
};

export default GalleryCard;
