import { Card } from "react-bootstrap";

const BannerCarousel = ({title, src}) => {
  
  return (
    <Card className="border-0 overflow-hidden d-flex h-100 rounded-0">
      <Card.Img
        src={src}
        alt={title}
        className="h-100 w-100"
        style={{ objectFit: "cover" }}
      />
    </Card>
  );
};
export default BannerCarousel;
