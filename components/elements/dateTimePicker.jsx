import { useField } from "formik";
import moment from "moment";
import React from "react";
import { Form } from "react-bootstrap";
import DateTime from "react-datetime";
import ErrorText from "./errorText";
import FormLabel from "./formLabel";
import HelpText from "./helpText";

const DateTimePicker = ({
  formGroupClassName,
  label,
  helptext,
  name,
  defaultValue,
  viewMode,
  onDateTimeChange,
  inputProps,
  ...props
}) => {
  const [field, meta] = useField(name);
  const errorText = meta.error && meta.touched ? meta.error : "";

  return (
    <Form.Group className={formGroupClassName}>
      {label && <FormLabel label={label} />}
      <DateTime
        {...props}
        inputProps={{
          readOnly: true,
          style: { backgroundColor: "white" },
          ...inputProps,
        }}
        defaultValue={
          defaultValue
            ? viewMode?.toLowerCase() === "time"
              ? moment(`2000-01-01 ${defaultValue}`).format("hh:mm a")
              : moment(defaultValue)
            : ""
        }
        dateFormat={viewMode?.toLowerCase() === "time" ? false : "DD/MM/YYYY"}
        viewMode={viewMode}
        onChange={(e) => onDateTimeChange(e)}
      />
      {helptext && <HelpText help={helptext} />}
      {errorText && <ErrorText error={errorText} />}
    </Form.Group>
  );
};

export default DateTimePicker;
