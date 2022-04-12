import { Card } from "react-bootstrap";
import { AiOutlineStar } from "react-icons/ai";
import styles from "./detailCard.module.scss";

const DetailCard = ({
  title,
  src,
  location,
  rating,
  href,
  target,
  className,
  onClick,
}) => {
  return (
    <div onClick={onClick}>
      <a
        href={href}
        target={target}
        className={`${styles.link} d-flex position-relative overflow-hidden rounded-10`}
      >
        <div className={`backgroundImage ${styles.card} ${className}`}>
          <div className={styles.content}>
            <h6 className={`${styles.title}`}>{title}</h6>
            <p className={styles.desc}>
              {rating} {rating && <AiOutlineStar size="0.9rem" />}
              {rating && location ? " | " : ""}
              {location}
            </p>
          </div>
          <style jsx>
            {`
              .backgroundImage::before {
                background-image: url(${src});
              }
            `}
          </style>
        </div>
        <div className={styles.overlay} />
      </a>
    </div>
  );
};

DetailCard.Loading = ({ height }) => {
  return (
    <Card className={`border-0 ${height} rounded-10`}>
      <Card.ImgOverlay
        className={`text-white grad-black d-flex flex-column justify-content-end rounded ${height}`}
      >
        <Card.Title></Card.Title>
        <Card.Text className="text-md">Loaidng</Card.Text>
      </Card.ImgOverlay>
    </Card>
  );
};

export default DetailCard;
