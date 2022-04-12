import React from "react";
import { Form } from "react-bootstrap";
import { useEffect } from "react";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const HotelInfoAppointment = (props) => {
  useEffect(() => {
    // console.log("hello=>", props);
  },[]);
  // const total_price = props.PDP * props.days;
  // let newPDT = Math.floor(parseInt(props.PDP) >= 7500 ? parseInt(props.PDP) * 0.18 : parseInt(props.PDP) * 0.12);
  // let newPDP = Math.floor(
  //   parseInt(props.PDP) + (parseInt(props.PDP) >= 7500 ? parseInt(props.PDP) * 0.18 : parseInt(props.PDP) * 0.12)
  // );
  let tax= Math.ceil(props.GTA+ +props?.data?.[0]?.srp_info?.hotel_tax_amount)
  // const new_total_price = newPDP * props.days;
  // const total_tax = newPDT * props.days;
  return (
    <div>
      <div className="hotelinfo__container__right">
        <div className="hotelinfo__searchroom">
          <Form>
            <h4>Trip Detail's</h4>
            <Form.Group className="form-controls">
              <div className="form-group-icon">
                <span className="icon-group">
                  <img src="/images/calender.svg" alt="" />
                </span>
                <div className=" date-picker">
                  <Form.Control
                    disabled
                    style={{ background: "none" }}
                    type="text"
                    value={`${props.checkin} - ${props.checkout}`}
                  />
                </div>
              </div>
            </Form.Group>
            <Form.Group className="form-controls">
              <div className="form-group-icon">
                <span className="icon-group">
                  <img src="/images/guest.svg" />
                </span>

                <Form.Control
                  disabled
                  style={{ background: "none" }}
                  type="text"
                  value={`${props.adult} Adult, ${props.child} Child, ${props.rooms} Room`}
                />
                {/* use is-open class to open the dropdown */}
                {/* <div className="c-dropdown guestdropdown">
                    <div className="guestdropdown__card">
                      <h5>Adult</h5>
                      <div className="guestdropdown__count">
                        <button>
                          <img src="/images/minus.svg" alt="plus" />
                        </button>
                        <input type="text" value="1" />
                        <button>
                          <img src="/images/plus.svg" alt="plus" />
                        </button>
                      </div>
                    </div>
                    <div className="guestdropdown__card">
                      <h5>
                        Child<span>(0-11 Years)</span>
                      </h5>
                      <div className="guestdropdown__count">
                        <button>
                          <img src="/images/minus.svg" alt="plus" />
                        </button>
                        <input type="text" value="2" />
                        <button>
                          <img src="/images/plus.svg" alt="plus" />
                        </button>
                      </div>
                    </div>
                    <div className="guestdropdown__addrooms">
                      <button className="btn btn__link">Add Rooms</button>
                    </div>
                  </div>  */}
              </div>
            </Form.Group>
          
            <ul className="list-unstyled hotelinfo__searchroom__price">
              <li>
                
                {(props?.data?.[0]?.srp_info?.minRate) ?(
                  <>
                  <h5>
                    ₹{Math.ceil(props?.data?.[0]?.srp_info?.minRate /props?.data?.[0]?.srp_info?.days )?.toLocaleString("en-IN")} x {props.days} nights
                  </h5>
                  </>
                ):(<div style={{width:"50%"}}><Skeleton  /> </div>)}
                {(props?.data?.[0]?.srp_info?.minRate) ?(
                  <>
                  <span>₹ {(props?.data?.[0]?.srp_info?.minRate )?.toLocaleString("en-IN")} </span>
                  </>
                ):(<div style={{width:"30%"}}><Skeleton  /> </div>)}
                
              </li>
              
              <li>
                <h5>Taxes & charges per day</h5>
                {(props?.data?.[0]?.srp_info?.minRate) ?(
                  <>
                  
                  <span>₹{tax?.toLocaleString("en-IN")}</span>
                  </>
                ):(<div style={{width:"30%"}}><Skeleton  /> </div>)}
                
              </li>
              <li className="total">
                <h5>Total</h5>
                {(props?.data?.[0]?.srp_info?.minRate) ?(
                  <>
                  <span>
                  ₹{(props?.data?.[0]?.srp_info?.minRate +tax) ?.toLocaleString("en-IN")}
                  <label>Inclusive of {tax* props?.data?.[0]?.srp_info?.days?.toLocaleString("en-IN")} total tax</label>
                </span>
                  </>
                ):(<div style={{width:"30%"}}><Skeleton  /> </div>)}
                
              </li>
            </ul>
            {/* <button className="btn btn__primary" type="submit">
                Select Room Type
              </button> */}
          </Form>
        </div>
      </div>
    </div>
  );
};

export default HotelInfoAppointment;
