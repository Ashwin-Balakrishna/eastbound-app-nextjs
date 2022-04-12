import { Card, Col, Container, Image, Navbar, Row } from "react-bootstrap";
import { useRouter } from "next/router";
import { urls } from "../../../../../shared/urls";
import { useSessionStorage } from "../../../../../hooks/useSessionStorage";
import { useEffect, useState } from "react";
import withAuth from "../../../../../utils/withAuth";

const PREFIX = "Travel_Packages__";

const TripBudget = ({ tripCode }) => {
  const router = useRouter();
  const [tripBudget, setTripBudget] = useSessionStorage(
    `${PREFIX}budget_range`,
    null
  );

  const [tripBudgetState, setTripBudgetState] = useState("");
  useEffect(() => setTripBudgetState(tripBudget), [tripBudget]);

  return (
    <>
      <Navbar
        bg="light"
        className=" mb-5 justify-content-center text-center"
        fixed="top"
      >
        <p className="mb-0 small font-weight-bold text-primary py-2">
          STEP 5 of 6
        </p>
      </Navbar>
      <Container className="d-flex align-items-center customise-margin justify-content-center">
        <Row className="justify-content-center">
          <Col xs={12} className="text-center mb-3 mb-lg-5">
            <h4>What is your budget for the trip?</h4>
            <p className="text-md text-primary">Excluding your flights</p>
          </Col>
          <Col xs={6} md={3} className="mb-3">
            <Card
              className={`bg-shade1 text-md text-center py-5 p-3 d-flex h-100 justify-content-between travel-package-customise-card ${
                tripBudgetState === "50000-100000" ? "selected" : ""
              }`}
              onClick={() => {
                setTripBudget("50000-100000");
                router.push(
                  `${urls.travelPackages_trips}/${tripCode}/customise-trip/special-request/`
                );
              }}
            >
              <div className="mb-4">
                <Image src="/images/svg/travel1.svg" width="100" />
              </div>
              <div className="font-weight-bold">₹50,000 - ₹100,000</div>
            </Card>
          </Col>
          <Col xs={6} md={3} className="mb-3">
            <Card
              className={`bg-shade1 text-md text-center py-5 p-3 d-flex h-100 justify-content-between travel-package-customise-card ${
                tripBudgetState === "100000-150000" ? "selected" : ""
              }`}
              onClick={() => {
                setTripBudget("100000-150000");
                router.push(
                  `${urls.travelPackages_trips}/${tripCode}/customise-trip/special-request/`
                );
              }}
            >
              <div className="mb-4">
                <Image src="/images/svg/travel2.svg" width="150" />
              </div>
              <div className="font-weight-bold">₹100,000 - ₹150,000</div>
            </Card>
          </Col>
          <Col xs={6} md={3} className="mb-3">
            <Card
              className={`bg-shade1 text-md text-center py-5 p-3 d-flex h-100 justify-content-between travel-package-customise-card ${
                tripBudgetState === "150000 - 200000" ? "selected" : ""
              }`}
              onClick={() => {
                setTripBudget("150000-200000");
                router.push(
                  `${urls.travelPackages_trips}/${tripCode}/customise-trip/special-request/`
                );
              }}
            >
              <div className="mb-4">
                <Image src="/images/svg/travel3.svg" width="100" />
              </div>
              <div className="font-weight-bold">₹150,000 - ₹200,000</div>
            </Card>
          </Col>
          <Col xs={6} md={3} className="mb-3">
            <Card
              className={`bg-shade1 text-md text-center py-5 p-3 d-flex h-100 justify-content-between travel-package-customise-card ${
                tripBudgetState === "200000+" ? "selected" : ""
              }`}
              onClick={() => {
                setTripBudget("200000+");
                router.push(
                  `${urls.travelPackages_trips}/${tripCode}/customise-trip/special-request/`
                );
              }}
            >
              <div className="mb-4">
                <Image src="/images/svg/travel4.svg" width="100" />
              </div>
              <div className="font-weight-bold">Above ₹200,000</div>
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

export default withAuth(TripBudget);
