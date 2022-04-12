import { Formik } from "formik";
import _ from "lodash";
import moment from "moment";
import * as Yup from "yup";
import { BiBuildings, BiWallet, BiUser } from "react-icons/bi";
import {IoLogoWhatsapp} from "react-icons/io";
import { RiFlightTakeoffLine, RiHotelBedFill, RiCheckboxCircleLine } from "react-icons/ri";
import {MdSms, MdContentCopy} from "react-icons/md";
import {ImMail4} from "react-icons/im";
import nationalitiesData from "../../../public/json/nationalities.json";
import Checkbox from "../../elements/checkbox";
import DateRange from "../../elements/dateRange";
import Styles from "./bookingForm.module.scss";
import PhoneNumber from "../../elements/phoneNumber/phoneNumber";
import SelectField from "../../elements/selectField";
import RadioGroup from "../../elements/radioGroup";
import Radio from "../../elements/radio";
import TextField from "../../elements/textField/textField";
import  {Accordion,Card,Button,Row,Col,FormGroup,InputGroup,FormControl} from "react-bootstrap";
import DateTimePicker from "../../elements/dateTimePicker";
import { useEffect, useState } from "react";
import { urls } from "../../../shared/urls";
import Paymentsaccordion from "./paymentsaccordion";
import { useHotelState } from "../../../context/hotelCodeContext";


const options = [
  { value: "Ms", label: "Ms" },
  { value: "Mr", label: "Mr" },
  { value: "Mrs", label: "Mrs" },
];


const validationSchema = Yup.object({
  guest_detail: Yup.lazy((obj) =>
    Yup.object(
      _.mapValues(obj, (guest) => {
        if (guest.guest_temp_id === 0) {
          return Yup.object({
            guest_name: Yup.string().required("Please enter guest name"),
            // guest_age: Yup.string().required("Please enter guest age"),
            is_primary: Yup.bool(),
            guest_email: Yup.string().when("is_primary", {
              is: (val) => val,
              then: Yup.string()
                .required("Please enter guest email address")
                .email("Email is invalid"),
              otherwise: Yup.string().notRequired(),
            }),
            guest_dial_code: Yup.string(),
            phoneIsValid: Yup.boolean(),
            guest_phone_number: Yup.string().when("is_primary", {
              is: (val) => val,
              then: Yup.string().when(
                ["phoneIsValid", "guest_dial_code"],
                (phoneIsValid, guest_dial_code, schema) => {
                  return phoneIsValid === false
                    ? schema
                        .test(
                          "requiredPhone",
                          "Please enter phone number",
                          (value) => {
                            return (
                              value &&
                              value.substr(guest_dial_code.length) != ""
                            );
                          }
                        )
                        .test(
                          "validPhone",
                          "Phone number is invalid",
                          () => phoneIsValid
                        )
                    : schema.test(
                        "requiredPhone",
                        "Please enter phone number",
                        (value) => {
                          return (
                            value && value.substr(guest_dial_code.length) != ""
                          );
                        }
                      );
                }
              ),
            }),
            otherwise: Yup.string().notRequired(),
          });
        }
      })
    )
  ),

  booking_detail: Yup.object({
  
    t_and_c_accepted: Yup.boolean().oneOf(
      [true],
      "Please read and accept terms & conditions"
    ),
    is_gst_input_claimed: Yup.string()
      .nullable()
      .required("Please select if you have GST indentification"),
    gst_detail_id: Yup.number()
      .nullable()
      .when("is_gst_input_claimed", {
        is: (val) => val === "true",
        then: Yup.number()
          .nullable()
          .required("Please select a GST identification numbber"),
        otherwise: Yup.number().nullable().notRequired(),
      }),
  }),
  room_detail: Yup.object({
    room: Yup.string().required("Please select a room type"),
    roomPlan: Yup.string().required("Please select a room plan"),
  }),
  flights_detail: Yup.object({
    arrival_date: Yup.string()
      .nullable()
      .when("departure_date", (departure_date, schema) => {
        return schema.test(
          "validateDate",
          "Arrival date cannot be greater than departure date",
          (value) => {
            if (!value || !departure_date) {
              return true;
            }
            return moment(value) < moment(departure_date);
          }
        );
      }),
    departure_date: Yup.string().nullable(),
  }),
});

const gstDetailsOptions = (gst_details) => {
  return gst_details.map((gst_detail) => ({
    label: `${gst_detail.place_of_supply_state} - ${gst_detail.gstin}`,
    value: gst_detail.gst_detail_id,
  }));
};



