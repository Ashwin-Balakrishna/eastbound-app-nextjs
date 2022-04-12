import { Card } from "react-bootstrap";
import { AiOutlineStar } from "react-icons/ai";
import { Img } from "react-image";
import { IMAGE_URL } from "../../../utils/helper";

const DetailCardHorizontal = ({
  title,
  src,
  location,
  rating,
  href,
  target,
  onClick,
}) => {
  return (
    <Card
      className="border-0 overflow-hidden cursor-pointer bg-transparent rounded-10"
      onClick={onClick}
    >
      <a href={href} target={target} className="d-flex">
        <Img
          src={[`${IMAGE_URL}${src}`, "/images/basic.png"]}
          className="h-30vh w-100"
        />
        <Card.ImgOverlay className="text-white grad-black d-flex flex-column justify-content-end rounded-10">
          <Card.Title className="h6 mb-1">{title}</Card.Title>
          <Card.Text className="text-md">
            {rating} <AiOutlineStar size="0.9rem" />
            {` | ${location}`}
          </Card.Text>
        </Card.ImgOverlay>
      </a>
    </Card>
  );
};

DetailCardHorizontal.Loading = () => {
  return (
    <Card className="border-0 h-30vh">
      <Card.ImgOverlay className="text-white grad-black d-flex flex-column justify-content-end rounded-10 h-30vh">
        <Card.Title></Card.Title>
        <Card.Text className="text-md">Loaidng</Card.Text>
      </Card.ImgOverlay>
    </Card>
  );
};

export default DetailCardHorizontal;
