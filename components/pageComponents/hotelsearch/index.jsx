import { Form, Toast } from "react-bootstrap";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
// import { DateRangePicker } from 'rsuite';

// Bootstrap dateRange
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";

import { API_URL, getSessionToken, NODE_API_URL } from "../../../utils/helper";
// import { API_URL, NODE_API_URL, getSessionToken } from "../../../utils/helper";
import { fetchFormDataWithAuth } from "../../../utils/apiHelper";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import moment from "moment";

const SearchHotels = ({
  data,
  setData,
  setHotelPrice,
  checkboxFilters,
  background,
  labelc,
  callHotel,
  setCallhotel,
  setBooking,
  setShowSearch,
  loader,
  setLoader,
  setTotalHotels,
  dataPriced,
  setDataPriced,
  setPercentage,
  intervalId,
  setIntervalId,
  setFilter,
}) => {
  var today = new Date();
  var dd = today.getDate() + 1;
  var mm = today.getMonth() + 1; //As January is 0.
  var yyyy = today.getFullYear();
  var todayDateString = dd + "/" + mm + "/" + yyyy;

  const router = useRouter();
  // console.log();

  // const query=router.query;

  var url = new URL(API_URL + router.asPath);
  var params = new URLSearchParams(url.search);
  // console.log(params.get("checkin"))

  // City Search Options and setting Value

  const [search, setSearch] = useState(false); //open and close
  const lightPickRef = useRef(null);

  const [city, setCity] = useState(params.get("city") || "");
  const [guest, setGuest] = useState(false);
  const [adultCount, setadultCount] = useState(
    +(params.get("adult") || "1").split("_").reduce((prev, count) => +prev + +count)
  );
  const [childCount, setchildCount] = useState(
    +(params.get("child") || "0").split("_").reduce((prev, count) => +prev + +count)
  );
  const [fromdate, setFromdate] = useState(
    params.get("checkin") ? new Date(params.get("checkin")) : moment(today).add(1, "days")
  );

  const [todate, setTodate] = useState(
    params.get("checkout") ? new Date(params.get("checkout")) : moment(fromdate).add(1, "days")
  );
  const [intervalID, setIntervalID] = useState(0);

  const [rooms, setRooms] = useState(
    Array.from({ length: +params.get("rooms") || 1 }).map((_, i) => {
      let children_age =
        params
          .get("children_age")
          ?.split("_")
          ?.[i]?.split("-")
          .map((a) => +a) || Array.from({ length: +(params.get("child") || "0").split("_")[i] || 0 }).map((_) => 0);
      if (children_age[0] === 0) {
        children_age = [];
      }
      return {
        roomId: i + 1,
        adults: +(params.get("adult") || "1").split("_")[i] || 1,
        children: +(params.get("child") || "0").split("_")[i] || 0,
        children_age,
      };
    })
  );
  const searchoptions = [
    { value: "Alapuzha", label: "Alapuzha" },
    { value: "Bangalore", label: "Bangalore" },
    { value: "Delhi", label: "Delhi" },
    { value: "Chennai", label: "Chennai" },
    { value: "Goa", label: "Goa" },
    { value: "Mumbai", label: "Mumbai" },
  ];

  // AsyncSelect INPUT FOR CITY
  const handleInputChange = (value) => {
    setSearch(value);
  };

  const handleChange = (value) => {
    // setCity(value.value||"");
    if (value) setCity(value.value || "");
    else setCity("");
  };

  const loadOptions = async (inputText, callback) => {
    const response = await fetch(`${API_URL}/api/agent/cities?city=${city || inputText}`);
    const json = await response.json();
    callback(json.map((i) => ({ label: i, value: i })));
  };

  // FILTERS

  useEffect(() => {
    // console.log("ifchecked=>", checkboxFilters.updated, callHotel);
    if (checkboxFilters.updated || callHotel) {
      // console.log("callingiftrue",checkboxFilters);
      submitForm();
    }
  }, [checkboxFilters, callHotel]);

  const toggleSearch = () => {
    setSearch(!search);
  };

  const selectCity = (name) => {
    setCity(name);
  };

  const toggleGuest = () => {
    setGuest(!guest);
  };

  const addAdult = (index) => {
    const tempRooms = [...rooms];
    const singleRoom = { ...tempRooms[index] };
    if (singleRoom && singleRoom.adults < 3) {
      setadultCount((prevState) => prevState + 1);
      singleRoom.adults += 1;
      tempRooms[index] = singleRoom;
      setRooms(tempRooms);
    }
  };

  const subtractAdult = (index) => {
    const tempRooms = [...rooms];
    const singleRoom = { ...tempRooms[index] };

    if (singleRoom && singleRoom.adults > 1) {
      setadultCount((prevState) => prevState - 1);
      singleRoom.adults -= 1;
      tempRooms[index] = singleRoom;
      setRooms(tempRooms);
    }
  };

  const addChild = (index) => {
    const tempRooms = [...rooms];
    const singleRoom = { ...tempRooms[index] };

    if (singleRoom && singleRoom.children < 3) {
      setchildCount((prevState) => prevState + 1);

      singleRoom.children += 1;
      singleRoom.children_age.push(0);
      tempRooms[index] = singleRoom;
      setRooms(tempRooms);
    }
  };

  const subtractChild = (index) => {
    const tempRooms = [...rooms];
    const singleRoom = { ...tempRooms[index] };

    if (singleRoom && singleRoom.children) {
      setchildCount((prevState) => prevState - 1);

      singleRoom.children -= 1;
      singleRoom.children_age.pop();
      tempRooms[index] = singleRoom;
      setRooms(tempRooms);
    }
  };

  const addRoom = () => {
    setadultCount((prevState) => prevState + 1);
    setRooms((prevState) => [
      ...prevState,
      {
        roomId: prevState.length + 1,
        adults: 1,
        children: 0,
        children_age: [],
      },
    ]);
  };

  const removeRoom = (index) => {
    setadultCount((prevState) => prevState - rooms[index].adults);
    setchildCount((prevState) => prevState - rooms[index].children);
    setRooms((prevState) => prevState.filter((room, idx) => idx !== index));
  };

  // API CALLS
  const api = async (payload) => {
    let arr = [];
    const responsedata = await fetchFormDataWithAuth(
      `${API_URL}/api/agent/hotel/search`,
      "POST",
      null,
      null,
      JSON.stringify(payload)
    );

    if (responsedata?.error) {
      throw new Error(responsedata.error);
    }

    // if(Object.values(responsedata).length===0){

    //   clearInterval(intervalID);
    //   return
    // }

    const { cost, rating, updated, ...contentfilter } = checkboxFilters;
    // Price Data Fetch
    let fdate = moment(fromdate).format("YYYY-MM-DD");
    let tdate = moment(todate).format("YYYY-MM-DD");
    const pricepayload = {
      hotels: Object.values(responsedata.response).map((d) => ({
        hotel_code: d.hotelCode,
        hotel_source: d.hotel_source,
      })),
      checkin: fdate,
      checkout: tdate,
      from: [fromdate, new Date(fromdate)],
      to: [todate, new Date(todate)],
      rooms: rooms,
      // cost: checkboxFilters.cost,
      // range: checkboxFilters.range,
      cost,
      rating,
    };
    clearInterval(intervalId);
    setIntervalId(0);
    setPercentage(50);
    const res = await fetchFormDataWithAuth(
      `${NODE_API_URL}/hotel/prices`,
      // `${API_URL}/api/agent/hotel/prices`,
      "POST",
      null,
      { "Content-Type": "application/json" },
      //null,
      JSON.stringify(pricepayload)
    );
    console.log("PRICE FETCHED==>");
    const hotelPrices = res["data"];
    setPercentage(75);
    console.log("PRICE FETCHED==>1", responsedata.response);
    setHotelPrice((prev) => {
      if (callHotel == 0) {
        const priceobj = {};
        hotelPrices?.forEach((price, index) => {
          priceobj[price.hotel_code] = price;
          if (responsedata.response[price.hotel_code]) {
            responsedata.response[price.hotel_code] = {
              ...priceobj[price.hotel_code],
              ...responsedata.response[price.hotel_code],
            };
            // console.log("CHECK",responsedata.response[price.hotel_code] )
            arr.push(responsedata.response[price.hotel_code]);
            delete responsedata.response[price.hotel_code];
            // console.log('newobj', responsedata.response)
          }
        });
        return priceobj;
      }
      const priceobj = { ...prev };
      hotelPrices?.forEach((price) => {
        priceobj[price.hotel_code] = price;
        if (responsedata.response[price.hotel_code]) {
          responsedata.response[price.hotel_code] = {
            ...priceobj[price.hotel_code],
            ...responsedata.response[price.hotel_code],
          };
          console.log("CHECK123", responsedata.response[price.hotel_code]);
          arr.push(responsedata.response[price.hotel_code]);
          delete responsedata.response[price.hotel_code];
          // console.log('newobj', responsedata.response)
        }
      });
      return priceobj;
    });
    //search api
    console.log("FETCHEDD===>");

    setDataPriced((prev) => {
      if (callHotel === 0 || payload.from === 0) {
        return Object.values(arr);
      }
      return prev.concat(Object.values(arr));
    });
    setData((prev) => {
      if (callHotel === 0 || payload.from === 0) {
        console.log("response", responsedata.response);
        return Object.values(responsedata.response);
      }
      return prev.concat(Object.values(responsedata.response));
    });
    setTotalHotels(responsedata.total_hotels);
    setPercentage(100);

    // console.log("PRICE FETCHED==>2")
    setCallhotel(1);
  };

  // Submit Form
  const submitForm = async (e) => {
    console.log("cleared==>", callHotel);
    if (e || callHotel == 0) {
      if (checkboxFilters && router.pathname != "/home") {
        if (
          checkboxFilters.chains.length > 0 ||
          checkboxFilters.cost.length > 0 ||
          checkboxFilters.facilities.length > 0 ||
          checkboxFilters.propertytypes.length > 0 ||
          checkboxFilters.stars.length > 0 ||
          checkboxFilters.rating != null
        ) {
          if (setFilter) setFilter(true);
        } else {
          if (setFilter) setFilter(false);
        }
      }
      if (e) e.preventDefault();
      clearInterval(intervalID);
      setCallhotel(0);
      setData([]);
      setHotelPrice([]);
      if (setDataPriced) setDataPriced([]);
      if (setPercentage) setPercentage(10);
    }

    let fdate = moment(fromdate).format("YYYY-MM-DD");
    let tdate = moment(todate).format("YYYY-MM-DD");
    const booking = {
      checkin: fdate,
      checkout: tdate,
      adults: adultCount,
      children: childCount,
      rooms: rooms.length,
    };
    setBooking(booking);

    try {
      if (router.pathname == "/home") {
        router.push(
          `/srp?city=${city}&checkin=${booking.checkin}&checkout=${booking.checkout}&adult=${rooms
            .map((r) => r.adults)
            .join("_")}&child=${rooms.map((r) => r.children).join("_")}&rooms=${rooms.length}&children_age=${rooms
            .map((r) => r.children_age.join("-"))
            .join("_")}`
        );
        return;
      }

      if (city && !loader) {
        setLoader(true);

        // Content data Fetch
        const { cost, rating, updated, ...contentfilter } = checkboxFilters;
        const payload = {
          city: city,
          from: data.length,
          size: 50,
          response_type: "min",
          // facilities: checkboxFilters.facilities,
          // chains : checkboxFilters.chains,
          // stars : checkboxFilters.stars,
          ...contentfilter,
        };
        if (callHotel === 0) {
          payload.from = 0;
        }
        if (e) {
          payload.from = 0;
        }

        localStorage.setItem("room_details", JSON.stringify(rooms));
        localStorage.setItem("payload", JSON.stringify(payload));

        router.push(
          `/srp?city=${city}&checkin=${booking.checkin}&checkout=${booking.checkout}&adult=${rooms
            .map((r) => r.adults)
            .join("_")}&child=${rooms.map((r) => r.children).join("_")}&rooms=${rooms.length}&children_age=${rooms
            .map((r) => r.children_age.join("-"))
            .join("_")}`
        );

        await api(payload);

        //  const id=setInterval(()=>{
        //      payload.from=data.length
        //      api(payload)
        //    },6000
        //  )
        //  setIntervalID(id)

        // setHotelPrice((prev)=>{
        //   if(callHotel==0){
        //     return(hotelPrices)
        //   }
        //   return prev.concat(hotelPrices)
        // })

        //  payload.map((room,index)=>{

        //   setRooms([...rooms, {
        //     roomId:rooms.Id,
        //     adults: rooms.adults,
        //     children: rooms.children,
        //     children_age: [],
        //  }

        // ])})

        setShowSearch(false);

        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  const { allowedMaxDays, allowedDays, allowedRange, beforeToday, afterToday, combine } = DateRangePicker;

  return (
    <section className="search__wrapper m_active" style={{ background: `${background}` }}>
      <Form onSubmit={submitForm}>
        <Form.Group className="form-controls">
          <Form.Label style={{ color: `${labelc}` }}>Destination</Form.Label>
          <div className="form-group-icon search_form">
            <span className="icon-group">
              <img src="/images/location.svg" />
            </span>
            <div className=" date-picker ml-4 pl-2" style={{ width: "100%" }}>
              <AsyncSelect
                cacheOptions
                value={city ? { value: city, label: city } : ""}
                placeholder={"Select City"}
                loadOptions={loadOptions}
                // defaultInputValue={city}
                onInputChange={handleInputChange}
                onChange={handleChange}
                isClearable={true}
                // inputValue={city}
              />
            </div>
          </div>
        </Form.Group>
        <Form.Group className="form-controls">
          <Form.Label style={{ color: `${labelc}` }}>Check in - out</Form.Label>
          <div className="form-group-icon search_form">
            <span className="icon-group">
              <img src="/images/calender.svg" alt="" />
            </span>
            <div id="searchdatepicker" className=" date-picker ml-4 pl-2" style={{ width: "60%" }}>
              <DateRangePicker
                initialSettings={{
                  autoApply: true,
                  locale: {
                    format: "MMM DD",
                  },
                  minDate: todayDateString,
                }}
                onEvent={(event, picker) => {
                  if (event.type === "apply") {
                    console.log("date called==>");
                    setFromdate(picker.startDate.toISOString());
                    setTodate(
                      picker.endDate
                        .add({ days: picker.endDate.clone().diff(picker.startDate, "days") < 1 ? 1 : 0 })
                        .toISOString()
                    );
                  }
                }}
              >
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: "5px" }}
                  value={`${moment(fromdate).format("MMM DD")} - ${moment(todate).format("MMM DD")}`}
                />
              </DateRangePicker>
            </div>
            <span className="nights">
              {moment(todate).diff(moment(fromdate), "days")}-
              {moment(todate).diff(moment(fromdate), "days") === 1 ? "Night" : "Nights"}
            </span>
          </div>
        </Form.Group>
        <Form.Group className="form-controls">
          <Form.Label style={{ color: `${labelc}` }}>Guest</Form.Label>
          <div className="form-group-icon search_form">
            <span className="icon-group">
              <img src="/images/guest.svg" />
            </span>
            <span className="icon-group-right" onClick={toggleGuest}>
              <img src="/images/arrowdown.svg" alt="img" />
            </span>
            <div></div>
            <Form.Control
              type="text"
              value={`${adultCount} Adult ${childCount} Child ${rooms.length} Rooms`}
              onClick={toggleGuest}
            />
            {/* use is-open class to open the dropdown */}
            <div
              className={guest ? "c-dropdown is-open guestdropdown guestcard" : "c-dropdown guestdropdown guestcard"}
            >
              {rooms.map((room, i) => (
                <div key={i}>
                  <div className="room-line">
                    <div className="room-heading">
                      <h6>Room {i + 1}</h6>
                      {i > 0 ? (
                        <button
                          className="btn btn__link"
                          onClick={(e) => {
                            e.preventDefault();
                            removeRoom(i);
                          }}
                        >
                          Delete
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="guestdropdown__card">
                      <h5>Adult</h5>
                      <div className="guestdropdown__count">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            subtractAdult(i);
                          }}
                        >
                          <img src="/images/minus.svg" alt="plus" />
                        </button>
                        {/* <input type="text" value={adultCount} /> */}
                        <p className="m-1 mx-2 text-sm text-border">{room.adults}</p>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            addAdult(i);
                          }}
                        >
                          <img src="/images/plus.svg" alt="plus" />
                        </button>
                      </div>
                    </div>
                    <div className="guestdropdown__card">
                      <h5>
                        Child<span>(0-11 Years)</span>
                      </h5>
                      <div className="guestdropdown__count">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            subtractChild(i);
                          }}
                        >
                          <img src="/images/minus.svg" alt="plus" />
                        </button>
                        {/* <input type="text" value="2" /> */}
                        <p className="m-1 mx-2 text-sm text-border">{room.children}</p>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            addChild(i);
                          }}
                        >
                          <img src="/images/plus.svg" alt="plus" />
                        </button>
                      </div>
                    </div>
                    <div className="d-flex select-child">
                      {room.children_age.map((age, index) => {
                        return (
                          <select
                            key={index}
                            value={String(age)}
                            onChange={(e) => {
                              const temp2 = +e.target.value;
                              setRooms((prev) => {
                                const temp = [...prev];
                                temp[i].children_age[index] = temp2;
                                return temp;
                              });
                            }}
                          >
                            <option value="0" disabled>
                              Child {index + 1} age
                            </option>

                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                          </select>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
              <div className="d-flex justify-content-between guest_rooms_count">
                <div className="guestdropdown__addrooms">
                  {rooms.length <= 3 ? (
                    <button
                      className="btn btn__link"
                      onClick={(e) => {
                        e.preventDefault();
                        addRoom();
                      }}
                    >
                      Add Rooms
                    </button>
                  ) : (
                    ""
                  )}
                </div>
                <div className="guestdropdown__addrooms">
                  <button
                    className="btn btn__link"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleGuest();
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Form.Group>
        <button className="btn btn__primary" type="submit">
          Search Hotels
        </button>
      </Form>
    </section>
  );
};

export default SearchHotels;
