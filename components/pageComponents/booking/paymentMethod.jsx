import {useEffect, useState} from 'react';
import Cookies from "js-cookie";
const PaymentMethod = (props) => {
  const [option,setOption]=useState('')
  const [accepted,setAccepted] = useState(false)
  const [visible , setVisible] = useState(false)
  const [total,setTotal] = useState(0)
  // console.log(props.creditAmount)
  useEffect(()=>{
    var url = window.location.search;
    var params = new URLSearchParams(url);
    const rate =  params.get('rate')
    if (Cookies.get('accesses')&&JSON.parse(Cookies.get('accesses')).includes(12))
    setVisible(true) 
    setTotal(parseInt(rate))
    if(Cookies.get('accesses')&&!JSON.parse(Cookies.get('accesses')).includes(12)){
      setCC()
    }
  },[])
  const setHub=()=>{
    props.setPaymentMethod({method:'2Hub Wallet'})
    return setOption(0)
  }
  const setCC=()=>{
    props.setPaymentMethod({method:'Payment Gateway'})
    return setOption(1)
  }
  const setCR=()=>{
    props.setPaymentMethod({method:'Credit'})
    return setOption(2)
  }
  function onSubmit(){
    props.handleSubmit()
  }
  return (
    <div className="booking-card-wrapper">
      <div className="booking-overview-bottom">
        <div className="payment_modes_wrapper">
          <ul>
          {visible &&  <li  onClick={setHub} className={option===0?"active":""}> 
              <svg  classname="default" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="#808080" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9 12L11 14L15 10" stroke="#808080" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <label>Deposit Account</label>
              <div className="wallet_balance_details">
                <span>Available Balance</span>
                <label>₹ {parseInt(props?.walletAmount).toLocaleString('en-IN')}</label>
              </div>
            </li>}
            <li onClick={setCR} className={option===2?"active":""}>
              <svg className="default" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="#808080" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9 12L11 14L15 10" stroke="#808080" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <label>Credit</label>
              <div className="wallet_balance_details">
                <span>Available Credit</span>
                <label>₹ {parseInt(props?.creditAmount).toLocaleString('en-IN')}</label>
              </div>
            </li>
            <li  onClick={setCC} className={option===1?"active":""}>
              <svg className="default" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="#808080" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9 12L11 14L15 10" stroke="#808080" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <label>Payment Gateway</label>
            </li>
            
          </ul>
          <div className="form-check policy_details">
            <input className="form-check-input" checked={accepted?true:false} onChange={()=>setAccepted(!accepted)} type="checkbox" id="policychecked"/>
            <label className="form-check-label" for="policychecked">
               I accept  <a target='_blank' href="/privacy-policy">Booking policy </a>,  <a target='_blank' href="/privacy-policy"> Terms of use</a> & <a  target='_blank' href="/privacy-policy">Privacy policy</a> 
            </label>
          </div>
        </div>
      </div>
      <div className="booking-action-button">
        <button className="btn btn__primary cus-btn" 
          disabled={!accepted || option === '' ||(option === 0 && props.rate>parseInt(props?.walletAmount)) || (option === 2 && props.rate>parseInt(props?.creditAmount)) || props.loader} 
          type="submit" onClick={onSubmit}>
            Pay via {option === 0 ?'Deposit Account':option === 1?'Payment Gateway':option === 2 ?'Credit':''}
            <span className="mx-1 spinner-border spinner-border-sm" hidden={!props.loader} role="status" aria-hidden="true"></span>
        </button>
        {option === 0 && <span hidden={!(props.rate>parseInt(props?.walletAmount))} className='text-danger'>* Deposit Balance is Less than Actual Price</span>}
        {option === 2 && <span hidden={!(props.rate>parseInt(props?.creditAmount))} className='text-danger'>* Credit Balance is Less than Actual Price</span>}
      </div>
    </div>
  );
};

export default PaymentMethod;