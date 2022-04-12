import { Button, Card } from "react-bootstrap";
import Styles from "./offerCard.module.scss";

const OfferCard = ({ title, src, offerPercent }) => {
  return (
    <Card className="border-0 overflow-hidden d-flex h-100">
      <Card.Img src={src} alt={title} />
      <Card.ImgOverlay className="text-white grad-black d-flex rounded align-items-end justify-content-between">
        <Card.Title className="font-italic mb-1" style={{ fontSize: "25px" }}>
          {title}
        </Card.Title>
        <Card.Text>
          <Button variant="primary" size="sm" className="p-2">
            Book Now
          </Button>
        </Card.Text>
      </Card.ImgOverlay>
      <div className={Styles.triangleWrapper}>
        <div className={Styles.triangle}>
          <p className={`${Styles.triangleText} small mb-0`}>
            <span className="text-md font-weight-bold">Save</span>
            <br />
            <span
              className={`small ${Styles.fontWeight900}`}
            >{`${offerPercent}%`}</span>
          </p>
        </div>
      </div>
    </Card>
  );
};
export default OfferCard;
