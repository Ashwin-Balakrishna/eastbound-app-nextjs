import AsyncSelect from "react-select/async";
import { useField } from "formik";
import { Form } from "react-bootstrap";
import ErrorText from "./errorText";
import FormLabel from "./formLabel";
import HelpText from "./helpText";
import { useState } from "react";

const customStyles = {
  control: (styles) => ({
    ...styles,
    boxShadow: "none",
  }),
};

const AsyncSelectFiled = ({
  label,
  id,
  formGroupClassName,
  helptext,
  placeholder,
  onOptionChanged,
  loadOptions,
  defaultOptions,
  ...props
}) => {
  const [field, meta, helpers] = useField(props.name);
  const errorText = meta.error && meta.touched ? meta.error : "";
  const initialValue =
    defaultOptions &&
    defaultOptions.filter((option) => option.value === field.value);
  const [selectedValue, setSelectedValue] = useState(
    initialValue.length > 0 ? initialValue[0] : ""
  );

  return (
    <Form.Group className={formGroupClassName}>
      {label && <FormLabel label={label} />}
      <AsyncSelect
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
        cacheOptions={true}
        instanceId={id}
        isClearable={true}
        placeholder={placeholder || ""}
        value={selectedValue}
        onChange={(option) => {
          setSelectedValue(option);
          onOptionChanged && onOptionChanged(option || "");
          helpers.setValue(option ? option.value : "");
        }}
        onBlur={() => helpers.setTouched(true)}
        defaultOptions={defaultOptions || ""}
        loadOptions={loadOptions}
      />
      {helptext && <HelpText help={helptext} />}
      {errorText && <ErrorText error={errorText} />}
    </Form.Group>
  );
};

AsyncSelectFiled.WithoutFormik = ({
  label,
  id,
  formGroupClassName,
  helptext,
  errorText,
  placeholder,
  onOptionChanged,
  loadOptions,
  defaultOptions,
  ...props
}) => {
  const [selectedValue, setSelectedValue] = useState("");
  return (
    <Form.Group className={formGroupClassName}>
      {label && <FormLabel label={label} />}
      <AsyncSelect
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
        cacheOptions={true}
        instanceId={id}
        isClearable={true}
        placeholder={placeholder || ""}
        value={selectedValue}
        onChange={(option) => {
          setSelectedValue(option);
          onOptionChanged && onOptionChanged(option || "");
        }}
        defaultOptions={defaultOptions || ""}
        loadOptions={loadOptions}
      />
      {helptext && <HelpText help={helptext} />}
      {errorText && <ErrorText error={errorText} />}
    </Form.Group>
  );
};

export default AsyncSelectFiled;
