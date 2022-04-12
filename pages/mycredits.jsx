import Link from "next/link";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import BaseLayout from "../components/layouts/baseLayout";
import PageLayout from "../components/layouts/pageLayout";
import DataTable from "react-data-table-component";
import { fetchFormDataWithAuth } from "../utils/apiHelper";
import withAuth from "../utils/withAuth";

const API_URL = process.env.global_url;

function MyCredits() {
  const [booking, setBooking] = useState("");
  const [username, setUsername] = useState("");
  const [bookingDetails, setBookingDetails] = useState("");
  const [fetched, setFetched] = useState(false);
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumSignificantDigits: 3,
  });
  useEffect(() => {
    if (fetched === false) {
      getMyBookings();
    }
    setUsername(localStorage.getItem("firstName"));
  }, []);

  const paginationOptions = {
    rowsPerPageText: "Items per page",
    rangeSeparatorText: "of",
  };

  const columns = [
    {
      name: "DETAILS",
      cell: (bookingDetails) => (
        <div style={{ whiteSpace: "pre-wrap" }} className="py-3">
          {bookingDetails.payment_detail}
        </div>
      ),
      grow: 3,
    },
    {
      name: "AMOUNT",
      cell: (bookingDetails) => (
        <div style={{ whiteSpace: "pre-wrap" }} className="py-3">
            &#x20B9; {Math.trunc(bookingDetails.payment_amount)}
        </div>
      ),
    },
    {
      name: "DUE DATE",
      cell: (bookingDetails) => (
        <div style={{ whiteSpace: "pre-wrap" }} className="py-3">
          {new Date(bookingDetails.payment_due_date)
            .toLocaleDateString("en-GB")
            .split("/")
            .join("-")}
        </div>
      ),
    },
  ];

  const getMyBookings = async () => {
    try {
      const bookings = await fetchFormDataWithAuth(
        `${API_URL}/api/agent/credit/payable`,
        "GET",
        null,
        null,
        null
      );

      if (bookings.Error) {
        Router.push("/credit");
        // setErrorMessage(data.Error);
      } else {
        if (bookings.is_credit_agent === false) {
          Router.push("/credit");
        } else {
          setBooking(bookings);
          setBookingDetails(bookings.details);
          setFetched(true);
          console.log(bookings);
        }
      }
    } catch (err) {
      // setErrorMessage(`Something went wrong! Please try again later.`);
      console.error(`Something went wrong! Error: ${JSON.stringify(err)}`);
    }
  };

  return (
    <PageLayout title="2Hub | Credits">
      <BaseLayout>
        <Card
          body
          className="border-0 shadow-sm mb-5"
          style={{
            backgroundImage: "url('../../images/Profile_BG02.jpg')",
            backgroundPosition: "center",
          }}
        >
          <Container fluid>
            <Row className="pt-2 pb-4">
              <Col md={12}>
                <p
                  className="mb-0 text-primary text-capitalize"
                  style={{ fontSize: 40 }}
                >
                  Hello {username}
                </p>
                <p className="text-muted">Welcome back to 2HUB</p>
              </Col>
            </Row>
          </Container>
        </Card>
        <Card body className="shadow-sm border-0">
          <h5>My Credits</h5>
          {booking.is_credit_agent === false ? (
            <Link href="/credit">
              <a>
                <Button variant="primary" className="mt-4">
                  Apply for credit
                </Button>
              </a>
            </Link>
          ) : (
            <>
              <div className="d-flex">
                <p>
                  <span className="text-muted">Total Payable</span>{" "}
                  <span className=" ml-2">
                    &#x20B9; {Math.trunc(booking.payable_amt)}
                  </span>
                </p>
                <p className="ml-5">
                  <span className="text-muted">Credit Allocated</span>{" "}
                  <span className=" ml-2">
                    &#x20B9; {Math.trunc(booking.credit_allocated)}
                  </span>
                </p>
                <p className="ml-5">
                  <span className="text-muted">Credit Balance</span>{" "}
                  <span className=" ml-2">
                    &#x20B9; {Math.trunc(booking.credit_balance)}
                  </span>
                </p>
               
              </div>
              <DataTable
                noHeader={true}
                columns={columns}
                data={bookingDetails}
                pagination
                paginationComponentOptions={paginationOptions}
              />
            </>
          )}
        </Card>
      </BaseLayout>
    </PageLayout>
  );
}

export default withAuth(MyCredits);
