import { Button, Card, Col, Image, Row } from "react-bootstrap";
import Styles from "./dealCard.module.scss";

const DealCard = () => {
  return (
    <Card className="border-0 bg-transparent">
      <Card.Body className="p-3">
        <Row>
          <Col
            xs={12}
            lg={6}
            className={`${Styles.bgGradientPrimary} p-3 p-md-0 d-flex flex-column align-items-center justify-content-center`}
          >
            <h5 className="mb-2 text-white-50">Enjoy Summer Deals</h5>
            <h2 className="mb-3 font-weight-bold text-white">
              Up to 40% Discount!
            </h2>
            <a href="/join-us" target="_blank" className="mb-3 btn btn-info">
              View More
            </a>
            <Image src="/images/logo.png" className="mb-2" />
            <small className="text-white">*Terms applied</small>
          </Col>
          <Col xs={12} lg={6} className="p-0">
            <Image
              src="/images/demo-img5.jpg"
              className={`${Styles.imgDiv} w-100`}
            ></Image>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default DealCard;
