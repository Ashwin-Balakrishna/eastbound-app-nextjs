import { useField } from "formik";
import React from "react";
import { Form } from "react-bootstrap";
import ErrorText from "./errorText";
import FormLabel from "./formLabel";

const RadioGroup = ({ formGroupClassName, label, children, ...props }) => {
  const [_, meta] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : "";

  return (
    <Form.Group {...props} className={formGroupClassName}>
      {label && <FormLabel label={label} />}

      {children}
      {errorText && <ErrorText error={errorText} />}
    </Form.Group>
  );
};

export default RadioGroup;
