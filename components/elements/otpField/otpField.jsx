import { useField } from "formik";
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import OtpInput from "react-otp-input";
import ErrorText from "../errorText";
import FormLabel from "../formLabel";
import Styles from "./otpField.module.scss";

const Otp = ({ formGroupClassName, label, errorText, value, ...props }) => {
  const [field, meta, helpers] = useField(props.name);
  const [otp, setOtp] = useState(value || "");

  useEffect(() => {
    helpers.setValue(otp);
  }, [otp]);

  return (
    <Form.Group className={formGroupClassName}>
      {label && <FormLabel label={label} />}
      <OtpInput
        {...props}
        onChange={(v) => setOtp(v)}
        value={otp}
        separator={<span></span>}
        inputStyle={Styles.otpInputStyle}
        errorStyle={Styles.otpError}
      />
      {props.hasErrored && errorText && <ErrorText error={errorText} />}
    </Form.Group>
  );
};

export default Otp;
