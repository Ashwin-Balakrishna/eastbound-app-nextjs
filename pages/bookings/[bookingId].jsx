import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import PageLayout from "../../components/layouts/pageLayout";
import AmmendBookingForm from "../../components/pageComponents/bookings/ammendBookingForm";
import HotelSearchAmmend from "../../components/pageComponents/hotels/hotelSearchAmmend";
import PaymentCard from "../../components/pageComponents/hotels/paymentCard";
import ThankYou from "../../components/pageComponents/thankyou";

const BOOKING_STEPS = {
  SEARCH_HOTEL: "SEARCH_HOTEL",
  BOOKING_FORM: "BOOKING_FORM",
  THANK_YOU: "THANK_YOU",
};

const getGuestList = (room) => {
  let adults = 0;
  let children = 0;
  room.map((r) => {
    adults += r.adults;
    children += r.children;
  });

  let text = "";
  text += adults ? `${adults} Adult ` : "";
  text += children ? `${children} Children ` : "";
  text += `(${room.length} Room)`;
  return text;
};

const BookingId = ({ query_data }) => {
  const [bookingSteps, setBookingSteps] = useState(BOOKING_STEPS.SEARCH_HOTEL);
  const [hotel, setHotel] = useState([]);
  const [query, setQuery] = useState({});
  const [roomType, setRoomType] = useState({
    pureAgent: null,
    net: 0,
    pure_agent_net: 0,
    tax: 0,
    commission: 0,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const roomPrice = roomType.pureAgent ? roomType.pure_agent_net : roomType.net;
  const commissionCharges = roomPrice * roomType.commission * 0.01;
  const taxAndServices = roomType.pureAgent
    ? commissionCharges * roomType.tax * 0.01
    : (roomPrice + commissionCharges) * roomType.tax * 0.01;

  const totalAmount =
    parseFloat(parseFloat(roomPrice).toFixed(0)) +
    parseFloat(parseFloat(commissionCharges).toFixed(0)) +
    parseFloat(parseFloat(taxAndServices).toFixed(0));
  let submitBookingDetails = null;
  const handleSaveBookingDetails = (e) => {
    if (submitBookingDetails) {
      submitBookingDetails(e);
    }
  };
  const handleSubmitBookingDetails = (submitForm) => {
    submitBookingDetails = submitForm;
  };

  let content = null;
  switch (bookingSteps) {
    case BOOKING_STEPS.SEARCH_HOTEL:
      content = (
        <>
          <Col md={8}>
            <AmmendBookingForm
              query={query_data}
              next={(hotel, query) => {
                setHotel(hotel[0]);
                setQuery(query);
                setBookingSteps(BOOKING_STEPS.BOOKING_FORM);
              }}
            />
          </Col>
        </>
      );
      break;
    case BOOKING_STEPS.BOOKING_FORM:
      content = (
        <>
          <Col md={8}>
            <div className="d-flex justify-content-between">
              <div className="text-md text-muted font-weight-bold mb-3">
                {`Hotel : ${hotel.name}`}
              </div>
            </div>
            <hr />
            <HotelSearchAmmend
              bookingData={query_data}
              totalAmount={totalAmount}
              hotel_data={hotel}
              query_data={query}
              handleSubmitForm={handleSubmitBookingDetails}
              roomType={roomType}
              onRoomTypeSelected={(roomType) => setRoomType(roomType)}
              setErrorMessage={(error) => setErrorMessage(error)}
              bookingSubmitted={() => setBookingSteps(BOOKING_STEPS.THANK_YOU)}
            />
          </Col>
          <Col md={4} className="mt-4">
            <PaymentCard
              prices={{
                pureAgent: roomType.pureAgent,
                basePrice: roomPrice,
                commission: commissionCharges,
                taxAndServices,
                tax: roomType.tax,
                totalAmount,
              }}
              onClick={handleSaveBookingDetails}
              errorMessage={errorMessage}
              getGuestList={getGuestList(query_data.rooms)}
            />
          </Col>
        </>
      );
      break;
    case BOOKING_STEPS.THANK_YOU:
      content = (
        <>
          <Col md={12}>
            <ThankYou
              message="Thank you, your booking ammendment request has been created"
              link="/bookings"
              linkTitle="Go to my bookings"
            />
          </Col>
        </>
      );
      break;
    default:
      break;
  }
  return (
    <PageLayout title="2Hub">
      <Container className="mt-md-5 pt-md-5 mt-4">
        <Row>{content}</Row>
      </Container>
    </PageLayout>
  );
};

export const getServerSideProps = async (context) => {
  const { data } = context.query;
  const query_data = JSON.parse(data);
  return {
    props: {
      query_data: query_data,
    },
  };
};
export default BookingId;
