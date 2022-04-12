import { Formik } from "formik";
import moment from "moment";
import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import * as Yup from "yup";
import Checkbox from "../../elements/checkbox";
import TextField from "../../elements/textField/textField";

const declarationSchema = Yup.object({
  submitted_place: Yup.string().required("place is required"),
  t_and_c_accepted: Yup.boolean().oneOf([true], "Required"),
});

const DeclarationDetails = ({ userFullName, dispatch, next, back }) => {
  return (
    <Formik
      key="declaration_key"
      validationSchema={declarationSchema}
      onSubmit={(data, { setSubmitting }) => {
        dispatch(data);
        next();
      }}
      initialValues={{
        submitted_place: "",
        t_and_c_accepted: false,
      }}
    >
      {({ values, handleSubmit, isSubmitting }) => (
        <Form onSubmit={handleSubmit}>
          <Checkbox name="t_and_c_accepted" id="t_and_c_accepted">
            <span className=" font-weight-medium text-md">
              I hereby declare that the above information is true to the best of
              my knowledge.
            </span>
          </Checkbox>
          <Row className="mt-3 mb-4">
            <Col xs={6}>
              <p className="mb-1">
                <span className="small font-weight-bold">Name: </span>
                <span className="text-md">{userFullName}</span>
              </p>
              <p className="mb-1">
                <span className="small font-weight-bold">Date: </span>
                <span className="text-md">{moment().format("LL")}</span>
              </p>
            </Col>
            <Col xs={6} className="mt-3">
              <TextField
                name="submitted_place"
                placeholder="Place"
                value={values.submitted_place}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={3}>
              <Button
                className="p-2"
                variant="info"
                block
                type="button"
                onClick={() => back()}
              >
                Back
              </Button>
            </Col>
            <Col xs={9}>
              <Button
                className="p-2"
                block
                variant="primary"
                type="submit"
                disabled={isSubmitting}
              >
                Creat Account
              </Button>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default DeclarationDetails;
