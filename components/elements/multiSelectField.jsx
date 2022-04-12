import { useField } from "formik";
import { Form } from "react-bootstrap";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import ErrorText from "./errorText";
import FormLabel from "./formLabel";
import HelpText from "./helpText";

// https://react-select.com/home

const animatedComponents = makeAnimated();

const getValues = (options, values) => {
  let filteredVal = [];

  values.map((value) => {
    filteredVal.push(
      options ? options.find((option) => option.value === value) : ""
    );
  });

  return filteredVal || [];
};

const customStyles = {
  control: (styles) => ({
    ...styles,
    boxShadow: "none",
    border: "1px solid #ced4da",
  }),
};
const MultiSelectField = ({
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
          borderRadius: "10px",
          colors: {
            ...theme.colors,
            primary25: "#fabd9e",
            primary50: "#f36b25",
            primary: "#f36b25",
          },
        })}
        instanceId={id}
        isClearable={true}
        components={animatedComponents}
        isMulti
        placeholder={placeholder || ""}
        options={options}
        value={getValues(options, field.value)}
        onChange={(options) => {
          onOptionChanged && onOptionChanged(true);
          helpers.setValue(
            options ? options.map((option) => option.value) : []
          );
        }}
        onBlur={() => helpers.setTouched(true)}
      />
      {helptext && <HelpText help={helptext} />}
      {errorText && <ErrorText error={errorText} />}
    </Form.Group>
  );
};

export default MultiSelectField;
