import { useEffect, useState } from "react";
import { Formik } from "formik";
import Link from "next/link";
import { Button, Form } from "react-bootstrap";
import * as Yup from "yup";
import Checkbox from "../../elements/checkbox";
import PhoneNumber from "../../elements/phoneNumber/phoneNumber";
import TextField from "../../elements/textField/textField";
import { fetchDataWithAuth, fetchFormDataWithAuth } from "../../../utils/apiHelper";
import {API_URL, NODE_API_URL} from "../../../utils/helper"
import { toast } from "react-toastify";
const creditApprovalFormSchema = Yup.object({
  agency_name: Yup.string().trim().required("Agency name is required")
  .matches(/^\S+(?: \S+)*$/, "Please enter a valid agency name") //do not allow double space between characters
  // .matches(/^[^\s]+(\s+[^\s]+)*$/,"Please enter a valid agency name"), //do not allow space at start and end
  .matches(/(?!^\d+$)^.+$/, "Please enter a valid agency name") //do not allow only numbers
  .matches(/[A-Za-z0-9]/, "Please enter a valid agency name"),//do not allow only special characters
  billing_executive_name: Yup.string().required("Billing executive is required")
  .matches(/^[aA-zZ\s]+$/, "Please enter a valid billing executive name"),
  billing_executive_role: Yup.string().required("Executive role is required")
  .matches(/^[aA-zZ\s]+$/, "Please enter a valid executive role"),
  billing_email_address: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  billing_address: Yup.string().required("Address is required"),
  // billing_credit_card_number: Yup.string().required(
  //   "Credit card number is required"
  // ),
  billing_dial_code: Yup.string(),
  phoneIsValid: Yup.boolean().nullable(),
  billing_phone_number: Yup.string().when(
    ["phoneIsValid", "billing_dial_code"],
    (phoneIsValid, billing_dial_code, schema) => {
      return phoneIsValid === false
        ? schema
            .test("requiredPhone", "Phone number is required", (value) => {
              return value && value.substr(billing_dial_code.length) != "";
            })
            .test("validPhone", "Phone number is invalid", () => phoneIsValid)
        : schema.test("requiredPhone", "Phone number is required", (value) => {
            return value && value.substr(billing_dial_code.length) != "";
          });
    }
  ),
  is_accepted: Yup.boolean().oneOf([true], "Required"),
  submitted_place: Yup.string().required("Place is required")
  .matches(/^[aA-zZ\s]+$/, "Please enter a valid place"),
});

const CreditForm = ({ creditApprovalForm, next }) => {
  const [initialValues, setInitialValues] = useState(null);
  useEffect(()=>{
   getPrefillData();
  },[])

  const getPrefillData=async()=>{
    try {
    const res = await fetchDataWithAuth(
      `${NODE_API_URL}/getProfile`,
      "GET",
      null,
      null,
      null,
    );
      if(res&&res.status){
    setInitialValues({
    agency_name: res.data.agency_name,
    billing_executive_name: res.data.billing_executive_name,
    billing_executive_role:res.data.billing_executive_role,
    billing_email_address: res.data.billing_email_address,
    billing_address: "",
    billing_phone_number: "91"+res.data.billing_phone_number,
    billing_dial_code: "91",
    phoneIsValid: null,
    is_accepted: false,
    submitted_place: res.data.submitted_place,
    })
  }
  else{
  toast.error(res.message)
  }

}

  catch (err) {
    
    console.error(`Something went wrong! Error: ${JSON.stringify(err)}`);
  }
    // console.log("success", res)
  }
  return (
    <>
   {initialValues==null?<></>: <Formik
      key="credit_approval_key"
      validationSchema={creditApprovalFormSchema}
      enableReinitialize={true}
      onSubmit={(data) => {
        
        next(data);
      }}
      initialValues={initialValues}
    >
      {({
        handleSubmit,
        setFieldValue,
        values,
        touched,
        errors,
        handleBlur,
      }) => (
        <Form onSubmit={handleSubmit}>
          <TextField
            name="agency_name"
            label="Agency Name"
            value={values.agency_name}
            disabled={true}
          />
          <TextField
            name="billing_executive_name"
            label="Executive Name"
            value={values.billing_executive_name}
            disabled={true}
          />
          <TextField
            name="billing_executive_role"
            label="Executive Role"
            value={values.billing_executive_role}
            disabled={true}
          />
          <TextField
            type="email"
            name="billing_email_address"
            label="Billing Email"
            value={values.billing_email_address}
            disabled={true}
          />
          <TextField
            type="textarea"
            name="billing_address"
            value={values.billing_address}
            helptext="Landmark/Street address"
            label="Billing Address"
          />
          <TextField
            name="submitted_place"
            label="Place"
            value={values.submitted_place}
            disabled={true}
          />
          {/* <TextField
            mask="9999-9999-9999-9999"
            name="billing_credit_card_number"
            label="Credit Card Number"
            value={values.billing_credit_card_number}
          /> */}
          <PhoneNumber
            label="Phone Number"
            name="billing_phone_number"
            country="in"
            preferredCountries={["in"]}
            value={values.billing_phone_number}
            onPhoneChange={(value, country, e, _, isValid) => {
              setFieldValue("billing_dial_code", country.dialCode);
              setFieldValue("billing_phone_number", value);
              setFieldValue("phoneIsValid", isValid);
            }}
            searchPlaceholder="Search by Country name or code"
            errorText={
              errors.billing_phone_number && touched.billing_phone_number
                ? errors.billing_phone_number
                : ""
            }
            touched={touched.billing_phone_number}
            onBlur={handleBlur}
            disabled={true}
          />
          <Checkbox name="is_accepted" id="is_accepted">
            <span className="text-md text-muted font-weight-bold">
              I have read and agree to the&nbsp;
              <Link href="/privacy-policy">
                <a target="_blank"> terms and condition</a>
              </Link>
            </span>
          </Checkbox>
          <Button
          
            className="p-2 mb-5 mt-4"
            block
            variant="primary"
            type="submit"
          >
            Next
          </Button>
        </Form>
      )}
    </Formik>}
    </>
  );
};

export const getServerSideProps = async (context) => {
  // const formData = new FormData();
  // formData.append(email)
  const profile = await fetchgetServerSidePropsWithAuth(
    `${API_URL}/api/agent/account/profile`,
    "GET",
    null,
    null,
    null,
    context
  );
  return { props: { profile: profile } };
};
export default CreditForm;
