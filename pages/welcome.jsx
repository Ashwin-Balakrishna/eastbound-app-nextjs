import React, { useState, useEffect } from "react";
import withAuth from "../utils/withAuth";
import { Col, Container, Image, Navbar, Row, Card } from "react-bootstrap";
import { fetchFormDataWithAuth } from "../utils/apiHelper";
import { API_URL, logout } from "../utils/helper";
import ThankYou from "../components/pageComponents/thankyou";
import { supportEmail, supportNumberFormated } from "../shared/contacts";

function Welcome() {
  const [profile, setProfile] = useState("");
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (fetched === false) {
      getProfileDetails();
    }
  }, [fetched]);

  const getProfileDetails = async () => {
    try {
      const [profile, payments] = await Promise.all([
        fetchFormDataWithAuth(
          `${API_URL}/api/agent/account/profile`,
          "GET",
          null,
          null,
          null
        ),
        fetchFormDataWithAuth(
          `${API_URL}/api/agent/account/payments`,
          "GET",
          null,
          null,
          null
        ),
      ]);
      if (profile.Error || payments.Error) {
        // setErrorMessage(data.Error);
      } else {
        setProfile(profile);
        // setPayments(payments);
        setFetched(true);
      }
    } catch (err) {
      console.error(`Something went wrong! Error: ${JSON.stringify(err)}`);
    }
  };
  return (
    <>
      <Navbar
        bg="light"
        className="mb-5 justify-content-center text-center"
        fixed="top"
      >
        <Navbar.Brand>
          <Image src="/images/logo.png" alt="2hub_logo" width="100px" />
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse
          className="justify-content-end cursor-pointer"
          onClick={() => logout()}
        >
          <Navbar.Text>Log out</Navbar.Text>
        </Navbar.Collapse>
      </Navbar>
      <Container className="mt-5 pt-5">
        <Card
          body
          className="border-0 shadow-sm"
          style={{ backgroundImage: "url('../../images/Profile_BG02.jpg')" }}
        >
          <Container>
            <Row className="justify-content-md-center text-center pt-2 pb-4">
              <Col md={4} sm={6} className="position-relative">
                <p className="text-primary mb-0" style={{ fontSize: 50 }}>
                  {profile.first_name} {profile.last_name}
                </p>
                <p className="text-muted lead mb-0">{profile.agency_name}</p>
                <p className="text-muted mb-0">
                  +{profile.dial_code} {profile.phone_number}
                </p>
                <p className="text-muted pb-2">{profile.email}</p>
              </Col>
            </Row>
          </Container>
        </Card>
      </Container>
      <Container className="mt-5">
        <ThankYou
          defaultImage="/images/review_docs.svg"
          subText={
            <span>
              Your profile has been updated successfully.
              <br />
              Access to this site will be available from first week of December!
              <br />
              <br />
              Please feel free to contact us at
              <strong> {supportEmail}</strong> or
              <strong> {supportNumberFormated}</strong> for any assistance
            </span>
          }
        />
      </Container>
    </>
  );
}

export default withAuth(Welcome);
