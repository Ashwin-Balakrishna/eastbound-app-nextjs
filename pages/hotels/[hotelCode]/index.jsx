import { useState, createContext } from "react";
import { Col, Container, Image, Row } from "react-bootstrap";
import PageLayout from "../../../components/layouts/pageLayout";
import HotelBooking from "../../../components/pageComponents/hotels/hotelBooking";
import HotelDetails from "../../../components/pageComponents/hotels/hotelDetails";
import HotelSearch from "../../../components/search/hotel/hotelSearch";
import { fetchgetServerSidePropsWithAuth } from "../../../utils/apiHelper";
import { useRouter } from "next/router";
import withAuth from "../../../utils/withAuth";
import ThankYou from "../../../components/pageComponents/thankyou";
import { FaHome } from "react-icons/fa";
import { API_URL, reloadPageWithUrl } from "../../../utils/helper";
import { urls } from "../../../shared/urls";
import {
  HotelCodeProvider,
  useHotelState,
} from "../../../context/hotelCodeContext";

const HotelCode = ({ hotel_data, query_data, error }) => {
  const { HOTEL_STEP, hotelStep, updateHotelStep } = useHotelState();

  let content = null;
  if (error) {
    content = (
      <>
        <section
          className="mt-5 pt-4 bg-info mb-5 sticky-top"
          style={{ top: "-10px" }}
        >
          <Container>
            <Row>
              <Col>
                <HotelSearch
                  query_data={query_data}
                  onSearch={(data) => {
                    reloadPageWithUrl(
                      `${urls.hotels_listing}?search=${encodeURIComponent(
                        JSON.stringify(data)
                      )}`
                    );
                  }}
                />
              </Col>
            </Row>
          </Container>
        </section>
        <Container>
          <Row className="text-center">
            <Col>
              <Image
                src="/images/svg/error.svg"
                width="200"
                className="mb-3"
              ></Image>
              <h3 className="text-jetblack">Something went wrong</h3>
            </Col>
          </Row>
        </Container>
      </>
    );
  } else {
    switch (hotelStep) {
      case HOTEL_STEP.HOTEL_DETAIL:
        content = (
          <HotelDetails
            hotel_data={hotel_data}
            query_data={query_data}
            bookingClicked={() => updateHotelStep(HOTEL_STEP.HOTEL_BOOKING)}
          />
        );
        break;
      case HOTEL_STEP.HOTEL_BOOKING:
        content = (
          <HotelBooking
            hotel_data={hotel_data}
            query_data={query_data}
            bookingSubmitted={() => updateHotelStep(HOTEL_STEP.THANKYOU)}
            back={() => updateHotelStep(HOTEL_STEP.HOTEL_DETAIL)}
          />
        );
        break;
      case HOTEL_STEP.THANKYOU:
        content = (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ height: "70vh" }}
          >
            <ThankYou
              message="Thank you!"
              subText="Done! Your booking has been recieved."
              link="/"
              linkTitle="Go Home"
              variant="outline-info"
              icon={<FaHome />}
            />
          </div>
        );
        break;
    }
  }

  return <div>{content}</div>;
};

const HotelCodePage = ({ hotel_data, query_data, page, error }) => {
  return (
    <PageLayout title={`2Hub | ${hotel_data.name}`}>
      <HotelCodeProvider page={page}>
        <HotelCode
          hotel_data={hotel_data}
          query_data={query_data}
          page={page}
          error={error}
        />
      </HotelCodeProvider>
    </PageLayout>
  );
};

export const getServerSideProps = async (context) => {
  const { hotelCode } = context.params;
  const { search, page } = context.query;
  const query_data = JSON.parse(search);

  const payload = {
    code: parseInt(hotelCode),
    ...query_data,
    city: query_data.hotels.city
  };

  try {
    const data = await fetchgetServerSidePropsWithAuth(
      `${API_URL}/api/agent/hotel/search`,
      "POST",
      null,
      null,
      JSON.stringify(payload),
      context
    );
    console.log(payload,data);
    const filteredData = data.response.filter(obj => {
      return obj.code === parseInt(hotelCode)
    })
    if (data.error || data.Error) {
      return {

        props: {
          error: "Something went wrong",
          query_data: query_data,
          page: "",
        },
      };
    }
    return {
      props: {
        hotel_data: data.response.length > 0 ? filteredData[0] : {},
        query_data: query_data,
        page: page || "",
      },
    };
  } catch (err) {
    console.error(JSON.stringify(err));
    return {
      props: { error: JSON.stringify(err), query_data: query_data, page: "" },
    };
  }
};

export default withAuth(HotelCodePage);
