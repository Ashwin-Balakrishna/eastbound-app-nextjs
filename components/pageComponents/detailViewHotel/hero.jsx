import moment from "moment";
import {
  Badge,
  Button,
  Card,
  Col,
  Image,
  Row,
  CardColumns,
} from "react-bootstrap";
import { AiOutlineStar } from "react-icons/ai";
import { FiCheck, FiCheckCircle } from "react-icons/fi";
import { scrollPageTo, getCurrency, IMAGE_URL } from "../../../utils/helper";
import Styles from "./hero.module.scss";
import ModalComponent from "../../elements/modal";
import { useState } from "react";
import { Img } from "react-image";

const DetailViewHero = ({
  type,
  name,
  address,
  facilities,
  amenities,
  rooms,
  city,
  images,
  checkin,
  checkout,
  categoryName,
  bookingClicked,
  prices,
}) => {
  const [showFacilities, setShowFacilities] = useState(false);

  return (
    <>
      <Row>
        <Col md={3}>
          <Card className="border-0">
            <Img
              className="card-img min-height-img"
              src={[
                `${IMAGE_URL}${images[0]?.image_file}`,
                "/images/basic.png",
              ]}
              alt="Card image"
            />
          </Card>
        </Col>
        <Col md={9}>
          <div className="d-flex my-3 my-md-0">
            <h4 className="text-jetblack mr-5">{name}</h4>
            <Badge
              variant="primary"
              className="p-2 d-inline-flex align-items-center mb-3"
            >
              <span className="mr-1">{categoryName?.replace("STARS", "")}</span>
              <AiOutlineStar size="0.9rem" />
            </Badge>
          </div>

          <Row>
            <Col md={8} className={Styles.hotelInfo}>
              <Row className="mb-2">
                <Col md={7}>
                  <div className="d-flex align-items-center">
                    <Image src="/images/svg/map.svg" className="mr-2"></Image>
                    <p className="text-md text-jetblack font-weight-bold mb-0">
                      {address}
                    </p>
                  </div>
                </Col>
                <Col md={5}>
                  <p className="text-md text-jetblack font-weight-bold mb-0">
                    {city}
                  </p>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <ul className="list-unstyled list-inline">
                    {facilities.map((facility, i) => {
                      if (i < 4) {
                        return (
                          <li
                            className="list-inline-item text-md"
                            key={facility.facility_id}
                          >
                            <span className="text-muted">
                              <FiCheck
                                size="18px"
                                className="mr-1 text-success"
                              />

                              {type==="hg"?facility:facility.description} 
                            </span>
                          </li>
                        );
                      }
                    })}

                    <li className="list-inline-item d-none d-lg-inline-block text-md">
                      <p
                        className="mb-0 text-primary cursor-pointer"
                        onClick={() => {
                          scrollPageTo("about", -100);
                        }}
                      >
                        +more
                      </p>
                    </li>
                    <li className="list-inline-item d-lg-none">
                      <p
                        className="mb-0 text-primary cursor-pointer"
                        onClick={() => {
                          setShowFacilities(true);
                        }}
                      >
                        +more
                      </p>
                    </li>
                  </ul>
                </Col>
              </Row>
              <Row>
                <Col xs={6}>
                  <p className="font-weight-bold text-md text-jetblack mb-1">
                    Check In
                  </p>
                  <p className="font-weight-medium text-muted text-md">
                    {moment(checkin).format("Do MMMM YY, dddd")}
                  </p>
                </Col>
                <Col xs={6}>
                  <p className="font-weight-bold text-md text-jetblack mb-1">
                    Check Out
                  </p>
                  <p className="font-weight-medium text-muted text-md">
                    {moment(checkout).format("Do MMMM YY, dddd")}
                  </p>
                </Col>
              </Row>
            </Col>
            <Col md={4}>
              <div className="d-flex justify-content-between">
                <p className="text-primary font-weight-bold text-md">
                  Price starting from
                </p>
              </div>

              <div className="d-flex justify-content-between">
                <p className="col-md-8 text-jetblack px-0 text-md">Base Price</p>
                <p className="col-md-4 text-muted px-0 text-right">
                  {getCurrency(prices.basePrice, { maximumFractionDigits: 1 })}
                </p>
              </div>

              <div className="d-flex justify-content-between">
                <p className="col-md-8 text-jetblack px-0 text-md">{`Estimated Tax & Services (${prices.tax}% GST)`}</p>
                <p className="col-md-4 text-muted px-0 text-right">
                  {getCurrency(prices.taxAndServices, {
                    maximumFractionDigits: 1,
                  })}
                </p>
              </div>

              <div className="d-flex justify-content-between">
                <p className="col-md-8 text-jetblack px-0 text-md">
                  Total Payable*
                </p>
                <p className="col-md-4 text-primary font-weight-bold px-0 text-right">
                  {getCurrency(prices.totalAmount, {
                    maximumFractionDigits: 1,
                  })}
                </p>
              </div>
            </Col>
          </Row>

          <Row className="mt-3">
            {/* <Col md={8}>
              <Alert
              className="mb-0 border-0 bg-light"
              style={{ fontSize: "68%" }}
            >
              100% Refund Guaranteed if cancelled before 29-Apr-2020 02_00 PM
              IST. Here's the <a href="#/">Full Policy</a>
            </Alert>
            </Col>
            <Col md={4}>
              <Button
                variant="primary"
                block
                className="font-weight-bold"
                onClick={() => bookingClicked()}
              >
                Request Booking
              </Button>
            </Col> */}
          </Row>
        </Col>
      </Row>
      <ModalComponent
        show={showFacilities}
        onHide={() => setShowFacilities(false)}
        title="Amenities"
        scrollable={true}
        body={
          <Col xs={12}>
            <CardColumns>
              {
                type!='hg'?
              
              amenities.map((amenitie, i) => (
                <Card className="bg-transparent border-0" key={`amenitie.${i}`}>
                  <div className="font-weight-bold text-md mb-1">
                    {amenitie.group}
                  </div>
                  {amenitie.list.map((list, i) => (
                    <div
                      className="d-flex align-items-center mb-2"
                      key={`list.${i}`}
                    >
                      <div>
                        <FiCheckCircle className="text-primary mr-2 mt-1" />
                      </div>
                      <p className="text-md text-muted mb-0">{list}</p>
                    </div>
                  ))} 
                </Card>
              )):
              
              
                <Card className="bg-transparent border-0" >
                  {amenities.map((list, i) => (
                    <div
                      className="d-flex align-items-center mb-2"
                      key={`list.${i}`}
                    >
                      <div>
                        <FiCheckCircle className="text-primary mr-2 mt-1" />
                      </div>
                      <p className="text-md text-muted mb-0">{list}</p>
                    </div>
                  ))} 
                </Card>
          
              } 
            </CardColumns>
          </Col>
        }
      />
    </>
  );
};

export default DetailViewHero;
