import { FieldArray, Formik } from "formik";
import React, { Fragment, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { fetchDataWithAuth } from "../../../utils/apiHelper";
import { API_URL, getLoggedInUserEmail } from "../../../utils/helper";
import ErrorText from "../../elements/errorText";
import FormLabel from "../../elements/formLabel";
import PhoneNumber from "../../elements/phoneNumber/phoneNumber";
import Radio from "../../elements/radio";
import RadioGroup from "../../elements/radioGroup";
import TextField from "../../elements/textField/textField";
import { useRouter } from "next/router";
import { urls } from "../../../shared/urls";

const TripEnquireForm = ({ productId, departureId }) => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  return (
    <>
      <Row className="my-4 text-center">
        <Col xs={12} md={10} className="mx-auto">
          <h4>Lets Get Started!</h4>
          <p className="text-muted">
            Please share your information so that we can arrange a call back and
            have our travel experts guide you.
          </p>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={10} className="mx-auto">
          <Formik
            key="enquire_form"
            // validationSchema={enquireFormSchema}
            onSubmit={(data, { setSubmitting }) => {
              const postEnquire = async (payload) => {
                setSubmitting(true);
                try {
                  const response = await fetchDataWithAuth(
                    `${API_URL}/api/travelPackages/bookingEnquire`,
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
                      `${router.pathname}/thankYou`,
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

              const payload = JSON.parse(JSON.stringify(data));

              payload.booking_details.guest_details.forEach((guest) => {
                delete guest["phoneIsValid"];
                guest.travel_packages_bookings_guest_details_phone_number = guest.travel_packages_bookings_guest_details_phone_number.replace(
                  guest.travel_packages_bookings_guest_details_dial_code,
                  ""
                );
              });

              setErrorMessage("");
              postEnquire(payload);
            }}
            initialValues={{
              booking_details: {
                booking_intent: "",
                guest_details: [
                  {
                    travel_packages_bookings_guest_details_first_name: "",
                    travel_packages_bookings_guest_details_last_name: "",
                    travel_packages_bookings_guest_details_dial_code: "+91",
                    travel_packages_bookings_guest_details_phone_number: "",
                    travel_packages_bookings_guest_details_email: "",
                    travel_packages_bookings_guest_details_is_primary: true,
                  },
                ],
              },
              agent_email: getLoggedInUserEmail(),
              travel_package_id: productId,
              travel_packages_departure_id: departureId,
            }}
          >
            {({
              values,
              handleSubmit,
              setFieldValue,
              handleBlur,
              isSubmitting,
              touched,
              errors,
            }) => (
              <Form onSubmit={handleSubmit}>
                <FieldArray name="booking_details.guest_details">
                  {() => (
                    <>
                      {values.booking_details.guest_details &&
                        values.booking_details.guest_details.map(
                          (guest, index) => {
                            return (
                              <Fragment key={index}>
                                <FormLabel label="Name*" />
                                <div className="d-lg-flex">
                                  <TextField
                                    formGroupClassName="mr-lg-2 flex-fill"
                                    name={`booking_details.guest_details.${index}.travel_packages_bookings_guest_details_first_name`}
                                    placeholder="First Name"
                                    value={
                                      guest.travel_packages_bookings_guest_details_first_name
                                    }
                                  />
                                  <TextField
                                    formGroupClassName="flex-fill"
                                    name={`booking_details.guest_details.${index}.travel_packages_bookings_guest_details_last_name`}
                                    placeholder="Last Name"
                                    value={
                                      guest.travel_packages_bookings_guest_details_last_name
                                    }
                                  />
                                </div>
                                <TextField
                                  type="email"
                                  name={`booking_details.guest_details.${index}.travel_packages_bookings_guest_details_email`}
                                  value={
                                    guest.travel_packages_bookings_guest_details_email
                                  }
                                  label="Email"
                                />
                                <PhoneNumber
                                  label="Mobile Number*"
                                  name={`booking_details.guest_details.${index}.travel_packages_bookings_guest_details_phone_number`}
                                  country="in"
                                  preferredCountries={["in"]}
                                  value={
                                    guest.travel_packages_bookings_guest_details_phone_number
                                  }
                                  onPhoneChange={(
                                    value,
                                    country,
                                    e,
                                    _,
                                    isValid
                                  ) => {
                                    setFieldValue(
                                      `booking_details.guest_details.${index}.travel_packages_bookings_guest_details_dial_code`,
                                      country.dialCode
                                    );
                                    setFieldValue(
                                      `booking_details.guest_details.${index}.travel_packages_bookings_guest_details_phone_number`,
                                      value
                                    );
                                    setFieldValue(
                                      `booking_details.guest_details.${index}.phoneIsValid`,
                                      isValid
                                    );
                                  }}
                                  searchPlaceholder="Search by Country name or code"
                                  errorText={
                                    errors?.booking_details?.guest_details
                                      ?.length ===
                                      index + 1 &&
                                    errors.booking_details.guest_details[index]
                                      .phone_number &&
                                    touched?.booking_details?.guest_details
                                      ?.length ===
                                      index + 1 &&
                                    touched.booking_details.guest_details[index]
                                      .phone_number
                                      ? errors.booking_details.guest_details[
                                          index
                                        ].phone_number
                                      : ""
                                  }
                                  touched={
                                    touched?.booking_details?.guest_details
                                      ?.length ===
                                      index + 1 &&
                                    touched.booking_details.guest_details[index]
                                      .phone_number
                                  }
                                  onBlur={handleBlur}
                                />
                              </Fragment>
                            );
                          }
                        )}
                    </>
                  )}
                </FieldArray>
                <FormLabel label="How likely your customer to travel*" />
                <RadioGroup name="booking_details.booking_intent">
                  <Radio
                    className="mb-2 text-muted"
                    name="booking_details.booking_intent"
                    id="is_definitely_booking"
                    value="definitely_booking"
                    checked={
                      values.booking_details.booking_intent ===
                      "definitely_booking"
                    }
                  >
                    Definitely booking
                  </Radio>
                  <Radio
                    className="mb-2 text-muted"
                    name="booking_details.booking_intent"
                    id="is_thinking_about_booking"
                    value="thinking_about_booking"
                    checked={
                      values.booking_details.booking_intent ===
                      "thinking_about_booking"
                    }
                  >
                    Thinking about booking
                  </Radio>
                  <Radio
                    className="mb-2 text-muted"
                    name="booking_details.booking_intent"
                    id="is_just_browsing"
                    value="just_browsing"
                    checked={
                      values.booking_details.booking_intent === "just_browsing"
                    }
                  >
                    Just browsing
                  </Radio>
                </RadioGroup>
                <Button
                  className="mt-3"
                  block
                  size="lg"
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Enquire
                </Button>
                {errorMessage && <ErrorText error={errorMessage} />}
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </>
  );
};

export default TripEnquireForm;
