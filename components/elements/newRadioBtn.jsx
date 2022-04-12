import { useField } from "formik";
import React from "react";
import { Form } from "react-bootstrap";
import Styles from './newRadioBtn.module.scss'
const NewRadioBtn = ({ id, value, children, className, ...props }) => {
  const [field] = useField(props);
  return (
      <div className={Styles.container}>
    <Form.Check type="radio" id={id} value={value} className={className}>
      <Form.Check.Input type="radio" {...field} {...props} value={value}/>
      <span className={Styles.checkmark} {...props}></span>
      <Form.Check.Label>{children}</Form.Check.Label>
    </Form.Check>
    </div>
  );
};

export default NewRadioBtn;