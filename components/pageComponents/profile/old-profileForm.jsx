import { Fragment, useState } from "react";
import { Formik, FieldArray } from "formik";
import { Button, Form, Card, Row, Col } from "react-bootstrap";
import * as Yup from "yup";
import PhoneNumber from "../../elements/phoneNumber/phoneNumber";
import TextField from "../../elements/textField/textField";
import FileUpload from "../../elements/fileUpload";
import SelectField from "../../elements/selectField";
import Radio from "../../elements/radio";
import RadioGroup from "../../elements/radioGroup";
import accreditationData from "../../../public/json/accreditations.json";
import { getStatesOptions, getSessionToken } from "../../../utils/helper";
import ThankYou from "../thankyou";
import ModalComponent from "../../elements/modal";
import { fetchFormDataWithAuth } from "../../../utils/apiHelper";

const API_URL = process.env.global_url;

const profileFormSchema = Yup.object({
  agency_address: Yup.string().required("Address is required"),
});

const letter = /[A-Z]/i;
const digit = /[0-9]/;
const maskPAN = [
  letter,
  letter,
  letter,
  letter,
  letter,
  digit,
  digit,
  digit,
  digit,
  letter,
];

const FILE_SIZE = 15 * 1024 * 1024;
const SUPPORTED_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/gif",
  "image/png",
  "application/pdf",
  "application/zip",
];

