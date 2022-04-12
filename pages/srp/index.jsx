/* eslint-disable react/no-find-dom-node */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/jsx-key */
/* eslint-disable prettier/prettier */

import { useState, useEffect } from "react";
import PageLayout from "../../components/layouts/pageLayout";
import SearchHotels from "../../components/pageComponents/hotelSearches/index.jsx";
import Footer from "../../components/pageComponents/footer/footer";
import HotelBookingCard from "../../components/pageComponents/hotelbookingCard";
import MobileHotelBookingCard from "../../components/pageComponents/hotelbookingCard/mobileIndex";
import HotelBookingCardSearch from "../../components/pageComponents/hotelBookingCardSearch";
import HotelFilter from "../../components/pageComponents/hotelFilters";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { ReactDOM } from "react-dom";
import Maps from "../../components/pageComponents/maps/newmaps";
import { useWindowSize } from "../../hooks/useWindowSize";
import { useRouter } from "next/router";
import { fetchDataWithAuth, fetchFormDataWithAuth } from "../../utils/apiHelper";
import { API_URL, getUrlParameter, NODE_API_URL } from "../../utils/helper";
import InfiniteScroll from "react-infinite-scroll-component";
import moment from "moment";
import ReactTooltip from "react-tooltip";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
const NewHotel = () => {

  // Use Form Validation for Modals 
  const {register,handleSubmit ,unregister  ,reset,formState: { errors }} = useForm();
  const [contactInfo,setContactInfo] = useState([])
  const router = useRouter();
  var url = new URL(API_URL + router.asPath);
  var params = new URLSearchParams(url.search);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // INFINITE SCROLL
  const [hasMore, setHasMore] = useState(true);
  const [incValue, setIncValue] = useState(50);
  const [datalen, setDataLen] = useState(0);
  const [totalData, setTotalData] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [totalHotels, setTotalHotels] = useState(0);
  const [fquery, setFquery] = useState("");
  const [iload, setIload] = useState(false);
  // Storing data for hotels
  const [filter, setFilter] = useState(false);
  const [style, setStyle] = useState({});
  const [percentage, setPercentage] = useState(0);
  const [intervalId, setIntervalId] = useState(0);
  const [dataPriced, setDataPriced] = useState([]);
  const [checkboxFilters, setCheckboxFilters] = useState({ updated: false });
  const [hotelPrice, setHotelPrice] = useState({});
  const [callHotel, setCallhotel] = useState(0);
  const [booking, setBooking] = useState({});
  const [hotelClicked, setHotelClicked] = useState(-1);
  const [initialCenter, setInitialCenter] = useState({ lat: 0, lng: 0 });
  const [filters, setFilterStatus] = useState(false);
  const [filtersStatus, setFiltersStatus] = useState(false);
  const [filteredStatus, setFilteredStatus] = useState(false);
  const [mview, setMview] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [city, setCity] = useState(params.get("city") || "");
  const [guest, setGuest] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [clearAllFunc, setClearAllFunc] = useState(0);
  const [adultCount, setadultCount] = useState(
    (params.get("adult") || "1")
      .split("_")
      .reduce((prev, count) => +prev + +count)
  );
  const [childCount, setchildCount] = useState(
    (params.get("child") || "0")
      .split("_")
      .reduce((prev, count) => +prev + +count, 0)
  );
  const [fromdate, setFromdate] = useState(
    params.get("checkin")
      ? new Date(params.get("checkin"))
      : moment().add(1, "days")
  );

  const [todate, setTodate] = useState(
    params.get("checkout")
      ? new Date(params.get("checkout"))
      : moment(fromdate).add(1, "days")._d
  );
  const [rooms, setRooms] = useState(
    Array.from({ length: +params.get("rooms") || 1 }).map((_, i) => {
      let children_age = ! (+params.get("child")?.split("_")[i] )? [] :
        (params
          .get("children_age")
          ?.split("_")
          ?.[i]?.split("-")
          .map((a) => +a) ||
        Array.from({
          length: +(params.get("child") || "0").split("_")[i] || 0,
        }).map((_) => 0));
      if (children_age[0] === null) {
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
  const [filteredValue, setFilteredValue] = useState([]);

  // LAZYLOAD DATA FOR INFINITE SCROLL
  const lazyloaddata = () => {
    // if (datalen >= totalHotels) {
    //   console.log("hasmore state", hasMore);
    //   setHasMore(false);
    // }
    // setTimeout(() => {
    //   setDataLen((prev) => prev + 20);
    // }, 500);
    console.log("Lazy Loading");

    let data = filteredStatus ? filteredValue : totalData;
    console.log(filteredStatus ? "true" : "false", data);
    if (!data || data.length <= 0) return;
    let currIncValue = incValue > data.length ? data.length + 1 : incValue + 1;

    if (incValue <= data.length) {
      setHasMore(true);
      // console.log("Has more", "true");
    } else {
      setHasMore(false);
      // console.log("Has more", "false");
    }

    if (!hasMore) return;
    setDisplayData(data.slice(0, currIncValue));
    setIncValue(incValue + 50);
  };

  // console.log(displayData);

  const filterData = () => {
    setFiltersStatus(true);
    // Generate Query
    let query = [];

    Object.entries(checkboxFilters).forEach(([key, value]) => {
      if (key === "cost" && value.length)
        query.push(
          `(${
            value[0]?.[0] || null
          }<=h.srp_info?.minRate && h.srp_info?.minRate<=${
            value[0]?.[1] || null
          })`
        );
      if (key === "rating" && value)
        query.push(`((h.reviews || [])[0]?.rate==${value})`);
      if (key === "facilities" && value.length)
        query.push(
          `(${JSON.stringify(
            value
          )}.every(val => (h.facilities || []).includes(val)))`
        );
      // if(key==="propertytypes" && value.length )
      //     query.push(`(${JSON.stringify(value)}.includes(h.propertyType))`)
      if (key === "stars" && value.length)
        query.push(`(${JSON.stringify(value)}.includes(h.starRating))`);
    });
    setFquery(query.join(" && "));

    // Filter totalData with Query
    // const temp = totalData.filter((h) => eval(query));
    // console.log("fullldata =>", temp);

    // Set data to display
    setDataLen(20);
    setTimeout(setFiltersStatus(false), 3000);
    // Code goes here with totalData.slice(0,20)
  };
  // useEffect(() => {
  //   window.scrollTo({ top: 0, behavior: "smooth" });

  //   filterData();
  // }, [checkboxFilters, filtersStatus]);
  // function HandleKey(id) {
  //   var node = document.getElementById("googlemaps" + id);
  //   const item = ReactDOM.findDOMNode(node);
  //   window.scrollTo({ top: item.offsetTop, behavior: "smooth" });
  // }

  const screenSize = useWindowSize();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(screenSize.width <= 991);
    // window.scrollTo({ top: 0, behavior: "smooth" });
  }, [screenSize]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (!loader && datalen > 0) {
      // if(intervalId){
      //   clearInterval(intervalId);
      //   setIntervalId(0);
      //   }
      setInitialLoad(true);
    } else {
      setInitialLoad(false);
    }
  }, [loader]);
  // useEffect(() => {
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // }, []);
  //Sorting Option open and close
  const [sortOpen, setSortOpen] = useState(false);

  // Setting map or list option view
  const [map, setMap] = useState(false);
  const isMap = () => {
    setMap(true);
    console.log("Entering");
  };
  const isList = () => {
    setMap(false);
  };

  //Mobile view of Cards
  const isMview = () => {
    setFilterStatus(false);
    setMview(true);
  };

  // Filter for mobiles
  const isFilter = () => {
    setFilterStatus(true);
    setMview(false);
  };

  // Sort By Option
  const [sort, setSort] = useState("Lowest Price");

  const sortOption = (id) => {
    let name = id ? "Highest Price" : "Lowest Price";
    setSort(name);
    let sortValue;
    let displaySortValue;
    let data = filteredStatus ? filteredValue : totalData;
    if (sort === "Highest Price") {
      displaySortValue = data.sort(
        (i, j) =>
          (i.srp_info?.minRate || Number.MAX_VALUE) -
          (j.srp_info?.minRate || Number.MAX_VALUE)
      );
      sortValue = totalData.sort(
        (i, j) =>
          (i.srp_info?.minRate || Number.MAX_VALUE) -
          (j.srp_info?.minRate || Number.MAX_VALUE)
      );

      // setData(totalData.slice(0, 20));
      // console.log("newLowData=>", data);
    }

    if (sort === "Lowest Price") {
      displaySortValue = data.sort(
        (i, j) =>
          (j.srp_info?.minRate || Number.MIN_VALUE) -
          (i.srp_info?.minRate || Number.MIN_VALUE)
      );
      sortValue = totalData.sort(
        (i, j) =>
          (j.srp_info?.minRate || Number.MIN_VALUE) -
          (i.srp_info?.minRate || Number.MIN_VALUE)
      );
    }
    setTotalData(sortValue);
    setDisplayData(displaySortValue.slice(0, 11));
    setIncValue(50);
    setHasMore(true);
  };

  const [sortLow, setSortLow] = useState(true);
  const sortMobile = () => {
    setSortLow(!sortLow);
    let sortValue;
    let displaySortValue;
    let data = filteredStatus ? filteredValue : totalData;
    if (sortLow) {
      sortValue = totalData.sort(
        (i, j) =>
          (j.srp_info?.minRate || Number.MIN_VALUE) -
          (i.srp_info?.minRate || Number.MIN_VALUE)
      );
      displaySortValue = data.sort(
        (i, j) =>
          (j.srp_info?.minRate || Number.MIN_VALUE) -
          (i.srp_info?.minRate || Number.MIN_VALUE)
      );
    } else {
      sortValue = totalData.sort(
        (i, j) =>
          (i.srp_info?.minRate || Number.MAX_VALUE) -
          (j.srp_info?.minRate || Number.MAX_VALUE)
      );
      displaySortValue = data.sort(
        (i, j) =>
          (i.srp_info?.minRate || Number.MAX_VALUE) -
          (j.srp_info?.minRate || Number.MAX_VALUE)
      );
    }
    setTotalData(sortValue);
    setDisplayData(displaySortValue.slice(0, 11));
    setIncValue(50);
    setHasMore(true);
  };

  const toggleSort = () => {
    setSortOpen(!sortOpen);
  };
  // console.log("parent component:",setCallhotel)

  useEffect(() => {
    const newIntervalId = setInterval(() => {
      setPercentage(percentage + 10);

      // const newStyle = {
      //   opacity: 1,
      //   width: `${percentage+10}%`
      // }
      // console.log("inside interval", percentage);
      // setStyle(newStyle);
    }, 1000);
    setIntervalId(newIntervalId);
  }, []);

  useEffect(() => {
    // console.log("percentage", percentage);
    const newStyle = {
      opacity: 1,
      width: percentage > 50 ? "600px" : `${percentage + 10}%`,
    };
    setStyle(newStyle);
  }, [percentage]);

  // CALL API
  const getHotels = async () => {
    try {
      // console.log("API CALL ");
      setIload(false);
      setTotalData([]);
      setDisplayData([]);
      setDataLoading(true);
      setDataLen(0);
      let q = router.query;
      const room_info = Array.from({ length: +q.rooms || 1 }).map((_, i) => {
        let children_age =
          (q.children_age
            ?.split("_")
            ?.[i] && q.children_age
            ?.split("_")
            ?.[i]?.split("-")
            .map((a) => +a)) ||
          Array.from({ length: +(q.child || "0").split("_")[i] || 0 }).map(
            (_) => 0
          );
        // console.log("ch age", children_age, q.children_age)
        if (children_age[0] === null) {
          children_age = [];
        }
        return {
          roomId: i + 1,
          adults: +(q.adult || "1").split("_")[i] || 1,
          children: +(q.child || "0").split("_")[i] || 0,
          children_age,
        };
      });
      // console.log("room_info", room_info)
      // Content data Fetch
      setLoader(true);
      setPercentage(20);
      let fdate = moment(params.get("checkin")).format("YYYY-MM-DD");
      let tdate = moment(params.get("checkout")).format("YYYY-MM-DD");

      const payload = {
        city: params.get("city"),
        from: 0,
        size: 2000,
        checkin: fdate,
        checkout: tdate,
        rooms: room_info,
      };

      const booking = {
        checkin: fdate,
        checkout: tdate,
        adults: adultCount,
        children: childCount,
        rooms: rooms.length,
      };
      setBooking(booking);
      setTimeout(setPercentage(50), 1500);


      const res = await fetchFormDataWithAuth(
        `${NODE_API_URL}/hotel/prices`,
        "POST",
        null,
        { "Content-Type": "application/json" },
        JSON.stringify(payload)
      );

      // localStorage.setItem("room_details", JSON.stringify(room_info));

      console.log("API FETCH ", res);
      setDataLoading(false);
      setPercentage(75);
      setSort("Lowest Price");
      setTotalHotels(res["data"].total_hotels);
      setTotalData(res["data"]["response"]);
      setDisplayData(res["data"]["response"].slice(0, 11));
      setHasMore(true);
      setDataLen(20);
      setPercentage(100);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setLoader(true);
      setLoader(false);
      setIload(true);
    } catch (error) {
       
      console.error("get hotel error=>", error);
    }
  };

  useEffect(() => {
    getHotels();
    setContactInfo(new Array(JSON.parse(localStorage.getItem('room_details'))?.length).fill(1))
    setadultCount(
      (params.get("adult") || "1")
        .split("_")
        .reduce((prev, count) => +prev + +count)
    );
    setchildCount(
      (params.get("child") || "1")
        .split("_")
        .reduce((prev, count) => +prev + +count)
    );
  }, [router, adultCount, childCount]);

  const multipleFilter = (array, filterArray) => {
    let returnStatement = false;
    filterArray.forEach((arr) => {
      if (array.includes(arr)) returnStatement = true;
    });
    return returnStatement;
  };

  useEffect(() => {
    console.log("checkboxFilters from filer=>",checkboxFilters)
    let { stars, facilities, cost, rating } = checkboxFilters;
    if (
      (facilities && facilities.length) ||
      rating ||
      (stars && stars.length > 0) ||
      (cost && cost.length > 0)
    ) {
      let data = [...totalData];
      data =
        facilities && facilities.length > 0
          ? data.filter((da) => multipleFilter(da.facilities, facilities))
          : data;
      data =
        cost && cost.length > 0
          ? data.filter((da) =>
              da.srp_info
                ? (parseInt(da.srp_info.minRate) +
                    parseInt(da.srp_info.govt_tax_amount)+ parseInt(da.srp_info.hotel_tax_amount)) >
                    parseInt(cost[0][0]) &&
                  (parseInt(da.srp_info.minRate) +
                    parseInt(da.srp_info.govt_tax_amount)+ parseInt(da.srp_info.hotel_tax_amount)) <
                    parseInt(cost[0][1])
                : false
            )
          : data;
      data = rating
        ? data.filter(
            (da) =>
              da.reviews &&
              da.reviews.length > 0 &&
              parseInt(da?.reviews[0]?.rate) == rating
          )
        : data;
      data =
        stars && stars.length > 0
          ? data.filter((da) =>
              da.starRating && stars.includes(da.starRating) ? true : false
            )
          : data;
      setFilteredValue(data);
      setTotalHotels(data.length);
      setDisplayData(data.slice(0, 10));
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIncValue(50);
      setFilteredStatus(true);
      setHasMore(true);
    } else {
      setFilteredValue([]);
      setFilteredStatus(false);
      setHasMore(true);
      setDisplayData(totalData.slice(0, 10));
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTotalHotels(totalData.length);
      setIncValue(50);
    }
  }, [checkboxFilters, filtersStatus, callHotel]);

  // Save Manual Booking In SRP 
  const onSubmit = async (data) => {
    // console.log(data)
    let tempData = {}
    for(let index=1;index<=contactInfo.length;index++){
      let flg={}
      flg['guest_name']=data['GuestName'+index]
      flg['guest_phone_number']=data['GuestPhone'+index]
      flg['guest_email']=data['GuestEmail'+index]
      flg['is_primary'] = true
      flg['is_adult'] = true
      tempData[index]=flg
    }
    let guest_room = [];
    for (let i = 1; i <= contactInfo.length ; i++) {
      guest_room.push([i.toString()]);
    }
    const body = {
      "hotel_name":data.HotelName,
      "city":params.get('city'),
      "check_in":moment(fromdate).format('YYYY-MM-DD'),
      "check_out":moment(todate).format('YYYY-MM-DD'),
      "rooms":JSON.parse(localStorage.getItem('room_details')),
      "guest_room":guest_room,
      "guest_detail":tempData,
    }
    // console.log(body)
    const response = await fetchDataWithAuth(`${NODE_API_URL}/manualBooking/create`,"POST",'',{'Content-Type':'application/json'},body)
    if (response.status){
      toast.success('Requesting Booking done')
      handleClose()
    }
    else{
      toast.error(response.message);
    }
  } 
  return (
    <PageLayout title="2hub | Hotels">
        {/* Modal for the Manual Booking */}
        <Modal className="" show={show}  onHide={handleClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header closeButton>
          <Modal.Title>Manual Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
      <div className="">
        <div className="">   


        {/* Hotel Name */}
        <Form.Group>
                    <Form.Label>Hotel Name</Form.Label>
                    <Form.Control 
                      type="text" 
                      className="srp-modal"
                      name={'HotelName'} 
                      id={'HotelName'} 
                      placeholder="Enter hotel name" 
                      {...register('HotelName', { required:true })} 
                    />
                    {errors['HotelName'] && (
                      <span className="text-danger mt-1">
                        *This is a required field
                      </span>
                    )}
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Destination</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={params.get("city")}
                      style={{background:'none'}}
                      className="srp-modal"
                      // name={'HotelName'} 
                      // id={'HotelName'} 
                      readOnly={true}
                      // placeholder="Enter hotel name" 
                      // {...register('HotelName', { required:true })} 
                    />
                    
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Check in-out</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={moment(fromdate).format('MMM DD')+" - "+moment(todate).format('MMM DD')}
                      style={{background:'none'}}
                      className="srp-modal"
                      // name={'HotelName'} 
                      // id={'HotelName'} 
                      readOnly={true}
                      // placeholder="Enter hotel name" 
                      // {...register('HotelName', { required:true })} 
                    />
                    
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Guest</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={(moment(todate).diff(moment(fromdate),'days')) +  ' nights, ' + adultCount +' adult ,' + childCount + ' children'}
                      style={{background:'none'}}
                      className="srp-modal"
                      // name={'HotelName'} 
                      // id={'HotelName'} 
                      readOnly={true}
                      // placeholder="Enter hotel name" 
                      // {...register('HotelName', { required:true })} 
                    />
                    
                  </Form.Group>
                  
          {/* guest form */}
          {
            contactInfo.map((info,index)=>{ 
              return (
                <div className="guest-details" key={index}>
                  <div className="clone-details">
                  <div className="clone-heading">
                    <p className="mb-2">Room {index+1} : Primary Guest *</p>
                  </div>
                  {/* {
                    info !==1 && (
                      <div className="clone-action-wrapper">
                        <div className="clone-action" onClick={()=>removeGuest(index)}>
                          <img src="/images/delete.png" />
                          <h4>Remove Guest</h4>
                        </div>
                      </div>
                  )} */}
                  </div>
                  <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control 
                      type="text" 
                      name={'GuestName'+(index+1)} 
                      id={'GuestName'+(index+1)} 
                      className="srp-modal"
                      placeholder="Enter your name" 
                      {...register('GuestName'+(index+1), { required:true })} 
                    />
                    {errors['GuestName'+(index+1)] && (
                      <span className="text-danger mt-1">
                        *This is a required field
                      </span>
                    )}
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control 
                      type="email" 
                      name={'GuestEmail'+(index+1)}
                      className="srp-modal" 
                      id={'GuestEmail'+(index+1)} 
                      placeholder="Enter your Email Address" 
                      {...register('GuestEmail'+(index+1), { required:true,pattern:/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/ })} 
                    />
                    {errors['GuestEmail'+(index+1)] && (
                      <span className="text-danger mt-1">
                        *This is a required field
                      </span>
                    )}
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Phone Number</Form.Label> 
                    <Form.Control 
                      type="tel" 
                      name={'GuestPhone'+(index+1)} 
                      className="srp-modal"
                      id={'GuestPhone'+(index+1)} 
                      placeholder="Enter your mobile number (Optional)" 
                      // required
                      minLength={10}
                      maxLength={10}
                      {...register('GuestPhone'+(index+1), {required:false , maxLength: 10 , minLength:10 })} 
                    />
                  </Form.Group>
                </div>
              )
            })
          }
         
        
        </div>
      </div>
      {/* <div className="booking-action-button">
        <button className="btn btn__primary cus-btn "  >Book Now</button>
      </div> */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>{handleClose();reset()}}>
            Close
          </Button>
          <Button variant="primary" type='submit' onClick={()=>{}}>
            Request Now
          </Button>
        </Modal.Footer>
      </form>
      </Modal>
        {/* End of Modal for Manual  */}
      {!isMobile && (
        <div className="desktop-view">
          <SearchHotels
            loader={loader}
            setLoader={setLoader}
            showSearch={showSearch}
            setShowSearch={setShowSearch}
            totalData={totalData}
            setTotalData={setTotalData}
            setHotelPrice={setHotelPrice}
            checkboxFilters={checkboxFilters}
            callHotel={callHotel}
            setCallhotel={setCallhotel}
            setBooking={setBooking}
            setTotalHotels={setTotalHotels}
            dataPriced={dataPriced}
            setDataPriced={setDataPriced}
            setPercentage={setPercentage}
            intervalId={intervalId}
            setIntervalId={setIntervalId}
            setFilter={setFilter}
          />
          <div className="hotelbooking__container">
            <div className="hotelbooking__left">
              <HotelFilter
                clearAllFunc={clearAllFunc}
                setCheckboxFilters={(val) => {
                  console.log("1", val);
                  setCheckboxFilters(val);
                }}
                setFilterStatus={(val) => {
                  console.log("2", val);
                  setFilterStatus(val);
                }}
                setCallhotel={(val) => {
                  console.log("3", val);
                  setCallhotel(val);
                }}
              />
            </div>
            <div className="hotelbooking__right">
              <div className="hotelbooking__resultfilter">
                <h5 style={{ fontWeight: 400 }}>
                  Showing{" "}
                  {
                    // data.filter((hotel) => {
                    //   return hotelPrice[hotel.hotelCode]?.srp_info?.minRate;
                    // }).length
                    filteredStatus ? filteredValue.length : totalData.length
                  }{" "}
                  results{" "}
                  {filtersStatus ? (
                    <Spinner animation="border" variant="dark" size="0.5" />
                  ) : (
                    ""
                  )}
                </h5>

                <div className="hotelbooking__resultfilter__right">
                <button className="mx-2 btn btn-primary" onClick={()=>{ window.open(`/bookingnew?checkin=${getUrlParameter('checkin')}&checkout=${getUrlParameter('checkout')}&adult=${getUrlParameter('adult')}&child=${getUrlParameter('child')}&rooms=${getUrlParameter('rooms')}&type=ManualBooking&city=${city}`,"_blank")}} >Hotel Not Found</button>
                  <div className="hotelbooking__sortby">
                    <span>Sort by : &nbsp;</span>
                    <div className="common-selectbox" onClick={toggleSort}>
                      <span style={{cursor:"pointer"}}>
                        {sort}
                        <svg
                          width="10"
                          height="6"
                          viewBox="0 0 10 6"
                          fill="none"
                        >
                          <path
                            d="M1 1L5 5L9 1"
                            stroke="#F36B25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <div
                        className={
                          sortOpen
                            ? "c-dropdown is-open searchdropdown"
                            : "c-dropdown searchdropdown"
                        }
                      >
                        <ul className="list-unstyled" onClick={toggleSort}>
                          <li onClick={() => sortOption(1)}>Highest Price </li>
                          <li onClick={() => sortOption(0)}>Lowest Price </li>
                          {/* <li onClick={() => sortOption("Top Reviewed")}>Top Reviewed</li> */}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>

              {!dataLoading && (
                <InfiniteScroll
                  dataLength={displayData.length} //This is important field to render the next data
                  next={lazyloaddata}
                  hasMore={hasMore}
                  loader={<h4><Spinner/></h4>}
                  scrollableTarget="scrollableDiv"
                  endMessage={
                    <p style={{ textAlign: "center" }}>
                      <b>Yay! You have seen it all</b>
                    </p>
                  }
                >
                  {displayData.map((hotel, index) => {
                    // if(index===1){
                    //   setLoader(false)
                    // }
                    //  if (totalData.filter(h=>fquery?eval(fquery):true).length<1)
                    return (
                      <HotelBookingCard
                        data={hotel}
                        expand
                        room_count={params.get("rooms") || "NA"}
                        name={hotel.name}
                        city={hotel.city}
                        img_url={hotel.images}
                        source={hotel?.hotel_source}
                        promoted={false}
                        no_imgs={hotel.images_length}
                        star={
                          hotel.category
                            ? hotel.category
                            : parseInt(hotel.starRating)
                        }
                        rating={hotel?.reviews ? hotel.reviews[0]?.rate : 0}
                        no_of_days={hotel?.srp_info?.days}
                        room_type={hotel?.room_type ? hotel.room_type : "NA"}
                        perdayprice={
                          hotel?.srp_info?.perDayPrice.toLocaleString(
                            "en-IN"
                          ) || "NA"
                        }
                        netPayable={
                          hotel?.srp_info?.minRate.toLocaleString("en-IN") ||
                          "NA"
                        }
                        marginRate={
                          hotel?.srp_info?.margin > 0
                            ? hotel?.srp_info?.margin.toLocaleString("en-IN")
                            : 0
                        }
                        perdaytax={hotel?.srp_info?.perDayTax || 0}
                        totaltax={hotel?.srp_info?.totalTax || 0}
                        facility={hotel.facilities}
                        // cancellation={hotel.rooms[0]?.rates[0]?.cancellation? true:false}
                        safety={false}
                        booking={booking}
                        url={hotel?.hotelCode}
                        setHotelClicked={setHotelClicked}
                        hotelClicked={hotelClicked}
                        agents_margin={hotel?.srp_info?.agent_margin || "NA"}
                        id={index}
                        key={index}
                      />
                    );
                  })}
                </InfiniteScroll>
              )}

              {loader ? (
                <div className="align-self-center mt-5">
                  {initialLoad ? (
                    <>
                      {/* <h6>Loading Data</h6>
                          <br />
                          <br />
                          <div className="ml-4">
                            <Spinner animation="grow" />
                          </div> */}
                    </>
                  ) : (
                    <>
                      <div className="progress">
                        <div className="progress-done" style={style}></div>
                      </div>
                      <br />
                      <br />
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        {filter ? (
                          <span>
                            {percentage < 50
                              ? "Filtering hotels..."
                              : percentage > 75
                              ? "Filtering hotels..."
                              : "Filtering results..."}
                          </span>
                        ) : (
                          <span>
                            {percentage < 50
                              ? "Looking for hotels..."
                              : percentage > 75
                              ? "Rendering results..."
                              : "Getting latest rates..."}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      )}
      {/* mobile view */}
      {isMobile && (
        <div className="mobile-view mt-5 pt-3">
          {/* search view */}
          <div style={{ display: showSearch ? "block" : "none" }}>
            {isMobile ? (
              <SearchHotels
                loader={loader}
                setLoader={setLoader}
                setHotelPrice={setHotelPrice}
                totalData={totalData}
                setTotalData={setTotalData}
                checkboxFilters={checkboxFilters}
                callHotel={callHotel}
                setCallhotel={setCallhotel}
                setBooking={setBooking}
                showSearch={showSearch}
                setShowSearch={setShowSearch}
                setTotalHotels={setTotalHotels}
                dataPriced={dataPriced}
                setDataPriced={setDataPriced}
                setPercentage={setPercentage}
                intervalId={intervalId}
                setIntervalId={setIntervalId}
                setFilter={setFilter}
              />
            ) : (
              ""
            )}
          </div>
          {/* details view */}
          {/* m_active to activate card views */}
          <div
            className={
              !filters && !showSearch
                ? "detail-view-wrapper m_active"
                : "detail-view-wrapper "
            }
          >
            {/* selceted details wrapper */}
            <div
              className="selected-details-wrapper"
              onClick={() => {
                setShowSearch(true);
              }}
            >
              <div className="selected-details-content">
                <div className="selected-location">
                  <span>
                    {" "}
                    <img src="/images/location.svg" />{" "}
                  </span>
                  <label>{params.get("city") || "NA"}</label>
                </div>
                <div className="selected-details">
                  <ul>
                    <li>
                      <div className="d-flex justify-content-between w-100">
                        <div className="d-flex justify-content-between">
                          <span>
                            {" "}
                            <img src="/images/search-calender.svg" />{" "}
                          </span>
                          <label>
                            {moment(params.get("checkin")).format("MMM DD")} -{" "}
                            {moment(params.get("checkout")).format("MMM DD")}{" "}
                          </label>
                        </div>

                        <div style={{ fontSize: "13px" }}>
                          {moment(todate).diff(moment(fromdate), "days")}-
                          {moment(todate).diff(moment(fromdate), "days") === 1
                            ? "Night"
                            : "Nights"}
                        </div>
                      </div>
                    </li>
                    <br />
                    <li>
                      <span>
                        {" "}
                        <img src="/images/guest.svg" />{" "}
                      </span>
                      <label>
                        {" "}
                        {booking.adults} adults, {booking.children} children,{" "}
                        {params.get("rooms") || "NA"} rooms{" "}
                      </label>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* card & map view wrapper */}

            <div className="details-card-container ">
              {/* filter floating section */}
              <div className="d-flex justify-content-start ml-3 mt-3 mb-0">
                <div className="filter__cards" onClick={isFilter}>
                  <svg
                    width="11"
                    height="12"
                    viewBox="0 0 11 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.16674 1.33325H9.8334C9.92942 1.36692 10.0164 1.42213 10.0878 1.49463C10.1592 1.56713 10.2131 1.65501 10.2452 1.75153C10.2774 1.84806 10.2871 1.95066 10.2735 2.0515C10.2598 2.15233 10.2233 2.24871 10.1667 2.33325L6.8334 5.99992V10.6666L4.16674 8.66659V5.99992L0.833405 2.33325C0.776799 2.24871 0.740295 2.15233 0.72669 2.0515C0.713085 1.95066 0.72274 1.84806 0.754914 1.75153C0.787089 1.65501 0.84093 1.56713 0.912313 1.49463C0.983696 1.42213 1.07073 1.36692 1.16674 1.33325Z"
                      stroke="#F36B25"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <label>Filter ({totalHotels} results)</label>
                </div>
                {/* second */}
                <div className="filter__cards" onClick={sortMobile}>
                  <svg
                    width="13"
                    height="12"
                    viewBox="0 0 13 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.5 3.99992L3.16667 1.33325M3.16667 1.33325L5.83333 3.99992M3.16667 1.33325V10.6666M12.5 7.99992L9.83333 10.6666M9.83333 10.6666L7.16667 7.99992M9.83333 10.6666V1.33325"
                      stroke="#F36B25"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <label>Sort</label>
                </div>
              </div>

              {!map ? (
                <>
                  {/* card view */}
                  <div className="card-tab-wrapper">
                    <div className="view-result">
                      <h1>Showing {filteredStatus ? filteredValue.length : totalData.length} results</h1>
                    </div>
                    <div className="card-view-wrappers">
                      {!datalen > 0 ? (
                        <div className="text-center mt-5">
                          <h6>Loading Data</h6>
                          <br />
                          <br />
                          <div className="ml-4">
                            <Spinner animation="grow" />
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                      <InfiniteScroll
                        dataLength={displayData.length} //This is important field to render the next data
                        next={lazyloaddata}
                        hasMore={hasMore}
                        // loader={<h4>Loading...</h4>}
                        scrollableTarget="scrollableDiv"
                        endMessage={
                          <p style={{ textAlign: "center" }}>
                            <b>Yay! You have seen it all</b>
                          </p>
                        }
                      >
                        {displayData.map((hotel, index) => {
                          // if(index===1){
                          //   setLoader(false)
                          // }
                          //  if (totalData.filter(h=>fquery?eval(fquery):true).length<1)
                          return (
                            <HotelBookingCard
                              data={hotel}
                              expand
                              room_count={params.get("rooms") || "NA"}
                              name={hotel.name}
                              city={hotel.city}
                              img_url={hotel.images}
                              source={hotel?.hotel_source}
                              promoted={false}
                              no_imgs={hotel.images_length}
                              star={
                                hotel.category
                                  ? hotel.category
                                  : parseInt(hotel.starRating)
                              }
                              rating={
                                hotel?.reviews ? hotel.reviews[0]?.rate : 0
                              }
                              no_of_days={hotel?.srp_info?.days}
                              room_type={
                                hotel?.room_type ? hotel.room_type : "NA"
                              }
                              perdayprice={
                                hotel?.srp_info?.perDayPrice.toLocaleString(
                                  "en-IN"
                                ) || "NA"
                              }
                              netPayable={
                                hotel?.srp_info?.minRate.toLocaleString(
                                  "en-IN"
                                ) || "NA"
                              }


                              marginRate={
                                hotel?.srp_info?.margin > 0
                                  ? hotel?.srp_info?.margin.toLocaleString(
                                      "en-IN"
                                    )
                                  : 0
                              }
                              perdaytax={hotel?.srp_info?.perDayTax || 0}
                              totaltax={hotel?.srp_info?.totalTax || 0}
                              facility={hotel.facilities}
                              // cancellation={hotel.rooms[0]?.rates[0]?.cancellation? true:false}
                              safety={false}
                              booking={booking}
                              url={hotel?.hotelCode}
                              setHotelClicked={setHotelClicked}
                              hotelClicked={hotelClicked}
                              agents_margin={
                                hotel?.srp_info?.agent_margin || "NA"
                              }
                              id={index}
                              key={index}
                            />
                          );
                        })}
                      </InfiniteScroll>
                    </div>
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
          </div>
          {/* filter */}
          {/* m_Active for filters */}
          <div className={filters ? "mobile-filter m_active" : "mobile-filter"}>
            {isMobile ? (
              <HotelFilter
                setCheckboxFilters={setCheckboxFilters}
                setCallhotel={setCallhotel}
                setFilterStatus={setFilterStatus}
              />
            ) : (
              ""
            )}
          </div>
          <a id="back-to-top" href="#">
            <img
              src="data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' aria-labelledby='title' aria-describedby='desc' role='img' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3EAngle Up%3C/title%3E%3Cdesc%3EA line styled icon from Orion Icon Library.%3C/desc%3E%3Cpath data-name='layer1' fill='none' stroke='%23202020' stroke-miterlimit='10' stroke-width='2' d='M20 40l11.994-14L44 40' stroke-linejoin='round' stroke-linecap='round'%3E%3C/path%3E%3C/svg%3E"
              alt="Angle Up"
            />
          </a>
          <style jsx>{`
            #back-to-top {
              height: 50px;
              width: 50px;
              position: fixed;
              bottom: 0;
              right: 0;
              z-index: 99;

              border-radius: 50%;
              box-shadow: 0px 0px 5px #ccc;
              margin: 17px;
              background: white;
            }

            html {
              scroll-behavior: smooth;
            }
          `}</style>
        </div>
      )}
      <Footer id="footer" />
    </PageLayout>
  );
};

export default NewHotel;
