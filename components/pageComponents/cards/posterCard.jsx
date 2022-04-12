import { Button, Card } from "react-bootstrap";

const PosterCard = ({ title, src }) => {
  return (
    <Card className="border-0 overflow-hidden d-flex h-100 rounded-10">
      <Card.Img
        src={src}
        alt={title}
        className="h-100 w-100"
        style={{ objectFit: "cover" }}
      />
    </Card>
  );
};
export default PosterCard;
