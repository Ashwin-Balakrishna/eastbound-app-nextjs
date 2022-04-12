import { useField } from "formik";
import moment from "moment";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { DateRangePicker } from "react-dates";
import "react-dates/initialize";
import ErrorText from "./errorText";
import FormLabel from "./formLabel";
import HelpText from "./helpText";

export default function DateRange({
  label,
  id,
  formGroupClassName,
  labelSm,
  controlSm,
  helptext,
  initialStartDate,
  initialEndDate,
  onStartDateChange,
  onEndDateChange,
  locale,
  name,
  disabled,
  ...props
}) {
  const [startDate, setStartDate] = useState(initialStartDate || null);
  const [endDate, setEndDate] = useState(initialEndDate || null);
  const [focusedInput, setFocusedInput] = useState(null);
  const [isDisabled, setDisabled] = useState(disabled || false);

  const [field, meta, helpers] = useField(name);
  const errorText = meta.error && meta.touched ? meta.error : "";

  useEffect(() => {
    onStartDateChange(startDate);
  }, [startDate]);

  useEffect(() => {
    onEndDateChange(endDate);
  }, [endDate]);

  moment.locale(locale || "en-in");

  return (
    <Form.Group className={formGroupClassName}>
      {label && <FormLabel label={label} />}

      <DateRangePicker
        disabled={isDisabled}
        {...props}
        displayFormat="MMM-d"
        block={true}
        startDate={startDate} // momentPropTypes.momentObj [moment("05/07/2020", "DD/MM/YYYY")] or null,
        startDateId={`start_date_${id}`} // PropTypes.string.isRequired,
        endDate={endDate} // momentPropTypes.momentObj or null,
        endDateId={`end_date_${id}`} // PropTypes.string.isRequired,
        onDatesChange={({ startDate, endDate }) => {
          setStartDate(startDate);
          setEndDate(endDate);
        }} // PropTypes.func.isRequired,
        focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
        onFocusChange={(focusedInput) => setFocusedInput(focusedInput)} // PropTypes.func.isRequired,
      />
      {helptext && <HelpText help={helptext} />}
      {errorText && <ErrorText error={errorText} />}
    </Form.Group>
  );
}
