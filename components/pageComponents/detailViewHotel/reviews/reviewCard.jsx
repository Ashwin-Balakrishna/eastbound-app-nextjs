import { Badge, Card, Col, Row } from "react-bootstrap";

const ReviewCard = () => {
  return (
    <Card className="border-0 custom-shadow">
      <Card.Body className="custom-card-border-top">
        <Row>
          <Col xs={12} lg={3}>
            <h2>
              <Badge variant="info" className="p-2">
                4.5
              </Badge>
            </h2>
          </Col>
          <Col xs={12} lg={9}>
            <p className="font-weight-bold small">Great stay!</p>
            <p className="font-weight-bold small">
              Rishi Khaithan, April 22, 2020
            </p>
            <p className="text-md">
              The staff was nothing short of excellent and The hotel was
              brilliant. Great property and excellent service.
            </p>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ReviewCard;
