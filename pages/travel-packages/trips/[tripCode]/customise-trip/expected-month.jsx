import {
  Button,
  Card,
  Col,
  Container,
  Image,
  Navbar,
  Row,
} from "react-bootstrap";
import { useRouter } from "next/router";
import { urls } from "../../../../../shared/urls";
import { useSessionStorage } from "../../../../../hooks/useSessionStorage";
import { useEffect, useState } from "react";
import withAuth from "../../../../../utils/withAuth";

const PREFIX = "Travel_Packages__";

const ExpectedMonth = ({ tripCode }) => {
  const router = useRouter();
  const [travelMonth, setTravelMonth] = useSessionStorage(
    `${PREFIX}expected_travel_month`,
    null
  );
  const [expectedMonth, setExpectedMonth] = useState("");
  useEffect(() => setExpectedMonth(travelMonth), [travelMonth]);

  return (
    <>
      <Navbar
        bg="light"
        className=" mb-5 justify-content-center text-center"
        fixed="top"
      >
        <p className="mb-0 small font-weight-bold text-primary py-2">
          STEP 3 of 6
        </p>
      </Navbar>
      <Container className="d-flex align-items-center customise-margin justify-content-center">
        <Row className="justify-content-center">
          <Col xs={12} className="text-center mb-3 mb-lg-5">
            <h4>When would you like to go?</h4>
          </Col>
          <Col xs={6} md={3} className="mb-3">
            <Card
              className={`bg-shade1 text-md text-center py-5 p-3 d-flex h-100 justify-content-between travel-package-customise-card ${
                expectedMonth === "Within a month" ? "selected" : ""
              }`}
              onClick={() => {
                setTravelMonth("Within a month");
                router.push(
                  `${urls.travelPackages_trips}/${tripCode}/customise-trip/accommodation-type/`
                );
              }}
            >
              <div className="mb-4">
                <Image src="/images/svg/travel2.svg" width="130" />
              </div>
              <div className="font-weight-bold">Within a month</div>
            </Card>
          </Col>
          <Col xs={6} md={3} className="mb-3">
            <Card
              className={`bg-shade1 text-md text-center py-5 p-3 d-flex h-100 justify-content-between travel-package-customise-card ${
                expectedMonth === "1-3" ? "selected" : ""
              }`}
              onClick={() => {
                setTravelMonth("1-3");
                router.push(
                  `${urls.travelPackages_trips}/${tripCode}/customise-trip/accommodation-type/`
                );
              }}
            >
              <div className="mb-4">
                <Image src="/images/svg/travel2.svg" width="130" />
              </div>
              <div className="font-weight-bold">1-3 months</div>
            </Card>
          </Col>
          <Col xs={6} md={3} className="mb-3">
            <Card
              className={`bg-shade1 text-md text-center py-5 p-3 d-flex h-100 justify-content-between travel-package-customise-card ${
                expectedMonth === "3+" ? "selected" : ""
              }`}
              onClick={() => {
                setTravelMonth("3+");
                router.push(
                  `${urls.travelPackages_trips}/${tripCode}/customise-trip/accommodation-type/`
                );
              }}
            >
              <div className="mb-4">
                <Image src="/images/svg/travel2.svg" width="100" />
              </div>
              <div className="font-weight-bold">3+ months</div>
            </Card>
          </Col>
          <Col xs={6} md={3} className="mb-3">
            <Card
              className={`bg-shade1 text-md text-center py-5 p-3 d-flex h-100 justify-content-between travel-package-customise-card ${
                expectedMonth === "I am not sure" ? "selected" : ""
              }`}
              onClick={() => {
                setTravelMonth("I am not sure");
                router.push(
                  `${urls.travelPackages_trips}/${tripCode}/customise-trip/accommodation-type/`
                );
              }}
            >
              <div className="mb-4">
                <Image src="/images/svg/not-sure.svg" width="130" />
              </div>
              <div className="font-weight-bold">I am not sure</div>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export const getServerSideProps = async (context) => {
  const { tripCode } = context.query;

  return { props: { tripCode: tripCode } };
};

export default withAuth(ExpectedMonth);
