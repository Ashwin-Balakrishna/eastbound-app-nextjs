import { Formik } from "formik";
import moment from "moment";
import React, { useState, useEffect } from "react";
import { Button, Form, Row, Badge } from "react-bootstrap";
import nationalitiesData from "../../../public/json/nationalities.json";
import DateRange from "../../elements/dateRange";
import SelectField from "../../elements/selectField";
import Guest from "./guests/guests";
import Styles from "./hotelSearch.module.scss";
import { API_URL, getSessionToken } from "../../../utils/helper";
import AsyncSelect from "../../elements/asyncSelect";
import { fetchFormDataWithAuth } from "../../../utils/apiHelper";
import { components } from "react-select";
import { useWindowSize } from "../../../hooks/useWindowSize";

const CustomOption = (props) => {
  const { data } = props;
  return (
    <components.Option
      {...props}
      className="d-flex justify-content-between align-items-center"
    >
      <div>{data.label}</div>
      <Badge variant="primary" className="text-capitalize">
        {data.type}
      </Badge>
    </components.Option>
  );
};

const getInitialSearchOption = (hotels) => {
  if (!hotels) return "";

  if (hotels.city)
    return [{ label: hotels.city, value: hotels.city, type: "city" }];

  if (hotels.hotelName)
    return [{ label: hotels.hotelName, value: hotels.code, type: "hotel" }];
};

const getHotelNameOptions = async (inputValue) => {
  const data = await fetchFormDataWithAuth(
    `${API_URL}/api/agent/hotel/search`,
    "POST",
    null,
    null,
    JSON.stringify({ query: inputValue })
  );

  const cities = data.response.cities.map((city) => {
    return { label: city, value: city, type: "city" };
  });

  const hotels = data.response.hotels.map((hotel) => {
    return { label: hotel.name, value: hotel.id, type: "hotel" };
  });

  return [...cities, ...hotels];
};

const HotelSearch = ({ query_data, onSearch }) => {
  const screenSize = useWindowSize();
  const [isError, setErrorMsg] = useState(false);
  const [dateRangeOrientation, setDateRangeOrientation] = useState(
    "horizontal"
  );
  const [dateRangeVerticalHeight, setDateRangeVerticalHeight] = useState(null);
  const token = getSessionToken();

  const initialSearchOption = getInitialSearchOption(query_data?.hotels);

  useEffect(() => {
    setDateRangeOrientation(screenSize.width < 768 ? "vertical" : "horizontal");
    setDateRangeVerticalHeight(screenSize.width < 768 ? 400 : null);
  }, [screenSize]);

  return (
    <Formik
      key="hotel_search_key"
      onSubmit={(data) => {
        if (
          data.checkin &&
          data.checkout &&
          data.rooms &&
          data.hotels 
          // &&    data.nationality
        ) {
          onSearch(data);
        } else {
          setErrorMsg(true);
        }
      }}
      initialValues={{
        hotels: query_data?.hotels,
        checkin: query_data?.checkin,
        checkout: query_data?.checkout,
        hotelsearch: query_data?.hotels?.city || query_data?.hotels?.code || "",
        rooms: query_data?.rooms,
        // nationality: query_data?.nationality || "IN",
      }}
    >
      {({ handleSubmit, values, setFieldValue }) => (
        <Form
          className={`search-font-size ${Styles.form}`}
          onSubmit={handleSubmit}
        >
          <Row>

            <div
              className={`col-md-3 col-12 px-1 ${Styles.selectWidthLg} ${Styles.widthXs100}`}
            >
              <p className="mb-1" style={{color:"#fff", fontSize:"12px"}}>Destination</p>
              <AsyncSelect
                formGroupClassName="mb-lg-0"
                label=""
                id="hotelsearch"
                name="hotelsearch"
                classNamePrefix="search"
                placeholder="Search"
                value={values.hotelsearch}
                components={{ Option: CustomOption }}
                defaultOptions={initialSearchOption}
                loadOptions={getHotelNameOptions}
                onOptionChanged={(option) => {
                  option.type === "city"
                    ? setFieldValue("hotels", { city: option.label })
                    : setFieldValue("hotels", {
                        code: option.value,
                        hotelName: option.label,
                      });
                }}
              />
            </div>
            <div
              className={`px-1 col-md-3 col-12 ${Styles.dateRangeWidthLg} ${Styles.widthXs100}`}
            >
              <p className="mb-1" style={{color:"#fff", fontSize:"12px"}}>Check In-Out</p>
              <DateRange
                readOnly
                formGroupClassName="mb-lg-0"
                name="date"
                showDefaultInputIcon={true}
                startDatePlaceholderText="Check in"
                endDatePlaceholderText="Check out"
                initialStartDate={values.checkin && moment(values.checkin)}
                initialEndDate={values.checkout && moment(values.checkout)}
                onStartDateChange={(startDate) =>
                  setFieldValue("checkin", startDate)
                }
                onEndDateChange={(endDate) =>
                  setFieldValue("checkout", endDate)
                }
                showClearDates={true}
                orientation={dateRangeOrientation}
                verticalHeight={dateRangeVerticalHeight}
                id="hotel-date-range"
                
              />
            </div>
            {/* 
            Nationality
            
            <div
              className={`col-md-2 col-12 px-1 ${Styles.selectWidthLg} ${Styles.widthXs100}`}
            >
              <SelectField
                formGroupClassName="mb-lg-0"
                id="hotel-search--nationality"
                classNamePrefix="search"
                placeholder="Nationality"
                name={"nationality"}
                value={values.nationality}
                options={nationalitiesData.nationalities}
              />
            </div> */}
            <div
              className={`col-md-4 col-12 px-1 ${Styles.guestSelectWidthLg} ${Styles.widthXs100}`}
            >
              <p className="mb-1" style={{color:"#fff", fontSize:"12px"}}>Guest</p>
              <Guest
                rooms={values.rooms}
                onRoomSelect={(room) =>
                  setFieldValue("rooms", room["guestList"])
                }
              />
            </div>
            <div className="col-md-2 col-12 px-1">
            <p className="mb-1" style={{ fontSize:"12px",opacity:"0"}}>Search</p>
              <Button variant="primary" type="submit" size="lg" block>
                Search Hotels
              </Button>
            </div>
          </Row>
          {isError === true ? (
            <p className="text-primary small text-center mb-0">
              Please fill all required details
            </p>
          ) : null}
        </Form>
      )}
    </Formik>
  );
};

export default HotelSearch;
