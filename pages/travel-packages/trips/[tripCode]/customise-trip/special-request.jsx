/* eslint-disable no-unused-vars */
import { Button, Col, Container, Form, Navbar, Row } from "react-bootstrap";
import Checkbox from "../../../../../components/elements/checkbox";
import TextField from "../../../../../components/elements/textField/textField";
import { useRouter } from "next/router";
import { urls } from "../../../../../shared/urls";
import { Formik } from "formik";
import { useSessionStorage } from "../../../../../hooks/useSessionStorage";
import FormLabel from "../../../../../components/elements/formLabel";
import Radio from "../../../../../components/elements/radio";
import RadioGroup from "../../../../../components/elements/radioGroup";
import { fetchDataWithAuth } from "../../../../../utils/apiHelper";
import { API_URL, getLoggedInUserEmail } from "../../../../../utils/helper";
import { useState } from "react";
import ErrorText from "../../../../../components/elements/errorText";
import * as Yup from "yup";
import withAuth from "../../../../../utils/withAuth";

const PREFIX = "Travel_Packages__";

const getSpecialRequest = (specialRequest) => {
  const arr = [];
  specialRequest.honeymoon ? arr.push("Honeymoon") : null;
  specialRequest.weddingAnniversary ? arr.push("Wedding anniversary") : null;
  specialRequest.seniorCitizen ? arr.push("Senior Citizens") : null;
  specialRequest.birthday ? arr.push("Birthday") : null;
  specialRequest.physicallyChallenged
    ? arr.push("Physically Challenged")
    : null;
  specialRequest.extra ? arr.push(specialRequest.extra) : null;

  return arr;
};
const validationSchema = Yup.object({
  booking_intent: Yup.string().required("Please choose an option"),
});

const SpecialRequest = ({ tripCode }) => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const [noOfPax, setNoOfPax] = useSessionStorage(`${PREFIX}pax_type`, null);

  const [noOfNights, setNoOfNights] = useSessionStorage(
    `${PREFIX}no_of_nights`,
    null
  );

  const [travelMonth, setTravelMonth] = useSessionStorage(
    `${PREFIX}expected_travel_month`,
    null
  );

  // const [packageType, setPackageType] = useSessionStorage(
  //   `${PREFIX}package_type`,
  //   null
  // );

  const [hotelBudget, setHotelBudget] = useSessionStorage(
    `${PREFIX}hotel_type`,
    null
  );

  const [tripBudget, setTripBudget] = useSessionStorage(
    `${PREFIX}budget_range`,
    null
  );

  return (
    <>
      <Navbar
        bg="light"
        className=" mb-5 justify-content-center text-center"
        fixed="top"
      >
        <p className="mb-0 small font-weight-bold text-primary py-2">
          STEP 6 of 6
        </p>
      </Navbar>
      <Container style={{ marginTop: "4rem" }}>
        <Row>
          <Col xs={12} md={7} lg={5} className="mx-auto">
            <h4 className="font-weight-bold mb-3 mb-lg-5">
              Any special requests?
            </h4>
            <Formik
              key="specials_key"
              validationSchema={validationSchema}
              onSubmit={(data, { setSubmitting }) => {
                const specialRequests = getSpecialRequest(data.specialRequest);

                const postCustomiseEnquire = async (payload) => {
                  setSubmitting(true);
                  try {
                    const response = await fetchDataWithAuth(
                      `${API_URL}/api/travelPackages/customizeBookingEnquiry`,
                      "POST",
                      null,
                      null,
                      payload
                    );

                    if (response.Error) {
                      setErrorMessage(response.Error);
                    } else {
                      const { tripCode } = router.query;

                      router.push(
                        `${urls.travelPackages_trips}/${tripCode}/thankYou`
                      );
                    }
                  } catch (err) {
                    setErrorMessage(
                      `Something went wrong! Please try again later.`
                    );
                    console.error(
                      `Something went wrong! Error: ${JSON.stringify(err)}`
                    );
                  } finally {
                    setSubmitting(false);
                  }
                };

                const payload = {};

                payload.no_of_nights = noOfNights;
                payload.pax_type = noOfPax;
                payload.expected_travel_month = travelMonth;
                // payload.package_type = packageType;
                payload.hotel_type = hotelBudget;
                payload.budget_range = tripBudget;
                payload.special_request = specialRequests;
                payload.booking_intent = data.booking_intent;

                postCustomiseEnquire({
                  booking_details: payload,
                  travel_package_slug: tripCode,
                  agent_email: getLoggedInUserEmail(),
                });
              }}
              initialValues={{
                specialRequest: {
                  honeymoon: false,
                  weddingAnniversary: false,
                  birthday: false,
                  seniorCitizen: false,
                  physicallyChallenged: false,
                  extra: "",
                },
                booking_intent: "",
              }}
            >
              {({ handleSubmit }) => (
                <>
                  <Form onSubmit={handleSubmit}>
                    <p className="small text-muted font-weight-bold form-label">
                      Is this a trip for a special occasion? If so, please
                      choose from the options below.
                    </p>

                    <div>
                      <Checkbox name="specialRequest.honeymoon" id="honeymoon">
                        <span className="text-md text-muted">Honeymoon</span>
                      </Checkbox>
                      <Checkbox
                        name="specialRequest.weddingAnniversary"
                        id="Wedding-anniversary"
                      >
                        <span className="text-md text-muted">
                          Wedding anniversary
                        </span>
                      </Checkbox>

                      <Checkbox name="specialRequest.birthday" id="birthday">
                        <span className="text-md text-muted">Birthday</span>
                      </Checkbox>
                      <Checkbox
                        name="specialRequest.seniorCitizen"
                        id="senior-citizen"
                      >
                        <span className="text-md text-muted">
                          Senior Citizens
                        </span>
                      </Checkbox>

                      <Checkbox
                        name="specialRequest.physicallyChallenged"
                        id="physically-challenged"
                      >
                        <span className="text-md text-muted">
                          Physically Challenged
                        </span>
                      </Checkbox>
                      <TextField
                        name="specialRequest.extra"
                        placeholder="write here"
                        label="Any Other Request (Optional)"
                        type="textarea"
                      />
                    </div>

                    <FormLabel label="How likely are you to travel?*" />
                    <RadioGroup name="booking_intent">
                      <Radio
                        className="mb-2 text-muted"
                        name="booking_intent"
                        id="is_definitely_booking"
                        value="definitely_booking"
                      >
                        Definitely booking
                      </Radio>
                      <Radio
                        className="mb-2 text-muted"
                        name="booking_intent"
                        id="is_thinking_about_booking"
                        value="thinking_about_booking"
                      >
                        Thinking about booking
                      </Radio>
                      <Radio
                        className="mb-2 text-muted"
                        name="booking_intent"
                        id="is_just_browsing"
                        value="just_browsing"
                      >
                        Just browsing
                      </Radio>
                    </RadioGroup>

                    <Button
                      block
                      className="btn-lg my-4"
                      variant="primary"
                      type="submit"
                    >
                      Enquire
                    </Button>
                    {errorMessage && <ErrorText error={errorMessage} />}
                  </Form>
                </>
              )}
            </Formik>
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

export default withAuth(SpecialRequest);
