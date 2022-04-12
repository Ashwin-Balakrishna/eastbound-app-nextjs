import { useField } from "formik";
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import InputMask from "react-input-mask";
import ErrorText from "../errorText";
import FormLabel from "../formLabel";
import HelpText from "../helpText";
import Styles from "./textField.module.scss";

const TextField = ({
  formGroupClassName,
  label,
  helptext,
  mask,
  maskPlaceholder,
  alwaysShowMask,
  type,
  autoFocus,
  ...props
}) => {
  const [field, meta] = useField(props.name);
  const errorText = meta.error && meta.touched ? meta.error : "";
  const [inputType, setInputType] = useState(type || "text");
  const [showVisibilityIcon, setShowVisibilityIcon] = useState(
    type ? type.toLowerCase() === "password" : false
  );

  const [showChild, setShowChild] = useState(false);

  // Wait until after client-side hydration to show
  useEffect(() => {
    setShowChild(true);
  }, []);

  const handleIconClick = () => {
    const type = inputType.toLowerCase() === "password" ? "text" : "password";
    setInputType(type);
  };

  return (
    <Form.Group className={formGroupClassName}>
      {label && <FormLabel label={label} />}
      {mask ? (
        !showChild ? (
          <Form.Control />
        ) : (
          <InputMask
            mask={mask}
            maskPlaceholder={maskPlaceholder}
            alwaysShowMask={alwaysShowMask}
            {...field}
            {...props}
          >
            <Form.Control/>
          </InputMask>
        )
      ) : inputType.toLowerCase() === "textarea" ? (
        <Form.Control as={inputType} {...field} {...props} />
      ) : (
        <Form.Control  autoFocus={autoFocus} type={inputType || "text"} {...field} {...props} />
      )}

      {showVisibilityIcon ? (
        <span className={`${Styles.pViewer} px-3`} onClick={handleIconClick}>
          {inputType.toLowerCase() === "password" ? (
            <FaRegEyeSlash />
          ) : (
            <FaRegEye />
          )}
        </span>
      ) : null}

      {helptext && <HelpText help={helptext} />}
      {errorText && <ErrorText error={errorText} />}
    </Form.Group>
  );
};

export default TextField;
