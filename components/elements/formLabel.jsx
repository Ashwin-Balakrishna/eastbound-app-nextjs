import { Form } from "react-bootstrap";

const FormLabel = ({ label, className, ...props }) => {
  return (
    <Form.Label
      className={`small text-muted font-weight-bold ${className}`}
      {...props}
    >
      {label}
    </Form.Label>
  );
};
export default FormLabel;
