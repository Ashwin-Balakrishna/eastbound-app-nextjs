import { useField } from "formik";
import { useState } from "react";
import { Form } from "react-bootstrap";
import Select from "react-select";
import ErrorText from "./errorText";
import FormLabel from "./formLabel";
import HelpText from "./helpText";

// https://react-select.com/home

const getValue = (options, value) => {
  let filteredVal = options
    ? options.find((option) => option.value === value)
    : "";
  return filteredVal || "";
};

const customStyles = {
  menu: (styles) => ({
    ...styles,
    zIndex: "50",
  }),
  control: (styles) => ({
    ...styles,
    boxShadow: "none",
    border: "1px solid #ced4da",
  }),
};
const SelectField = ({
  label,
  id,
  formGroupClassName,
  options,
  helptext,
  placeholder,
  onOptionChanged,
  ...props
}) => {
  const [field, meta, helpers] = useField(props.name);
  const errorText = meta.error && meta.touched ? meta.error : "";

  return (
    <Form.Group className={formGroupClassName}>
      {label && <FormLabel label={label} />}

      <Select
        {...props}
        {...field}
        styles={customStyles}
        theme={(theme) => ({
          ...theme,
          // borderRadius: "10px",
          colors: {
            ...theme.colors,
            primary25: "#fabd9e",
            primary50: "#f36b25",
            primary: "#f36b25",
          },
        })}
        instanceId={id}
        inputId={id}
        isClearable={true}
        placeholder={placeholder || ""}
        options={options}
        value={getValue(options, field.value)}
        onChange={(option) => {
          onOptionChanged && onOptionChanged(option || "");
          helpers.setValue(option ? option.value : "");
        }}
        onBlur={() => helpers.setTouched(true)}
      />
      {helptext && <HelpText help={helptext} />}
      {errorText && <ErrorText error={errorText} />}
    </Form.Group>
  );
};

SelectField.WithoutFormik = ({
  label,
  id,
  formGroupClassName,
  options,
  value,
  helptext,
  errorText,
  placeholder,
  onOptionChanged,
  ...props
}) => {
  const [selectedValue, setSelectedValue] = useState(value);
  return (
    <Form.Group className={formGroupClassName}>
      {label && <FormLabel label={label} />}
      <Select
        {...props}
        styles={customStyles}
        theme={(theme) => ({
          ...theme,
          // borderRadius: "10px",
          colors: {
            ...theme.colors,
            primary25: "#fabd9e",
            primary50: "#f36b25",
            primary: "#f36b25",
          },
        })}
        instanceId={id}
        inputId={id}
        isClearable={true}
        placeholder={placeholder || ""}
        options={options}
        value={selectedValue}
        onChange={(option) => {
          setSelectedValue(option);
          onOptionChanged && onOptionChanged(option || "");
        }}
      />
      {helptext && <HelpText help={helptext} />}
      {errorText && <ErrorText error={errorText} />}
    </Form.Group>
  );
};

export default SelectField;
