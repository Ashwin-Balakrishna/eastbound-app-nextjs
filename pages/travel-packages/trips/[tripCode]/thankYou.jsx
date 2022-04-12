import { Col, Container, Row } from "react-bootstrap";
import ThankYou from "../../../../components/pageComponents/thankyou";
import { urls } from "../../../../shared/urls";

const Thanks = () => {
  return (
    <Container className="d-flex flex-column align-items-center vh-100 justify-content-center">
      <Row>
        <Col xs={12} md={8} lg={6} className="mx-auto">
          <ThankYou
            defaultImage="/images/thankyou1.svg"
            message="Thank You!"
            subText="One of our travel designers will be giving you a call to discuss your plan and share on-going offers and deals."
            link="/"
            linkTitle="Go Home"
            variant="outline-primary"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Thanks;
