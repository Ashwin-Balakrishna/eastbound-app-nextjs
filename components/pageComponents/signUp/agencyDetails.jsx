import { Formik, FieldArray } from "formik";
import React from "react";
import { Button, Form, Row, Card } from "react-bootstrap";
import * as Yup from "yup";
import accreditationData from "../../../public/json/accreditations.json";
import { getCountriesOptions, getStatesOptions } from "../../../utils/helper";
import Checkbox from "../../elements/checkbox";
import FileUpload from "../../elements/fileUpload";
import FormLabel from "../../elements/formLabel";
import Radio from "../../elements/radio";
import RadioGroup from "../../elements/radioGroup";
import SelectField from "../../elements/selectField";
import TextField from "../../elements/textField/textField";

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

const agencyDetailSchema = Yup.object({
  pan_number: Yup.string().required("Please enter PAN number"),
  pan_copy: Yup.mixed()
    .required("Please upload a PAN copy")
    .test(
      "fileSize",
      "File too large",
      (value) => value && value.size <= FILE_SIZE
    )
    .test(
      "fileFormat",
      "Unsupported Format",
      (value) => value && SUPPORTED_FORMATS.includes(value.type)
    ),
  agency_address: Yup.string().required("Please enter agency address"),
  email: Yup.string()
    .required("Pleasse enter your email address")
    .email("Please enter a valid email address"),
  agency_state: Yup.string().required("Please select agency state"),
  agency_country: Yup.string().required("Please select agency country"),
  agency_pin_code: Yup.string().required("Please enter agency pincode"),
  agency_guarantee_mode: Yup.string().required(
    "Please select agency guarantee mode"
  ),
  agency_iata_regd: Yup.string().required("Please select if IATA registered"),
  agency_iata_code: Yup.string().when("Please enter IATA registeration code", {
    is: (val) => val == "true",
    then: Yup.string().required("Please enter IATA registeration code"),
    otherwise: Yup.string().notRequired(),
  }),
  year_in_business: Yup.string()
    .required("Please enter number of business years")
    .test(
      "noOfYears",
      "Not valid number of year",
      (value) => value && value.match(/^\d+$/)
    ),
  gst_regd: Yup.string().required("Please select if GST registered"),
  regd_doc: Yup.mixed()
    .nullable()
    .when("gst_regd", {
      is: (val) => val === "false",
      then: Yup.mixed()
        .nullable()
        .required("File is required")
        .test(
          "fileSize",
          "File too large",
          (value) => value && value.size <= FILE_SIZE
        )
        .test(
          "fileFormat",
          "Unsupported Format",
          (value) => value && SUPPORTED_FORMATS.includes(value.type)
        ),
      otherwise: Yup.string().notRequired(),
    }),
  gst_details_list: Yup.array().when("gst_regd", {
    is: (val) => val === "true",
    then: Yup.array().of(
      Yup.object({
        gstin: Yup.string().required("Please enter GSTIN"),
        place_of_supply: Yup.string().required("Please select Place of supply"),
        gstin_cert: Yup.mixed()
          .nullable()
          .required("Please add GSTIN certificate")
          .test(
            "fileSize",
            "File too large",
            (value) => value && value.size <= FILE_SIZE
          )
          .test(
            "fileFormat",
            "Unsupported Format",
            (value) => value && SUPPORTED_FORMATS.includes(value.type)
          ),
      })
    ),
    otherwise: Yup.array().notRequired(),
  }),
  t_and_c_accepted: Yup.boolean().oneOf(
    [true],
    "Please accept terms and condition"
  ),
});

