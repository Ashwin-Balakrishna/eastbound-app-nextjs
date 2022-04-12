import React, { useEffect } from "react";
import { Formik } from "formik";
import _ from "lodash";
import moment from "moment";
import * as Yup from "yup";
import Checkbox from "../../elements/checkbox";
import DateRange from "../../elements/dateRange";
import Styles from "./bookingForm.module.scss";
import PhoneNumber from "../../elements/phoneNumber/phoneNumber";
import SelectField from "../../elements/selectField";
import RadioGroup from "../../elements/radioGroup";
import Radio from "../../elements/radio";
import TextField from "../../elements/textField/textField";
import { Accordion, Card } from "react-bootstrap";
import DateTimePicker from "../../elements/dateTimePicker";
import { useState } from "react";
import { fetchFormDataWithAuth } from "../../../utils/apiHelper";
const API_URL = process.env.global_url;

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
            guest_age: Yup.string().required("Please enter guest age"),
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

const getInitialGuestDetail = (rooms, bookingData) => {
  let initialGuests = [];
  let totalGuests = 0;
  for (let i = 0; i < bookingData.rooms.length; i++) {
    for (let j = 0; j < bookingData.rooms[i].guests.length; j++) {
      initialGuests.push(bookingData.rooms[i].guests[j]);
    }
  }
  for (let i = 0; i < rooms.length; i++) {
    totalGuests += parseInt(rooms[i].adults + rooms[i].children);
  }

  if (initialGuests.length >= totalGuests) {
    initialGuests = initialGuests.slice(0, parseInt(totalGuests));
  } else {
    for (let i = initialGuests.length - 1; i < totalGuests; i++) {
      initialGuests.push({
        guest_id: 0,
        guest_title: "",
        guest_name: "",
        guest_dial_code: "",
        guest_phone_number: "",
        guest_email: "",
        is_adult: "",
        is_primary: "",
      });
    }
  }
  let guestIds = [];
  let initialGuestDetail = {};
  let id = 1;
  let tempId = 0;
  for (let i = 0; i < rooms.length; i++) {
    let temp = [];
    for (let j = 0; j < rooms[i].adults + rooms[i].children; j++) {
      temp.push(id);
      initialGuestDetail[id] = {
        guest_temp_id: j,
        guest_title: initialGuests[tempId].guest_title,
        guest_name: initialGuests[tempId].guest_name,
        guest_age: initialGuests[tempId].guest_age,
        is_adult: !(j - rooms[i].adults >= 0),
        is_primary: j === 0 ? true : false,
        guest_dial_code: "91",
        guest_phone_number:
          initialGuests[tempId].guest_dial_code +
          initialGuests[tempId].guest_phone_number,
        guest_email: initialGuests[tempId].guest_email,
      };
      id += 1;
      tempId += 1;
    }
    guestIds.push(temp);
  }
  return { guestIds, initialGuestDetail };
};

const getInitialGuestInfo = (rooms, bookingData) => {
  let initialGuests = [];
  let initialRoom = [];
  let totalGuests = 0;
  for (let i = 0; i < bookingData.rooms.length; i++) {
    for (let j = 0; j < bookingData.rooms[i].guests.length; j++) {
      initialGuests.push(bookingData.rooms[i].guests[j]);
    }
  }

  for (let i = 0; i < rooms.length; i++) {
    totalGuests += parseInt(rooms[i].adults + rooms[i].children);
  }

  if (initialGuests.length >= totalGuests) {
    initialGuests = initialGuests.slice(0, parseInt(totalGuests));
  } else {
    for (let i = initialGuests.length - 1; i < totalGuests; i++) {
      initialGuests.push({
        guest_id: 0,
        guest_title: "",
        guest_name: "",
        guest_dial_code: "",
        guest_phone_number: "",
        guest_email: "",
        is_adult: "",
        is_primary: "",
      });
    }
  }

  let initialGuestInfo = [];

  let id = 0;
  for (let i = 0; i < rooms.length; i++) {
    // let temp = [];
    let temp = [];
    let tempp = [];
    for (let j = 0; j < rooms[i].adults + rooms[i].children; j++) {
      // temp.push(id);

      temp.push({
        guest_id: initialGuests[id].guest_id,
        guest_title: initialGuests[id].guest_title,
        guest_name: initialGuests[id].guest_name,
        guest_dial_code: initialGuests[id].guest_dial_code,
        guest_phone_number: initialGuests[id].guest_phone_number,
        guest_email: initialGuests[id].guest_email,
        guest_age: initialGuests[id].guest_age,
        is_adult: initialGuests[id].is_adult,
        is_primary: initialGuests[id].is_primary,
      });
      id += 1;
    }
    tempp.push({
      guests: temp,
      booking_room_id: bookingData.rooms[i].booking_room_id,
      room_type: bookingData.rooms[i].room_type,
      meal_plan: bookingData.rooms[i].meal_plan,
      room_amount: bookingData.rooms[i].room_amount,
      no_of_rooms: bookingData.rooms[i].no_of_rooms,
      roomcode_id: bookingData.rooms[i].roomcode_id,
    });
    initialGuestInfo.push(tempp[0]);
  }
  return { initialGuestInfo };
};

