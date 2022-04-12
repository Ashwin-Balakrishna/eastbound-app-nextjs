import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row, Tab,Tabs } from "react-bootstrap";
import BaseLayout from "../components/layouts/baseLayout";
import PageLayout from "../components/layouts/pageLayout";
import Credit from "../components/pageComponents/credit/credit";
import CreditPayments from "../components/pageComponents/credit/creditPayment";
import RequestCredits from "../components/pageComponents/credit/requestCredits";
import { fetchgetServerSidePropsWithAuth } from "../utils/apiHelper";
import { NODE_API_URL } from "../utils/helper";
import withAuth from "../utils/withAuth";



const API_URL = process.env.global_url;

function MyCredits({ bookings }) {
  // const [booking, setBooking] = useState({bookings});
  // const [bookingDetails, setBookingDetails] = useState({bookings}.details);
  // const [fetched, setFetched] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    setUsername(localStorage.getItem("firstName"));
    console.log("bookings",bookings)
  }, []);

  const paginationOptions = {
    rowsPerPageText: "Items per page",
    rangeSeparatorText: "of",
  };
  const columns = [
    {
      name: "DETAILS",
      cell: (bookingDetails) => (
        <div style={{ whiteSpace: "pre-wrap" }}>
          {bookingDetails.payment_detail}
        </div>
      ),
    },
    {
      name: "AMOUNT",
      cell: (bookingDetails) => (
        <div style={{ whiteSpace: "pre-wrap" }}>
          {parseFloat(bookingDetails.payment_amount).toFixed(0)}
        </div>
      ),
    },
  ];

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
                  className="text-primary mb-0 text-capitalize"
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
        <Tabs
                  variant="pills"
                  defaultActiveKey="0"
                  // onSelect={(selectedKey) => {
                  //   filterBookings(parseInt(selectedKey));
                  // }}
                  className="nav-tab-pills mb-2"
                  style={{
                    overflowX: "auto",
                    overflowY: "hidden",
                    flexWrap: "nowrap",
                  }}
                >
          <Tab title="Apply Credits" eventKey='0'>
          {/* {bookings.is_credit_agent === true ? ( */}
             {bookings?.message?.status === "approved" ? (
            <>
              <h5>My Credits</h5>
              <div className="d-flex">
                <p>
                  <span className="text-muted">Total Amount</span>{" "}
                  <span className=" ml-2">{bookings.payable_amt}</span>
                </p>
                <p>
                  <span className="text-muted ml-4">Due Date</span>{" "}
                  <span className="ml-2">
                    {bookings.payment_due_date
                      ? bookings.payment_due_date.slice(0, 10)
                      : ""}
                  </span>
                </p>
              </div>
              <DataTable
                noHeader={true}
                columns={columns}
                data={bookings.details}
                pagination
                paginationComponentOptions={paginationOptions}
              />
            </>
          ) : (
            <Credit status={bookings?.message?.status||'not applied'}></Credit>
          )}
          </Tab>
          <Tab title="Request Credits" eventKey='1'><RequestCredits/></Tab>
          <Tab title="Credit Payments" eventKey='2'><CreditPayments/></Tab>
          </Tabs>
        </Card>
      </BaseLayout>
    </PageLayout>
  );
}

export async function getServerSideProps(context) {
  // const { query_data } = nextCookie(context);

  const bookings = await fetchgetServerSidePropsWithAuth(
    `${NODE_API_URL}/getRequestedStatus`,
    "GET",
    null,
    null,
    null,
    context
  );

  return { props: { bookings } };
}

export default withAuth(MyCredits);
