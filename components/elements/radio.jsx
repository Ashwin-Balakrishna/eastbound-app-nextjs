import { useField } from "formik";
import React from "react";
import { Form } from "react-bootstrap";

const Radio = ({ id, value, children, className, ...props }) => {
  const [field] = useField(props);
  return (
    <Form.Check type="radio" id={id} value={value} className={className}>
      <Form.Check.Input type="radio" {...field} {...props} value={value} />
      <Form.Check.Label>{children}</Form.Check.Label>
    </Form.Check>
  );
};

export default Radio;
