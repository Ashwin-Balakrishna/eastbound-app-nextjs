import moment from "moment";
import { useState, useEffect } from "react";
import {
  Alert,
  Badge,
  Card,
  Col,
  Container,
  Image,
  Row,
  Form,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { AiOutlineStar } from "react-icons/ai";
import { IoIosArrowRoundForward, IoIosArrowRoundBack, IoIosCalendar } from "react-icons/io";
import { BiUser } from "react-icons/bi";
import BookingForm from "./bookingForm";
import PaymentCard from "./paymentCard";
import ErrorText from "../../elements/errorText";
import { Formik } from "formik";
import ModalComponent from "../../elements/modal";
import {
  fetchFormDataWithAuth,
  fetchDataWithAuth,
} from "../../../utils/apiHelper";
import RadioGroup from "../../elements/radioGroup";
import Radio from "../../elements/radio";
import * as Yup from "yup";
import Button from "../../elements/Button";
import { IMAGE_URL, API_URL, reloadPageWithUrl } from "../../../utils/helper";
import { useHotelState } from "../../../context/hotelCodeContext";

const getGuestList = (room) => {
  let adults = 0;
  let children = 0;
  room.map((r) => {
    adults += r.adults;
    children += r.children;
  });

  let text = "";
  text += adults ? `${adults} Adult ` : "";
  text += children ? `${children} Children ` : "";
  text += `(${room.length} Room)`;
  return text;
};

const STEPS = {
  LOADING: "loading",
  LOADED: "loaded",
};

let bookingDetails = {};

const HotelBooking = ({ hotel_data, query_data, bookingSubmitted, back }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [showIntentModal, setShowIntentModal] = useState(false);
  const [instantModal, setInstantModal] = useState(false);
  const [creditUser, setCreditUser] = useState(false);
  const [rateCommentsResponse, setRateCommentsResponse] = useState(false);
  const { room, roomPlan, setRoomPlan, priceStructure } = useHotelState();
  const [pageStep, setPageStep] = useState(STEPS.LOADING);
  const { commissionCharges, taxAndServices, totalAmount } = priceStructure;

  let submitHotelDetails = null;
  const handleSaveHotelDetails = (e) => {
    if (submitHotelDetails) {
      submitHotelDetails(e);
    }
  };
  const handleSubmitHotelDetails = (submitForm) => {
    submitHotelDetails = submitForm;
  };

  useEffect(() => {
    const getUserType = async () => {
      try {
        const data = await fetchFormDataWithAuth(
          `${API_URL}/api/agent/account/profile`,
          "GET",
          null,
          null,
          null
        );

        if (data.Error || data.error) {
          console.log(data);
        } else {
          if (data.credit_info !== null) {
            setCreditUser(true);
          }
        }
      } catch (err) {
        console.error(`Something went wrong! Error: ${JSON.stringify(err)}`);
      }
    };

    getUserType();
  }, []);

  useEffect(() => {
    const getRecheckRates = async () => {
      try {
        const data = await fetchDataWithAuth(
          `${API_URL}/api/agent/recheck-rates/`,
          "POST",
          null,
          null,
          roomPlan
        );

        if (data.Error || data.error) {
          console.log(data);
        } else {
          setRoomPlan(data);
        }
        setPageStep(STEPS.LOADED);
      } catch (err) {
        console.error(`Something went wrong! Error: ${JSON.stringify(err)}`);
      }
    };
    setTimeout(() => getRecheckRates(), 2000);
  }, []);

  const sendRateComments = async (rateCommentsId) => {
    let date = moment(query_data.checkin).format("YYYY-MM-DD");
    const payload = {
      date: date,
      code: rateCommentsId,
    };
    try {
      const data = await fetchFormDataWithAuth(
        `${API_URL}/api/agent/bookings/ratecomments`,
        "POST",
        null,
        null,
        JSON.stringify(payload)
      );

      if (data.Error || data.error) {
        console.log(data);
      } else {
        setRateCommentsResponse(data);
        setShowIntentModal(true);
      }
    } catch (err) {
      console.error(`Something went wrong! Error: ${JSON.stringify(err)}`);
    }
    
  };

  let content = null;
  switch (pageStep) {
    case STEPS.LOADED:
      content = (
        <>
          <div className="mt-md-5 pl-5 pt-md-5 mt-4 mb-4">
            <Row>
              <Col className="px-0">
                <Button
                  variant="link"
                  style={{ fontWeight: "400", color: "#000", fontSize: "24px" }}
                  onClick={() => back()}
                >
                  <IoIosArrowRoundBack size="1.5rem" /> Modify your booking
                </Button>
              </Col>
            </Row>
          </div>

          {/* Booking Details */}
          <div className="container-fluid pl-5">
            <Row>
              {/* INFORMATION FORM PART */}
              <Col  md={{span : 7, order:1}} xs={{span:12, order:2}} className="pr-5">
                

                <BookingForm
                  hotel_data={hotel_data}
                  query_data={query_data}
                  handleSubmitForm={handleSubmitHotelDetails}
                  onRequestBooking={(data) => {
                    bookingDetails = data;
                    if (roomPlan.rateCommentsId !== null) {
                      sendRateComments(roomPlan.rateCommentsId);
                    } else {
                      setShowIntentModal(true);
                    }
                  }}
                />
              </Col>

              {/* Booking Payment Part */}
              <Col md={{span: 5, order:2}} xs={{span:12 ,order:1}} className="col-sm-push-5">
                <Card className="overflow-hidden mb-4 p-3">
                  <Row className="p-3">
                    <span style={{ fontWeight: "400", color: "#000", fontSize: "24px" }}>Your Trip</span>
                  </Row>


                  <div className="my-2" style={{ border: "2px solid #EBEBEB ", borderRadius: "5%" }} className="w-100 my-2">
                    <Row className="ml-2 pt-3">
                      <Col md={1} xs={1} style={{ marginTop: "-5px" }}>
                        <IoIosCalendar color="#F36B25" size="1.5rem" />
                      </Col>
                      <Col md={2} xs={4}>

                        <p className="font-weight-400 text-md">
                          {moment(query_data.checkin).format(
                            "DD MMM"
                          )}
                        </p>
                      </Col>
                      <Col md={1} xs={1} className="mt-">-</Col>
                      <Col md={2} xs={4}>
                        <div >
                          <p className="font-weight-400 text-md">
                            {moment(query_data.checkout).format(
                              "DD MMM "
                            )}
                          </p>
                        </div>

                      </Col>
                    </Row>
                  </div>



                  <div style={{ border: "2px solid #EBEBEB ", borderRadius: "5%" }} className="w-100 my-2">
                    <Row className="ml-2  py-3">
                      <Col md={1} xs={1} >
                        <BiUser color="#F36B25" size="1.5rem" />
                      </Col>
                      <Col >
                        <p className="small mb-1 text-grey">
                          {getGuestList(query_data.rooms)}
                          
                        </p>
                      </Col>

                    </Row>
                  </div>


                  <Row className="no-gutters">
                    <Col md={4} sm={12} xs={12} className="pt-2 pl-2">
                      <div style={{ height: "125px", width: "150px" }}>
                        <Image
                          style={{ objectFit: "cover", borderRadius: "5%" }}
                          src={`${IMAGE_URL}${hotel_data.images[0].image_file}`}
                          alt="Card image"
                          className="w-100 h-100"
                        />
                      </div>

                    </Col>

                    <Col md={8} sm={12} xs={12}>
                      <Card.Body >
                        <Row className="mb-2">
                          <Col md={12} >
                            <div className="pl-2">
                              <p className="small mb-1 text-grey">
                                {/* {getGuestList(query_data.rooms)} */}
                                1 Room &#183; 2 Beds &#183; 3 Adults 
                              </p>
                              <div className="d-flex ">
                                <span className="text-capitalize" style={{color:"#1A1A1A",fontSize:"16px",fontWeight:"500"}}>
                                  {hotel_data.name}
                                </span>
                              </div>
                            </div>
                          </Col>
                        </Row>

                        <Row className="mb-2 pl-2">
                          <Col md={12}>
                            {/* <Row className="mb-2 ">
                              <Col md={12}>
                                <div className="d-flex align-items-center">
                                  
                                  <p className="text-muted mb-1" style={{fontSize:"10px"}} >
                                    {hotel_data.address}
                                  </p>
                                </div>
                              </Col>
                            </Row> */}
                            <div className="">
                              <p className="text-md text-muted mb-1" style={{textDecoration:"underline", fontSize:"10px"}}>
                                {hotel_data.city}
                              </p>
                            </div>
                          </Col>
                        </Row>


                        <Row className="no-gutters pl-2">
                    
                            {/* Ratings Badge */}

                            <Row class="mt-2 px-1">
                                <Col md="auto" xs="auto" >
                                  <span style={{background:"#2AC084",color:"#FFF",padding:"2px 6px", borderRadius:"4px", fontSize:"12px",fontWeight:"600"}}>4 / 5</span>
                                </Col>

                                <Col className="text-muted text-sm mt-1">
                                  user reviews
                                </Col>
                            </Row>
                          
                        </Row>



                      </Card.Body>
                    </Col>
                  </Row>
                  {/* <div className="w-100 my-2 md">
                    <InputGroup className="mb-3">

                      <FormControl
                        placeholder="Enter Discount Amount"
                      />
                      <InputGroup.Text id="basic-addon1" style={{background:"#F36B25",color:"#fff"}}>₹</InputGroup.Text>
                    </InputGroup>
                  </div> */}

                  {/* Price Detail Section */}
                  <Row className="p-3">
                    <span style={{ fontWeight: "400", color: "#000", fontSize: "24px" }}>Price Detail's</span>
                  </Row>
                  <div className="container">
                  <Row className="mt-1">
                    <Col md={8} className="text-muted "><span style={{fontSize:"14px"}}>4000 x 3nights</span></Col>
                    <Col md={4} style={{textAlign:"right"}}> 12000</Col>
                  </Row>
{/* 
                  <Row className="mt-1">
                    <Col md={8} className="text-muted"><span>Discount</span></Col>
                    <Col md={4} style={{textAlign:"right",color:"#2AC084"}}>-12000</Col>
                  </Row> */}

                  <Row className="mt-1">
                    <Col md={8} className="text-muted "><span style={{fontSize:"14px"}}>Service Fee</span></Col>
                    <Col md={4} style={{textAlign:"right"}}>8000</Col>
                  </Row>


                  <Row className="mt-1">
                    <Col md={8} className="text-muted "><span style={{fontSize:"14px"}}>Taxes and Fee</span></Col>
                    <Col md={4} style={{textAlign:"right"}}>8000</Col>
                  </Row>
                  <hr />
                  <Row className="mt-1">
                    <Col md={8} style={{fontWeight:"bold"}}><span>TOTAL</span></Col>
                    <Col md={4} style={{textAlign:"right",fontWeight:"bold"}}>16000</Col>
                  </Row>


                  </div>
                  
                </Card>
                {room.rates
                  ?.filter(
                    (rate) =>
                      rate.price_source === "Hotelbeds" &&
                      rate.ratekey === roomPlan.ratekey &&
                      rate.cancellation?.length > 0
                  )
                  .map((rate, i) => {
                    return (
                      <Alert
                        key={i}
                        variant="danger"
                        className="border-0 text-center"
                      >
                        <div>
                          <strong> Cancellation charges:</strong>
                          {rate.cancellation.map((cancellation, k) => (
                            <div key={k} className="text-md">
                              {`INR ${parseFloat(cancellation.amount).toFixed(
                                2
                              )}, from ${moment(
                                cancellation.from,
                                "YYYY-MM-DDTHH:mm"
                              ).format("LLLL")}`}
                            </div>
                          ))}
                        </div>
                      </Alert>
                    );
                  })}


              </Col>

              {/* Payment card*/}
              {/* <Col md={4}>
                <PaymentCard
                  contracted={roomPlan.price_source}
                  onClick={handleSaveHotelDetails}
                  onBookNow={() => {
                    setInstantModal(true);
                  }}
                  errorMessage={errorMessage}
                  getGuestList={getGuestList(query_data.rooms)}
                />
              </Col> */}
            </Row>
          </div>

        </>
      );
      break;
    case STEPS.LOADING:
    default:
      content = (
        <div
          className="d-flex align-items-center justify-content-center flex-column"
          style={{ height: "70vh" }}
        >
          <h5>Please wait until we fetch latest Price</h5>
          <Image src="/images/loading.gif" width="200" />
        </div>
      );
      break;
  }

  return (
    <>
      {content}

      <ModalComponent
        show={showIntentModal}
        onHide={() => {
          setShowIntentModal(false);
          setInstantModal(false);
        }}
        bodyClassName="p-5 mx-auto"
        body={
          <>
            <Formik
              initialValues={{ booking_intent: "" }}
              onSubmit={(data, { setSubmitting }) => {
                const requestBooking = async (payload) => {
                  try {
                    const response = await fetchDataWithAuth(
                      `${API_URL}/api/agent/bookings/submit`,
                      "POST",
                      null,
                      null,
                      payload
                    );
                    if (response.Error) {
                      setErrorMessage(response.Error);
                    } else {
                      if (response.redirect_url == "" || !instantModal) {
                        bookingSubmitted();
                      } else {
                        reloadPageWithUrl(response.redirect_url);
                      }
                    }
                  } catch (err) {
                    setErrorMessage(
                      `Something went wrong! case STEPS.LOADING:
                      default: Error: ${JSON.stringify(err)}`
                    );
                    console.error(
                      `Something went wrong! Error: ${JSON.stringify(err)}`
                    );
                  } finally {
                    setSubmitting(false);
                  }
                };

                setErrorMessage("");
                const payload = { ...bookingDetails, ...data };
                if (
                  creditUser &&
                  roomPlan.price_source == "Hotelbeds" &&
                  instantModal
                ) {
                  payload.instant_booking = true;
                  payload.create_payment = true;
                } else if (
                  !creditUser &&
                  roomPlan.price_source == "Hotelbeds" &&
                  instantModal
                ) {
                  payload.instant_booking = false;
                  payload.create_payment = true;
                } else {
                  payload.instant_booking = false;
                  payload.create_payment = false;
                }
                payload.booking_detail.booking_amount = parseFloat(totalAmount);
                payload.booking_detail.net_price = parseFloat(roomPlan.net);
                payload.booking_detail.commission_at = roomPlan.commission;

                payload.booking_detail.markup_price = parseFloat(
                  commissionCharges
                );
                payload.booking_detail.tax_amount = parseFloat(taxAndServices);
                payload.booking_detail.tax_percent = parseFloat(roomPlan.tax);
                payload.booking_detail.voucher_remarks = rateCommentsResponse;
                payload.ratekeys = roomPlan.ratekeys;

                requestBooking(payload);
              }}
            >
              {({ handleSubmit, values, isSubmitting }) => (
                <form onSubmit={handleSubmit}>
                  {!instantModal ? (
                    <>
                      <h5 className="text-jetblack mb-4">
                        How likely are you to book?
                      </h5>
                      <RadioGroup name="booking_intent">
                        <Radio
                          className="mb-2"
                          name="booking_intent"
                          id="is_definitely_booking"
                          value="definitely_booking"
                          checked={
                            values.booking_intent === "definitely_booking"
                          }
                        >
                          Definitely booking
                        </Radio>
                        <Radio
                          className="mb-2"
                          name="booking_intent"
                          id="is_thinking_about_booking"
                          value="thinking_about_booking"
                          checked={
                            values.booking_intent === "thinking_about_booking"
                          }
                        >
                          Thinking about booking
                        </Radio>
                        <Radio
                          className="mb-2"
                          name="booking_intent"
                          id="is_just_browsing"
                          value="just_browsing"
                          checked={values.booking_intent === "just_browsing"}
                        >
                          Just browsing
                        </Radio>
                      </RadioGroup>
                      <Button
                        variant="primary"
                        className="mt-4"
                        isLoading={isSubmitting}
                        type="submit"
                        block
                      >
                        Submit
                      </Button>
                    </>
                  ) : (
                    <>
                      <h5 className="text-center text-jetblack mb-4">
                        Proceed to Pay
                      </h5>
                      <p>{rateCommentsResponse}</p>
                      <div className="d-flex">
                        <Button
                          variant="outline-secondary"
                          className="mt-4 flex-fill mr-2"
                          onClick={() => setShowIntentModal(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          className="mt-4 ml-2 flex-fill"
                          isLoading={isSubmitting}
                          type="submit"
                        >
                          Pay Now
                        </Button>
                      </div>
                    </>
                  )}
                  <ErrorText error={errorMessage} />
                </form>
              )}
            </Formik>
            
          </>
        }
      />
    </>
  );
};

export default HotelBooking;
