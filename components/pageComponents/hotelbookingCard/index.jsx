import { useEffect, useState } from "react";
import ReactTooltip from "react-tooltip";
import router from "next/router";
import Link from 'next/link';

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
    minRate:props?.data?.srp_info?.minRate ,
    days:props?.data?.srp_info?.days,
    govt_tax_amount: props?.data?.srp_info?.govt_tax_amount,
    
    hotel_tax_amount:props?.data?.srp_info?.hotel_tax_amount,
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
      {/* <ReactTooltip effect="solid" /> */}
      <div className="hotelbooking__detailswrap">
        <div className="hotelbooking__card expand">
          <div className="hotelbooking__img">
            <img
              src={hotels.img_url}
              alt={hotels.name}
              loading="lazy"
              height="100%"
              width="100%"
            />
            {hotels.source==="hyperguest" ? (
              <span className="promotedtag">Promoted</span>
            ) : (
              ""
            )}
            <span className="photostag">{hotels.no_imgs} Photos</span>
          </div>
          <div className="hotelbooking__details">
            <div className="hotelbooking__desc">
              <h5>{hotels.name}</h5>
              <div className="hotelbooking__feedback">
                <span style={{ fontSize: "12px", color: "#808080" }}>
                  {hotels.city}
                </span>
                <div className="hotelbooking__star">
                  <span>{totalStar}</span>
                  {/* <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span> */}
                </div>
                {/* use bad, avg and good for rating parameter as classname */}
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
              {hotels.rackRate === 0 && hotels.netPayable === 0 ? (
                ""
              ) : (
                <div className="hotelbooking__foodtag">
                  <img src="/images/food.svg" alt="food" />
                  <h5>Breakfast Included</h5>
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
                  <div
                  title={hotels?.facility
                      ?.slice(4, hotels?.facility?.length)
                      .join(", ")}
                    style={{cursor:"pointer"}}
                   
                    className="hotelbooking__tags"
                  >
                    <span>+ {remainingFacility}</span>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            {(<div className={"hotelbooking__pricewrapper"}>
                <div className={hotels.minRate?"pricecard_overview":"pricecard_overview mt-3"}>
                  <div className="pricecard-overview-day" >
                    <h1>
                      <b>{hotels.room_type}</b> : {+hotels.room_count} Bed
                    </h1>
                    {/* // min rate + tax amount / days  */}
                    {/* tax amount / days tax per day */}
                    <label style={{color:"#1A1A1A"}}>{((+hotels.minRate + (+hotels.govt_tax_amount + +hotels.hotel_tax_amount) )/hotels.days)?`₹ ${Math.ceil((+hotels.minRate + (+hotels.govt_tax_amount + +hotels.hotel_tax_amount) )/hotels.days).toLocaleString("en-IN")}/day`:'Not Available'}</label>
                    <span>Inclusive of {Math.ceil(+hotels?.govt_tax_amount + +hotels.hotel_tax_amount)?.toLocaleString("en-IN")} taxes and charges/day</span>
                  </div>
                  <div className="pricecard-overview-full">
                    {isMobile?
                    (<span>
                      {hotels.days} nights, {+hotels.booking.adults + +hotels.booking.children} person
                    </span>):""
                    } 
                    <h1>
                       {(hotels.minRate + (+hotels.govt_tax_amount+ +hotels.hotel_tax_amount))?`Total ₹ ${Math.ceil(hotels.minRate + (hotels.govt_tax_amount + +hotels.hotel_tax_amount)).toLocaleString("en-IN")}`:'Not Available'}{" "}
                    </h1>
                    <label>Inclusive of {Math.ceil((+hotels?.govt_tax_amount+ +hotels?.hotel_tax_amount)* hotels.days)?.toLocaleString("en-IN")} total tax</label>
                    {!isMobile?
                    (<span>
                      {hotels.days ? `${hotels.days} nights,` : ""} {+hotels.booking.adults + +hotels.booking.children} person
                    </span>):""
                    } 
                  </div>
                </div>
                <button
                  // disabled={!hotels.minRate}
                  className="btn btn__primary"
                  onClick={(e) => {
                    e.preventDefault();
                  
                   {hotels.minRate?
                    window.open(`/hotelinfo?hotelcode=${hotels.url}&source=${hotels.source}&checkin=${hotels.booking.checkin}&checkout=${hotels.booking.checkout}&adult=${hotels.booking.adults}&child=${hotels.booking.children}&rooms=${hotels.booking.rooms}&lat=${props.data.latitude}&lng=${props.data.longitude}&city=${hotels.city}`,"_blank")
                    :
                    window.open(`/bookingnew?hotelcode=${hotels.url}&source=${hotels.source}&checkin=${hotels.booking.checkin}&checkout=${hotels.booking.checkout}&adult=${hotels.booking.adults}&child=${hotels.booking.children}&rooms=${hotels.booking.rooms}&lat=${props.data.latitude}&lng=${props.data.longitude}&type=RequestBooking&city=${hotels.city}`,"_blank")}
                  }}
                >
                  {!hotels.minRate? "Request Booking":"Explore"}
                </button>
                <h6>{hotels.minRate?"Free Cancellation":""} </h6>
                {/* • No Prepayment  */}
              </div>)}
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
