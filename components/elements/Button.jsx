import { Button as BootstrapButton, Spinner } from "react-bootstrap";

const Button = ({ isLoading, disabled, children, ...props }) => {
  return (
    <BootstrapButton disabled={disabled || isLoading} {...props}>
      {isLoading ? <Spinner animation="border" /> : children}
    </BootstrapButton>
  );
};

export default Button;