const getGuestInfo = (rooms, data) => {
  let guestInfo = [];
  let id = 1;
  for (let i = 0; i < rooms.length; i++) {
    let info = [];
    let temp = [];
    for (let j = 0; j < rooms[i].adults + rooms[i].children; j++) {
      info.push({
        guest_id: data.guest_detail[id].guest_id,
        guest_title: data.guest_detail[id].guest_title,
        guest_name: data.guest_detail[id].guest_name,
        guest_dial_code: data.guest_detail[id].guest_dial_code,
        guest_phone_number: data.guest_detail[id].guest_phone_number,
        guest_email: data.guest_detail[id].guest_email,
        guest_age: data.guest_detail[id].guest_age,
        is_adult: data.guest_detail[id].is_adult,
        is_primary: data.guest_detail[id].is_primary,
      });
      id += 1;
    }
    temp.push({
      guests: info,
      booking_room_id: data.guset_room[i].booking_room_id,
      room_type: data.guset_room[i].room,
      meal_plan: data.guset_room[i].meal_plan,
      room_amount: data.guset_room[i].room_amount,
      no_of_rooms: data.guset_room[i].no_of_rooms,
      roomcode_id: data.guset_room[i].roomcode_id,
    });
    guestInfo.push(temp[0]);
  }
  return { guestInfo };
};

const getInitialGuestRoom = (guestIds, hotel_data, bookingData) => {
  let tempBookingData = bookingData.rooms;
  if (bookingData.rooms.length < guestIds.length) {
    for (let i = bookingData.rooms.length; i < guestIds.length; i++) {
      tempBookingData.push({
        booking_room_id: "",
        guests: [],
        meal_plan: "",
        no_of_rooms: "",
        room_amount: "",
        room_type: "",
        roomcode_id: "",
      });
    }
  }

  let initialGuestRoom = [];
  for (let i = 0; i < guestIds.length; i++) {
    initialGuestRoom.push({
      booking_room_id: tempBookingData[i].booking_room_id,
      room: tempBookingData[i].room_type,
      no_of_rooms: tempBookingData[i].no_of_rooms,
      meal_plan: tempBookingData[i].meal_plan,
      roomPlan: tempBookingData[i].room_plan,
      hotel_code: "",
      guest_ids: "",
      room_amount: tempBookingData[i].room_amount,
    });
  }

  return initialGuestRoom;
};

const getMealOptions = (rates) => {
  return rates.map((rate) => {
    return {
      label: rate.meal_plan,
      value: rate.ratekey,
    };
  });
};

