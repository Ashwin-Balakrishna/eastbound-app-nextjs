import {useEffect, useState} from 'react';
import Cookies from "js-cookie";
const HotelNotFound = (props) => {
  const [accepted,setAccepted] = useState(false)
  const onSubmit= ()=>{
    props.handleSubmit()
  }
  useEffect(()=>{

  },[accepted])
  return (
    <div className="booking-card-wrapper">
      <div className="booking-overview-bottom">
        <div className="payment_modes_wrapper">
       
          <div class="form-check policy_details">
            <input class="form-check-input"  checked={accepted} onChange={()=>{setAccepted(!accepted)}} type="checkbox" id="hotelNotFound"/>
            <label class="form-check-label" for="hotelNotFound">
               I accept  <a target='_blank' href="/privacy-policy">Booking policy </a>,  <a target='_blank' href="/privacy-policy"> Terms of use</a> & <a  target='_blank' href="/privacy-policy">Privacy policy</a> 
            </label>
          </div>
        </div>
      </div>
      <div className="booking-action-button">
        <button className="btn btn__primary cus-btn" 
          disabled={!accepted} 
          type="submit" onClick={()=>onSubmit()}>
            Request Booking
            <span className="mx-1 spinner-border spinner-border-sm" hidden={!props.loader} role="status" aria-hidden="true"></span>
        </button>
      </div>
    </div>
  );
};

export default HotelNotFound;