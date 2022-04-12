import { useEffect, useState } from "react";
import ReactTooltip from "react-tooltip";
import router from "next/router";

export default function HotelBookingCard(props) {
  const hotels = {
    name: props.name,
    room_count: props.room_count,
    expand: props.expand,
    city: props.city,
    img_url: props.img_url,
    promoted: props.promoted,
    no_imgs: props.no_imgs,
    star: props.star,
    expand: props.expand,
    rating: props.rating,
    breakfast: props.breakfast,
    PDP: props.perdayprice,
    netPayable: props.netPayable,
    room_type: props.room_type,
    marginRate: props.marginRate,
    perNightRate: props.perNightRate,
    facility: props.facility,
    cancellation: props.cancellation,
    PDT: props.perdaytax,
    totalTax: props.totaltax,
    safety: props.safety,
    url: props.url,
    source: props.source,
    booking: props.booking,
    days: props.no_of_days,
    agents_margin: props.agents_margin,
    index: props.id,
    newPDT: Math.floor(
      parseInt(props.perdayprice.replace(/,/g, "")) >= 7500
        ? parseInt(props.perdayprice.replace(/,/g, "")) * 0.18
        : parseInt(props.perdayprice.replace(/,/g, "")) * 0.12
    ),
    newPDP: Math.floor(
      parseInt(props.perdayprice.replace(/,/g, "")) +
        (parseInt(props.perdayprice.replace(/,/g, "")) >= 7500
          ? parseInt(props.perdayprice.replace(/,/g, "")) * 0.18
          : parseInt(props.perdayprice.replace(/,/g, "")) * 0.12)
    ),
  };

  const starsymbol = "★";
  const totalStar = starsymbol.repeat(hotels.star);
  const [facilities, setFacilities] = useState([]);
  const [remainingFacility, setRemainingFacility] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (props) {
      // console.log(hotels.img_url);
      ReactTooltip.rebuild();
      {
        facilities?.length > 5
          ? setFacilities(hotels?.facility)
          : setFacilities(hotels?.facility?.slice(0, 4));
      }
      setRemainingFacility(hotels?.facility?.length - 4);
    }
  }, [props]);

  return (
    <div
      onClick={() => {
        props.setHotelClicked(props.id);
      }}
      key={props.id}
    >
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
                      `/hotelinfo?hotelcode=${hotels.url}&source=${hotels.source}&checkin=${hotels.booking.checkin}&checkout=${hotels.booking.checkout}&adult=${hotels.booking.adults}&child=${hotels.booking.children}&rooms=${hotels.booking.rooms}&lat=${props.data.latitude}&lng=${props.data.longitude}`
                    );
                  }}
                >
                  Explore
                </button>
              </div> */}
            <div className="pricecard_overview mapcard_price">
              <div className="pricecard-overview-day">
                <h1>
                  <span>Private Suite</span> : {hotels.room_count} Bed
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
    </div>
  );
}
