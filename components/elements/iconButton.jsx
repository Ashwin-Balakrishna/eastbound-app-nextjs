import { OverlayTrigger, Tooltip, Button } from "react-bootstrap";

const IconButton = ({
  icon,
  tooltip,
  tooltipDirection,
  variant,
  type,
  className,
  width,
  ...props
}) => {
  return (
    <OverlayTrigger
      placement={tooltipDirection || "top"}
      overlay={<Tooltip>{tooltip}</Tooltip>}
    >
      <Button
        variant={variant}
        type={type || "button"}
        className={`font-weight-bold button-icon ${className}`}
        {...props}
      >
        {icon}
      </Button>
    </OverlayTrigger>
  );
};

export default IconButton;