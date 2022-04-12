import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Tabs, Tab } from "react-bootstrap";
import { RiRadioButtonFill } from "react-icons/ri";
import HotelInfoAppointment from "../hotelInfoAppointment";
import { fetchFormDataWithAuth } from "../../../utils/apiHelper";
import { API_URL, getSessionToken } from "../../../utils/helper";
import Maps from "../maps/infomaps";
import Cookies from "js-cookie";

const HotelInfoDetail = (props) => {
  const router = useRouter();
  var url = new URL(API_URL + router.asPath);
  var params = new URLSearchParams(url.search);
  
  const lat = props?.data?.[0]?.latitude
  const lng = props?.data?.[0]?.longitude
  const [active, setActive] = useState(0);
  const hotels = {
    
    name: props.name,
    city: props.city,
    star: props.starRating,
    rating: 4,
    amenities:props.amenities,
    facility: props.facility,
    about: props.about,
    surrounding: [],
  };
  useEffect(()=>{
    window.scrollTo({top: 0,behavior: 'auto'});
  },[])
  return (
    <section className="hotelinfo__detatils">
      {/* hotel info appointments */}
      <div className="hotelinfo__appointments">
        <HotelInfoAppointment 
            rooms={props.rooms}
            
            adult={props.adult}
            child={props.child}
            rackRate={props.rackRate}
            netpayable={props.netpayable}
            PDP={props.PDP}
            PDT={props.PDT}
            totalTax={props.totalTax}
            days={props.days}
            margin={props.margin}
            data={props.data}
            checkin={props.checkin}
          checkout={props.checkout}
        />
      </div>
      {/* amenities */}
      {/* <div className="hotelinfo__amenitieswrapper">
        <div className="hotelinfo__amenities">
          <div className="hotelinfo__amenities__img">
            <img src="/images/bed.svg" alt="img" />
          </div>
          <div className="hotelinfo__amenities__desc">
            <h5>3 bedrooms</h5>
            <span>Highly rated apartments.</span>
          </div>
        </div>
        <div className="hotelinfo__amenities">
          <div className="hotelinfo__amenities__img">
            <img src="/images/bed.svg" alt="img" />
          </div>
          <div className="hotelinfo__amenities__desc">
            <h5>Cancellation Policy</h5>
            <span>Flexible cancellation details.</span>
          </div>
        </div>
        <div className="hotelinfo__amenities">
          <div className="hotelinfo__amenities__img">
            <img src="/images/bed.svg" alt="img" />
          </div>
          <div className="hotelinfo__amenities__desc">
            <h5>Cancellation Policy</h5>
            <span>Flexible cancellation details.</span>
          </div>
        </div>
      </div> */}
      {/* tabs */}
      <div className="hotelinfo__tabswrapper">
        <ul className="hotelinfo__tabs list-unstyled">
          <li className="active">
            <a href="#rooms">Rooms</a>
          </li>

          <li>
            <a href="#amenities">Amenities</a>
          </li>

          <li>
            <a href="#about">About</a>
          </li>
          {/* <li>
            <a href="#surroundings">Surroundings</a>
          </li>
          <li>
            <a href="#r&p">Rules & Policies</a>
          </li> */}
          {/* <li>
            <a href="#reviews">Reviews</a>
          </li> */}
        </ul>
        <div className="hotelinfo__tabs__content">
          <div className="hotelinfo__tabs__panel roomstab" id="rooms">
            {/* Roomes Tab*/}
            <div className="hotelinfo__tabs__heading">
              <h4>Rooms</h4>
            </div>
            {/* use class - active to expand */}
            {/* Room 1 */}
            {props.roominfo?.map((room, index) => {
              return (
                <>
                {
                  room.rates?.[0]?.net && 
                
                <div
                  className={active === index ? "active accordion__wrapper" : "accordion__wrapper"}
                  onClick={() => {
                    setActive(index);
                  }}
                >
                  <div className="accordion__heading">
                    <div className="accordion__heading__left">
                      <RiRadioButtonFill size="1.3rem" />

                      <h6>{room.name}</h6>
                    </div>
                    <div className="accordion__heading__right">
                      <div className="hotelinfo__tabs__price">
                        <h5>
                          <span>Starting from </span>₹{room.rates?.[0]?.net?.toLocaleString("en-IN")}
                        </h5>
                      </div>
                    </div>
                  </div>
                  <div className="accordion__body">
                    <div className="accordion__card flex-start">
                      <div className="free-cancellation__left">
                        <div className="free-cancellation__amenities">
                          <svg width="20" height="13" viewBox="0 0 20 13" fill="none">
                            <path
                              d="M1 1V12M1 8H19M19 12V4C19 3.46957 18.7893 2.96086 18.4142 2.58579C18.0391 2.21071 17.5304 2 17 2H9V8M6 4C6 4.55228 5.55228 5 5 5C4.44772 5 4 4.55228 4 4C4 3.44772 4.44772 3 5 3C5.55228 3 6 3.44772 6 4Z"
                              stroke="#808080"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span>1 large</span>
                          double bed
                        </div>
                        <div className="free-cancellation__amenities">
                          <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
                            <path
                              d="M10.0001 1V7.5L13.0001 9.22M18.6604 6L13.0312 9.25L13.0416 12.7081M18.6604 16L13.0312 12.75L10.0416 14.4881M10.0001 21V14.5L7.0001 12.78M1.33984 16L6.96901 12.75L6.95857 9.29192M1.33984 6L6.96901 9.25L9.95857 7.51192M8.0001 3L10.0001 4L12.0001 3H8.0001ZM15.9283 5.26795L16.0623 7.5L17.9283 8.73205L15.9283 5.26795ZM17.9283 13.2679L16.0623 14.5L15.9283 16.7321L17.9283 13.2679ZM12.0001 19L10.0001 18L8.0001 19H12.0001ZM4.07189 16.732L3.93792 14.5L2.07189 13.2679L4.07189 16.732ZM2.07189 8.73205L3.93792 7.5L4.07189 5.26795L2.07189 8.73205Z"
                              stroke="#808080"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              stroke-Linejoin="round"
                            />
                          </svg>
                          <span>Air Conditioned</span>
                          room
                        </div>
                      </div>
                      <div className="free-cancellation__amenities">
                        <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
                          <path
                            d="M5 8V5H8M15 8V11H12M3 1H17C18.1046 1 19 1.89543 19 3V13C19 14.1046 18.1046 15 17 15H3C1.89543 15 1 14.1046 1 13V3C1 1.89543 1.89543 1 3 1Z"
                            stroke="#808080"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            stroke-Linejoin="round"
                          />
                        </svg>
                        <span>31 m²</span>
                        living space
                      </div>
                      <div className="free-cancellation__right">
                        <div className="free-cancellation__card">
                          <h6>Free cancellation</h6>
                          <span>
                            until {room?.rates?.[0]?.cancellation[0]?.from?.slice(0, 10) || "Not Applicable"}{" "}
                            {room?.rates?.[0]?.cancellation[0]?.from?.slice(11, 16)}
                          </span>
                        </div>
                        {/* <div className="free-cancellation__card mr-5 pr-3">
                          <h6>Pre Payment</h6>
                          <span>Not Required</span>
                        </div> */}
                      </div>
                    </div>
                    {/* {room.rates.map((rate, index) => {
                      return (
                        <div key={rate.ratekey} className="accordion__card">
                          <h5>{rate.meal_plan}</h5>
                          <div className="rate-payable-card">
                            

                          </div>
                          <div className="rate-payable-card">
                            <span>Hotel Net Payable</span>
                            <span>₹{rate.net?.toLocaleString("en-IN")}</span>
                          </div>
                          <button
                            className="btn btn__outline"
                            onClick={(e) => { */}
                    {/* e.preventDefault();
                              router.push(
                                `/bookingnew?hotelcode=${props.code}&checkin=${props.checkin}&checkout=${props.checkout}&adult=${props.adult}&child=${props.child}&rate=${rate.net}&roomtype=${room.name}&roomplan=${rate.meal_plan}`
                              );
                            }}
                          >
                            Book for ₹{rate.net}
                          </button>
                        </div>
                      );
                    })} */}

                    {room?.rates?.map((rate, rindex) => {
                      return (
                        <div key={rate.ratekey} className="accordion__card">
                          <h5>{rate.meal_plan}</h5>
                          <div className="rate-payable-card">
                            <span>Base Price</span>
                            <span>₹{rate.net?.toLocaleString("en-IN")}</span>
                          </div>
                          {/* <div className="rate-payable-card">
                            <span>Room Tax</span>
                            <span>
                              {rate.tax?.taxes?.[0]?.amount} {rate.tax?.taxes?.[0]?.currency}{" "}
                            </span>
                          </div> */}

{Cookies.get('accesses')&&JSON.parse(Cookies.get('accesses')).includes(18)&& 
<button
                            className="btn btn__outline"
                            onClick={(e) => {
                              e.preventDefault();
                              router.push(
                                `/bookingnew?hotelcode=${props.code}&source=${props.source}&checkin=${props.checkin}&checkout=${props.checkout}&adult=${props.adult}&child=${props.child}&rate=${rate.net}&roomtype=${room.name}&roomplan=${rate.meal_plan}&pid=${index}&rid=${rindex}&city=${props.city}`
                              );
                            }}
                          >
                            Book Now
                          </button>
                           }
                        </div>
                      );
                    })}
                  </div>
                </div>
              }
            </>
              );
            }
            )}
          </div>
          {/* Amenities Tab*/}
          <div className="hotelinfo__tabs__panel amenitiestab" id="amenities">
            <div className="hotelinfo__tabs__heading">
            
              <h4>Amenities</h4>
            </div>
            {hotels?.amenities?.general?.length>0 &&
            <div className="mt-3">
              <h6>General</h6>
              <ul className="list-unstyled">
                
                {hotels?.amenities?.general?.map((facility, index) => {
                  return (
                    <li>
                      
                      <img src="/images/cross.svg" width={12} alt="wifi" />
                      <span>{facility}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
}
            {hotels?.amenities?.services?.length>0 && 
            <div className="mt-3">
              <h6>Service</h6>
              <ul className="list-unstyled">
                
                {hotels?.amenities?.services?.map((facility, index) => {
                  return (
                    <li>
                      
                      <img src="/images/cross.svg" width={12} alt="wifi" />
                      <span>{facility}</span>
                    </li>
                  );
                })}
              </ul>
            </div>}

            {hotels?.amenities?.business?.length>0 &&
            <div className="mt-3">
              <h6>Business</h6>
              <ul className="list-unstyled">
                
                {hotels?.amenities?.business?.map((facility, index) => {
                  return (
                    <li>
                      
                      <img src="/images/cross.svg" width={12} alt="wifi" />
                      <span>{facility}</span>
                    </li>
                  );
                })}
              </ul>
            </div>}

           {hotels?.amenities?.foodbeverage?.length>0 && <div className="mt-3">
              <h6>Food & Beverage</h6>
              <ul className="list-unstyled">
                
                {hotels?.amenities?.foodbeverage?.map((facility, index) => {
                  return (
                    <li>
                      
                      <img src="/images/cross.svg" width={12} alt="wifi" />
                      <span>{facility}</span>
                    </li>
                  );
                })}
              </ul>
            </div>}

            {hotels?.amenities?.smoking?.length>0 &&
            <div className="mt-3">
              <h6>Smoking</h6>
              <ul className="list-unstyled">
                
                {hotels?.amenities?.smoking?.map((facility, index) => {
                  return (
                    <li>
                      
                      <img src="/images/cross.svg" width={12} alt="wifi" />
                      <span>{facility}</span>
                    </li>
                  );
                })}
              </ul>
            </div>}

            {hotels?.amenities?.recreation?.length>0 &&<div className="mt-3">
              <h6>Recreation</h6>
              <ul className="list-unstyled">
                
                {hotels?.amenities?.recreation?.map((facility, index) => {
                  return (
                    <li>
                      
                      <img src="/images/cross.svg" width={12} alt="wifi" />
                      <span>{facility}</span>
                    </li>
                  );
                })}
              </ul>
            </div>}

            {hotels?.amenities?.travel?.length>0 &&
            <div className="mt-3">
              <h6>Travel</h6>
              <ul className="list-unstyled">
                
                {hotels?.amenities?.travel?.map((facility, index) => {
                  return (
                    <li>
                      
                      <img src="/images/cross.svg" width={12} alt="wifi" />
                      <span>{facility}</span>
                    </li>
                  );
                })}
              </ul>
            </div>}

            {hotels?.amenities?.frontdesk?.length>0 &&
            <div className="mt-3">
              <h6>Front Desk</h6>
              <ul className="list-unstyled">
                
                {hotels?.amenities?.frontdesk?.map((facility, index) => {
                  return (
                    <li>
                      
                      <img src="/images/cross.svg" width={12} alt="wifi" />
                      <span>{facility}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
}

          </div>

          {/* About */}
          <div className="hotelinfo__tabs__panel abouttab" id="about">
            <div className="hotelinfo__tabs__heading">
              <h4>About</h4>
            </div>
            <div className="hotelinfo__tabs__desc">
              <p>{hotels.about}</p>
            </div>
            <div className="hotelinfo__tabs__map">
              <Maps data={[{ lat: lat, lng: lng }]} disableDefaultUI={true} />
            </div>
          </div>
          {/* surrounding */}
          {hotels.surrounding.length > 0 ? (
            <div className="hotelinfo__tabs__panel surroundingtab" id="surroundings">
              <div className="hotelinfo__tabs__heading">
                <h4>Surroundings</h4>
              </div>
              <div className="hotelinfo__tabs__desc">
                <p>
                  Guests loved walking around the neighbourhood! The property is situated 800 m from Rembrandtplein and
                  750 m<span>Read More</span>
                </p>
              </div>
              <Tabs defaultActiveKey="top" id="uncontrolled-tab-example" className="mb-3">
                <Tab
                  eventKey="top"
                  title={
                    <span>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path
                          d="M1 12.5C0.723858 12.5 0.5 12.7239 0.5 13C0.5 13.2761 0.723858 13.5 1 13.5V12.5ZM5.66667 13V13.5C5.94281 13.5 6.16667 13.2761 6.16667 13H5.66667ZM7 9.66667V10.1667V9.66667ZM8.33333 11H7.83333H8.33333ZM8.33333 13H7.83333C7.83333 13.2761 8.05719 13.5 8.33333 13.5V13ZM13 13.5C13.2761 13.5 13.5 13.2761 13.5 13C13.5 12.7239 13.2761 12.5 13 12.5V13.5ZM2.5 13C2.5 13.2761 2.72386 13.5 3 13.5C3.27614 13.5 3.5 13.2761 3.5 13H2.5ZM10.5 13C10.5 13.2761 10.7239 13.5 11 13.5C11.2761 13.5 11.5 13.2761 11.5 13H10.5ZM13 5H13.5C13.5 4.86495 13.4454 4.73565 13.3485 4.64151C13.2517 4.54737 13.1209 4.4964 12.9859 4.5002L13 5ZM7 1L7.48023 0.860802C7.41828 0.647068 7.22253 0.5 7 0.5C6.77747 0.5 6.58172 0.647068 6.51977 0.860802L7 1ZM1 5L1.01406 4.5002C0.879065 4.4964 0.748277 4.54737 0.651452 4.64151C0.554627 4.73565 0.5 4.86495 0.5 5H1ZM1 13.5H5.66667V12.5H1V13.5ZM6.16667 13V11H5.16667V13H6.16667ZM6.16667 11C6.16667 10.779 6.25446 10.567 6.41074 10.4107L5.70364 9.70364C5.35982 10.0475 5.16667 10.5138 5.16667 11H6.16667ZM6.41074 10.4107C6.56703 10.2545 6.77899 10.1667 7 10.1667V9.16667C6.51377 9.16667 6.04745 9.35982 5.70364 9.70364L6.41074 10.4107ZM7 10.1667C7.22101 10.1667 7.43297 10.2545 7.58926 10.4107L8.29636 9.70364C7.95255 9.35982 7.48623 9.16667 7 9.16667V10.1667ZM7.58926 10.4107C7.74554 10.567 7.83333 10.779 7.83333 11H8.83333C8.83333 10.5138 8.64018 10.0475 8.29636 9.70364L7.58926 10.4107ZM7.83333 11V13H8.83333V11H7.83333ZM8.33333 13.5H13V12.5H8.33333V13.5ZM3.5 13V7H2.5V13H3.5ZM11.5 13V7H10.5V13H11.5ZM3 7.5H11V6.5H3V7.5ZM11 7.5C11.663 7.5 12.2989 7.23661 12.7678 6.76777L12.0607 6.06066C11.7794 6.34197 11.3978 6.5 11 6.5V7.5ZM12.7678 6.76777C13.2366 6.29893 13.5 5.66304 13.5 5H12.5C12.5 5.39783 12.342 5.77936 12.0607 6.06066L12.7678 6.76777ZM12.9859 4.5002C11.7225 4.53573 10.4885 4.18722 9.4876 3.51998L8.9329 4.35203C10.1132 5.13889 11.5524 5.54091 13.0141 5.4998L12.9859 4.5002ZM9.4876 3.51998C8.48747 2.85322 7.78502 1.91232 7.48023 0.860802L6.51977 1.1392C6.89523 2.43456 7.75186 3.56466 8.9329 4.35203L9.4876 3.51998ZM6.51977 0.860802C6.21498 1.91232 5.51253 2.85322 4.5124 3.51998L5.0671 4.35203C6.24814 3.56466 7.10477 2.43456 7.48023 1.1392L6.51977 0.860802ZM4.5124 3.51998C3.51153 4.18722 2.27754 4.53573 1.01406 4.5002L0.985943 5.4998C2.44756 5.54091 3.8868 5.13889 5.0671 4.35203L4.5124 3.51998ZM0.5 5C0.5 5.66304 0.763392 6.29893 1.23223 6.76777L1.93934 6.06066C1.65804 5.77936 1.5 5.39782 1.5 5H0.5ZM1.23223 6.76777C1.70107 7.23661 2.33696 7.5 3 7.5V6.5C2.60218 6.5 2.22064 6.34197 1.93934 6.06066L1.23223 6.76777Z"
                          fill="#808080"
                        />
                      </svg>
                      Top Attraction
                    </span>
                  }
                >
                  {/* for mobile title */}
                  <div className="surrounding-title active">
                    <h2>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path
                          d="M1 12.5C0.723858 12.5 0.5 12.7239 0.5 13C0.5 13.2761 0.723858 13.5 1 13.5V12.5ZM5.66667 13V13.5C5.94281 13.5 6.16667 13.2761 6.16667 13H5.66667ZM7 9.66667V10.1667V9.66667ZM8.33333 11H7.83333H8.33333ZM8.33333 13H7.83333C7.83333 13.2761 8.05719 13.5 8.33333 13.5V13ZM13 13.5C13.2761 13.5 13.5 13.2761 13.5 13C13.5 12.7239 13.2761 12.5 13 12.5V13.5ZM2.5 13C2.5 13.2761 2.72386 13.5 3 13.5C3.27614 13.5 3.5 13.2761 3.5 13H2.5ZM10.5 13C10.5 13.2761 10.7239 13.5 11 13.5C11.2761 13.5 11.5 13.2761 11.5 13H10.5ZM13 5H13.5C13.5 4.86495 13.4454 4.73565 13.3485 4.64151C13.2517 4.54737 13.1209 4.4964 12.9859 4.5002L13 5ZM7 1L7.48023 0.860802C7.41828 0.647068 7.22253 0.5 7 0.5C6.77747 0.5 6.58172 0.647068 6.51977 0.860802L7 1ZM1 5L1.01406 4.5002C0.879065 4.4964 0.748277 4.54737 0.651452 4.64151C0.554627 4.73565 0.5 4.86495 0.5 5H1ZM1 13.5H5.66667V12.5H1V13.5ZM6.16667 13V11H5.16667V13H6.16667ZM6.16667 11C6.16667 10.779 6.25446 10.567 6.41074 10.4107L5.70364 9.70364C5.35982 10.0475 5.16667 10.5138 5.16667 11H6.16667ZM6.41074 10.4107C6.56703 10.2545 6.77899 10.1667 7 10.1667V9.16667C6.51377 9.16667 6.04745 9.35982 5.70364 9.70364L6.41074 10.4107ZM7 10.1667C7.22101 10.1667 7.43297 10.2545 7.58926 10.4107L8.29636 9.70364C7.95255 9.35982 7.48623 9.16667 7 9.16667V10.1667ZM7.58926 10.4107C7.74554 10.567 7.83333 10.779 7.83333 11H8.83333C8.83333 10.5138 8.64018 10.0475 8.29636 9.70364L7.58926 10.4107ZM7.83333 11V13H8.83333V11H7.83333ZM8.33333 13.5H13V12.5H8.33333V13.5ZM3.5 13V7H2.5V13H3.5ZM11.5 13V7H10.5V13H11.5ZM3 7.5H11V6.5H3V7.5ZM11 7.5C11.663 7.5 12.2989 7.23661 12.7678 6.76777L12.0607 6.06066C11.7794 6.34197 11.3978 6.5 11 6.5V7.5ZM12.7678 6.76777C13.2366 6.29893 13.5 5.66304 13.5 5H12.5C12.5 5.39783 12.342 5.77936 12.0607 6.06066L12.7678 6.76777ZM12.9859 4.5002C11.7225 4.53573 10.4885 4.18722 9.4876 3.51998L8.9329 4.35203C10.1132 5.13889 11.5524 5.54091 13.0141 5.4998L12.9859 4.5002ZM9.4876 3.51998C8.48747 2.85322 7.78502 1.91232 7.48023 0.860802L6.51977 1.1392C6.89523 2.43456 7.75186 3.56466 8.9329 4.35203L9.4876 3.51998ZM6.51977 0.860802C6.21498 1.91232 5.51253 2.85322 4.5124 3.51998L5.0671 4.35203C6.24814 3.56466 7.10477 2.43456 7.48023 1.1392L6.51977 0.860802ZM4.5124 3.51998C3.51153 4.18722 2.27754 4.53573 1.01406 4.5002L0.985943 5.4998C2.44756 5.54091 3.8868 5.13889 5.0671 4.35203L4.5124 3.51998ZM0.5 5C0.5 5.66304 0.763392 6.29893 1.23223 6.76777L1.93934 6.06066C1.65804 5.77936 1.5 5.39782 1.5 5H0.5ZM1.23223 6.76777C1.70107 7.23661 2.33696 7.5 3 7.5V6.5C2.60218 6.5 2.22064 6.34197 1.93934 6.06066L1.23223 6.76777Z"
                          fill="#808080"
                        />
                      </svg>
                      Top Attraction
                    </h2>
                  </div>
                  <ul className="list-unstyled">
                    <li>
                      <h5>Leidsestraat</h5>
                      <span>0.2 km</span>
                    </li>
                    <li>
                      <h5>Leidsestraat</h5>
                      <span>0.2 km</span>
                    </li>
                    <li>
                      <h5>The Krijtberg Church</h5>
                      <span>0.2 km</span>
                    </li>
                    <li>
                      <h5>Moco Museum</h5>
                      <span>0.2 km</span>
                    </li>
                    <li>
                      <h5>National Pipe Museum</h5>
                      <span>0.2 km</span>
                    </li>
                  </ul>
                </Tab>
                <Tab
                  eventKey="resturant"
                  title={
                    <span>
                      <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
                        <path
                          d="M1 10.1667C0.723858 10.1667 0.5 10.3906 0.5 10.6667C0.5 10.9429 0.723858 11.1667 1 11.1667V10.1667ZM13 11.1667C13.2761 11.1667 13.5 10.9429 13.5 10.6667C13.5 10.3906 13.2761 10.1667 13 10.1667V11.1667ZM1 5.33337V4.83337C0.867392 4.83337 0.740215 4.88605 0.646447 4.97982C0.552678 5.07359 0.5 5.20077 0.5 5.33337H1ZM13 5.33337H13.5C13.5 5.20077 13.4473 5.07359 13.3536 4.97982C13.2598 4.88605 13.1326 4.83337 13 4.83337V5.33337ZM7.66667 10.6667V11.1667V10.6667ZM6.33333 10.6667V11.1667V10.6667ZM4.5 3.33337C4.5 3.60952 4.72386 3.83337 5 3.83337C5.27614 3.83337 5.5 3.60952 5.5 3.33337H4.5ZM5.5 1.33337C5.5 1.05723 5.27614 0.833374 5 0.833374C4.72386 0.833374 4.5 1.05723 4.5 1.33337H5.5ZM7.5 1.33337C7.5 1.05723 7.27614 0.833374 7 0.833374C6.72386 0.833374 6.5 1.05723 6.5 1.33337H7.5ZM6.5 3.33337C6.5 3.60952 6.72386 3.83337 7 3.83337C7.27614 3.83337 7.5 3.60952 7.5 3.33337H6.5ZM9.5 1.33337C9.5 1.05723 9.27614 0.833374 9 0.833374C8.72386 0.833374 8.5 1.05723 8.5 1.33337H9.5ZM8.5 3.33337C8.5 3.60952 8.72386 3.83337 9 3.83337C9.27614 3.83337 9.5 3.60952 9.5 3.33337H8.5ZM1 11.1667H13V10.1667H1V11.1667ZM1 5.83337H13V4.83337H1V5.83337ZM12.5 5.33337C12.5 6.61525 11.9908 7.84463 11.0843 8.75106L11.7915 9.45816C12.8854 8.3642 13.5 6.88047 13.5 5.33337H12.5ZM11.0843 8.75106C10.1779 9.65748 8.94855 10.1667 7.66667 10.1667V11.1667C9.21376 11.1667 10.6975 10.5521 11.7915 9.45816L11.0843 8.75106ZM7.66667 10.1667H6.33333V11.1667H7.66667V10.1667ZM6.33333 10.1667C5.05145 10.1667 3.82208 9.65748 2.91565 8.75106L2.20854 9.45816C3.30251 10.5521 4.78624 11.1667 6.33333 11.1667V10.1667ZM2.91565 8.75106C2.00922 7.84463 1.5 6.61525 1.5 5.33337H0.5C0.5 6.88047 1.11458 8.3642 2.20854 9.45816L2.91565 8.75106ZM5.5 3.33337V1.33337H4.5V3.33337H5.5ZM6.5 1.33337V3.33337H7.5V1.33337H6.5ZM8.5 1.33337V3.33337H9.5V1.33337H8.5Z"
                          fill="#808080"
                        />
                      </svg>
                      Restaurant
                    </span>
                  }
                >
                  {/* for mobile title */}
                  <div className="surrounding-title">
                    <h2>
                      <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
                        <path
                          d="M1 10.1667C0.723858 10.1667 0.5 10.3906 0.5 10.6667C0.5 10.9429 0.723858 11.1667 1 11.1667V10.1667ZM13 11.1667C13.2761 11.1667 13.5 10.9429 13.5 10.6667C13.5 10.3906 13.2761 10.1667 13 10.1667V11.1667ZM1 5.33337V4.83337C0.867392 4.83337 0.740215 4.88605 0.646447 4.97982C0.552678 5.07359 0.5 5.20077 0.5 5.33337H1ZM13 5.33337H13.5C13.5 5.20077 13.4473 5.07359 13.3536 4.97982C13.2598 4.88605 13.1326 4.83337 13 4.83337V5.33337ZM7.66667 10.6667V11.1667V10.6667ZM6.33333 10.6667V11.1667V10.6667ZM4.5 3.33337C4.5 3.60952 4.72386 3.83337 5 3.83337C5.27614 3.83337 5.5 3.60952 5.5 3.33337H4.5ZM5.5 1.33337C5.5 1.05723 5.27614 0.833374 5 0.833374C4.72386 0.833374 4.5 1.05723 4.5 1.33337H5.5ZM7.5 1.33337C7.5 1.05723 7.27614 0.833374 7 0.833374C6.72386 0.833374 6.5 1.05723 6.5 1.33337H7.5ZM6.5 3.33337C6.5 3.60952 6.72386 3.83337 7 3.83337C7.27614 3.83337 7.5 3.60952 7.5 3.33337H6.5ZM9.5 1.33337C9.5 1.05723 9.27614 0.833374 9 0.833374C8.72386 0.833374 8.5 1.05723 8.5 1.33337H9.5ZM8.5 3.33337C8.5 3.60952 8.72386 3.83337 9 3.83337C9.27614 3.83337 9.5 3.60952 9.5 3.33337H8.5ZM1 11.1667H13V10.1667H1V11.1667ZM1 5.83337H13V4.83337H1V5.83337ZM12.5 5.33337C12.5 6.61525 11.9908 7.84463 11.0843 8.75106L11.7915 9.45816C12.8854 8.3642 13.5 6.88047 13.5 5.33337H12.5ZM11.0843 8.75106C10.1779 9.65748 8.94855 10.1667 7.66667 10.1667V11.1667C9.21376 11.1667 10.6975 10.5521 11.7915 9.45816L11.0843 8.75106ZM7.66667 10.1667H6.33333V11.1667H7.66667V10.1667ZM6.33333 10.1667C5.05145 10.1667 3.82208 9.65748 2.91565 8.75106L2.20854 9.45816C3.30251 10.5521 4.78624 11.1667 6.33333 11.1667V10.1667ZM2.91565 8.75106C2.00922 7.84463 1.5 6.61525 1.5 5.33337H0.5C0.5 6.88047 1.11458 8.3642 2.20854 9.45816L2.91565 8.75106ZM5.5 3.33337V1.33337H4.5V3.33337H5.5ZM6.5 1.33337V3.33337H7.5V1.33337H6.5ZM8.5 1.33337V3.33337H9.5V1.33337H8.5Z"
                          fill="#808080"
                        />
                      </svg>
                      Restaurant
                    </h2>
                  </div>
                  <ul className="list-unstyled">
                    <li>
                      <h5>Leidsestraat</h5>
                      <span>0.2 km</span>
                    </li>
                    <li>
                      <h5>Leidsestraat</h5>
                      <span>0.2 km</span>
                    </li>
                    <li>
                      <h5>The Krijtberg Church</h5>
                      <span>0.2 km</span>
                    </li>
                    <li>
                      <h5>Moco Museum</h5>
                      <span>0.2 km</span>
                    </li>
                    <li>
                      <h5>National Pipe Museum</h5>
                      <span>0.2 km</span>
                    </li>
                  </ul>
                </Tab>
                <Tab
                  eventKey="transports"
                  title={
                    <span>
                      <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                        <path
                          d="M1.3335 9.33337H0.833496C0.833496 9.60952 1.05735 9.83337 1.3335 9.83337V9.33337ZM2.00016 1.33337V1.83337V1.33337ZM14.6668 9.33337V9.83337C14.943 9.83337 15.1668 9.60952 15.1668 9.33337H14.6668ZM11.1557 1.22861C11.0979 0.958597 10.8321 0.786613 10.5621 0.844473C10.2921 0.902333 10.1201 1.16813 10.1779 1.43814L11.1557 1.22861ZM11.6668 6.00004L11.1779 6.10481C11.2273 6.33534 11.4311 6.50004 11.6668 6.50004V6.00004ZM1.3335 4.16671C1.05735 4.16671 0.833496 4.39057 0.833496 4.66671C0.833496 4.94285 1.05735 5.16671 1.3335 5.16671V4.16671ZM11.3335 5.16671C11.6096 5.16671 11.8335 4.94285 11.8335 4.66671C11.8335 4.39057 11.6096 4.16671 11.3335 4.16671V5.16671ZM5.16683 1.33337C5.16683 1.05723 4.94297 0.833374 4.66683 0.833374C4.39069 0.833374 4.16683 1.05723 4.16683 1.33337H5.16683ZM4.16683 4.66671C4.16683 4.94285 4.39069 5.16671 4.66683 5.16671C4.94297 5.16671 5.16683 4.94285 5.16683 4.66671H4.16683ZM8.50016 1.33337C8.50016 1.05723 8.27631 0.833374 8.00016 0.833374C7.72402 0.833374 7.50016 1.05723 7.50016 1.33337H8.50016ZM7.50016 4.66671C7.50016 4.94285 7.72402 5.16671 8.00016 5.16671C8.27631 5.16671 8.50016 4.94285 8.50016 4.66671H7.50016ZM4.8335 9.33337C4.8335 9.79361 4.4604 10.1667 4.00016 10.1667V11.1667C5.01268 11.1667 5.8335 10.3459 5.8335 9.33337H4.8335ZM4.00016 10.1667C3.53993 10.1667 3.16683 9.79361 3.16683 9.33337H2.16683C2.16683 10.3459 2.98764 11.1667 4.00016 11.1667V10.1667ZM3.16683 9.33337C3.16683 8.87314 3.53993 8.50004 4.00016 8.50004V7.50004C2.98764 7.50004 2.16683 8.32085 2.16683 9.33337H3.16683ZM4.00016 8.50004C4.4604 8.50004 4.8335 8.87314 4.8335 9.33337H5.8335C5.8335 8.32085 5.01268 7.50004 4.00016 7.50004V8.50004ZM12.8335 9.33337C12.8335 9.79361 12.4604 10.1667 12.0002 10.1667V11.1667C13.0127 11.1667 13.8335 10.3459 13.8335 9.33337H12.8335ZM12.0002 10.1667C11.5399 10.1667 11.1668 9.79361 11.1668 9.33337H10.1668C10.1668 10.3459 10.9876 11.1667 12.0002 11.1667V10.1667ZM11.1668 9.33337C11.1668 8.87314 11.5399 8.50004 12.0002 8.50004V7.50004C10.9876 7.50004 10.1668 8.32085 10.1668 9.33337H11.1668ZM12.0002 8.50004C12.4604 8.50004 12.8335 8.87314 12.8335 9.33337H13.8335C13.8335 8.32085 13.0127 7.50004 12.0002 7.50004V8.50004ZM2.66683 8.83337H1.3335V9.83337H2.66683V8.83337ZM1.8335 9.33337V2.00004H0.833496V9.33337H1.8335ZM1.8335 2.00004C1.8335 1.95584 1.85106 1.91345 1.88231 1.88219L1.1752 1.17508C0.956412 1.39388 0.833496 1.69062 0.833496 2.00004H1.8335ZM1.88231 1.88219C1.91357 1.85093 1.95596 1.83337 2.00016 1.83337V0.833374C1.69074 0.833374 1.394 0.956291 1.1752 1.17508L1.88231 1.88219ZM2.00016 1.83337H11.3335V0.833374H2.00016V1.83337ZM11.3335 1.83337C12.0203 1.83337 12.7294 2.21493 13.2837 2.99083L14.0974 2.40959C13.4014 1.43515 12.4148 0.833374 11.3335 0.833374V1.83337ZM13.2837 2.99083C13.8394 3.76885 14.1668 4.8503 14.1668 6.00004H15.1668C15.1668 4.67443 14.7919 3.38191 14.0974 2.40959L13.2837 2.99083ZM14.1668 6.00004V9.33337H15.1668V6.00004H14.1668ZM14.6668 8.83337H13.3335V9.83337H14.6668V8.83337ZM10.6668 8.83337H5.3335V9.83337H10.6668V8.83337ZM10.1779 1.43814L11.1779 6.10481L12.1557 5.89528L11.1557 1.22861L10.1779 1.43814ZM11.6668 6.50004H14.6668V5.50004H11.6668V6.50004ZM1.3335 5.16671H11.3335V4.16671H1.3335V5.16671ZM4.16683 1.33337V4.66671H5.16683V1.33337H4.16683ZM7.50016 1.33337V4.66671H8.50016V1.33337H7.50016Z"
                          fill="#808080"
                        />
                      </svg>
                      Transports
                    </span>
                  }
                >
                  {/* for mobilr title */}
                  <div className="surrounding-title">
                    <h2>
                      <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                        <path
                          d="M1.3335 9.33337H0.833496C0.833496 9.60952 1.05735 9.83337 1.3335 9.83337V9.33337ZM2.00016 1.33337V1.83337V1.33337ZM14.6668 9.33337V9.83337C14.943 9.83337 15.1668 9.60952 15.1668 9.33337H14.6668ZM11.1557 1.22861C11.0979 0.958597 10.8321 0.786613 10.5621 0.844473C10.2921 0.902333 10.1201 1.16813 10.1779 1.43814L11.1557 1.22861ZM11.6668 6.00004L11.1779 6.10481C11.2273 6.33534 11.4311 6.50004 11.6668 6.50004V6.00004ZM1.3335 4.16671C1.05735 4.16671 0.833496 4.39057 0.833496 4.66671C0.833496 4.94285 1.05735 5.16671 1.3335 5.16671V4.16671ZM11.3335 5.16671C11.6096 5.16671 11.8335 4.94285 11.8335 4.66671C11.8335 4.39057 11.6096 4.16671 11.3335 4.16671V5.16671ZM5.16683 1.33337C5.16683 1.05723 4.94297 0.833374 4.66683 0.833374C4.39069 0.833374 4.16683 1.05723 4.16683 1.33337H5.16683ZM4.16683 4.66671C4.16683 4.94285 4.39069 5.16671 4.66683 5.16671C4.94297 5.16671 5.16683 4.94285 5.16683 4.66671H4.16683ZM8.50016 1.33337C8.50016 1.05723 8.27631 0.833374 8.00016 0.833374C7.72402 0.833374 7.50016 1.05723 7.50016 1.33337H8.50016ZM7.50016 4.66671C7.50016 4.94285 7.72402 5.16671 8.00016 5.16671C8.27631 5.16671 8.50016 4.94285 8.50016 4.66671H7.50016ZM4.8335 9.33337C4.8335 9.79361 4.4604 10.1667 4.00016 10.1667V11.1667C5.01268 11.1667 5.8335 10.3459 5.8335 9.33337H4.8335ZM4.00016 10.1667C3.53993 10.1667 3.16683 9.79361 3.16683 9.33337H2.16683C2.16683 10.3459 2.98764 11.1667 4.00016 11.1667V10.1667ZM3.16683 9.33337C3.16683 8.87314 3.53993 8.50004 4.00016 8.50004V7.50004C2.98764 7.50004 2.16683 8.32085 2.16683 9.33337H3.16683ZM4.00016 8.50004C4.4604 8.50004 4.8335 8.87314 4.8335 9.33337H5.8335C5.8335 8.32085 5.01268 7.50004 4.00016 7.50004V8.50004ZM12.8335 9.33337C12.8335 9.79361 12.4604 10.1667 12.0002 10.1667V11.1667C13.0127 11.1667 13.8335 10.3459 13.8335 9.33337H12.8335ZM12.0002 10.1667C11.5399 10.1667 11.1668 9.79361 11.1668 9.33337H10.1668C10.1668 10.3459 10.9876 11.1667 12.0002 11.1667V10.1667ZM11.1668 9.33337C11.1668 8.87314 11.5399 8.50004 12.0002 8.50004V7.50004C10.9876 7.50004 10.1668 8.32085 10.1668 9.33337H11.1668ZM12.0002 8.50004C12.4604 8.50004 12.8335 8.87314 12.8335 9.33337H13.8335C13.8335 8.32085 13.0127 7.50004 12.0002 7.50004V8.50004ZM2.66683 8.83337H1.3335V9.83337H2.66683V8.83337ZM1.8335 9.33337V2.00004H0.833496V9.33337H1.8335ZM1.8335 2.00004C1.8335 1.95584 1.85106 1.91345 1.88231 1.88219L1.1752 1.17508C0.956412 1.39388 0.833496 1.69062 0.833496 2.00004H1.8335ZM1.88231 1.88219C1.91357 1.85093 1.95596 1.83337 2.00016 1.83337V0.833374C1.69074 0.833374 1.394 0.956291 1.1752 1.17508L1.88231 1.88219ZM2.00016 1.83337H11.3335V0.833374H2.00016V1.83337ZM11.3335 1.83337C12.0203 1.83337 12.7294 2.21493 13.2837 2.99083L14.0974 2.40959C13.4014 1.43515 12.4148 0.833374 11.3335 0.833374V1.83337ZM13.2837 2.99083C13.8394 3.76885 14.1668 4.8503 14.1668 6.00004H15.1668C15.1668 4.67443 14.7919 3.38191 14.0974 2.40959L13.2837 2.99083ZM14.1668 6.00004V9.33337H15.1668V6.00004H14.1668ZM14.6668 8.83337H13.3335V9.83337H14.6668V8.83337ZM10.6668 8.83337H5.3335V9.83337H10.6668V8.83337ZM10.1779 1.43814L11.1779 6.10481L12.1557 5.89528L11.1557 1.22861L10.1779 1.43814ZM11.6668 6.50004H14.6668V5.50004H11.6668V6.50004ZM1.3335 5.16671H11.3335V4.16671H1.3335V5.16671ZM4.16683 1.33337V4.66671H5.16683V1.33337H4.16683ZM7.50016 1.33337V4.66671H8.50016V1.33337H7.50016Z"
                          fill="#808080"
                        />
                      </svg>
                      Transports
                    </h2>
                  </div>
                  <ul className="list-unstyled">
                    <li>
                      <h5>Leidsestraat</h5>
                      <span>0.2 km</span>
                    </li>
                    <li>
                      <h5>Leidsestraat</h5>
                      <span>0.2 km</span>
                    </li>
                    <li>
                      <h5>The Krijtberg Church</h5>
                      <span>0.2 km</span>
                    </li>
                    <li>
                      <h5>Moco Museum</h5>
                      <span>0.2 km</span>
                    </li>
                    <li>
                      <h5>National Pipe Museum</h5>
                      <span>0.2 km</span>
                    </li>
                  </ul>
                </Tab>
                <Tab
                  eventKey="store"
                  title={
                    <span>
                      <svg width="14" height="14" viewBox="0 0 14 14">
                        <path
                          d="M1 12.5C0.723858 12.5 0.5 12.7239 0.5 13C0.5 13.2761 0.723858 13.5 1 13.5V12.5ZM13 13.5C13.2761 13.5 13.5 13.2761 13.5 13C13.5 12.7239 13.2761 12.5 13 12.5V13.5ZM1 3.66667L0.552786 3.44306C0.518073 3.51249 0.5 3.58904 0.5 3.66667H1ZM1 4.33333H0.5H1ZM5 3.66667H5.5C5.5 3.39052 5.27614 3.16667 5 3.16667V3.66667ZM9.5 3.66667C9.5 3.39052 9.27614 3.16667 9 3.16667C8.72386 3.16667 8.5 3.39052 8.5 3.66667H9.5ZM13 4.33333H13.5H13ZM13 3.66667H13.5C13.5 3.58904 13.4819 3.51249 13.4472 3.44306L13 3.66667ZM2.33333 1V0.5C2.14395 0.5 1.97082 0.607001 1.88612 0.776393L2.33333 1ZM11.6667 1L12.1139 0.776393C12.0292 0.607001 11.8561 0.5 11.6667 0.5V1ZM1.83333 13C1.83333 13.2761 2.05719 13.5 2.33333 13.5C2.60948 13.5 2.83333 13.2761 2.83333 13H1.83333ZM2.83333 6.23333C2.83333 5.95719 2.60948 5.73333 2.33333 5.73333C2.05719 5.73333 1.83333 5.95719 1.83333 6.23333H2.83333ZM11.1667 13C11.1667 13.2761 11.3905 13.5 11.6667 13.5C11.9428 13.5 12.1667 13.2761 12.1667 13H11.1667ZM12.1667 6.23333C12.1667 5.95719 11.9428 5.73333 11.6667 5.73333C11.3905 5.73333 11.1667 5.95719 11.1667 6.23333H12.1667ZM4.5 13C4.5 13.2761 4.72386 13.5 5 13.5C5.27614 13.5 5.5 13.2761 5.5 13H4.5ZM6.33333 9V9.5V9ZM8.5 13C8.5 13.2761 8.72386 13.5 9 13.5C9.27614 13.5 9.5 13.2761 9.5 13H8.5ZM1 13.5H13V12.5H1V13.5ZM0.5 3.66667V4.33333H1.5V3.66667H0.5ZM0.5 4.33333C0.5 4.99637 0.763392 5.63226 1.23223 6.1011L1.93934 5.39399C1.65804 5.11269 1.5 4.73116 1.5 4.33333H0.5ZM1.23223 6.1011C1.70107 6.56994 2.33696 6.83333 3 6.83333V5.83333C2.60218 5.83333 2.22064 5.6753 1.93934 5.39399L1.23223 6.1011ZM3 6.83333C3.66304 6.83333 4.29893 6.56994 4.76777 6.1011L4.06066 5.39399C3.77936 5.6753 3.39783 5.83333 3 5.83333V6.83333ZM4.76777 6.1011C5.23661 5.63226 5.5 4.99637 5.5 4.33333H4.5C4.5 4.73116 4.34196 5.11269 4.06066 5.39399L4.76777 6.1011ZM5.5 4.33333V3.66667H4.5V4.33333H5.5ZM5 3.16667H1V4.16667H5V3.16667ZM4.5 4.33333C4.5 4.99637 4.76339 5.63226 5.23223 6.1011L5.93934 5.39399C5.65804 5.11269 5.5 4.73116 5.5 4.33333H4.5ZM5.23223 6.1011C5.70107 6.56994 6.33696 6.83333 7 6.83333V5.83333C6.60218 5.83333 6.22064 5.6753 5.93934 5.39399L5.23223 6.1011ZM7 6.83333C7.66304 6.83333 8.29893 6.56994 8.76777 6.1011L8.06066 5.39399C7.77936 5.6753 7.39783 5.83333 7 5.83333V6.83333ZM8.76777 6.1011C9.23661 5.63226 9.5 4.99637 9.5 4.33333H8.5C8.5 4.73116 8.34197 5.11269 8.06066 5.39399L8.76777 6.1011ZM9.5 4.33333V3.66667H8.5V4.33333H9.5ZM8.5 4.33333C8.5 4.99637 8.76339 5.63226 9.23223 6.1011L9.93934 5.39399C9.65804 5.11269 9.5 4.73116 9.5 4.33333H8.5ZM9.23223 6.1011C9.70107 6.56994 10.337 6.83333 11 6.83333V5.83333C10.6022 5.83333 10.2206 5.6753 9.93934 5.39399L9.23223 6.1011ZM11 6.83333C11.663 6.83333 12.2989 6.56994 12.7678 6.1011L12.0607 5.39399C11.7794 5.6753 11.3978 5.83333 11 5.83333V6.83333ZM12.7678 6.1011C13.2366 5.63226 13.5 4.99637 13.5 4.33333H12.5C12.5 4.73116 12.342 5.11269 12.0607 5.39399L12.7678 6.1011ZM13.5 4.33333V3.66667H12.5V4.33333H13.5ZM13 3.16667H1V4.16667H13V3.16667ZM1.44721 3.89027L2.78055 1.22361L1.88612 0.776393L0.552786 3.44306L1.44721 3.89027ZM2.33333 1.5H11.6667V0.5H2.33333V1.5ZM11.2195 1.22361L12.5528 3.89027L13.4472 3.44306L12.1139 0.776393L11.2195 1.22361ZM2.83333 13V6.23333H1.83333V13H2.83333ZM12.1667 13V6.23333H11.1667V13H12.1667ZM5.5 13V10.3333H4.5V13H5.5ZM5.5 10.3333C5.5 10.1123 5.5878 9.90036 5.74408 9.74408L5.03697 9.03697C4.69315 9.38079 4.5 9.8471 4.5 10.3333H5.5ZM5.74408 9.74408C5.90036 9.5878 6.11232 9.5 6.33333 9.5V8.5C5.8471 8.5 5.38079 8.69315 5.03697 9.03697L5.74408 9.74408ZM6.33333 9.5H7.66667V8.5H6.33333V9.5ZM7.66667 9.5C7.88768 9.5 8.09964 9.5878 8.25592 9.74408L8.96303 9.03697C8.61921 8.69315 8.1529 8.5 7.66667 8.5V9.5ZM8.25592 9.74408C8.4122 9.90036 8.5 10.1123 8.5 10.3333H9.5C9.5 9.8471 9.30685 9.38079 8.96303 9.03697L8.25592 9.74408ZM8.5 10.3333V13H9.5V10.3333H8.5Z"
                          fill="#808080"
                        />
                      </svg>
                      Stores & Malls
                    </span>
                  }
                >
                  {/* for mobilr title */}
                  <div className="surrounding-title">
                    <h2>
                      <svg width="14" height="14" viewBox="0 0 14 14">
                        <path
                          d="M1 12.5C0.723858 12.5 0.5 12.7239 0.5 13C0.5 13.2761 0.723858 13.5 1 13.5V12.5ZM13 13.5C13.2761 13.5 13.5 13.2761 13.5 13C13.5 12.7239 13.2761 12.5 13 12.5V13.5ZM1 3.66667L0.552786 3.44306C0.518073 3.51249 0.5 3.58904 0.5 3.66667H1ZM1 4.33333H0.5H1ZM5 3.66667H5.5C5.5 3.39052 5.27614 3.16667 5 3.16667V3.66667ZM9.5 3.66667C9.5 3.39052 9.27614 3.16667 9 3.16667C8.72386 3.16667 8.5 3.39052 8.5 3.66667H9.5ZM13 4.33333H13.5H13ZM13 3.66667H13.5C13.5 3.58904 13.4819 3.51249 13.4472 3.44306L13 3.66667ZM2.33333 1V0.5C2.14395 0.5 1.97082 0.607001 1.88612 0.776393L2.33333 1ZM11.6667 1L12.1139 0.776393C12.0292 0.607001 11.8561 0.5 11.6667 0.5V1ZM1.83333 13C1.83333 13.2761 2.05719 13.5 2.33333 13.5C2.60948 13.5 2.83333 13.2761 2.83333 13H1.83333ZM2.83333 6.23333C2.83333 5.95719 2.60948 5.73333 2.33333 5.73333C2.05719 5.73333 1.83333 5.95719 1.83333 6.23333H2.83333ZM11.1667 13C11.1667 13.2761 11.3905 13.5 11.6667 13.5C11.9428 13.5 12.1667 13.2761 12.1667 13H11.1667ZM12.1667 6.23333C12.1667 5.95719 11.9428 5.73333 11.6667 5.73333C11.3905 5.73333 11.1667 5.95719 11.1667 6.23333H12.1667ZM4.5 13C4.5 13.2761 4.72386 13.5 5 13.5C5.27614 13.5 5.5 13.2761 5.5 13H4.5ZM6.33333 9V9.5V9ZM8.5 13C8.5 13.2761 8.72386 13.5 9 13.5C9.27614 13.5 9.5 13.2761 9.5 13H8.5ZM1 13.5H13V12.5H1V13.5ZM0.5 3.66667V4.33333H1.5V3.66667H0.5ZM0.5 4.33333C0.5 4.99637 0.763392 5.63226 1.23223 6.1011L1.93934 5.39399C1.65804 5.11269 1.5 4.73116 1.5 4.33333H0.5ZM1.23223 6.1011C1.70107 6.56994 2.33696 6.83333 3 6.83333V5.83333C2.60218 5.83333 2.22064 5.6753 1.93934 5.39399L1.23223 6.1011ZM3 6.83333C3.66304 6.83333 4.29893 6.56994 4.76777 6.1011L4.06066 5.39399C3.77936 5.6753 3.39783 5.83333 3 5.83333V6.83333ZM4.76777 6.1011C5.23661 5.63226 5.5 4.99637 5.5 4.33333H4.5C4.5 4.73116 4.34196 5.11269 4.06066 5.39399L4.76777 6.1011ZM5.5 4.33333V3.66667H4.5V4.33333H5.5ZM5 3.16667H1V4.16667H5V3.16667ZM4.5 4.33333C4.5 4.99637 4.76339 5.63226 5.23223 6.1011L5.93934 5.39399C5.65804 5.11269 5.5 4.73116 5.5 4.33333H4.5ZM5.23223 6.1011C5.70107 6.56994 6.33696 6.83333 7 6.83333V5.83333C6.60218 5.83333 6.22064 5.6753 5.93934 5.39399L5.23223 6.1011ZM7 6.83333C7.66304 6.83333 8.29893 6.56994 8.76777 6.1011L8.06066 5.39399C7.77936 5.6753 7.39783 5.83333 7 5.83333V6.83333ZM8.76777 6.1011C9.23661 5.63226 9.5 4.99637 9.5 4.33333H8.5C8.5 4.73116 8.34197 5.11269 8.06066 5.39399L8.76777 6.1011ZM9.5 4.33333V3.66667H8.5V4.33333H9.5ZM8.5 4.33333C8.5 4.99637 8.76339 5.63226 9.23223 6.1011L9.93934 5.39399C9.65804 5.11269 9.5 4.73116 9.5 4.33333H8.5ZM9.23223 6.1011C9.70107 6.56994 10.337 6.83333 11 6.83333V5.83333C10.6022 5.83333 10.2206 5.6753 9.93934 5.39399L9.23223 6.1011ZM11 6.83333C11.663 6.83333 12.2989 6.56994 12.7678 6.1011L12.0607 5.39399C11.7794 5.6753 11.3978 5.83333 11 5.83333V6.83333ZM12.7678 6.1011C13.2366 5.63226 13.5 4.99637 13.5 4.33333H12.5C12.5 4.73116 12.342 5.11269 12.0607 5.39399L12.7678 6.1011ZM13.5 4.33333V3.66667H12.5V4.33333H13.5ZM13 3.16667H1V4.16667H13V3.16667ZM1.44721 3.89027L2.78055 1.22361L1.88612 0.776393L0.552786 3.44306L1.44721 3.89027ZM2.33333 1.5H11.6667V0.5H2.33333V1.5ZM11.2195 1.22361L12.5528 3.89027L13.4472 3.44306L12.1139 0.776393L11.2195 1.22361ZM2.83333 13V6.23333H1.83333V13H2.83333ZM12.1667 13V6.23333H11.1667V13H12.1667ZM5.5 13V10.3333H4.5V13H5.5ZM5.5 10.3333C5.5 10.1123 5.5878 9.90036 5.74408 9.74408L5.03697 9.03697C4.69315 9.38079 4.5 9.8471 4.5 10.3333H5.5ZM5.74408 9.74408C5.90036 9.5878 6.11232 9.5 6.33333 9.5V8.5C5.8471 8.5 5.38079 8.69315 5.03697 9.03697L5.74408 9.74408ZM6.33333 9.5H7.66667V8.5H6.33333V9.5ZM7.66667 9.5C7.88768 9.5 8.09964 9.5878 8.25592 9.74408L8.96303 9.03697C8.61921 8.69315 8.1529 8.5 7.66667 8.5V9.5ZM8.25592 9.74408C8.4122 9.90036 8.5 10.1123 8.5 10.3333H9.5C9.5 9.8471 9.30685 9.38079 8.96303 9.03697L8.25592 9.74408ZM8.5 10.3333V13H9.5V10.3333H8.5Z"
                          fill="#808080"
                        />
                      </svg>
                      Store & Malls
                    </h2>
                  </div>
                  <ul className="list-unstyled">
                    <li>
                      <h5>Leidsestraat</h5>
                      <span>0.2 km</span>
                    </li>
                    <li>
                      <h5>Leidsestraat</h5>
                      <span>0.2 km</span>
                    </li>
                    <li>
                      <h5>The Krijtberg Church</h5>
                      <span>0.2 km</span>
                    </li>
                    <li>
                      <h5>Moco Museum</h5>
                      <span>0.2 km</span>
                    </li>
                    <li>
                      <h5>National Pipe Museum</h5>
                      <span>0.2 km</span>
                    </li>
                  </ul>
                </Tab>
              </Tabs>
            </div>
          ) : (
            ""
          )}

          {/* Rules & Policies */}
          {/* <div className="hotelinfo__tabs__panel rulestab" id="r&p">
            <div className="hotelinfo__tabs__heading">
              <h4>Rules & Policies</h4>
            </div>
            <div className="hotelinfo__tabs__desc">
              <p>
                Photo ID proof with permanent address required for all guests
                before check in. Number of guests staying at the apartment must
                be as per the booking, additional guest stay overnight is not
                allowed. For a booking of two guests,
                <span>Read More</span>
              </p>
              <ul className="list-unstyled tabs-list">
                <li>
                  <img src="/images/checkedin.svg" alt="img" />
                  <div className="tabs-desc">
                    <h5>Check-in</h5>
                    <span>Until 12:00 hours</span>
                  </div>
                </li>
                <li>
                  <img src="/images/checkedin.svg" alt="img" />
                  <div className="tabs-desc">
                    <h5>Check-out</h5>
                    <span>Until 12:00 hours</span>
                  </div>
                </li>
                <li>
                  <img src="/images/paymenticon.svg" alt="img" />
                  <div className="tabs-desc">
                    <h5>Payment Method</h5>
                    <span>This property only accepts cash payments.</span>
                  </div>
                </li>
                <li>
                  <img src="/images/pets.svg" alt="img" />
                  <div className="tabs-desc">
                    <h5>Pets</h5>
                    <span>Pets are not allowed</span>
                  </div>
                </li>
                <li>
                  <img src="/images/smoking.svg" alt="img" />
                  <div className="tabs-desc">
                    <h5>Smoking</h5>
                    <span>Smoking is not allowed</span>
                  </div>
                </li>
                <li>
                  <img src="/images/restriction.svg" alt="img" />
                  <div className="tabs-desc">
                    <h5>Age restriction</h5>
                    <span>There is no age requirement for check-in</span>
                  </div>
                </li>
                <li>
                  <img src="/images/party.svg" alt="img" />
                  <div className="tabs-desc">
                    <h5>Party</h5>
                    <span>No Partying is allowed</span>
                  </div>
                </li>
              </ul>
              <div className="cancel-policy">
                <img src="/images/cross.svg" alt="cross" />
                <span>
                  <b>Cancellation policy</b>Cancel before 2 Dec and get a 50%
                  refund, minus the first night and service fee.
                </span>
              </div>
            </div>
          </div> */}
          {/* Review */}

          <div className="hotelinfo__tabs__panel rulestab" id="reviews">
            <div className="hotelinfo__tabs__heading">{/* <h4>Review</h4> */}</div>
            <div className="hotelinfo__tabs__review">
              {/* review card */}
              {/* <div className="review-card">
                <div className="review-card-left">
                  <div className="review-card-left-star">
                    <img src="/images/starsmile.svg" alt="smile" />
                    <h5>{props.rating}</h5>
                  </div>
                  <span>Based on {props.ratingcount} reviews</span>
                </div>
                 <div className="review-card-right">
                  <div className="review-card-desc">
                    <div className="review-card-desc-left">
                      <h5>Positive</h5>
                      <span>4 stars and above</span>
                    </div>
                    <div className="review-card-progressbar">
                      <span>80%</span>
                      <div className="progressbar-card good">
                        <span></span>
                      </div>
                    </div>
                  </div>
                  <div className="review-card-desc">
                    <div className="review-card-desc-left">
                      <h5>Neutral</h5>
                      <span>3 stars and above</span>
                    </div>
                    <div className="review-card-progressbar">
                      <span>15%</span>
                      <div className="progressbar-card avg">
                        <span></span>
                      </div>
                    </div>
                  </div>
                  <div className="review-card-desc">
                    <div className="review-card-desc-left">
                      <h5>Negative</h5>
                      <span>under 2 start</span>
                    </div>
                    <div className="review-card-progressbar">
                      <span>5%</span>
                      <div className="progressbar-card bad">
                        <span></span>
                      </div>
                    </div>
                  </div>
                </div> 
              </div> */}
              {/* recent */}
              {/* <div className="recent__wrapper">
                <div className="recent__heading">
                  <h5>Recent </h5>
                </div>
                <div className="recent__card">
                  <div className="recent__card__heading">
                    <h4>Charming and comfortable house</h4>
                    <div className="star-rate">
                      <span>★</span>
                      4.91
                    </div>
                  </div>
                  <p>
                    Reviews on peer-to-peer sites can happen organically, often
                    removing the company from the review process entirely. This
                    can be a nightmare if you’re managing a small business.
                  </p>
                  <div className="recent__card__profile">
                    <div className="recent__card__img">
                      <img src="/images/Vidya.jpeg" alt="profile" />
                    </div>
                    <div className="recent__card__desc">
                      <h5>Jushawn McDowell</h5>
                      <span>Jun 03-10, 2020</span>
                    </div>
                  </div>
                </div>
                <div className="recent__card">
                  <div className="recent__card__heading">
                    <h4>Hideaway tent with pool and tub</h4>
                    <div className="star-rate">
                      <span>★</span>
                      4.91
                    </div>
                  </div>
                  <p>
                    You might be on multiple social media platforms, so how can
                    you keep track of all these messages? If you’re providing
                    omnichannel customer service.
                  </p>
                  <div className="recent__card__profile">
                    <div className="recent__card__img">
                      <img src="/images/Vidya.jpeg" alt="profile" />
                    </div>
                    <div className="recent__card__desc">
                      <h5>Joana Leite</h5>
                      <span>Jun 03-10, 2020</span>
                    </div>
                  </div>
                </div>
                <div className="recent__card">
                  <div className="recent__card__heading">
                    <h4>Charming and comfortable house</h4>
                    <div className="star-rate">
                      <span>★</span>
                      4.91
                    </div>
                  </div>
                  <p>
                    We list customer quotes as the easiest type of review to get
                    because they involve very little effort for you and your
                    customer.
                  </p>
                  <div className="recent__card__profile">
                    <div className="recent__card__img">
                      <img src="/images/Vidya.jpeg" alt="profile" />
                    </div>
                    <div className="recent__card__desc">
                      <h5>Jushawn McDowell</h5>
                      <span>Jun 03-10, 2020</span>
                    </div>
                  </div>
                </div>
              </div>
                <button className="btn btn__outline">Load More</button> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HotelInfoDetail;
