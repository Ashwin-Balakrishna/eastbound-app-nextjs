/* eslint-disable no-dupe-keys */
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import HotelInfo from "../../../pages/profilenew/newProfile";
import router from "next/router";
import Booking from "../../../pages/bookingnew/index";
import ReactTooltip from 'react-tooltip';

const HotelBookingCardSearch = (props) => {
  const hotels = {
    name: props.name,
    expand: props.expand,
    city: props.city,
    img_url: props.img_url,
    promoted: props.promoted,
    no_imgs: props.no_imgs,
    star: props.star,
    expand: props.expand,
    room_type: props.room_type,
    marginRate: props.marginRate,
    perNightRate: props.perNightRate,
    facility: props.facility,
    safety: props.safety,
    booking: props.booking,
   
  };

  const [facilities, setFacilities] = useState([]);
  const [remainingFacility, setRemainingFacility] = useState(0);
  useEffect(() => {
    if (props) {
      // console.log(hotels.img_url);
      ReactTooltip.rebuild();
      {
        facilities.length > 5 ? setFacilities(hotels?.facility) : setFacilities(hotels?.facility?.slice(0, 4));
      }
      setRemainingFacility(hotels?.facility?.length - 4);
    }
  }, [props]);

  const starsymbol = "★";
  const totalStar = starsymbol.repeat(hotels.star);
  return (
    <div
      onClick={() => {
        props.setHotelClicked(props.id);
      }}
    >
     <ReactTooltip effect="solid"/>
      {hotels.expand ? (
        <div className="hotelbooking__detailswrap">
          <div className="hotelbooking__card expand">
            <div className="hotelbooking__img">
              <img src={hotels.img_url} alt="IMAGE NOT FOUND" />
              {hotels.promoted ? <span className="promotedtag">Promoted</span> : ""}
              <span className="photostag">{hotels.no_imgs} Photos</span>
            </div>
            <div className="hotelbooking__details">
              <div className="hotelbooking__desc">
                <h5>{hotels.name}</h5>
                <div className="hotelbooking__feedback">
                  <span style={{ fontSize: "12px", color: "#808080" }}>{hotels.city}</span>
                  <div className="hotelbooking__star">
                    <span>{totalStar}</span>
                    {/* <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span> */}
                  </div>
                  {/* use bad, avg and good for rating parameter as classname */}
                  
                </div>
                {hotels.rackRate === 0 && hotels.netPayable === 0 ? (
                  ""
                ) : (
                  <div className="hotelbooking__foodtag">
                    <img src="/images/food.svg" alt="food" />
                    <h5 >Breakfast Included</h5>
                    <span>Optional</span>
                  </div>
                )}

                <div className="hotelbooking__tagswrapper">
                  {facilities?.map((facility, i) => (
                    <div className="hotelbooking__tags" key={i}>
                      <span>{facility}</span>
                    </div>
                  ))}
                  {remainingFacility > 0 ? (
                    <div data-tip={hotels?.facility?.slice(4, hotels?.facility?.length).join(', ')} className="hotelbooking__tags">
                      <span >+ {remainingFacility}</span>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="hotelbooking__pricewrapper">
                <div className="pricecard_overview" style={{minHeight:"80%"}}>
                  <div className="pricecard-overview-day">
                    <h1><span>NA</span> : 1 Bed</h1>
                    <label>NA</label>
                    <span>Inclusive of NA taxes and charges/day</span>
                  </div>
                  <div className="pricecard-overview-full">
                    <h1>
                      <span>Total</span> NA{" "}
                    </h1>
                    <label>Inclusive of NA total tax</label>
                    <span>
                      {hotels.days} nights, {+hotels.booking.adults + +hotels.booking.children} person
                    </span>
                  </div>
                </div>
                <button
                disabled={true}
                  className="btn btn__primary"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(
                      `/hotelinfo?hotelcode=${hotels.url}&checkin=${hotels.booking.checkin}&checkout=${hotels.booking.checkout}&adult=${hotels.booking.adults}&child=${hotels.booking.children}&rooms=${hotels.booking.rooms}&lat=${props.data.latitude}&lng=${props.data.longitude}`
                    );
                  }}
                >
                  Explore
                </button>
                {/* <h6>Free Cancellation • No Prepayment </h6> */}
              </div>
            </div>
          </div>
          {hotels.safety ? (
            <div className="hotelbooking__safety">
              <img src="/images/safety.svg" alt="safety" />
              <span>Safe & Hygienic Stay</span>
              Safety protocal in partnership with SGS
            </div>
          ) : (
            ""
          )}
        </div>
      ) : (
        <div className="hotelbooking__detailswrap">
          <div className="hotelbooking__card">
            <div className="hotelbooking__img">
              <img src={hotels.img_url} alt="IMAGE NOT FOUND" />
              {/* <img src={`${IMAGE_URL}${hotels.img_url}`} alt='/images/basic.png' />    Hotel beds requirement*/}
              <span className="photostag">{hotels.no_imgs} Photos</span>
            </div>
            <div className="hotelbooking__desc">
              <h5>{hotels.name}</h5>
              <div className="hotelbooking__feedback">
                <span>{hotels.city}</span>
                <div className="hotelbooking__star">
                  <span>{totalStar}</span>
                </div>
                {hotels.rating > 0 ? (
                  <span
                    className={
                      hotels.rating > 3.5
                        ? "rating good"
                        : hotels.rating > 2.5 && hotels.rating <= 3.5
                        ? "rating avg"
                        : "rating bad"
                    }
                  >
                    {hotels.rating} / 5
                  </span>
                ) : (
                  ""
                )}
              </div>
              {/* <ul className="list-unstyled d-flex">
                <li>
                  <span>Hotel Rack Rate</span>
                  <h4>₹{hotels.rackRate}</h4>
                </li>
                <li className="seperation">|</li>
                <li>
                  <span>Net Payable</span>
                  <h4>₹{hotels.netPayable}</h4>
                </li>
              </ul> */}
              {/* <div className="hotelbooking__bottom">
                <div className="hotelbooking__rate">
                  <h4>₹{hotels.marginRate}</h4>
                  <span>
                    for {hotels.days} nights
                    <img src="/images/info.svg" alt="info" />
                  </span>
                </div>
                <button
                  className="btn btn__primary"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(
                      `/hotelinfo?hotelcode=${hotels.url}&checkin=${hotels.booking.checkin}&checkout=${hotels.booking.checkout}&adult=${hotels.booking.adults}&child=${hotels.booking.children}&rooms=${hotels.booking.rooms}&lat=${props.data.latitude}&lng=${props.data.longitude}`
                    );
                  }}
                >
                  Explore
                </button>
              </div> */}
              <div className="pricecard_overview mapcard_price">
                <div className="pricecard-overview-day">
                  <h1>
                    <span>Private Suite</span> : 1 Bed
                  </h1>
                  <label>₹3,100/day</label>
                  <span>+₹ 222 taxes and charges/day</span>
                </div>
                <div className="pricecard-overview-full">
                  <span>3 nights, 2 person</span>
                  <h1>
                    <span>Total</span> ₹7,200{" "}
                  </h1>
                  <label>Inclusive of 522 total tax</label>
                </div>
              </div>
            </div>
          </div>
          {hotels.safety ? (
            <div className="hotelbooking__safety">
              <img src="/images/safety.svg" alt="safety" />
              <span>Safe & Hygienic Stay</span>
              Safety protocal in partnership with SGS
            </div>
          ) : (
            ""
          )}
        </div>
      )}
      
    </div>
  );
};

export default HotelBookingCardSearch;
