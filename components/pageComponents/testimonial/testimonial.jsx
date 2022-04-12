import { Card, Col, Image, Row } from "react-bootstrap";

const Testimonial = ({ src, name, place, description, href }) => {
  return (
    <Card className="border-0 custom-shadow rounded-10  h-100">
      <Card.Body className="custom-card-border-top">
        <Row className="align-items-lg-center">
          {/* <Col xs={12} lg={3}>
            <Image src={src} roundedCircle width="100" height="100" />
          </Col> */}
          <Col xs={12}>
            {name && (
              <p className="font-weight-bold text-md">
                {name}
                {place && (
                  <>
                    <span>, </span>
                    <span className="text-muted">{place}</span>
                  </>
                )}
              </p>
            )}
            <p className="text-md font-italic text-muted">
              {description}
              {/* <a href={href} target="_blank" rel="noreferrer">
                Read more
              </a> */}
            </p>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};
export default Testimonial;
