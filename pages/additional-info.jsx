import withAuth from "../utils/withAuth";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Image, Navbar, Row } from "react-bootstrap";
import ErrorText from "../components/elements/errorText";
import AuthLayout from "../components/layouts/authLayout";
import AgencyDetails from "../components/pageComponents/signUp/agencyDetails";
import ThankYou from "../components/pageComponents/thankyou";
import { fetchFormDataWithoutAuth } from "../utils/apiHelper";
import {
  API_URL,
  getProfileStatus,
  logout,
  reloadPageWithUrl,
} from "../utils/helper";
import Cookies from "js-cookie";
import { urls } from "../shared/urls";

const SIGNUP_STEP = {
  NOT_LOADED: "not_loaded",
  AGENCY_DETAILS: "agency_details",
  CREATING_USER_ACCOUNT: "creating_user_account",
  THANK_YOU: "thankYou",
};

const AdditionalInfo = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [agencyDetails, setAgencyDetails] = useState({
    email: "",
    pan_number: "",
    pan_copy: null,
    agency_address: "",
    agency_city: "",
    agency_state: "",
    agency_country: "",
    agency_pin_code: "",
    agency_guarantee_mode: "",
    agency_iata_regd: "",
    agency_iata_code: "",
    accreditations: "",
    year_in_business: "",
    gst_regd: "",
    t_and_c_accepted: false,
    regd_doc: null,
    gst_details_list: [
      {
        gstin: "",
        place_of_supply: "",
        gstin_cert: null,
      },
    ],
  });

  const [signUpStep, setSignUpStep] = useState(SIGNUP_STEP.NOT_LOADED);

  useEffect(() => {
    const status = getProfileStatus();
    switch (status) {
      case "registered":
        setSignUpStep(SIGNUP_STEP.AGENCY_DETAILS);
        break;
      case "pending":
      case "rejected":
        reloadPageWithUrl("/");
        break;
      case "complete":
        reloadPageWithUrl(urls.home);
        break;
    }
  }, []);

  useEffect(() => {
    const createAccount = async (formData) => {
      try {
        const data = await fetchFormDataWithoutAuth(
          `${API_URL}/api/agent/auth/updateProfileDetails`,
          "PUT",
          null,
          null,
          formData
        );

        if (data.Error || data.error) {
          setErrorMessage(data.Error);
        } else if (data.msg || data.Msg) {
          localStorage.setItem("profileStatus", "pending");
          Cookies.set("profileStatus", "pending");
          setSignUpStep(SIGNUP_STEP.THANK_YOU);
        } else {
          setErrorMessage(`Something went wrong! Please try again later.`);
        }
      } catch (err) {
        setErrorMessage(`Something went wrong! Please try again later.`);
        console.error(`Something went wrong! Error: ${JSON.stringify(err)}`);
      }
    };

    if (signUpStep === SIGNUP_STEP.CREATING_USER_ACCOUNT) {
      setErrorMessage("");
      const signupDetails = { ...agencyDetails };

      const formData = new FormData();
      for (let key in signupDetails) {
        if (key === "gst_details_list" && signupDetails.gst_regd === "true") {
          let gstDetailsList = [];
          signupDetails.gst_details_list.map((gst) => {
            formData.append(gst.gstin, gst.gstin_cert);
            gstDetailsList.push({
              gstin: gst.gstin,
              place_of_supply: gst.place_of_supply,
            });
          });

          formData.append(key, JSON.stringify(gstDetailsList));
        } else if (
          (key === "regd_doc" && signupDetails.gst_regd === "true") ||
          (key === "gst_details_list" && signupDetails.gst_regd === "false")
        ) {
          continue;
        } else {
          formData.append(key, signupDetails[key]);
        }
      }

      createAccount(formData);
    }
  }, [signUpStep]);

  const heading = () => {
    switch (signUpStep) {
      case SIGNUP_STEP.AGENCY_DETAILS:
        return (
          <>
            <div className="py-3">
              <h4 className="font-weight-bold">Tell us more about yourself</h4>
              <p>Please provide all required details to register with us</p>
            </div>
          </>
        );
      case SIGNUP_STEP.CREATING_USER_ACCOUNT:
        return (
          <>
            <h4 className="font-weight-bold">
              Creating the account please wait...
            </h4>
          </>
        );
      case SIGNUP_STEP.THANK_YOU:
        return null;
      default:
        return null;
    }
  };

  const content = () => {
    switch (signUpStep) {
      case SIGNUP_STEP.AGENCY_DETAILS:
        return (
          <AgencyDetails
            agencyDetails={agencyDetails}
            dispatch={(data) => setAgencyDetails(data)}
            next={() => {
              setSignUpStep(SIGNUP_STEP.CREATING_USER_ACCOUNT);
            }}
          />
        );
      case SIGNUP_STEP.CREATING_USER_ACCOUNT:
        return (
          <>
            {errorMessage ? (
              <>
                <div>
                  Oops! There seems to be some issue registering you.Please
                  contact us.
                </div>
                <ErrorText error={errorMessage} />
                <Button
                  className="mt-3 font-weight-bold"
                  variant="primary"
                  type="button"
                  onClick={() => setSignUpStep(SIGNUP_STEP.AGENCY_DETAILS)}
                >
                  Retry
                </Button>
              </>
            ) : (
              <div>Please wait until your request is processed...</div>
            )}
          </>
        );
      case SIGNUP_STEP.THANK_YOU:
        return (
          <>
            <ThankYou
              message="Thank you for signing up"
              subText="Allow us to review your request. We will come back
              to you shortly!."
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <AuthLayout title="2Hub | Complete user registration">
        {signUpStep !== SIGNUP_STEP.CREATING_USER_ACCOUNT ? (
          <Navbar
            bg="light"
            className=" mb-5 justify-content-center text-center"
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
        ) : null}

        <Container style={{ marginTop: "4rem" }}>
          <Row className="mb-3 mb-lg-4">
            <Col xs={12} md={7} lg={5} className="mx-auto">
              {heading()}
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={7} lg={5} className="mx-auto">
              {content()}
            </Col>
          </Row>
        </Container>
      </AuthLayout>
    </>
  );
};

export default withAuth(AdditionalInfo);
