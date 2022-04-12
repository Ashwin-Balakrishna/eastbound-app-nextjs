import { useField } from "formik";
import React, { useState } from "react";
import { Form } from "react-bootstrap";
import PhoneInput from "react-phone-input-2";
import ErrorText from "../errorText";
import FormLabel from "../formLabel";
import HelpText from "../helpText";
import Styles from "./phoneNumber.module.scss";

// https://github.com/bl00mber/react-phone-input-2

const PhoneNumber = ({
  formGroupClassName,
  labelClassName,
  onPhoneChange,
  label,
  id,
  helptext,
  checkValidation,
  invalidErrorMessage,
  autoFocus,
  ...props
}) => {
  const [field, meta, helpers] = useField(props.name);
  const errorText = meta.error && meta.touched ? meta.error : "";

  const [isValid, setIsValid] = useState(false);
  const showError = checkValidation || true;
  const invalidError = invalidErrorMessage || "Phone Number is invalid";

  return (
    <Form.Group className={formGroupClassName}>
      {label && <FormLabel label={label} className={labelClassName} />}

      <PhoneInput
      
        {...field}
        {...props}
        inputProps={{ id: id, autoFocus: autoFocus }}
        countryCodeEditable={false}
        disableSearchIcon={true}
        enableSearch={true}
        searchClass={Styles.searchClass}
        inputClass={Styles.inputClass}
        buttonStyle={{
          borderBottomLeftRadius: "10px",
          borderTopLeftRadius: "10px",
        }}
        placeholder={props.placeholder || ""}
        onChange={(value, country, e, formattedValue) => {
          if (
            country.format !==
            `+${country.dialCode.replace(/\d/g, ".")} ... ... ... ... ..`
          ) {
            setIsValid(formattedValue.replace(/\d/g, ".") === country.format);
            onPhoneChange(
              value,
              country,
              e,
              formattedValue,
              formattedValue.replace(/\d/g, ".") === country.format
            );
          } else {
            onPhoneChange(value, country, e, formattedValue, null);
          }
        }}
        onBlur={() => helpers.setTouched(true)}
      />
      {helptext && <HelpText help={helptext} />}
      {errorText && <ErrorText error={errorText} />}
    </Form.Group>
  );
};

export default PhoneNumber;
