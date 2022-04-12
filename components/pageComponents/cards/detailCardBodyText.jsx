import { Card } from "react-bootstrap";

const DeatilCardBodyText = ({ title, src, subtitle }) => {
  return (
    <Card className="overflow-hidden cursor-pointer rounded-10 d-flex h-100">
      <object
        data={src}
        type={`image/${/[^.]+$/.exec(src)}`}
        className="w-100 h-30vh"
      >
        <Card.Img src="/images/demo-img4.jpg" className="w-100 h-30vh" />
      </object>
      <Card.Body>
        <p className="small text-primary mb-1">{subtitle}</p>
        <h6>{title}</h6>
        {/* <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text> */}
      </Card.Body>
    </Card>
  );
};

export default DeatilCardBodyText;
