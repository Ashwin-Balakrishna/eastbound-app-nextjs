import React, { useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import moment from "moment";
import Link from "next/link";
import { fetchFormDataWithAuth } from "../utils/apiHelper";
const API_URL = process.env.global_url;

const BookingDetails = ({ paymentId }) => {
  const [fetched, setFetched] = useState(false);
  const [bookingDetails, setBookingDetails] = useState("");

  useEffect(() => {
    if (fetched === false) {
      getBookingDetails();
    }
  }, []);

  const getBookingDetails = async () => {
    try {
      const res = await fetchFormDataWithAuth(
        `${API_URL}/api/agent/bookings/bookingdetails?payment_id=${paymentId}`,
        "GET",
        null,
        null,
        null
      );

      if (res.Error) {
        // setErrorMessage(data.Error);
      } else {
        setBookingDetails(res);
        setFetched(true);
      }
    } catch (err) {
      console.error(`Something went wrong! Error: ${JSON.stringify(err)}`);
    }
  };

  return (
    <section className="mt-5">
      <div className="container pt-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8">
            <h3 className="text-center mb-5">Booking Details</h3>
            <Row>
              <Col md={6}>
                <span className="font-weight-bold text-muted mr-2">
                  Hotel Name:
                </span>
                <span className="text-muted">{bookingDetails.hotel}</span>
              </Col>
            </Row>
            <Row className="mb-4">
              <Col md={6}>
                <span className="font-weight-bold text-muted mr-2">
                  Check-in:
                </span>
                <span className="text-muted">
                  {moment(bookingDetails.checkin).format("DD-MM-YYYY")}
                </span>
              </Col>
              <Col md={6}>
                <span className="float-right">
                  <span className="font-weight-bold text-muted mr-2">
                    Check-out:
                  </span>
                  <span className="text-muted">
                    {moment(bookingDetails.checkout).format("DD-MM-YYYY")}
                  </span>
                </span>
              </Col>
            </Row>
            <hr />
            <Row>
              <Col md={6}>
                <span className="font-weight-bold text-muted mr-2">
                  Booking Reference:
                </span>
                <span className="text-muted">
                  {bookingDetails.booking_reference}
                </span>
              </Col>
              <Col md={6}>
                <span className="float-right">
                  <span className="font-weight-bold text-muted mr-2">
                    Primary Guest:
                  </span>
                  <span className="text-muted">
                    {bookingDetails.primary_guest}
                  </span>
                </span>
              </Col>
            </Row>
            <Row className="mb-4">
              <Col md={6}>
                <span className="font-weight-bold text-muted mr-2">
                  Booking Status:
                </span>
                <span className="text-muted">
                  {bookingDetails.booking_status}
                </span>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <span className="font-weight-bold text-muted mr-2">Rooms:</span>
              </Col>
            </Row>
            <Row className="mb-4">
              <Col md={12}>
                {bookingDetails.rooms !== undefined
                  ? bookingDetails.rooms.map((room, i) => (
                      <div key={i} className="mb-2">
                        <div className="text-muted">
                          {room.no}: {room.room} ({room.meal_plan})
                        </div>
                        <div className="text-muted">
                          Adults: {room.adults} Children: {room.children}
                        </div>
                      </div>
                    ))
                  : null}
              </Col>
            </Row>
            <hr />
            <Row className="d-none">
              <Col md={6}>
                <span className="font-weight-bold text-muted mr-2">
                  Cancellation Policy:
                </span>
              </Col>
            </Row>
            <Row className="d-none">
              <Col md={6}>
                <div className="text-muted">
                  1000/- cancellation charges from dd-mm-yyyy
                </div>
                <div className="text-muted">
                  1000/- cancellation charges from dd-mm-yyyy
                </div>
              </Col>
            </Row>
            <div className="row justify-content-center">
              <Link href="/home" passHref>
                <Button variant="primary" className="mt-3">
                  Go to home page
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

BookingDetails.getInitialProps = async (ctx) => {
  const paymentId = ctx.query.paymentId;

  return { paymentId };
};

export default BookingDetails;
