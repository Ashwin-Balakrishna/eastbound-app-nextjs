import { Formik } from "formik";
import React from "react";
import { Button, Form } from "react-bootstrap";
import * as Yup from "yup";
import FormLabel from "../../elements/formLabel";
import TextField from "../../elements/textField/textField";

const personalDetailsSchema = Yup.object({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const PersonalDetails = ({ personalDetails, dispatch, next }) => {
  return (
    <Formik
      key="personal_details_key"
      validationSchema={personalDetailsSchema}
      onSubmit={(data) => {
        dispatch(data);
        next();
      }}
      initialValues={personalDetails}
    >
      {({ handleSubmit, setFieldValue, values }) => (
        <>
          <Form onSubmit={handleSubmit}>
            <FormLabel label="Full name" />
            <div className="d-lg-flex">
              <TextField
                formGroupClassName="mr-lg-2 flex-fill"
                name="first_name"
                placeholder="First Name"
                value={values.first_name}
              />
              <TextField
                formGroupClassName="flex-fill"
                name="last_name"
                placeholder="Last Name"
                value={values.last_name}
              />
            </div>
            <TextField
              type="email"
              name="email"
              label="Email address"
              value={values.email}
              helptext="We'll never share your email with anyone else."
            />

            <Button className="p-2 mt-4" variant="primary" type="submit" block>
              Next
            </Button>
          </Form>
        </>
      )}
    </Formik>
  );
};

export default PersonalDetails;
