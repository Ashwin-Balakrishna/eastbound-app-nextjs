import { Image, Card, Col, Container, Navbar, Row } from "react-bootstrap";
import { useRouter } from "next/router";
import { urls } from "../../../../../shared/urls";
import { useSessionStorage } from "../../../../../hooks/useSessionStorage";
import { useEffect, useState } from "react";
import { VscStarEmpty } from "react-icons/vsc";
import withAuth from "../../../../../utils/withAuth";

const PREFIX = "Travel_Packages__";

const HotelBudget = ({ tripCode }) => {
  const router = useRouter();
  const [hotelBudget, setHotelBudget] = useSessionStorage(
    `${PREFIX}hotel_type`,
    null
  );

  const [hotelBudgetState, sethotelBudgetState] = useState("");
  useEffect(() => sethotelBudgetState(hotelBudget), [hotelBudget]);

  return (
    <>
      <Navbar
        bg="light"
        className=" mb-5 justify-content-center text-center"
        fixed="top"
      >
        <p className="mb-0 small font-weight-bold text-primary py-2">
          STEP 4 of 6
        </p>
      </Navbar>
      <Container className="d-flex align-items-center customise-margin justify-content-center">
        <Row className="justify-content-center">
          <Col xs={12} className="text-center mb-3 mb-lg-5">
            <h4>What kind of accommodation do you prefer?</h4>
          </Col>
          <Col xs={6} md={4} lg={3} className=" mb-3">
            <Card
              className={`bg-shade1 text-md text-center py-5 p-3 d-flex h-100 justify-content-between travel-package-customise-card ${
                hotelBudgetState === "2 star" ? "selected" : ""
              }`}
              onClick={() => {
                setHotelBudget("2 star");
                router.push(
                  `${urls.travelPackages_trips}/${tripCode}/customise-trip/trip-budget/`
                );
              }}
            >
              <div className="mb-4">
                <VscStarEmpty size="4rem" />
                <VscStarEmpty size="4rem" />
              </div>
              <div className="font-weight-bold">2 star</div>
            </Card>
          </Col>
          <Col xs={6} md={4} lg={3} className=" mb-3">
            <Card
              className={`bg-shade1 text-md text-center py-5 p-3 d-flex h-100 justify-content-between travel-package-customise-card ${
                hotelBudgetState === "3 star" ? "selected" : ""
              }`}
              onClick={() => {
                setHotelBudget("3 star");
                router.push(
                  `${urls.travelPackages_trips}/${tripCode}/customise-trip/trip-budget/`
                );
              }}
            >
              <div className="mb-4">
                <VscStarEmpty size="4rem" />
                <VscStarEmpty size="4rem" />
                <VscStarEmpty size="4rem" />
              </div>
              <div className="font-weight-bold">3 Star</div>
            </Card>
          </Col>
          <Col xs={6} md={4} lg={3} className=" mb-3">
            <Card
              className={`bg-shade1 text-md text-center py-5 p-3 d-flex h-100 justify-content-between travel-package-customise-card ${
                hotelBudgetState === "4 star" ? "selected" : ""
              }`}
              onClick={() => {
                setHotelBudget("4 star");
                router.push(
                  `${urls.travelPackages_trips}/${tripCode}/customise-trip/trip-budget/`
                );
              }}
            >
              <div className="mb-4">
                <VscStarEmpty size="4rem" />
                <VscStarEmpty size="4rem" />
                <VscStarEmpty size="4rem" />
                <VscStarEmpty size="4rem" />
              </div>
              <div className="font-weight-bold">4 Star</div>
            </Card>
          </Col>
          <Col xs={6} md={4} lg={3} className=" mb-3">
            <Card
              className={`bg-shade1 text-md text-center py-5 p-3 d-flex h-100 justify-content-between travel-package-customise-card ${
                hotelBudgetState === "5 star" ? "selected" : ""
              }`}
              onClick={() => {
                setHotelBudget("5 star");
                router.push(
                  `${urls.travelPackages_trips}/${tripCode}/customise-trip/trip-budget/`
                );
              }}
            >
              <div className="mb-4">
                <VscStarEmpty size="4rem" />
                <VscStarEmpty size="4rem" />
                <VscStarEmpty size="4rem" />
                <VscStarEmpty size="4rem" />
                <VscStarEmpty size="4rem" />
              </div>
              <div className="font-weight-bold">5 Star</div>
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

export default withAuth(HotelBudget);
