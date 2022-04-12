import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import * as Yup from "yup";
import Checkbox from "../../components/elements/checkbox";
import FileUpload from "../../components/elements/fileUpload";
import FormLabel from "../../components/elements/formLabel";
import PhoneNumber from "../../components/elements/phoneNumber/phoneNumber";
import Radio from "../../components/elements/radio";
import RadioGroup from "../../components/elements/radioGroup";
import SelectField from "../../components/elements/selectField";
import TextField from "../../components/elements/textField/textField";
import PageLayout from "../../components/layouts/pageLayout";
import SideMenu from "../../components/pageComponents/sideMenu/sideMenu";
import { fetchFormDataWithAuth } from "../../utils/apiHelper";
import { getStatesOptions } from "../../utils/helper";
import withAuth from "../../utils/withAuth";

const API_URL = process.env.global_url;

const accreditationOptions = [{ label: "igta", value: "1" }];

const EditProfile = () => {
  const [profile, setProfile] = useState("");
  const [payments, setPayments] = useState("");
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
        setPayments(payments);
        setFetched(true);
      }
    } catch (err) {
      // setErrorMessage(`Something went wrong! Please try again later.`);
      console.error(`Something went wrong! Error: ${JSON.stringify(err)}`);
    }
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone_number: profile.phone_number,
        email: profile.email,
        agency_name: profile.agency_name,
        pan_number: profile.pan_number,
        pan_copy: profile.pan_copy,
        agency_address: profile.agency_address,
        agency_pin_code: profile.agency_pin_code,
        agency_city: profile.agency_city,
        agency_state: profile.agency_state,
        agency_guarantee_mode: "",
        accreditation: "",
        agency_iata_regd: profile.agency_iata_regd,
        year_in_business: "",
        gst_regd: "",
        regd_doc: "",
        t_and_c_accepted: "true",
        submitted_place: "",
        dial_code: "+91",
        agency_iata_code: "",
      }}
      onSubmit={(values, { setSubmitting }) => {}}
      validationSchema={Yup.object().shape({
        // first_name: Yup.string()
        // 	.required("First name is required"),
        // last_name: Yup.string()
        // 	.required("Last name is required"),
      })}
    >
      {(props) => {
        const {
          values,
          touched,
          errors,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
        } = props;

        return (
          <PageLayout title="2Hub | Edit Profile">
            <Row
              className="no-gutters w-100 h-100"
              style={{ position: "absolute", top: 0 }}
            >
              {/* */}
              <SideMenu />
              <Col md={10} className="p-5 mt-5 bg-light">
                <Row className="mb-4">
                  <Col>
                    <h5>My Profile</h5>
                  </Col>
                </Row>
                <Row>
                  <Col md={9}>
                    <Card body className="shadow-sm border-0">
                      <Row>
                        <Col>
                          <TextField
                            label="First name"
                            name="first_name"
                            type="text"
                            value={values.first_name}
                            disabled
                            // disabled={isSubmitting}
                          />
                        </Col>
                        <Col>
                          <TextField
                            label="Last name"
                            name="last_name"
                            type="text"
                            value={values.last_name}
                            disabled
                            // disabled={isSubmitting}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <PhoneNumber
                            label="Phone Number"
                            name="phone_number"
                            country="in"
                            preferredCountries={["in"]}
                            value={values.phone_number}
                            onPhoneChange={(value, country, e, _, isValid) => {
                              setFieldValue("dial_code", country.dialCode);
                              setFieldValue("phone_number", value);
                              // setFieldValue("phoneIsValid", isValid);
                            }}
                            searchPlaceholder="Search by Country name or code"
                            errorText={
                              errors.phone_number && touched.phone_number
                                ? errors.phone_number
                                : ""
                            }
                            touched={touched.phone_number}
                            onBlur={handleBlur}
                            disabled
                          />
                        </Col>
                        <Col>
                          <TextField
                            label="Email"
                            name="email"
                            type="text"
                            value={values.email}
                            disabled
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <FormLabel label="PAN number" />

                          <TextField
                            name="pan_number"
                            type="text"
                            value={values.pan_number}
                            disabled
                          />
                        </Col>
                        <Col>
                          <FileUpload
                            id="Pancard"
                            accept=".jpg,.png,.jpeg,.pdf,.zip,.gif"
                            helptext="Please upload jpg,png,jpeg,pdf,zip,gif"
                            label="PAN copy"
                            data-browse="Upload"
                            name="pan_copy"
                            formGroupClassName="mt-4"
                            fileselected={values.pan_copy}
                            fileChanged={(f) => setFieldValue("pan_copy", f)}
                            errorText={
                              errors.pan_copy && touched.pan_copy
                                ? errors.pan_copy
                                : ""
                            }
                            onBlur={handleBlur}
                            disabled
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <TextField
                            label="Agency Name"
                            name="agency_name"
                            type="text"
                            value={values.agency_name}
                            disabled
                          />
                        </Col>
                      </Row>
                      <TextField
                        label="Agency Address"
                        name="agency_address"
                        type="textarea"
                        value={values.agency_address}
                        disabled
                      />
                      <TextField
                        label="Agency Pin Code"
                        name="agency_pin_code"
                        type="number"
                        value={values.agency_pin_code}
                        disabled
                      />
                      <TextField
                        label="Agency City"
                        name="agency_city"
                        type="text"
                        value={values.agency_city}
                        disabled
                      />
                      <SelectField
                        label="Agency State"
                        name="agency_state"
                        value={values.agency_state}
                        options={getStatesOptions()}
                        disabled
                      />
                      <RadioGroup
                        name="agency_guarantee_mode"
                        label="Guarantee mode"
                        formgroupclassname="align-items-lg-center"
                        value={values.agency_guarantee_mode}
                        error={errors.agency_guarantee_mode}
                        touched={touched.agency_guarantee_mode}
                        disabled
                      >
                        <Radio
                          className="mb-2 mb-lg-0 text-md mr-lg-3"
                          name="agency_guarantee_mode"
                          id="no-guarantee"
                          value="1"
                          checked={values.agency_guarantee_mode === "1"}
                        >
                          No guarantee
                        </Radio>
                        <Radio
                          className="mb-2 mb-lg-0 text-md mr-lg-3"
                          name="agency_guarantee_mode"
                          id="bank-guarantee"
                          value="2"
                          checked={values.agency_guarantee_mode === "2"}
                        >
                          Bank guarantee
                        </Radio>
                        <Radio
                          className="mb-2 mb-lg-0 text-md"
                          name="agency_guarantee_mode"
                          id="post-dated-cheque"
                          value="3"
                          checked={values.agency_guarantee_mode === "3"}
                        >
                          Post dated cheque
                        </Radio>
                      </RadioGroup>
                      <RadioGroup
                        id="agency_iata_regd"
                        name="agency_iata_regd"
                        label="IATA regd"
                        value={values.agency_iata_regd}
                        error={errors.agency_iata_regd}
                        touched={touched.agency_iata_regd}
                      >
                        <Radio
                          className="form-check-inline ml-3"
                          name="agency_iata_regd"
                          id="iata-yes"
                          value="true"
                          checked={values.agency_iata_regd === "true"}
                        >
                          Yes
                        </Radio>
                        <Radio
                          className="form-check-inline"
                          name="agency_iata_regd"
                          id="iata-no"
                          value="false"
                          checked={values.agency_iata_regd === "false"}
                        >
                          No
                        </Radio>
                      </RadioGroup>
                      {values.agency_iata_regd === "true" ? (
                        <TextField
                          name="agency_iata_code"
                          placeholder="IATA code"
                          label="IATA Code"
                          value={values.agency_iata_code}
                        />
                      ) : null}
                      <SelectField
                        label="Accreditation"
                        // id="accreditation"
                        name="accreditation"
                        value={values.accreditation}
                        options={accreditationOptions}
                      />
                      <TextField
                        placeholder="Please enter number of years"
                        name="year_in_business"
                        type="number"
                        label="Year in Business"
                        value={values.year_in_business}
                      />
                      <RadioGroup
                        name="gst_regd"
                        label="GST Registered"
                        value={values.gst_regd}
                        error={errors.gst_regd}
                        touched={touched.gst_regd}
                      >
                        <Radio
                          className="form-check-inline ml-3"
                          name="gst_regd"
                          id="gst-yes"
                          value="true"
                          checked={values.gst_regd === "true"}
                        >
                          Yes
                        </Radio>
                        <Radio
                          className="form-check-inline"
                          name="gst_regd"
                          id="gst-no"
                          value="false"
                          checked={values.gst_regd === "false"}
                        >
                          No
                        </Radio>
                      </RadioGroup>
                      <Row>
                        <Col sm="12">
                          {values.gst_regd === "true" ? (
                            <FileUpload
                              label="GST certificate"
                              id="gstCertificate"
                              key="gstCertificate"
                              fileselected={values.regd_doc}
                              data-browse="Upload"
                              accept=".jpg,.png,.jpeg,.pdf,.zip,.gif"
                              helptext="Please upload jpg,png,jpeg,pdf,zip,gif"
                              name="regd_doc"
                              fileChanged={(f) => setFieldValue("regd_doc", f)}
                              onBlur={handleBlur}
                            />
                          ) : values.gst_regd === "false" ? (
                            <FileUpload
                              label="Shop Estd. Certificate"
                              id="shop_establishment_doc"
                              data-browse="Upload"
                              fileselected={values.regd_doc}
                              key="shop_establishment_doc"
                              accept=".jpg,.png,.jpeg,.pdf,.zip,.gif"
                              helptext="Please upload jpg,png,jpeg,pdf,zip,gif"
                              name="regd_doc"
                              fileChanged={(f) => setFieldValue("regd_doc", f)}
                              onBlur={handleBlur}
                            />
                          ) : null}
                        </Col>
                      </Row>
                      <Checkbox name="t_and_c_accepted" id="t_and_c_accepted">
                        <span className=" font-weight-medium text-md">
                          I hereby declare that the above information is true to
                          the best of my knowledge.
                        </span>
                      </Checkbox>
                      <TextField
                        className="mt-4"
                        name="submitted_place"
                        placeholder="Place"
                        value={values.submitted_place}
                      />
                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row>
          </PageLayout>
        );
      }}
    </Formik>
  );
};

export default withAuth(EditProfile);