const Agents = [
  { value: "agent1", label: "Agent1" },
  { value: "agent2", label: "Agent2" },
  { value: "agent3", label: "Agent3" },
];

const getRoomTypes = (rooms) => {
  return rooms.map((room) => ({
    value: room.roomcode,
    label: room.name || room.description,
  }));
};

const childrenAges = [...Array(12)].map((_, i) => ({
  value: i + 1,
  label: i + 1,
}));
const adultAges = [...Array(87)].map((_, i) => ({
  value: i + 13,
  label: i + 13,
}));

const getInitialGuestDetail = (rooms) => {
  let guestIds = [];
  let initialGuestDetail = {};
  let id = 1;
  for (let i = 0; i < rooms.length; i++) {
    let temp = [];
    for (let j = 0; j < rooms[i].adults + rooms[i].children; j++) {
      temp.push(id.toString());
      initialGuestDetail[id] = {
        guest_temp_id: j,
        guest_title: "",
        guest_name: "",
        guest_age:
          j - rooms[i].adults >= 0
            ? rooms[i].children_age[j - rooms[i].adults]
            : "",
        is_adult: !(j - rooms[i].adults >= 0),
        is_primary: j === 0 ? true : false,
        guest_dial_code: "91",
        guest_phone_number: "",
        guest_email: "",
      };
      id += 1;
    }
    guestIds.push(temp);
  }
  return { guestIds, initialGuestDetail };
};

const getInitialGuestRoom = (guestIds) => {
  let initialGuestRoom = [];
  for (let i = 0; i < guestIds.length; i++) {
    initialGuestRoom.push(guestIds[i]);
  }
  return initialGuestRoom;
};

const getSpecialRequest = (specialRequest) => {
  let text = "";
  text += specialRequest.smokingRoom ? "Smoking-room," : "";
  text += specialRequest.lateCheckOut ? "Late-check-out," : "";
  text += specialRequest.earlyCheckin ? "Early-check-in," : "";
  text += specialRequest.kingBed ? "Large-Bed," : "";
  text += specialRequest.twinBeds ? "Twin-Beds," : "";
  text += specialRequest.interconnectedRoom ? "Interconnected-room" : "";
  text += specialRequest.specialOccasion
    ? "Special occasion - Honeymoon / Wedding anniversary / Birthday,"
    : "";
  text += specialRequest.extra || "";

  return text;
};

const getMealOptions = (rates) => {
  return rates.map((rate) => {
    return {
      label: rate.meal_plan,
      value: rate.ratekey,
    };
  });
};

