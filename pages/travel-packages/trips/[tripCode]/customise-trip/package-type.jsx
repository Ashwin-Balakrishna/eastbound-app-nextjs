import { Card, Col, Container, Image, Navbar, Row } from "react-bootstrap";
import { useRouter } from "next/router";
import { urls } from "../../../../../shared/urls";
import { useSessionStorage } from "../../../../../hooks/useSessionStorage";
import { useEffect, useState } from "react";
import withAuth from "../../../../../utils/withAuth";

// "1" -- "Fixed Departure Group Tour"
// "3" -- "Semi-Escorted Tour"
// "4" -- "Customizable Tour"
// "5" -- "Youth Travel Tour"
// "7" -- "Senior Travel Tour"
// "8" -- "Staycation Tour"
// "9" -- "Independent Private Tour "
// "10" -- "Independent Self-Guided Tour "
// "11" -- "Independent Custom Tour "
// "12" -- "Independent Self Drive Tour "
// "14" -- "Independent Hop On/Off  Tour "
// "18" -- "Independent Flexi Tour "

const PREFIX = "Travel_Packages__";

const PackageType = ({ tripCode }) => {
  const router = useRouter();
  const [packageType, setPackageType] = useSessionStorage(
    `${PREFIX}package_type`,
    null
  );

  const [packageTypeState, setPackageTypeState] = useState("");
  useEffect(() => setPackageTypeState(packageType), [packageType]);

  return (
    <>
      <Navbar
        bg="light"
        className=" mb-5 justify-content-center text-center"
        fixed="top"
      >
        <p className="mb-0 small font-weight-bold text-primary py-2">
          STEP 4 of 7
        </p>
      </Navbar>
      <Container className="d-flex align-items-center customise-margin justify-content-center">
        <Row className="justify-content-center">
          <Col xs={12} className="text-center mb-3 mb-lg-4">
            <h4>How would you like to travel?</h4>
          </Col>
          <Col xs={6} md={3} lg={2} className="mb-3">
            <Card
              className={`bg-shade1 text-md text-center py-5 p-3 d-flex h-100 justify-content-between travel-package-customise-card ${
                packageTypeState === 1 ? "selected" : ""
              }`}
              onClick={() => {
                setPackageType(1);
                router.push(
                  `${urls.travelPackages_trips}/${tripCode}/customise-trip/hotel-budget/`
                );
              }}
            >
              <div className="mb-4">
                <Image src="/images/svg/people3.svg" width="100" />
              </div>
              <div>Fixed Departure Group Tour</div>
            </Card>
          </Col>
          <Col xs={6} md={3} lg={2} className="mb-3">
            <Card
              className={`bg-shade1 text-md text-center py-5 p-3 d-flex h-100 justify-content-between travel-package-customise-card ${
                packageTypeState === 4 ? "selected" : ""
              }`}
              onClick={() => {
                setPackageType(4);
                router.push(
                  `${urls.travelPackages_trips}/${tripCode}/customise-trip/hotel-budget/`
                );
              }}
            >
              <div className="mb-4">
                <Image src="/images/svg/customise.svg" width="100" />
              </div>
              <div>Customizable Tour</div>
            </Card>
          </Col>
          <Col xs={6} md={3} lg={2} className="mb-3">
            <Card
              className={`bg-shade1 text-md text-center py-5 p-3 d-flex h-100 justify-content-between travel-package-customise-card ${
                packageTypeState === 18 ? "selected" : ""
              }`}
              onClick={() => {
                setPackageType(18);
                router.push(
                  `${urls.travelPackages_trips}/${tripCode}/customise-trip/hotel-budget/`
                );
              }}
            >
              <div className="mb-4">
                <Image src="/images/svg/people1.1.svg" width="100" />
              </div>
              <div>Independent Flexi Tour</div>
            </Card>
          </Col>
          <Col xs={6} md={3} lg={2} className="mb-3">
            <Card
              className={`bg-shade1 text-md text-center py-5 p-3 d-flex h-100 justify-content-between travel-package-customise-card ${
                packageTypeState === 5 ? "selected" : ""
              }`}
              onClick={() => {
                setPackageType(5);
                router.push(
                  `${urls.travelPackages_trips}/${tripCode}/customise-trip/hotel-budget/`
                );
              }}
            >
              <div className="mb-4">
                <Image src="/images/svg/youth.svg" width="100" />
              </div>
              <div>Youth Travel Tour</div>
            </Card>
          </Col>
          <Col xs={6} md={3} lg={2} className="mb-3">
            <Card
              className={`bg-shade1 text-md text-center py-5 p-3 d-flex h-100 justify-content-between travel-package-customise-card ${
                packageTypeState === 7 ? "selected" : ""
              }`}
              onClick={() => {
                setPackageType(7);
                router.push(
                  `${urls.travelPackages_trips}/${tripCode}/customise-trip/hotel-budget/`
                );
              }}
            >
              <div className="mb-4">
                <Image src="/images/svg/senior.svg" width="100" />
              </div>
              <div>Senior Travel Tour</div>
            </Card>
          </Col>
          <Col xs={6} md={3} lg={2} className="mb-3">
            <Card
              className={`bg-shade1 text-md text-center py-5 p-3 d-flex h-100 justify-content-between travel-package-customise-card ${
                packageTypeState === "I am not sure" ? "selected" : ""
              }`}
              onClick={() => {
                setPackageType("I am not sure");
                router.push(
                  `${urls.travelPackages_trips}/${tripCode}/customise-trip/hotel-budget/`
                );
              }}
            >
              <div className="mb-4">
                <Image src="/images/svg/not-sure.svg" width="100" />
              </div>
              <div>I am not sure</div>
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

export default withAuth(PackageType);
