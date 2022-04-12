import { useField } from "formik";
import React from "react";
import { Form } from "react-bootstrap";
import ErrorText from "./errorText";
import FormLabel from "./formLabel";

const Checkbox = ({ id, label, className, children, ...props }) => {
  const [field, meta] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : "";
  return (
    <>
      {label && <FormLabel label={label} />}
      <Form.Check type="checkbox" id={id} className={`pl-0 mb-3 ${className}`}>
        <Form.Check.Input
          type="checkbox"
          {...field}
          defaultChecked={!!field.value}
        />
        <Form.Check.Label>{children}</Form.Check.Label>
        {errorText && <ErrorText error={errorText} />}
      </Form.Check>
    </>
  );
};

Checkbox.WithoutFormik = ({ id, label, children, errorText, ...props }) => {
  return (
    <>
      {label && <FormLabel label={label} />}
      <Form.Check type="checkbox" className="pl-0 mb-3" id={id}>
        <Form.Check.Input type="checkbox" {...props} checked={!!props.value} />
        <Form.Check.Label style={{ userSelect: "none" }}>
          {children}
        </Form.Check.Label>
        {errorText && <ErrorText error={errorText} />}
      </Form.Check>
    </>
  );
};

export default Checkbox;
