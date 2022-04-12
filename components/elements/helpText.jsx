import { Form } from "react-bootstrap";

const HelpText = ({ help }) => {
  return <Form.Text className="text-muted">{help}</Form.Text>;
};
export default HelpText;
