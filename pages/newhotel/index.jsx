/* eslint-disable react/no-find-dom-node */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/jsx-key */
/* eslint-disable prettier/prettier */

import { useState, useEffect } from "react";
import PageLayout from "../../components/layouts/pageLayout";
import SearchHotels from "../../components/pageComponents/hotelSearches/index.jsx";
import Footer from "../../components/pageComponents/footer/footer";
import HotelBookingCard from "../../components/pageComponents/hotelbookingCard";
import HotelBookingCardSearch from "../../components/pageComponents/hotelBookingCardSearch";
import HotelFilter from "../../components/pageComponents/hotelFilters";
import { Spinner } from "react-bootstrap";
import { ReactDOM } from "react-dom";
import Maps from "../../components/pageComponents/maps/newmaps";
import { useWindowSize } from "../../hooks/useWindowSize";
import { useRouter } from "next/router";
import { fetchFormDataWithAuth } from "../../utils/apiHelper";
import { API_URL, NODE_API_URL } from "../../utils/helper";
import InfiniteScroll from "react-infinite-scroll-component";
import moment from "moment";
import ReactTooltip from "react-tooltip";


const NewHotel = () => {
  const router  = useRouter();
  var url = new URL(API_URL + router.asPath);
  var params = new URLSearchParams(url.search);
  // INFINITE SCROLL
  const [hasMore, setHasMore] = useState(true);
  const [datalen, setDataLen] = useState(0);
  const [totalData, setTotalData] = useState([]);
  const [totalHotels, setTotalHotels] = useState(0);
  const [fquery,setFquery]=useState("")
  const [iload,setIload]=useState(false)
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
  const [mview, setMview] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [city, setCity] = useState(params.get("city") || "");
  const [guest, setGuest] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false);
  const [adultCount, setadultCount] = useState(
    (params.get("adult") || "1").split("_").reduce((prev, count) => +prev + +count)
  );
  const [childCount, setchildCount] = useState(
    (params.get("child") || "0").split("_").reduce((prev, count) => +prev + +count)
  );
  const [fromdate, setFromdate] = useState(
    params.get("checkin") ? new Date(params.get("checkin")) : moment().add(1, "days")
  );

  const [todate, setTodate] = useState(
    params.get("checkout") ? new Date(params.get("checkout")) : moment(fromdate).add(1, "days")._d
  );
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


  // LAZYLOAD DATA FOR INFINITE SCROLL
    const lazyloaddata =()=>{
      if (datalen >= totalHotels) {
        console.log("hasmore state",hasMore)
        setHasMore(false)
      }
      setTimeout(()=>{
        setDataLen((prev)=>prev+20)
      },500)
    }

  const filterData = () => {
     setFiltersStatus(true)
    // Generate Query
    let query = [];

    Object.entries(checkboxFilters).forEach(([key, value]) => {
      if (key === "cost" && value.length)
        query.push(`(${value[0]?.[0] || null}<=h.srp_info?.minRate && h.srp_info?.minRate<=${value[0]?.[1] || null})`);
      if (key === "rating" && value) query.push(`((h.reviews || [])[0]?.rate==${value})`);
      if (key === "facilities" && value.length)
        query.push(`(${JSON.stringify(value)}.every(val => (h.facilities || []).includes(val)))`);
      // if(key==="propertytypes" && value.length )
      //     query.push(`(${JSON.stringify(value)}.includes(h.propertyType))`)
      if (key === "stars" && value.length) query.push(`(${JSON.stringify(value)}.includes(h.starRating))`);
    });
    setFquery(query.join(" && "));

    
    // Filter totalData with Query
    // const temp = totalData.filter((h) => eval(query));
    // console.log("fullldata =>", temp);

    // Set data to display
    setDataLen(20);
    setTimeout(setFiltersStatus(false),3000)
    // Code goes here with totalData.slice(0,20)
  };
  useEffect(() => {
    
    window.scrollTo({ top: 0, behavior: "smooth" });

    filterData();
    
  }, [checkboxFilters,filtersStatus]);
  function HandleKey(id) {
    var node = document.getElementById("googlemaps" + id);
    const item = ReactDOM.findDOMNode(node);
    window.scrollTo({ top: item.offsetTop, behavior: "smooth" });
  }

  const screenSize = useWindowSize();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(screenSize.width <= 991);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
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
  const sortOption = (name) => {
    setSort(name);
    if (sort === "Highest Price") {
      setTotalData(
        totalData.sort((i, j) => (i.srp_info?.minRate || Number.MAX_VALUE) - (j.srp_info?.minRate || Number.MAX_VALUE))
      );
      // setData(totalData.slice(0, 20));
      console.log("newLowData=>", data);
    }

    if (sort === "Lowest Price") {
      setTotalData(
        totalData.sort((i, j) => (j.srp_info?.minRate || Number.MIN_VALUE) - (i.srp_info?.minRate || Number.MIN_VALUE))
      );
      
      
    }
  };
