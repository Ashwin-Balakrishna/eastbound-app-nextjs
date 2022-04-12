import { Col, Container, Image, Row } from "react-bootstrap";

const IconText = () => {
  return (
    <Container>
      <Row className="mb-4">
        <Col xs={12}>
          <h3 className="font-weight-bold">The 2Hub Advantage</h3>
        </Col>
      </Row>
      <Row className="text-center text-md-left">
        <Col xs={6} md={4}>
          <Image
            src="/images/svg/2Hub_Icons-Network.svg"
            width="80px"
            className="mb-3"
          />
          <p>Widest Network of Hotels</p>
        </Col>
        <Col xs={6} md={4}>
          <Image
            src="/images/svg/2Hub_Icons-Pricing.svg"
            width="80px"
            className="mb-3"
          />
          <p>Unmatched Pricing</p>
        </Col>
        <Col xs={6} md={4}>
          <Image
            src="/images/svg/2Hub_Icons-CustomerCare02.svg"
            width="80px"
            className="mb-3"
          />
          <p>24x7 Customer Support</p>
        </Col>
        <Col xs={6} md={4}>
          <Image
            src="/images/svg/2Hub_Icons-Rewards02.svg"
            width="80px"
            className="mb-3"
          />
          <p>Sell with Ease</p>
        </Col>
        <Col xs={6} md={4}>
          <Image
            src="/images/svg/2Hub_Icons-Products.svg"
            width="80px"
            className="mb-3"
          />
          <p>Tech Driven Automation</p>
        </Col>
        <Col xs={6} md={4}>
          <Image
            src="/images/svg/2Hub_Icons-Tech.svg"
            width="80px"
            className="mb-3"
          />
          <p>Customer Friendly UI/UX</p>
        </Col>
      </Row>
    </Container>
  );
};

export default IconText;
