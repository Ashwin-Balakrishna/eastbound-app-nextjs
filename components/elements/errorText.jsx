import { Form } from "react-bootstrap";

const ErrorText = ({ error, ...props }) => {
  return (
    <Form.Control.Feedback {...props} type="invalid">
      {error}
    </Form.Control.Feedback>
  );
};
export default ErrorText;