const HotelSearchAmmend = ({
  bookingData,
  totalAmount,
  hotel_data,
  query_data,
  handleSubmitForm,
  roomType,
  onRoomTypeSelected,
  bookingSubmitted,
}) => {
  const { guestIds, initialGuestDetail } = getInitialGuestDetail(
    query_data.rooms,
    bookingData
  );
  const { initialGuestInfo } = getInitialGuestInfo(
    query_data.rooms,
    bookingData
  );
  const [roomPlanRates, setRoomPlanRates] = useState([]);
  return (
    <>
      <Formik
        validationSchema={validationSchema}
        onSubmit={(data) => {
          const { guestInfo } = getGuestInfo(query_data.rooms, data);
          const payload = {
            booking_id: bookingData.booking_id,
            booking_amendment_data: {
              hotel_info: {
                check_in: query_data?.checkin,
                check_out: query_data?.checkout,
                booking_amount: totalAmount,
              },
              room_info: guestInfo,
              flights_info: {
                flight_detail_id: bookingData.flights_info.flight_detail_id,
                arrival_date: data.flights_detail.arrival_date,
                departure_date: data.flights_detail.departure_date,
                pick_up_service: data.flights_detail.pick_up_service,
                drop_service: data.flights_detail.drop_service,
                additional_details: data.flights_detail.additional_details,
              },
            },
          };

          const ammendBooking = async (payload) => {
            try {
              const resp = await fetchFormDataWithAuth(
                `${API_URL}/api/agent/bookings/submit`,
                "PUT",
                null,
                null,
                JSON.stringify(payload)
              );
              if (resp.Error) {
                console.log("error");
              } else {
                bookingSubmitted();
              }
            } catch (err) {
              console.error(
                `Something went wrong! Error: ${JSON.stringify(err)}`
              );
            }
          };
          ammendBooking(payload);
        }}
        initialValues={{
          bookingId: bookingData.booking_id,
          booking_ammendment_data: {
            hotel_info: {
              check_in: query_data?.checkin,
              check_out: query_data?.checkout,
            },
          },
          room_info: [...initialGuestInfo],
          flights_info: {
            flight_detail_id: bookingData.flights_info.flight_detail_id,
            arrival_date: bookingData.flights_info.arrival_date,
            departure_date: bookingData.flights_info.departure_date,
            pick_up_service: bookingData.flights_info.pick_up_service,
            drop_service: bookingData.flights_info.drop_service,
            additional_details: bookingData.flights_info.additional_details,
          },
          guest_detail: { ...initialGuestDetail },
          // guset_room: getInitialGuestRoom(guestIds, hotel_data, bookingData),
          booking_detail: {
            nationality: query_data?.nationality,
            check_in: query_data?.checkin,
            check_out: query_data?.checkout,
            is_gst_input_claimed: null,
            gst_detail_id: null,
          },
          room_detail: {
            hotel_code: hotel_data.code,
            room: "",
            roomPlan: "",
            meal_plan: "",
            room_amount: 0,
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
          return (
            <form onSubmit={handleSubmit} className="mb-5">
              <h6 className="text-jetblack mb-4">Traveller Information</h6>
              <DateRange
                label="CheckIn - CheckOut Date"
                name="date"
                startDatePlaceholderText="Check in"
                endDatePlaceholderText="Check out"
                initialStartDate={moment(
                  values.booking_ammendment_data.hotel_info.check_in
                )}
                initialEndDate={moment(
                  values.booking_ammendment_data.hotel_info.check_out
                )}
                onStartDateChange={() => {}}
                onEndDateChange={() => {}}
                showClearDates={false}
                disabled={true}
              />
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
                onOptionChanged={(option) => {
                  const roomPlans = hotel_data.rooms.filter(
                    (r) => r.roomcode === option.value
                  );
                  roomPlans.length > 0
                    ? setRoomPlanRates(roomPlans[0].rates)
                    : null;
                  // setFieldValue(`room_detail.roomPlan`, "");
                  onRoomTypeSelected({
                    pureAgent: null,
                    net: 0,
                    pure_agent_net: 0,
                    tax: 0,
                    comission: 0,
                  });
                }}
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
                options={getMealOptions(roomPlanRates)}
                onOptionChanged={(option) => {
                  setFieldValue(`room_detail.meal_plan`, option.label);
                  const selectedroom = hotel_data.rooms.filter(
                    (r) => r.roomcode === values.room_detail.room
                  );
                  const roomPlan = selectedroom[0].rates.filter(
                    (rate) => rate.ratekey === option.value
                  );
                  if (roomPlan.length > 0) {
                    let pureAgent = null;
                    if (
                      values.booking_detail.is_gst_input_claimed === "false"
                    ) {
                      pureAgent = true;
                      setFieldValue(
                        `room_detail.room_amount`,
                        roomPlan[0].pure_agent_net
                      );
                    } else if (
                      values.booking_detail.is_gstSelectField_input_claimed ===
                      "true"
                    ) {
                      pureAgent = false;
                      setFieldValue(`room_detail.room_amount`, roomPlan[0].net);
                    }
                    onRoomTypeSelected({
                      pureAgent: pureAgent,
                      net: roomPlan[0].net,
                      pure_agent_net: roomPlan[0].pure_agent_net,
                      tax: roomPlan[0].tax,
                      commission: roomPlan[0].commission,
                    });
                  } else {
                    onRoomTypeSelected({
                      pureAgent: null,
                      net: 0,
                      pure_agent_net: 0,
                      tax: 0,
                      comission: 0,
                    });
                  }
                }}
                isDisabled={!values.room_detail.room}
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
                    onClick={() =>
                      onRoomTypeSelected({
                        pureAgent: false,
                        net: roomType.net,
                        pure_agent_net: roomType.pure_agent_net,
                        tax: roomType.tax,
                        commission: roomType.commission,
                      })
                    }
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
                    onClick={() =>
                      onRoomTypeSelected({
                        pureAgent: true,
                        net: roomType.net,
                        pure_agent_net: roomType.pure_agent_net,
                        tax: roomType.tax,
                        commission: roomType.commission,
                      })
                    }
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

              {query_data.rooms.map((room, i) => (
                <div key={`room_${i}`}>
                  <h6 className="text-jetblack my-4">{`Room ${i + 1}`}</h6>
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
                              <div className="d-lg-flex justify-content-lg-between">
                                <SelectField
                                  label="Title"
                                  options={options}
                                  formGroupClassName="flex-fill col-12 col-md-2 p-0 mr-lg-2"
                                  name={`guest_detail.${guestIds[i][index]}.guest_title`}
                                  value={
                                    values.guest_detail[`${guestIds[i][index]}`]
                                      ?.guest_title
                                  }
                                />
                                <TextField
                                  formGroupClassName="flex-fill col-12 col-md-8 p-0 mr-lg-2"
                                  name={`guest_detail.${guestIds[i][index]}.guest_name`}
                                  label={
                                    <>
                                      <span>Guest Name</span>
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
                                <SelectField
                                  formGroupClassName="flex-fill col-12 col-md-2 p-0"
                                  label={
                                    <>
                                      <span>Guest Age</span>
                                      {index === 0 && (
                                        <span className="text-primary">*</span>
                                      )}
                                    </>
                                  }
                                  name={`guest_detail.${guestIds[i][index]}.guest_age`}
                                  value={
                                    values.guest_detail[`${guestIds[i][index]}`]
                                      ?.guest_age
                                  }
                                  options={
                                    values.guest_detail[`${guestIds[i][index]}`]
                                      ?.is_adult
                                      ? adultAges
                                      : childrenAges
                                  }
                                  onOptionChanged={(option) =>
                                    setFieldValue(
                                      `guest_detail.${guestIds[i][index]}.is_adult`,
                                      option?.value > 12
                                    )
                                  }
                                  isDisabled={
                                    !values.guest_detail[
                                      `${guestIds[i][index]}`
                                    ]?.is_adult
                                  }
                                />
                              </div>
                              <div className="d-lg-flex justify-content-between">
                                <TextField
                                  formGroupClassName={`flex-fill mr-lg-2 w-50 ${Styles.w100}`}
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

                                <PhoneNumber
                                  formGroupClassName={`flex-fill  w-50 ${Styles.w100}`}
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
                </div>
              ))}
              <h6 className="text-jetblack my-4">Flight Details</h6>
              <div className="d-lg-flex">
                <DateTimePicker
                  formGroupClassName="mr-lg-2 flex-fill w-50"
                  name="flights_detail.arrival_date"
                  label="Arrival Date (Optional)"
                  onDateTimeChange={(dateTime) =>
                    setFieldValue(
                      "flights_detail.arrival_date",
                      dateTime.format()
                    )
                  }
                  value={values.flights_info.arrival_date}
                />
                <DateTimePicker
                  formGroupClassName="flex-fill w-50"
                  name="flights_detail.departure_date"
                  label="Departure Date (Optional)"
                  onDateTimeChange={(dateTime) =>
                    setFieldValue(
                      "flights_detail.departure_date",
                      dateTime.format()
                    )
                  }
                  value={values.flights_info.departure_date}
                />
              </div>
              <p className="small text-muted font-weight-bold form-label">
                Additional Service (Optional)
              </p>
              <div className="d-lg-flex align-items-center">
                <Checkbox
                  name="flights_detail.pick_up_service"
                  value={values.flights_detail?.pick_up_service}
                  id="pick_up_service"
                >
                  <span className="text-md mr-4 text-muted">
                    Pick up Service
                  </span>
                </Checkbox>

                <Checkbox
                  name="flights_detail.drop_service"
                  value={values.flights_detail?.drop_service}
                  id="drop_service"
                >
                  <span className="text-md text-muted">Drop Service</span>
                </Checkbox>
              </div>
              <TextField
                name="flights_detail.additional_details"
                type="textarea"
                label="Additional Details (Optional)"
                value={values.flights_detail.additional_details}
              />
            </form>
          );
        }}
      </Formik>
    </>
  );
};

export default HotelSearchAmmend;
