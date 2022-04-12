import { Badge, Card, Col, Row } from "react-bootstrap";
import ReviewCard from "./reviewCard";
const HotelReview = () => {
  return (
    <Row>
      <Col md={6}>
        <p className="small text-jetblack">OverAll</p>
        <Row>
          <Col md={4}>
            <div>
              <Card className="d-flex align-items-center justify-content-center border-primary text-center custom-shadow">
                <Card.Body>
                  <Card.Text className="display-4 text-primary">4.5</Card.Text>
                  <Card.Text className="text-xs mb-1 text-muted">
                    116 RATINGS
                  </Card.Text>
                  <Card.Text className="text-xs mb-1 text-muted">
                    62 REVIEWS
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          </Col>
          <Col md={8}>
            <ul className="list-unstyled list-inline">
              <li className="list-inline-item m-2">
                <Badge variant="secondary" className="p-3 small">
                  Value for money
                </Badge>
              </li>
              <li className="list-inline-item m-2">
                <Badge variant="secondary" className="p-3 small">
                  Excellent Staff
                </Badge>
              </li>
              <li className="list-inline-item m-2">
                <Badge variant="secondary" className="p-3 small">
                  World class Property
                </Badge>
              </li>
              <li className="list-inline-item m-2">
                <Badge variant="secondary" className="p-3 small">
                  Quality Service
                </Badge>
              </li>
              <li className="list-inline-item m-2">
                <Badge variant="secondary" className="p-3 small">
                  Awesome Experience{" "}
                </Badge>
              </li>
            </ul>
          </Col>
        </Row>
      </Col>
      <Col md={6}>
        <Row>
          <div className="d-flex flex-row flex-nowrap is-x-scrollable w-100 py-3">
            <Col md={9}>
              <ReviewCard />
            </Col>
            <Col md={9}>
              <ReviewCard />
            </Col>
          </div>
        </Row>
      </Col>
    </Row>
  );
};

export default HotelReview;
