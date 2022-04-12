import { Card } from "react-bootstrap";
import { FiCheckCircle } from "react-icons/fi";

const DetailViewAbout = ({ title, subtitle }) => {
  return (
    <Card className="border-0 bg-white custom-shadow d-flex h-100">
      <Card.Body className="d-lg-flex flex-lg-column justify-content-lg-center text-center align-items-lg-center">
        <Card.Title>
          <FiCheckCircle className="text-primary" size="24px" />
        </Card.Title>
        <Card.Title className="small text-jetblack">{title}</Card.Title>
        <Card.Text>{subtitle}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default DetailViewAbout;