const AgencyDetails = ({ agencyDetails, dispatch, next }) => {
  return (
    <>
      <Formik
        key="agency_details_key"
        validationSchema={agencyDetailSchema}
        onSubmit={(data) => {
          dispatch(data);
          next();
        }}
        initialValues={agencyDetails}
      >
        {({
          handleSubmit,
          setFieldValue,
          values,
          touched,
          errors,
          handleBlur,
        }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <TextField
                label={
                  <>
                    <span>Email address</span>
                    <span className="text-primary">*</span>
                  </>
                }
                type="email"
                name="email"
                value={values.email}
                helptext="We'll never share your email with anyone else."
              />
              <FormLabel
                label={
                  <>
                    <span>PAN number</span>
                    <span className="text-primary">*</span>
                  </>
                }
              />
              <div className="d-lg-flex justify-content-between">
                <TextField
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
                  fileselected={values.pan_copy}
                  fileChanged={(f) => setFieldValue("pan_copy", f)}
                  errorText={
                    errors.pan_copy && touched.pan_copy ? errors.pan_copy : ""
                  }
                  onBlur={handleBlur}
                />
              </div>
              <SelectField
                label={
                  <>
                    <span>Country</span>
                    <span className="text-primary">*</span>
                  </>
                }
                id="agency_country"
                name="agency_country"
                value={values.agency_country}
                options={getCountriesOptions()}
                onOptionChanged={() => setFieldValue("agency_state", "")}
              />
              <SelectField
                label={
                  <>
                    <span>State</span>
                    <span className="text-primary">*</span>
                  </>
                }
                name="agency_state"
                id="agency_state"
                placeholder="State"
                value={values.agency_state}
                options={getStatesOptions(values.agency_country)}
                isDisabled={!values.agency_country}
              />
              <div className="d-lg-flex justify-content-between">
                <TextField
                  formGroupClassName="flex-fill"
                  name="agency_pin_code"
                  label={
                    <>
                      <span>Pin code</span>
                      <span className="text-primary">*</span>
                    </>
                  }
                  value={values.agency_pin_code}
                />
              </div>

              <TextField
                type="textarea"
                name="agency_address"
                value={values.agency_address}
                helptext="Landmark/Street address"
                label={
                  <>
                    <span>Address</span>
                    <span className="text-primary">*</span>
                  </>
                }
              />

              <RadioGroup
                name="agency_guarantee_mode"
                label={
                  <>
                    <span>Guarantee mode</span>
                    <span className="text-primary">*</span>
                  </>
                }
                formGroupClassName="align-items-lg-center"
              >
                <Radio
                  className="mb-2 text-muted"
                  name="agency_guarantee_mode"
                  id="no-guarantee"
                  value="1"
                  checked={values.agency_guarantee_mode === "1"}
                >
                  No guarantee
                </Radio>
                <Radio
                  className="mb-2 text-muted"
                  name="agency_guarantee_mode"
                  id="bank-guarantee"
                  value="2"
                  checked={values.agency_guarantee_mode === "2"}
                >
                  Bank guarantee
                </Radio>
                <Radio
                  className="mb-2 text-muted"
                  name="agency_guarantee_mode"
                  id="post-dated-cheque"
                  value="3"
                  checked={values.agency_guarantee_mode === "3"}
                >
                  Post dated cheque
                </Radio>
              </RadioGroup>
              <RadioGroup name="agency_iata_regd" label="IATA regd">
                <Radio
                  className="form-check-inline ml-3 text-muted"
                  name="agency_iata_regd"
                  id="iata-yes"
                  value="true"
                  checked={values.agency_iata_regd === "true"}
                >
                  Yes
                </Radio>
                <Radio
                  className="form-check-inline text-muted"
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
                  label={
                    <>
                      <span>IATA Code</span>
                      <span className="text-primary">*</span>
                    </>
                  }
                  value={values.agency_iata_code}
                />
              ) : null}
              <SelectField
                label={
                  <>
                    <span>Accreditations</span>
                    <span className="small text-muted"> (Optional)</span>
                  </>
                }
                id="accreditations"
                name="accreditations"
                value={values.accreditations}
                options={accreditationData.accreditations}
              />
              <TextField
                placeholder="Please enter number of years"
                name="year_in_business"
                label={
                  <>
                    <span>Year in Business</span>
                    <span className="text-primary">*</span>
                  </>
                }
                mask="999"
                maskPlaceholder=""
                value={values.year_in_business}
              />
              <RadioGroup
                name="gst_regd"
                label={
                  <>
                    <span>GST Registered</span>
                    <span className="text-primary">*</span>
                  </>
                }
              >
                <Radio
                  className="form-check-inline ml-3 text-muted"
                  name="gst_regd"
                  id="gst-yes"
                  value="true"
                  checked={values.gst_regd === "true"}
                  onChange={() => {
                    setFieldValue("gst_regd", "true");
                    setFieldValue("regd_doc", null);
                  }}
                >
                  Yes
                </Radio>
                <Radio
                  className="form-check-inline text-muted"
                  name="gst_regd"
                  id="gst-no"
                  value="false"
                  checked={values.gst_regd === "false"}
                  onChange={() => {
                    setFieldValue("gst_regd", "false");
                    setFieldValue("regd_doc", null);
                  }}
                >
                  No
                </Radio>
              </RadioGroup>

              {values.gst_regd === "true" ? (
                <Card className="p-2 bg-light border-0 mb-4">
                  <FieldArray name="gst_details_list">
                    {(arrayHelpers) => (
                      <>
                        {values.gst_details_list &&
                          values.gst_details_list.map((list, index) => {
                            return (
                              <React.Fragment key={index}>
                                <div>
                                  <Row>
                                    <TextField
                                      formGroupClassName="col-md-6 col-12 pr-md-1 mb-1"
                                      name={`gst_details_list.${index}.gstin`}
                                      label="Gst Identification"
                                      value={list.gstin}
                                    />
                                    <SelectField
                                      formGroupClassName="col-md-6 col-12 pl-md-1"
                                      name={`gst_details_list.${index}.place_of_supply`}
                                      id={`gst_details_list-state-${index}`}
                                      placeholder="State"
                                      label="State"
                                      value={list.place_of_supply}
                                      options={getStatesOptions("India")}
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
                                    fileChanged={(f) =>
                                      setFieldValue(
                                        `gst_details_list.${index}.gstin_cert`,
                                        f
                                      )
                                    }
                                    errorText={
                                      errors.gst_details_list &&
                                      errors.gst_details_list.length ===
                                        index + 1 &&
                                      errors.gst_details_list[index]
                                        .gstin_cert &&
                                      touched.gst_details_list &&
                                      touched.gst_details_list.length ===
                                        index + 1 &&
                                      touched.gst_details_list[index].gstin_cert
                                        ? errors.gst_details_list[index]
                                            .gstin_cert
                                        : ""
                                    }
                                    onBlur={handleBlur}
                                  />
                                  <div className="text-right">
                                    <Button
                                      className="text-md mr-3"
                                      size="sm"
                                      variant="outline-danger"
                                      onClick={() => arrayHelpers.remove(index)}
                                    >
                                      Remove
                                    </Button>
                                  </div>
                                </div>
                                <hr />
                              </React.Fragment>
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
                  errorText={
                    errors.regd_doc && touched.regd_doc ? errors.regd_doc : ""
                  }
                  onBlur={handleBlur}
                />
              ) : null}

              <Checkbox name="t_and_c_accepted" id="t_and_c_accepted">
                <span className="font-weight-medium text-md text-muted">
                  I hereby declare that the above information is true to the
                  best of my knowledge.
                </span>
              </Checkbox>

              <Button
                className="p-2 mb-5 mt-4"
                block
                variant="primary"
                type="submit"
              >
                Create Account
              </Button>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default AgencyDetails;
