import { useField } from "formik";
import React from "react";
import { Form } from "react-bootstrap";
import ErrorText from "./errorText";
import FormLabel from "./formLabel";
import HelpText from "./helpText";

const Dropdown = ({ label, helptext, value, children, ...props }) => {
  const [field, meta] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : "";

  return (
    <Form.Group>
      {label && <FormLabel label={label} />}
      <Form.Control as={"select"} value={value} {...field}>
        {children}
      </Form.Control>
      {helptext && <HelpText help={helptext} />}
      {errorText && <ErrorText error={errorText} />}
    </Form.Group>
  );
};

export default Dropdown;
