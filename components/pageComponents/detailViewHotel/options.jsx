import { useState, Fragment } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { FiCheck } from "react-icons/fi";
import { useHotelState } from "../../../context/hotelCodeContext";
import { getCurrency } from "../../../utils/helper";

const getRoomPrice = (rate) => {
  const netPrice = rate.net;
  const commission = netPrice * rate.commission * 0.01;
  return parseFloat(netPrice + commission).toFixed(0);
};

const Rates = ({ room }) => {
  const { HOTEL_STEP, updateHotelStep, setRoom, setRoomPlan } = useHotelState();

  return room.rates.map((rate, i) => (
    <Fragment key={`rate_${i}`}>
      {i > 0 ? (
        <>
          <Col md={3} xs={3} />
          <Col md={3} xs={3} />
        </>
      ) : null}
      <Col md={2} xs={3}>
        {/* <p className="text-md font-weight-bold text-muted">{`Plan ${
          i + 1
        }`}</p> */}
        <ul className="list-unstyled">
          <li className="mb-1 text-md text-muted">{rate.meal_plan}</li>
        </ul>
      </Col>
      <Col md={2} xs={3}>
        <p className="font-weight-bold text-md text-primary mb-0">
          {getCurrency(getRoomPrice(rate), { maximumFractionDigits: 0 })}
        </p>
        <p className="text-xs text-muted">Excluding Tax</p>
      </Col>
      <Col md={2} xs={12}>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => {
            setRoom(room);
            setRoomPlan(rate);
            updateHotelStep(HOTEL_STEP.HOTEL_BOOKING);
          }}
        >
          Book now
        </Button>
      </Col>
    </Fragment>
  ));
};

const DetailViewOptions = ({ room }) => {
  return (
    <>
      <Row>
        <Col md={3} xs={3}>
          <ul className="list-unstyled">
            <li className="mb-1 text-md text-muted font-weight-bold">
              {room.name}
            </li>
          </ul>
        </Col>
        <Col md={3} xs={3}>
          {room.roomfacilities?.map((roomFacility, i) => (
            <div className="d-flex align-items-center" key={i}>
              <div>
                <FiCheck className="mr-2 text-success" />
              </div>
              <p className="mb-0 text-md text-muted">
                {roomFacility.description}
              </p>
            </div>
          ))}
        </Col>
        <Rates room={room} />
      </Row>
      <hr />
    </>
  );
};

export default DetailViewOptions;