const ProfileForm = ({ profile, handleSubmitProfile }) => {
  const [showDocument, setShowDocument] = useState(false);
  const [documentUrl, setDocumentUrl] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isRegistrationAccepted, setIsRegistrationAccepted] = useState(false);

  const handleDocumentView = async (fileName, profileId, gstDetailId) => {
    try {
      const res = await fetch(
        `${API_URL}/api/dashboard/account/fetch/${fileName}/${profileId}/${gstDetailId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${getSessionToken()}`,
          },
        }
      );

      if (res.status !== 200) {
        console.error("Something went wrong");
        return;
      }

      const blob = await res.blob();
      const objectURL = URL.createObjectURL(blob);
      setDocumentUrl(objectURL);
      setShowDocument(true);
    } catch (err) {
      console.error("Something went wrong", err);
    }
  };

  const acceptRegistration = async () => {
    try {
      const resp = await fetchFormDataWithAuth(
        `${API_URL}/api/agent/auth/acceptRegistration`,
        "GET",
        null,
        null,
        null
      );
      if (resp.Error) {
        console.error(`Something went wrong!`);
      } else {
        setIsRegistrationAccepted(true);
      }
    } catch (err) {
      console.error(`Something went wrong! Error: ${JSON.stringify(err)}`);
    }
  };

  return (
    <>
      {!isRegistrationAccepted ? (
        <Formik
          key="credit_approval_key"
          validationSchema={profileFormSchema}
          onSubmit={(data, { setSubmitting }) => {
            alert("123")
            handleSubmitProfile(data);
          }}
          initialValues={profile}
        >
          {({
            handleSubmit,
            setFieldValue,
            values,
            touched,
            errors,
            handleBlur,
            isSubmitting,
          }) => {
            return (
              <Form onSubmit={handleSubmit}>
                <PhoneNumber
                  label="Phone Number"
                  name="phone_number"
                  country="in"
                  preferredCountries={["in"]}
                  value={values.phone_number}
                  onPhoneChange={(value, country, e, _, isValid) => {
                    setFieldValue("dial_code", country.dialCode);
                    setFieldValue("phone_number", value);
                  }}
                  searchPlaceholder="Search by Country name or code"
                  errorText={
                    errors.phone_number && touched.phone_number
                      ? errors.phone_number
                      : ""
                  }
                  touched={touched.phone_number}
                  onBlur={handleBlur}
                />
                <TextField
                  type="textarea"
                  name="agency_address"
                  label="Agency Address"
                  value={values.agency_address}
                />
                <TextField
                  label="PAN"
                  formGroupClassName="mr-lg-1 flex-fill"
                  name="pan_number"
                  mask={maskPAN}
                  value={values.pan_number}
                />
                <FileUpload
                  id="Pancard"
                  accept=".jpg,.png,.jpeg,.pdf,.zip,.gif"
                  label="PAN copy"
                  data-browse="Upload"
                  name="pan_copy"
                  fileChanged={(f) => {
                    console.log("CHECK", f)
                    setFieldValue("pan_copy", f);
                  }}
                  errorText={
                    errors.pan_copy && touched.pan_copy ? errors.pan_copy : ""
                  }
                  onBlur={handleBlur}
                />
                <Row>
                  <Col>
                    {typeof values.pan_copy == "string" ? (
                      <Button
                        variant="link"
                        className="px-0"
                        onClick={() =>
                          handleDocumentView("pan", values.profile_id, 0)
                        }
                      >
                        View Pan
                      </Button>
                    ) : null}
                  </Col>
                </Row>
                <TextField
                  name="agency_pin_code"
                  label="Agency Pin Code"
                  value={values.agency_pin_code}
                />
                <TextField
                  name="agency_city"
                  label="Agency City"
                  value={values.agency_city}
                />
                <RadioGroup
                  name="agency_guarantee_mode"
                  label="Guarantee mode"
                  formgroupclassname="align-items-lg-center"
                  value={values.agency_guarantee_mode}
                  error={errors.agency_guarantee_mode}
                  touched={touched.agency_guarantee_mode}
                >
                  <Radio
                    className="mb-2 mb-lg-0 text-md mr-lg-3"
                    name="agency_guarantee_mode"
                    id="no-guarantee"
                    value="1"
                    checked={values.agency_guarantee_mode == "1"}
                  >
                    No guarantee
                  </Radio>
                  <Radio
                    className="mb-2 mb-lg-0 text-md mr-lg-3"
                    name="agency_guarantee_mode"
                    id="bank-guarantee"
                    value="2"
                    checked={values.agency_guarantee_mode == "2"}
                  >
                    Bank guarantee
                  </Radio>
                  <Radio
                    className="mb-2 mb-lg-0 text-md"
                    name="agency_guarantee_mode"
                    id="post-dated-cheque"
                    value="3"
                    checked={values.agency_guarantee_mode == "3"}
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
                    checked={
                      values.agency_iata_regd == true ||
                      values.agency_iata_regd == "true"
                    }
                    onChange={() => setFieldValue(`agency_iata_regd`, true)}
                  >
                    Yes
                  </Radio>
                  <Radio
                    className="form-check-inline"
                    name="agency_iata_regd"
                    id="iata-no"
                    value="false"
                    checked={
                      values.agency_iata_regd == false ||
                      values.agency_iata_regd == "false"
                    }
                    onChange={() => setFieldValue(`agency_iata_regd`, false)}
                  >
                    No
                  </Radio>
                </RadioGroup>
                {values.agency_iata_regd == true ? (
                  <TextField
                    name="agency_iata_code"
                    placeholder="IATA code"
                    label="IATA Code"
                    value={values.agency_iata_code}
                  />
                ) : null}
                <SelectField
                  id="accreditation"
                  label="Accreditation"
                  name="accreditation"
                  value={values.accreditations}
                  options={accreditationData.accreditations}
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
                    checked={
                      values.gst_regd == true || values.gst_regd == "true"
                    }
                  >
                    Yes
                  </Radio>
                  <Radio
                    className="form-check-inline"
                    name="gst_regd"
                    id="gst-no"
                    value="false"
                    checked={
                      values.gst_regd == false || values.gst_regd == "false"
                    }
                  >
                    No
                  </Radio>
                </RadioGroup>
                {values.gst_regd == true || values.gst_regd == "true" ? (
                  <Card className="p-2 bg-light border-0">
                    <FieldArray name="gst_details">
                      {(arrayHelpers) => (
                        <>
                          {values.gst_details &&
                            values.gst_details.map((list, index) => {
                              return (
                                <Fragment key={index}>
                                  {list.action !== "delete" ? (
                                    <>
                                      <div>
                                        <Row>
                                          <TextField
                                            formGroupClassName="col-md-6 col-12 pr-md-1 mb-1"
                                            name={`gst_details.${index}.gstin`}
                                            label="Gst Identification"
                                            value={list.gstin}
                                          />
                                          <SelectField
                                            formGroupClassName="col-md-6 col-12 pl-md-1"
                                            name={`gst_details.${index}.place_of_supply_code`}
                                            id={`gst_details_list-state-${index}`}
                                            placeholder="State"
                                            label="State"
                                            value={list.place_of_supply}
                                            options={getStatesOptions("India")}
                                            onOptionChanged={(option) => {
                                              setFieldValue(
                                                `gst_details.${index}.place_of_supply_code`,
                                                option.value
                                              );
                                            }}
                                          />
                                        </Row>
                                        <FileUpload
                                          label="GST certificate"
                                          id="gstCertificate"
                                          fileselected={list.gstin_cert}
                                          data-browse="Upload"
                                          accept=".jpg,.png,.jpeg,.pdf,.zip,.gif"
                                          name={`gst_details_list.${index}.gstin_cert`}
                                          helptext="Please upload jpg,png,jpeg,pdf,zip,gif"
                                          fileChanged={(f) => {
                                            setFieldValue(
                                              `gst_details.${index}.gstin_cert`,
                                              f
                                            );
                                          }}
                                          errorText={
                                            errors.gst_details &&
                                            errors.gst_details.length ===
                                              index + 1 &&
                                            errors.gst_details[index]
                                              .gstin_cert &&
                                            touched.gst_details &&
                                            touched.gst_details.length ===
                                              index + 1 &&
                                            touched.gst_details[index]
                                              .gstin_cert
                                              ? errors.gst_details[index]
                                                  .gstin_cert
                                              : ""
                                          }
                                          onBlur={handleBlur}
                                        />
                                        {list.action == undefined &&
                                        values.gst_details[index].gstin_cert ==
                                          undefined ? (
                                          <Button
                                            variant="link"
                                            className="float-left px-0"
                                            onClick={() =>
                                              handleDocumentView(
                                                "regd",
                                                profile.profile_id,
                                                list.gst_detail_id
                                              )
                                            }
                                          >
                                            View Certificate
                                          </Button>
                                        ) : null}

                                        {/* <a href={list.gstin_cert} target="_blank">View GST Certificate</a> */}
                                        <div className="text-right">
                                          {list.gst_detail_id == undefined ? (
                                            <Button
                                              className="text-md mr-3"
                                              size="sm"
                                              variant="outline-danger"
                                              onClick={() =>
                                                arrayHelpers.remove(index)
                                              }
                                            >
                                              Remove
                                            </Button>
                                          ) : (
                                            <Button
                                              className="text-md mr-3"
                                              size="sm"
                                              variant="outline-danger"
                                              onClick={() => {
                                                arrayHelpers.remove(index);
                                                arrayHelpers.push({
                                                  gst_detail_id:
                                                    list.gst_detail_id,
                                                  gstin: list.gstin,
                                                  place_of_supply:
                                                    list.place_of_supply_code,
                                                  action: "delete",
                                                });
                                              }}
                                            >
                                              Remove
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                      <hr />
                                    </>
                                  ) : null}
                                </Fragment>
                              );
                            })}
                          <div>
                            <Button
                              className="text-md"
                              size="sm"
                              variant="outline-info"
                              onClick={() =>
                                arrayHelpers.push({
                                  gstin: "",
                                  place_of_supply: "",
                                  gstin_cert: null,
                                  action: "add",
                                })
                              }
                            >
                              Add GSTIN
                            </Button>
                          </div>
                        </>
                      )}
                    </FieldArray>
                  </Card>
                ) : values.gst_regd == false || values.gst_regd == "false" ? (
                  <>
                    <FileUpload
                      label="Shop Estd. Certificate"
                      id="shop_establishment_doc"
                      data-browse="Upload"
                      key="shop_establishment_doc"
                      accept=".jpg,.png,.jpeg,.pdf,.zip,.gif"
                      helptext="Please upload jpg,png,jpeg,pdf,zip,gif"
                      name="regd_doc"
                      fileChanged={(f) => {console.log(f,"image");setFieldValue("regd_doc", f)}}
                      errorText={
                        errors.regd_doc && touched.regd_doc
                          ? errors.regd_doc
                          : ""
                      }
                      onBlur={handleBlur}
                    />
                    {typeof values.regd_doc == "string" ? (
                      <Button
                        variant="link"
                        className="px-0 mb-4"
                        onClick={() =>
                          handleDocumentView("regd", profile.profile_id, 0)
                        }
                      >
                        View Certificate
                      </Button>
                    ) : null}
                  </>
                ) : null}
                <Button
                  block
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting ? true : false}
                >
                  {isSubmitting ? "Submitting" : "Submit"}
                </Button>
              </Form>
            );
          }}
        </Formik>
      ) : (
        <ThankYou
          message="Accept request has been sent"
          subText="Allow us to review your request. We will come back
          to you shortly!."
        />
      )}

      <ModalComponent
        size="lg"
        show={showDocument}
        scrollable={true}
        onHide={() => setShowDocument(false)}
        title="Document"
        body={
          <Row>
            <Col md={12}>
              <div className="mx-auto d-block">
                <div className="text-center">
                  <iframe
                    style={{ width: "100%", height: "100vh" }}
                    src={documentUrl}
                    frameBorder="0"
                    allowFullScreen
                  />
                </div>
              </div>
            </Col>
          </Row>
        }
      />
      <ModalComponent
        size="md"
        show={showConfirmationModal}
        onHide={() => setShowConfirmationModal(false)}
        title="Accept"
        body={
          <Row>
            <Col md={12}>Are you sure?</Col>
          </Row>
        }
        footer={
          <Button variant="primary" onClick={() => acceptRegistration()}>
            Yes
          </Button>
        }
      />
    </>
  );
};

export default ProfileForm;
