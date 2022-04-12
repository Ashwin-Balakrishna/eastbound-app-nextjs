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

const NoOfDays = ({ tripCode }) => {
  const router = useRouter();
  const [noOfNights, setNoOfNights] = useSessionStorage(
    `${PREFIX}no_of_nights`,
    null
  );

  const [numberOfNight, setNumberOfNight] = useState("");
  useEffect(() => setNumberOfNight(noOfNights), [noOfNights]);

  return (
    <>
      <Navbar
        bg="light"
        className=" mb-5 justify-content-center text-center"
        fixed="top"
      >
        <p className="mb-0 small font-weight-bold text-primary py-2">
          STEP 1 of 6
        </p>
      </Navbar>
      <Container className="d-flex align-items-center customise-margin justify-content-center">
        <Row className="justify-content-center">
          <Col xs={12} className="text-center mb-3 mb-lg-5">
            <h4>How many days do you have in mind for your trip?</h4>
          </Col>

          <Col xs={6} md={3} className="mb-3">
            <Card
              className={`bg-shade1 p-3 text-md text-center py-5 d-flex h-100 justify-content-between travel-package-customise-card ${
                numberOfNight === "6-9" ? "selected" : ""
              }`}
              onClick={() => {
                setNoOfNights("6-9");
                router.push(
                  `${urls.travelPackages_trips}/${tripCode}/customise-trip/number-of-pax/`
                );
              }}
            >
              <div className="mb-4">
                <Image src="/images/svg/dates.svg" width="100" />
              </div>
              <div className="font-weight-bold">6-9 days</div>
            </Card>
          </Col>
          <Col xs={6} md={3} className="mb-3">
            <Card
              className={`bg-shade1 text-md text-center p-3 py-5 d-flex h-100 justify-content-between travel-package-customise-card ${
                numberOfNight === "10-12" ? "selected" : ""
              }`}
              onClick={() => {
                setNoOfNights("10-12");
                router.push(
                  `${urls.travelPackages_trips}/${tripCode}/customise-trip/number-of-pax/`
                );
              }}
            >
              <div className="mb-4">
                <Image src="/images/svg/dates.svg" width="100" />
              </div>
              <div className="font-weight-bold">10-12 days</div>
            </Card>
          </Col>
          <Col xs={6} md={3} className="mb-3">
            <Card
              className={`bg-shade1 text-md text-center p-3 py-5 d-flex h-100 justify-content-between travel-package-customise-card ${
                numberOfNight === "13-15" ? "selected" : ""
              }`}
              onClick={() => {
                setNoOfNights("13-15");
                router.push(
                  `${urls.travelPackages_trips}/${tripCode}/customise-trip/number-of-pax/`
                );
              }}
            >
              <div className="mb-4">
                <Image src="/images/svg/dates.svg" width="100" />
              </div>
              <div className="font-weight-bold">13-15 days</div>
            </Card>
          </Col>
          <Col xs={6} md={3} className="mb-3">
            <Card
              className={`bg-shade1 text-md text-center p-3 py-5 d-flex h-100 justify-content-between travel-package-customise-card ${
                numberOfNight === "15-20" ? "selected" : ""
              }`}
              onClick={() => {
                setNoOfNights("15-20");
                router.push(
                  `${urls.travelPackages_trips}/${tripCode}/customise-trip/number-of-pax/`
                );
              }}
            >
              <div className="mb-4">
                <Image src="/images/svg/dates.svg" width="100" />
              </div>
              <div className="font-weight-bold">15-20 days</div>
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

export default withAuth(NoOfDays);