const [sortLow,setSortLow]=useState(true)
  const sortMobile = () => {
    setSortLow(!sortLow)
  
    if (sortLow) {
      setTotalData(
        totalData.sort((i, j) => (j.srp_info?.minRate || Number.MIN_VALUE) - (i.srp_info?.minRate || Number.MIN_VALUE))
      );
  }
    else {
      setTotalData(
        totalData.sort((i, j) => (i.srp_info?.minRate || Number.MAX_VALUE) - (j.srp_info?.minRate || Number.MAX_VALUE))
      );
  }
    
  

}
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
    
   try{
     console.log("API CALL ");
    setIload(false)
    setTotalData([]);

    setDataLen(0);
    let q=router.query;
    const room_info= Array.from({ length: +q.rooms || 1 }).map((_, i) => {
      let children_age =
        q.children_age
          ?.split("_")
          ?.[i]?.split("-")
          .map((a) => +a) || Array.from({ length: +(q.child || "0").split("_")[i] || 0 }).map((_) => 0);
      if (children_age[0] === 0) {
        children_age = [];
      }
      return {
        roomId: i + 1,
        adults: +(q.adult || "1").split("_")[i] || 1,
        children: +(q.child || "0").split("_")[i] || 0,
        children_age,}})
    // Content data Fetch
    setLoader(true);
    setPercentage(20);
    let fdate = moment(fromdate).format("YYYY-MM-DD");
    let tdate = moment(todate).format("YYYY-MM-DD");

    const payload = {
      city: router.query.city,
      from: 0,
      size: 2000,
      checkin: fdate,
      checkout: tdate,
      rooms: rooms,
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
    
    console.log("ABOVE ")
    
    const res = await fetchFormDataWithAuth(
      `${NODE_API_URL}/hotel/prices`,
      "POST",
      null,
      { "Content-Type": "application/json" },
      JSON.stringify(payload)
    );

    console.log("API FETCH ",res);
    setPercentage(75);
    setTotalHotels(res["data"].total_hotels);
    setTotalData(res["data"]["response"]);
    console.log("total data=>", res["data"]["response"]);
    setDataLen(20)
    setPercentage(100);
    setLoader(true);
    setLoader(false);
     setIload(true);
   } 
   catch(error){
    console.error("get hotel error=>",error)
   }
  };

  useEffect(() => {

    console.log("functioncallbefore")
        getHotels();
    console.log("functioncallafter")
  }, [router]);

  return (
    <PageLayout title="2hub | Hotels">
      {!isMobile ? (
        <div className="desktop-view">
          {!isMobile ? (
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
          ) : (
            ""
          )}
          <div className="hotelbooking__container">
            <div className="hotelbooking__left">
              {!isMobile ? <HotelFilter setCheckboxFilters={setCheckboxFilters} 
                setFilterStatus={setFilterStatus} setCallhotel={setCallhotel} /> : ""}
            </div>
            <div className="hotelbooking__right">
              <div className="hotelbooking__resultfilter">
                <h5 style={{ fontWeight: 400 }}>
                  Showing{" "}
                  {
                    // data.filter((hotel) => {
                    //   return hotelPrice[hotel.hotelCode]?.srp_info?.minRate;
                    // }).length
                    totalHotels
                  }{" "}
                  results 
                  {" "}{" "}
                  {filtersStatus ? (<Spinner animation="border" variant="dark" size="0.5" />) : ""}
                </h5>
                

                <div className="hotelbooking__resultfilter__right">
                  <div className="hotelbooking__sortby">
                    <span>Sort by : &nbsp;</span>
                    <div className="common-selectbox" onClick={toggleSort}>
                      <span>
                        {sort}
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                          <path d="M1 1L5 5L9 1" stroke="#F36B25" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <div className={sortOpen ? "c-dropdown is-open searchdropdown" : "c-dropdown searchdropdown"}>
                        <ul className="list-unstyled" onClick={toggleSort}>
                          <li onClick={() => sortOption("Highest Price")}>Highest Price </li>
                          <li onClick={() => sortOption("Lowest Price")}>Lowest Price </li>
                          {/* <li onClick={() => sortOption("Top Reviewed")}>Top Reviewed</li> */}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {!map ? (
                <>
                  {/* List View */}

                  {/* {data.sort((a,b)=>{
                  return (hotelPrice[a.hotelCode]?.srp_info?.minRate)?-1:1
                  
                })? (
                */}
                  <InfiniteScroll
                    dataLength={datalen}
                    hasMore={hasMore}
                    next={lazyloaddata}
                    loader={
                      iload?
                        (<div className="d-flex justify-content-center align-item-center mt-5">
                        <h6>Loading Data</h6>
                        <br />
                        <br />
                        <div className="ml-4">
                          <Spinner animation="grow" />
                        </div>
                      </div>): (<></>) 
                    }
                  >
                  {totalData.filter(h=>fquery?eval(fquery):true).slice(0,datalen+1).map((hotel, index) => {
                    // if(index===1){
                    //   setLoader(false)
                    // }
                    //  if (totalData.filter(h=>fquery?eval(fquery):true).length<1)
                    return (
                      <div key={index} id={"googlemaps" + index}>
                        <HotelBookingCard
                          data={hotel}
                          expand
                          name={hotel.name}
                          city={hotel.city}
                          img_url={hotel.images}
                          source={hotel?.hotel_source}
                          promoted={false}
                          no_imgs={hotel.images_length}
                          star={hotel.category ? hotel.category : parseInt(hotel.starRating)}
                          rating={hotel?.reviews ? hotel.reviews[0]?.rate : 0}
                          no_of_days={hotel?.srp_info?.days}
                          room_type={hotel?.room_type ? hotel.room_type: "NA"}
                          perdayprice={hotel?.srp_info?.perDayPrice.toLocaleString("en-IN") || "NA"}
                          netPayable={hotel?.srp_info?.minRate.toLocaleString("en-IN") || "NA"}
                          marginRate={hotel?.srp_info?.margin > 0 ? hotel?.srp_info?.margin.toLocaleString("en-IN") : 0}
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
                        />
                      </div>
                    );
                    return (<>
                       
                    </>
                    );
                  })}
                    </InfiniteScroll>

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
                          <div style={{ display: "flex", justifyContent: "center" }}>
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

                  
                      {totalHotels < 1 && !loader ? (
                        <div className="nodata-found">
                          <img src="/images/nodatafound.svg" />
                          <h5>No Data Found</h5>
                          <p>Please change your search filter & try again</p>
                        </div>
                      ) : (
                        ""
                      )}
                   

                  {/* <HotelBookingCard expand name="Capital O 74658 Nandhana Vistaa" city="Bangalore" img_url="/images/hotel1.png" promoted={true} no_imgs="12" star={4} rating={3.2} breakfast={true} rackRate="13,300" netPayable="12,700" marginRate="12,900" perNightRate="3,000" facility={["AC","Flexible Check-In", "Couple Friendly", "City View", "Parking", "Wifi", "Swimming Pool", "Spa"]} />
                <HotelBookingCard expand name="Test Hotel 1" city="Bangalore" img_url="/images/hotel1.png" promoted={true} no_imgs="12" star={4} rating={4} breakfast={true} rackRate="13,300" netPayable="12,700" marginRate="12,900" perNightRate="3,000" facility={["AC","Flexible Check-In", "Couple Friendly", "City View", "Parking", "Wifi", "Swimming Pool", "Spa"]} />
                <HotelBookingCard expand name="Test hotel 2" city="Bangalore" img_url="/images/hotel1.png" promoted={true} no_imgs="12" star={4} rating={2.3} breakfast={true} rackRate="13,300" netPayable="12,700" marginRate="12,900" perNightRate="3,000" facility={["AC","Flexible Check-In", "Couple Friendly", "City View", "Parking", "Wifi", "Swimming Pool", "Spa"]} />  */}
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      {/* mobile view */}
      {isMobile ? (
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
          <div className={!filters && !showSearch ? "detail-view-wrapper m_active" : "detail-view-wrapper "}>
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
                      <span>
                        {" "}
                        <img src="/images/search-calender.svg" />{" "}
                      </span>
                      <label>
                        {params.get("checkin")?.slice(5, 10) || "NA"} - {params.get("checkout")?.slice(5, 10) || "NA"}{" "}
                      </label>
                    </li>
                    <br />
                    <li>
                      <span>
                        {" "}
                        <img src="/images/guest.svg" />{" "}
                      </span>
                      <label>
                        {" "}
                        {booking.adults} adults {booking.children} children {params.get("rooms") || "NA"} rooms{" "}
                      </label>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* card & map view wrapper */}

            <div className="details-card-container ">
              {/* filter floating section */}
              <div className="filter__cards_wrapper">
                <div className="filter__cards" onClick={isFilter}>
                  <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M1.16674 1.33325H9.8334C9.92942 1.36692 10.0164 1.42213 10.0878 1.49463C10.1592 1.56713 10.2131 1.65501 10.2452 1.75153C10.2774 1.84806 10.2871 1.95066 10.2735 2.0515C10.2598 2.15233 10.2233 2.24871 10.1667 2.33325L6.8334 5.99992V10.6666L4.16674 8.66659V5.99992L0.833405 2.33325C0.776799 2.24871 0.740295 2.15233 0.72669 2.0515C0.713085 1.95066 0.72274 1.84806 0.754914 1.75153C0.787089 1.65501 0.84093 1.56713 0.912313 1.49463C0.983696 1.42213 1.07073 1.36692 1.16674 1.33325Z"
                      stroke="#808080"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <label>
                    Filter (
                    {
                      totalHotels
                    }{" "}
                    results)
                  </label>
                </div>
                {/* second */}
                <div className="filter__cards" onClick={sortMobile}>
                  <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M0.5 3.99992L3.16667 1.33325M3.16667 1.33325L5.83333 3.99992M3.16667 1.33325V10.6666M12.5 7.99992L9.83333 10.6666M9.83333 10.6666L7.16667 7.99992M9.83333 10.6666V1.33325"
                      stroke="#808080"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <label>Sort</label>
                </div>
                {/* 3rd */}
                {/* <div className="filter__cards filter__switch_view">
                  <div onClick={isList}>
                    <svg  width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="20" height="20" rx="2" fill="#fff"/>
                      <path d="M8.00016 6H15.3335M8.00016 10H15.3335M8.00016 14H15.3335M5.3335 6V6.00667M5.3335 10V10.0067M5.3335 14V14.0067" stroke="#808080" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  
                
                <div onClick={isMap}>

                  <svg  width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="20" height="20" rx="2" fill="#fff"/>
                    <path d="M8 4.66675L4 6.66675V15.3334L8 13.3334M8 4.66675L12 6.66675M8 4.66675V13.3334M12 6.66675L16 4.66675V13.3334L12 15.3334M12 6.66675V15.3334M12 15.3334L8 13.3334" stroke="#808080" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div> */}
              </div>

              {
                !map ? (
                  <>
                    {/* card view */}
                    <div className="card-tab-wrapper">
                      <div className="view-result">
                        <h1>
                          Showing{" "}
                          {
                            totalHotels
                          }{" "}
                          results
                        </h1>
                      </div>
                      <div className="card-view-wrappers">
                        {!datalen > 0 ? (
                          <div className="align-self-center mt-5">
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
                    dataLength={datalen}
                    hasMore={hasMore}
                    next={lazyloaddata}
                    loader={
                      iload?
                        (<div className="d-flex justify-content-center align-item-center mt-5">
                        <h6>Loading Data</h6>
                        <br />
                        <br />
                        <div className="ml-4">
                          <Spinner animation="grow" />
                        </div>
                      </div>): (<></>) 
                    }
                  >
                  {totalData.filter(h=>fquery?eval(fquery):true).slice(0,datalen+1).map((hotel, index) => {
                    // if(index===1){
                    //   setLoader(false)
                    // }
                    //  if (totalData.filter(h=>fquery?eval(fquery):true).length<1)
                    return (
                      <div key={index} id={"googlemaps" + index}>
                        <HotelBookingCard
                          data={hotel}
                          expand
                          name={hotel.name}
                          city={hotel.city}
                          img_url={hotel.images}
                          source={hotel?.hotel_source}
                          promoted={false}
                          no_imgs={hotel.images_length}
                          star={hotel.category ? hotel.category : parseInt(hotel.starRating)}
                          rating={hotel?.reviews ? hotel.reviews[0]?.rate : 0}
                          no_of_days={hotel?.srp_info?.days}
                          room_type={hotel?.room_type ? hotel.room_type: "NA"}
                          perdayprice={hotel?.srp_info?.perDayPrice.toLocaleString("en-IN") || "NA"}
                          netPayable={hotel?.srp_info?.minRate.toLocaleString("en-IN") || "NA"}
                          marginRate={hotel?.srp_info?.margin > 0 ? hotel?.srp_info?.margin.toLocaleString("en-IN") : 0}
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
                        />
                      </div>
                    );
                    return (<>
                       
                    </>
                    );
                  })}
                    </InfiniteScroll>

                       
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )
                //              (
                //               <>
                //               {/* map view */}
                //               <div className="map-tab-wrapper m_active">
                //                 <div className="map-view ">
                //                   <Maps data={data} initialCenter={initialCenter} price={hotelPrice} clicked={hotelClicked} HandleKey={HandleKey} disableDefaultUI={true}/>
                //                 </div>
                //                 <div className="mapcard-view-wrappers ">
                //                 {data.map((hotel,index)=>{
                //                   if(hotelPrice[hotel.hotelCode]?.srp_info?.minRate)

                //                   return(
                //                     <div id={'googlemaps'+index}>
                //                   <HotelBookingCard

                //                     name={hotel.name}
                //                       city={hotel.city}
                //                       img_url={hotel.images[0]}
                //                       promoted={false}
                //                       no_imgs={hotel.images.length}
                //                       star={hotel.category? hotel.category : parseInt(hotel.starRating)}
                //                       rating={hotelPrice[hotel.hotelCode]?.reviews ? hotelPrice[hotel.hotelCode].reviews[0]?.rate : 0}
                //                       no_of_days={hotelPrice[hotel.hotelCode]?.srp_info?.days}
                //                       rackRate={hotelPrice[hotel.hotelCode]?.srp_info?.bar.toLocaleString('en-IN') || "NA"}
                //                       netPayable={hotelPrice[hotel.hotelCode]?.srp_info?.minRate.toLocaleString('en-IN') || "NA"}
                //                       marginRate={hotelPrice[hotel.hotelCode]?.srp_info?.margin.toLocaleString('en-IN') > 0? hotelPrice[hotel.hotelCode]?.srp_info?.margin :0}
                //                       perNightRate={hotelPrice[hotel.hotelCode]?.srp_info?.perNight || "NA"}
                //                       facility={hotel.facilities}
                //                       // cancellation={hotel.rooms[0]?.rates[0]?.cancellation? true:false}
                //                       safety={false}
                //                       booking={booking}
                //                       url={hotel.hotelCode}
                //                       setHotelClicked={setHotelClicked}
                //                       hotelClicked={hotelClicked}
                //                       id={index}
                //                   />
                //                   </div>
                //                   )
                //                   return(<>

                //                   </>)

                //                 })}

                //                 {datalen>0 ? (
                //                               <div className="d-flex align-self-center mt-5">
                //                                 <div className="loadmore-btncenter">
                //                                     <button className="btn btn__outline__gray" onClick={(e)=>{
                //                                       setCallhotel((prev)=>(prev+1))
                //                                       console.log("loadmorre",callHotel)
                //                                     }}>Load hasMore</button>
                //                                   </div>
                //                               </div>
                //                             ):""}
                // {/*
                //                   <HotelBookingCard name="Capital O 74658901 - Nandhana Vistaa Gcc Northside" city="Bangalore" img_url="/images/hotel1.png" promoted={true} no_imgs="12" star={4} rating={2.3} breakfast={true} rackRate="13,300" netPayable="12,700" marginRate="12,900" perNightRate="3,000" facility={["AC","Flexible Check-In", "Couple Friendly", "City View", "Parking", "Wifi", "Swimming Pool", "Spa"]} />
                //                   <HotelBookingCard name="Capital O 74658901 - Nandhana Vistaa Gcc Northside" city="Bangalore" img_url="/images/hotel1.png" promoted={true} no_imgs="12" star={4} rating={2.3} breakfast={true} rackRate="13,300" netPayable="12,700" marginRate="12,900" perNightRate="3,000" facility={["AC","Flexible Check-In", "Couple Friendly", "City View", "Parking", "Wifi", "Swimming Pool", "Spa"]} />
                //                   <HotelBookingCard name="Capital O 74658901 - Nandhana Vistaa Gcc Northside" city="Bangalore" img_url="/images/hotel1.png" promoted={true} no_imgs="12" star={4} rating={2.3} breakfast={true} rackRate="13,300" netPayable="12,700" marginRate="12,900" perNightRate="3,000" facility={["AC","Flexible Check-In", "Couple Friendly", "City View", "Parking", "Wifi", "Swimming Pool", "Spa"]} /> */}
                //                 </div>
                //               </div>
                //             </>
                //             )
              }
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
        </div>
      ) : (
        ""
      )}
      <Footer id="footer" />
    </PageLayout>
  );
};

export default NewHotel;
