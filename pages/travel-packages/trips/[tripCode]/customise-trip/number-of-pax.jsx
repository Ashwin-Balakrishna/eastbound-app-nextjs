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

const NoOfPax = ({ tripCode }) => {
  const router = useRouter();

  const [noOfPax, setNoOfPax] = useSessionStorage(`${PREFIX}pax_type`, null);
  const [numberOfPax, setNumberOfPax] = useState("");
  useEffect(() => setNumberOfPax(noOfPax), [noOfPax]);

  // const [noOfNights] = useSessionStorage(`${PREFIX}no_of_nights`, null);
  // const [numberOfNight, setNumberOfNight] = useState("");
  // useEffect(() => setNumberOfNight(noOfNights), [noOfNights]);

  return (
    <>
      <Navbar
        bg="light"
        className=" mb-5 justify-content-center text-center"
        fixed="top"
      >
        <p className="mb-0 small font-weight-bold text-primary py-2">
          STEP 2 of 6
        </p>
      </Navbar>
      <Container className="d-flex align-items-center customise-margin justify-content-center">
        <Row className="justify-content-center">
          <Col xs={12} className="text-center mb-3 mb-lg-5">
            <h4>How many people are you travelling with?</h4>
          </Col>
          {/* <Col xs={12}>{numberOfNight && <div>{numberOfNight}</div>}</Col> */}

          <Col xs={6} md={3} className="mb-3">
            <Card
              className={`bg-shade1 text-md text-center py-5 d-flex h-100 justify-content-between travel-package-customise-card ${
                numberOfPax === "Solo (Just Me)" ? "selected" : ""
              }`}
              onClick={() => {
                setNoOfPax("Solo (Just Me)");
                router.push(
                  `${urls.travelPackages_trips}/${tripCode}/customise-trip/expected-month/`
                );
              }}
            >
              <div className="mb-4">
                <Image src="/images/svg/people1.1.svg" width="100" />
              </div>
              <div className="font-weight-bold">Solo (Just Me)</div>
            </Card>
          </Col>
          <Col xs={6} md={3} className="mb-3">
            <Card
              className={`bg-shade1 text-md text-center py-5 d-flex h-100 justify-content-between travel-package-customise-card ${
                numberOfPax === "2-4" ? "selected" : ""
              }`}
              onClick={() => {
                setNoOfPax("2-4");
                router.push(
                  `${urls.travelPackages_trips}/${tripCode}/customise-trip/expected-month/`
                );
              }}
            >
              <div className="mb-4">
                <Image src="/images/svg/people1.svg" width="100" />
              </div>
              <div className="font-weight-bold">2-4</div>
            </Card>
          </Col>
          <Col xs={6} md={3} className="mb-3">
            <Card
              className={`bg-shade1 text-md text-center py-5 d-flex h-100 justify-content-between travel-package-customise-card ${
                numberOfPax === "5+" ? "selected" : ""
              }`}
              onClick={() => {
                setNoOfPax("5+");
                router.push(
                  `${urls.travelPackages_trips}/${tripCode}/customise-trip/expected-month/`
                );
              }}
            >
              <div className="mb-4">
                <Image src="/images/svg/people3.svg" width="100" />
              </div>
              <div className="font-weight-bold">5+</div>
            </Card>
          </Col>
          <Col xs={6} md={3} className="mb-3">
            <Card
              className={`bg-shade1 text-md text-center py-5 d-flex h-100 justify-content-between travel-package-customise-card ${
                numberOfPax === "10+" ? "selected" : ""
              }`}
              onClick={() => {
                setNoOfPax("10+");
                router.push(
                  `${urls.travelPackages_trips}/${tripCode}/customise-trip/expected-month/`
                );
              }}
            >
              <div className="mb-4">
                <Image src="/images/svg/people4.svg" width="100" />
              </div>
              <div className="font-weight-bold">10+</div>
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

export default withAuth(NoOfPax);