const BookingForm = ({
  hotel_data,
  query_data,
  handleSubmitForm,
  onRequestBooking,
}) => {
  const { guestIds, initialGuestDetail } = getInitialGuestDetail(
    query_data.rooms
  );
  const { room, roomPlan, calculatePriceStructure } = useHotelState();

  return (
    <>


      <Formik
        validationSchema={validationSchema}
        onSubmit={(data) => {
          const specialRequest = getSpecialRequest(data.special_request);
          data.booking_detail.spl_request = specialRequest;

          const payload = {};
          payload.flights_detail = data.flights_detail;

          payload.booking_detail = { ...data.booking_detail };
          payload.booking_detail.is_gst_input_claimed =
            payload.booking_detail.is_gst_input_claimed === "true";
          payload.booking_detail.gst_detail_id = payload.booking_detail
            .is_gst_input_claimed
            ? payload.booking_detail.gst_detail_id
            : null;

          payload.guest_room = data.guest_room;

          payload.room_detail = {};
          payload.room_detail.hotel_code = data.room_detail.hotel_code;
          payload.room_detail.room = data.room_detail.room;
          payload.room_detail.roomcode_id = data.room_detail.roomcode_id;
          payload.room_detail.meal_plan = data.room_detail.meal_plan;
          payload.room_detail.room_amount = data.room_detail.room_amount;
          payload.room_detail.rate_key = data.room_detail.rate_key;

          payload.guest_detail = {};
          for (const key in data.guest_detail) {
            if (Object.prototype.hasOwnProperty.call(data.guest_detail, key)) {
              payload.guest_detail[key] = {};

              payload.guest_detail[key].guest_title =
                data.guest_detail[key].guest_title;
              payload.guest_detail[key].guest_name =
                data.guest_detail[key].guest_name;
              payload.guest_detail[key].guest_age =
                data.guest_detail[key].guest_age;
              payload.guest_detail[key].is_adult =
                data.guest_detail[key].is_adult;
              payload.guest_detail[key].is_primary =
                data.guest_detail[key].is_primary;
              payload.guest_detail[key].guest_dial_code =
                data.guest_detail[key].guest_dial_code;
              payload.guest_detail[key].guest_phone_number = data.guest_detail[
                key
              ].guest_phone_number.replace(
                data.guest_detail[key].guest_dial_code,
                ""
              );
              payload.guest_detail[key].guest_email =
                data.guest_detail[key].guest_email;
            }
          }

          onRequestBooking(payload);
        }}
        initialValues={{
          special_request: {
            smokingRoom: false,
            lateCheckOut: false,
            earlyCheckin: false,
            kingBed: false,
            interconnectedRoom: false,
            specialOccasion: false,
            twinBeds: false,
            extra: "",
          },
          guest_detail: { ...initialGuestDetail },
          guest_room: getInitialGuestRoom(guestIds, hotel_data),
          booking_detail: {
            nationality: query_data?.nationality,
            check_in: query_data?.checkin,
            check_out: query_data?.checkout,
          
            spl_request: "",
            is_gst_input_claimed: null,
            gst_detail_id: null,
            t_and_c_accepted: false,
          },
          room_detail: {
            hotel_code: hotel_data.code,
            room: room.roomcode,
            rate_key: roomPlan.ratekey,
            roomPlan: roomPlan.ratekey,
            meal_plan: roomPlan.meal_plan,
            room_amount: 0,
            roomcode_id: room.roomcode_id,
          },
          flights_detail: {
            arrival_date: null,
            departure_date: null,
            pick_up_service: false,
            drop_service: false,
            additional_details: "",
          },
        }}
      >
        {({
          setFieldValue,
          handleSubmit,
          values,
          submitForm,
          errors,
          touched,
          handleBlur,
        }) => {
          handleSubmitForm(submitForm);

        const [pay,setPay]=useState(1);

          return (

            <form onSubmit={handleSubmit} className="mb-5">
             <div>
                    <Accordion defaultActiveKey="0">
                      {/* Traveller INFO */}
                        <Card>
                            <Accordion.Toggle as={Card.Header} eventKey="0">
                            <h6 className="text-jetblack my-2"><BiBuildings color="#F36B25" size="1.5rem" /> Traveller Information</h6>
                            </Accordion.Toggle>

                            <Accordion.Collapse eventKey="0">
                            <Card.Body>
                              {/* <DateRange
                              label="CheckIn - CheckOut Date"
                              name="date"
                              startDatePlaceholderText="Check in"
                              endDatePlaceholderText="Check out"
                              initialStartDate={moment(values.booking_detail.check_in)}
                              initialEndDate={moment(values.booking_detail.check_out)}
                              onStartDateChange={() => {}}
                              onEndDateChange={() => {}}
                              showClearDates={false}
                              disabled={true}
                            />
                            <SelectField
                              label="Nationality"
                              name={"booking_detail.nationality"}
                              defaultValue={values.booking_detail.nationality}
                              options={nationalitiesData.nationalities}
                              isDisabled={true}
                            /> */}

                            <SelectField
                              label={
                                <>
                                  <span>Room type</span>
                                  <span className="text-primary">*</span>
                                </>
                              }
                              name={`room_detail.room`}
                              value={values.room_detail.room}
                              options={getRoomTypes(hotel_data.rooms)}
                              // isDisabled={true}
                            />
                            <SelectField
                              label={
                                <>
                                  <span>
                                    Room Plan (Please select room type for checking room plan)
                                  </span>
                                  <span className="text-primary">*</span>
                                </>
                              }
                              name={`room_detail.roomPlan`}
                              value={values.room_detail.roomPlan}
                              options={getMealOptions(room.rates)}
                              // isDisabled={true}
                            />
                            <p className="text-muted font-weight-bold small mb-1">
                              Do you wish to claim GST input
                              <span className="text-primary">*</span>
                            </p>
                            <RadioGroup name="booking_detail.is_gst_input_claimed">
                              <div className="d-flex">
                                <Radio
                                  className="mb-2 text-muted mr-3"
                                  name="booking_detail.is_gst_input_claimed"
                                  id="is_gst_input_claimed_yes"
                                  value={"true"}
                                  checked={
                                    values.booking_detail.is_gst_input_claimed === "true"
                                  }
                                  onClick={() => {
                                    setFieldValue(`room_detail.room_amount`, roomPlan.net);
                                    calculatePriceStructure(false);
                                  }}
                                >
                                  Yes
                                </Radio>
                                <Radio
                                  className="mb-2 text-muted"
                                  name="booking_detail.is_gst_input_claimed"
                                  id="is_gst_input_claimed_no"
                                  value={"false"}
                                  checked={
                                    values.booking_detail.is_gst_input_claimed === "false"
                                  }
                                  onClick={() => {
                                    setFieldValue(
                                      `room_detail.room_amount`,
                                      roomPlan.pure_agent_net
                                    );
                                    calculatePriceStructure(true);
                                  }}
                                >
                                  No
                                </Radio>
                              </div>
                            </RadioGroup>
                            {values.booking_detail.is_gst_input_claimed === "true" ? (
                              <SelectField
                                label={
                                  <>
                                    <span>GST Identification Number</span>
                                    <span className="text-primary">*</span>
                                  </>
                                }
                                name={"booking_detail.gst_detail_id"}
                                value={values.booking_detail.gst_detail_id}
                                options={gstDetailsOptions(hotel_data.gst_details)}
                              />
                              
                            ) : null}
                              <Button className="my-2" variant="primary" >Continue</Button>
                              </Card.Body>
                          </Accordion.Collapse>
                        </Card>

                        
                      {/* Guest Details */}
                      <Card>
                      {query_data.rooms.map((room, i) => (
                        <div key={`room_${i}`}>

                  
                
                            <Accordion.Toggle as={Card.Header} eventKey="1">
                             <h6 className="text-jetblack my-2"><BiUser color="#F36B25" size="1.5rem" />{`Contact Details`}</h6>
                            </Accordion.Toggle>

                            <Accordion.Collapse eventKey="1">
                                <Card.Body>
                                  <Accordion
                    defaultActiveKey={`room_${i}_guest_0`}
                    className="mb-3"
                  >
                    {[...Array(room.adults + room.children)].map((_, index) => {
                      return (
                        <Card
                          key={`room_${i}_guest_${index}`}
                          style={{
                            overflow: "unset",
                          }}
                        >
                          <Accordion.Toggle
                            as={Card.Header}
                            eventKey={`room_${i}_guest_${index}`}
                            className="text-muted small font-weight-bold border-0"
                          >
                            {`Guest ${index + 1}${
                              index === 0 ? "* (Primary guest)" : "(Optional)"
                            }`}
                          </Accordion.Toggle>
                          <Accordion.Collapse
                            eventKey={`room_${i}_guest_${index}`}
                          >
                            <div className="p-3">
                             
                                <TextField
                                  formGroupClassName="flex-fill col-12 col-md-8 p-0 mr-lg-2"
                                  name={`guest_detail.${guestIds[i][index]}.guest_name`}
                                  label={
                                    <>
                                      <span>Name</span>
                                      {index === 0 && (
                                        <span className="text-primary">*</span>
                                      )}
                                    </>
                                  }
                                  value={
                                    values.guest_detail[`${guestIds[i][index]}`]
                                      ?.guest_name
                                  }
                                />


                              <div className="d-lg-flex justify-content-between">
                                <TextField
                                  formGroupClassName={`flex-fill col-12 col-md-8 p-0 mr-lg-2`}
                                  type="email"
                                  name={`guest_detail.${guestIds[i][index]}.guest_email`}
                                  label={
                                    <>
                                      <span>Email address</span>
                                      {index === 0 && (
                                        <span className="text-primary">*</span>
                                      )}
                                    </>
                                  }
                                  value={
                                    values.guest_detail[`${guestIds[i][index]}`]
                                      ?.guest_email
                                  }
                                />

                               
                              </div>
                              <div className="d-lg-flex justify-content-between">
                              <PhoneNumber
                                  formGroupClassName={`flex-fill col-12 col-md-8 p-0 mr-lg-2`}
                                  label={
                                    <>
                                      <span>Phone Number</span>
                                      {index === 0 && (
                                        <span className="text-primary">*</span>
                                      )}
                                    </>
                                  }
                                  name={`guest_detail.${guestIds[i][index]}.guest_phone_number`}
                                  country="in"
                                  preferredCountries={["in"]}
                                  value={
                                    values.guest_detail[`${guestIds[i][index]}`]
                                      ?.guest_phone_number
                                  }
                                  onPhoneChange={(
                                    value,
                                    country,
                                    e,
                                    _,
                                    isValid
                                  ) => {
                                    setFieldValue(
                                      `guest_detail.${guestIds[i][index]}.guest_dial_code`,
                                      country.dialCode
                                    );
                                    setFieldValue(
                                      `guest_detail.${guestIds[i][index]}.guest_phone_number`,
                                      value
                                    );
                                    setFieldValue(
                                      `guest_detail.${guestIds[i][index]}.phoneIsValid`,
                                      isValid
                                    );
                                  }}
                                  searchPlaceholder="Search by Country name or code"
                                  errorText={
                                    errors.guest_detail && touched.guest_detail
                                      ? errors.guest_detail[
                                          `${guestIds[i][index]}`
                                        ]?.guest_phone_number &&
                                        touched.guest_detail[
                                          `${guestIds[i][index]}`
                                        ]?.guest_phone_number
                                        ? errors.guest_detail[
                                            `${guestIds[i][index]}`
                                          ]?.guest_phone_number
                                        : ""
                                      : ""
                                  }
                                  touched={
                                    touched.guest_detail
                                      ? touched.guest_detail[
                                          `${guestIds[i][index]}`
                                        ]?.guest_phone_number
                                      : null
                                  }
                                  onBlur={handleBlur}
                                />
                              </div>

                            </div>
                          </Accordion.Collapse>
                        </Card>
                      );
                    })}
                                  </Accordion>
                                  <Button className="my-2" variant="primary" >Continue</Button>
                                </Card.Body>
                            </Accordion.Collapse>
                            </div>
                      ))}
                       </Card>

                      {/* Special Requests */}
                      <Card>
                            <Accordion.Toggle as={Card.Header} eventKey="2">
                              <h6 className="text-jetblack my-2"><BiBuildings color="#F36B25" size="1.5rem" /> Special Requests</h6>
                              
                            </Accordion.Toggle>

                            <Accordion.Collapse eventKey="2">
                                <Card.Body>
                                  <p className="small text-muted font-weight-bold form-label">
                                    Special Request (Optional)
                                  </p>
                                  <div >
                                    <Row>
                                      <Col md={4} xs="auto">
                                        <Checkbox
                                        className="mr-3"
                                        name="special_request.smokingRoom"
                                        value={values.special_request?.smokingRoom}
                                        id="smokingRoom"
                                      >
                                        <span className="text-md text-muted">Pickup-Service</span>
                                        </Checkbox>
                                      </Col>
                                      
                                      <Col md={4} xs="auto">
                                        <Checkbox
                                          className="mr-3"
                                          name="special_request.lateCheckOut"
                                          value={values.special_request?.lateCheckOut}
                                          id="lateCheckOut"
                                        >
                                          <span className="text-md text-muted">Late check-out</span>
                                        </Checkbox>
                                      </Col>

                                      <Col md={4} xs="auto">
                                      <Checkbox
                                        className="mr-3"
                                        name="special_request.earlyCheckin"
                                        value={values.special_request?.earlyCheckin}
                                        id="earlyCheckin"
                                      >
                                        <span className="text-md text-muted">Early check-in</span>
                                      </Checkbox>
                                      </Col>
                                    </Row>

                                    <Row>
                                      <Col md={4} xs="auto">
                                          <Checkbox
                                          className="mr-3"
                                          name="special_request.kingBed"
                                          value={values.special_request?.kingBed}
                                          id="kingBed"
                                        >
                                          <span className="text-md text-muted">King bed</span>
                                        </Checkbox>
                                      </Col>
                                      
                                      <Col md={4} xs="auto">
                                        <Checkbox
                                            className="mr-3"
                                            name="special_request.twinBeds"
                                            value={values.special_request?.twinBeds}
                                            id="twinBeds"
                                          >
                                            <span className="text-md text-muted">Twin beds</span>
                                          </Checkbox>
                                      </Col>
                                      
                                        <Col md={4} xs="auto">
                                            <Checkbox
                                              className="mr-3"
                                              name="special_request.interconnectedRoom"
                                              value={values.special_request?.interconnectedRoom}
                                              id="interconnectedRoom"
                                            >
                                              <span className="text-md text-muted">
                                                Interconnected room
                                              </span>
                                            </Checkbox>
                                        </Col>
                                    </Row>

                                    <Row>
                                      <Col md={4} xs="auto"><Checkbox
                                        className="mr-3"
                                        name="special_request.specialOccasion"
                                        value={values.special_request?.specialOccasion}
                                        id="specialOccasion"
                                      >
                                        <span className="text-md text-muted">Special occasion</span>
                                        </Checkbox>
                                      </Col>

                                      <Col>
                                        <span className="text-primary text-sm">+ other requests</span>
                                      </Col>
                                      
                                    </Row>

                                    
                                    
                                   
                                   
                                    
                                    
                                    
                                    
                                  </div>
                              
                                <TextField
                                  name="special_request.extra"
                                  placeholder="write here"
                                  label="Any Other Request (Optional)"
                                  type="textarea"
                                  value={values.special_request?.extra}
                                />
                                <Button className="my-2" variant="primary" >Continue</Button>
                              </Card.Body>
                              
                            </Accordion.Collapse>
                        </Card>

                      {/* Paymnt OPTIONs */}
                        <Card>
                            <Accordion.Toggle as={Card.Header} eventKey="3">
                            <h6 className="text-jetblack my-2"><BiWallet color="#F36B25" size="1.5rem" />Payment Methods</h6>
                            </Accordion.Toggle>

                            <Accordion.Collapse eventKey="3">
                                <Card.Body>
                                  <Accordion defaultActiveKey="0">
                                      <Card>
                                          <Accordion.Toggle as={Card.Header} eventKey="0" onClick={()=>setPay(1)}>
                                              <span><RiCheckboxCircleLine size="1rem" color={pay===1?"green":""}/> 2HUB WALLET</span>
                                          </Accordion.Toggle>

                                          <Accordion.Collapse eventKey="0">
                                              <Card.Body>
                                               
                                                    <p className="text-muted text-sm">Available balance</p>
                                                    <span style={{fontWeight:"700",fontSize:"17px"}}>₹ 8345</span>
                                                 
                                              </Card.Body>
                                          </Accordion.Collapse>
                                      </Card>

                                      <Card>
                                          <Accordion.Toggle as={Card.Header} eventKey="1" onClick={()=>setPay(2)}>
                                            <span><RiCheckboxCircleLine size="1rem" color={pay===2?"green":""}/> Payment Gateway</span>
                                          </Accordion.Toggle>

                                          <Accordion.Collapse eventKey="1">
                                              <Card.Body>
                                                
                                                  <p className="text-muted text-sm">Amount to be paid</p>
                                                  <span style={{fontWeight:"700",fontSize:"17px"}}>₹ 16000</span>
                                                  
                                              </Card.Body>
                                        </Accordion.Collapse>
                                      </Card>

                                      {/* <Card>
                                          <Accordion.Toggle as={Card.Header} eventKey="2">
                                            <span><RiCheckboxCircleLine size="1rem" /> Link To Customer</span>
                                          </Accordion.Toggle>

                                          <Accordion.Collapse eventKey="2">
                                              <Card.Body>
                                                <Row className="my-2">
                                                  <Col>
                                                    <IoLogoWhatsapp color="green" size="1.5rem" /> <span>Whatsapp</span>
                                                  </Col>
                                                  <Col>
                                                    <ImMail4 color="grey" size="1.5rem" /> <span>Mail</span>
                                                  </Col>
                                                  <Col>
                                                    <MdSms color="grey" size="1.5rem" /> <span>Messages</span>
                                                  </Col>

                                                </Row>
                                                <InputGroup className="mb-3">
                                                  <FormControl
                                                    placeholder="UPI ID"
                                                  />
                                                  <InputGroup.Text id="basic-addon2"><MdContentCopy size="1rem"/> copy</InputGroup.Text>
                                                </InputGroup>
                                                <Button className="my-2" variant="primary" >Continue</Button>
                                              </Card.Body>
                                          </Accordion.Collapse>

                                      </Card> */}

                                  </Accordion>
                                  <Checkbox className="mt-3"
                                  name="booking_detail.t_and_c_accepted"
                                  id="booking_detail.t_and_c_accepted"
                                  value={values.booking_detail?.t_and_c_accepted}
                                >
                                  
                                  <span className=" text-md text-muted ">
                                    I agree to the &nbsp;
                                    <a href={urls.paymentPolicy} rel="noreferrer" target="_blank">
                                      Privacy policy | Terms &amp; Conditions | User Agreement |
                                      Cancellation policy
                                    </a>
                                  </span>
                                </Checkbox>
                                <Button variant="primary" className="btn-lg block px-5 text-sm">Pay via {pay === 1 ? "2 hub wallet" :"Razor Pay"}</Button>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                </div>


              

              
            </form>
          );
        }}
      </Formik>

                

    </>
  );
};

export default BookingForm;
