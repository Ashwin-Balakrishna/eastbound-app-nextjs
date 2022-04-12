import { Button, Image } from "react-bootstrap";

const ThankYou = ({
  message,
  subText,
  linkTitle,
  link,
  variant,
  icon,
  defaultImage,
}) => {
  return (
    <div className="text-center">
      <div className="mb-4">
        <Image
          src={defaultImage ? defaultImage : "/images/thank_you.svg"}
          width="200px"
        />
      </div>
      <h2 className="font-weight-bold">{message}</h2>
      <div className="lead">{subText}</div>
      {linkTitle && (
        <Button variant={variant} href={link} className="mt-3">
          <div className="d-flex align-items-center">
            <span>{linkTitle} </span>
            <span className="ml-1 mb-1">{icon}</span>
          </div>
        </Button>
      )}
    </div>
  );
};

export default ThankYou;
