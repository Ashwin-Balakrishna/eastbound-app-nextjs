import { Col, Container, Row } from "react-bootstrap";
import GalleryCard from "./galleryCard";

const HomeGallery = () => {
  return (
    <Container className="mb-5 mb-lg-7">
      <Row className="mb-4">
        <Col xs={12}>
          <h3 className="font-weight-bold">Get inspired</h3>
          <p>
            The best stories, destination coverage, local advice, and expert
            tips for the smart, adventurous, and creative traveller.
          </p>
        </Col>
      </Row>
      <Row>
        <GalleryCard
          src="/images/demo-img4.jpg"
          className="pr-lg-2 col-lg-8 mb-3"
          title="Card Title"
        />
        <GalleryCard
          src="/images/demo-img3.jpg"
          className="pl-lg-2 col-lg-4 mb-3"
          title="Card Title"
        />
      </Row>
      <Row>
        <GalleryCard
          src="/images/gallery1.jpg"
          className="pr-lg-2 col-lg-4 mb-3"
          title="Card Title"
        />
        <GalleryCard
          src="/images/gallery2.png"
          className="px-lg-2 col-lg-4 mb-3"
          title="Card Title"
        />
        <GalleryCard
          src="/images/gallery3.jpg"
          className="pl-lg-2 col-lg-4 mb-3"
          title="Card Title"
        />
      </Row>
    </Container>
  );
};

export default HomeGallery;
