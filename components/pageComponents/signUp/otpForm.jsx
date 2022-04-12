import { Formik } from "formik";
import Link from "next/link";
import Router from "next/router";
import React, { useState, useRef, useEffect } from "react";
import { Row, Col, Button, Card, Form } from "react-bootstrap";
import * as Yup from "yup";
import { API_URL, NODE_API_URL, ADMIN_API_URL } from "../../../utils/helper";
import ErrorText from "../../elements/errorText";
import PhoneNumber from "../../elements/phoneNumber/phoneNumber";
import TextField from "../../elements/textField/textField";
import { fetchDataWithoutAuth } from "../../../utils/apiHelper";
import { authenticateUser } from "../../../utils/helper";
import { useWindowSize } from "../../../hooks/useWindowSize";
import { FaHeart } from "react-icons/fa";
import FormLabel from "../../elements/formLabel";

//Elements
import OtpBoxes from '../../elements/otpBoxes'
import Timer from '../../elements/timer'

//scss
import Styles from './joinUsForm.module.scss'

//helper
import { maskMobile, maskEmail, validateEmail } from '../../../utils/helper.js'
import { identity, values } from "lodash";

import { useRouter } from "next/router";

const OTPForm = (props) => {
  const router = useRouter();
const routePayload = router.query;

const mobileTimerRef = useRef();
  const emailTimerRef = useRef();

  const [mobileOTPError, setMobileOTPError] = useState("");
  const [emailOTPError, setEmailOTPError] = useState("");

  const [otp1, setotp1] = useState('');
  const [otp2, setotp2] = useState('');
  const [otp3, setotp3] = useState('');
  const [otp4, setotp4] = useState('');
  const [otp5, setotp5] = useState('');
  const [otp6, setotp6] = useState('');

  const [eotp1, setEotp1] = useState('');
  const [eotp2, setEotp2] = useState('');
  const [eotp3, setEotp3] = useState('');
  const [eotp4, setEotp4] = useState('');

  const OTP1 = useRef();
  const OTP2 = useRef();
  const OTP3 = useRef();
  const OTP4 = useRef();
  const OTP5 = useRef();
  const OTP6 = useRef();

  const EOTP1 = useRef();
  const EOTP2 = useRef();
  const EOTP3 = useRef();
  const EOTP4 = useRef();

  const [phoneTotalAttempts, setPhoneTotalAttempts] = useState(5);
  const [phoneBalanceAttempts, setPhoneBalanceAttempts] = useState(props.phoneBalance);
  const [showPhoneAttempts, setShowPhoneAttempts] = useState(false);
  const [disablePhoneResendOTP, setDisablePhoneResendOTP] = useState(true);
  const [phoneExceededText, setPhoneExceededText] = useState('Phone OTP Limit Reached');

  const [emailTotalAttempts, setEmailTotalAttempts] = useState(5);
  const [emailBalanceAttempts, setEmailBalanceAttempts] = useState(props.emailBalance);
  const [showEmailAttempts, setShowEmailAttempts] = useState(false);
  const [disableEmailResendOTP, setDisableEmailResendOTP] = useState(true);
  const [emailExceededText, setEmailExceededText] = useState('Email OTP Limit Reached');

  const [phoneOTPVerified, setPhoneOTPVerified] = useState(props.phoneOTPVerified);
  const [emailOTPVerified, setEmailOTPVerified] = useState(props.emailOTPVerified);

  const [disableBtn, setDisableBtn] = useState(false);

  useEffect(()=>{
    // if(props.screen==1){
      console.log(props);
    if(!props.phoneOTPVerified){
    setDisablePhoneResendOTP(true);
    setTimeout(() => setDisablePhoneResendOTP(false), 30000);
    }
    if(!props.emailOTPVerified){
    setDisableEmailResendOTP(true);
    setTimeout(() => setDisableEmailResendOTP(false), 30000);
    }
    // }
  },[props.screen]);


  const sendPhoneOTP = async(data) =>
new Promise(async(resolve, reject) => {
  // data.phone_number = data.phone_number.replace(
  //     data.dial_code,
  //     ""
  //   );
    const payload={
      'phone':data.phone_number,
      'email':data.email
    }
    try {
      const response = await fetchDataWithoutAuth(
        `${NODE_API_URL}/auth/sendMobileOTP`,
        "GET",
        `email=${payload.email}&phone=${payload.phone}`,
        null,
        null,
        null
      );

      if (response && !response.status) {
        reject(response.message);
        props.setErrorMessage(response.message);
      } else if(response && response.status) {
        resolve(response)
      }
    } catch (err) {
     reject(err);
    }
});


const sendEmailOTP = (data) =>
new Promise(async(resolve, reject) => {
  // data.phone_number = data.phone_number.replace(
  //     data.dial_code,
  //     ""
  //   );
    const payload={
      'phone':data.phone_number,
      'email':data.email
    }
    try {
      const response = await fetchDataWithoutAuth(
        `${NODE_API_URL}/auth/sendEmailOTP`,
        "GET",
        `email=${payload.email}&phone=${payload.phone}`
      );

      if (response && !response.status) {
        reject(response.message);
        props.setErrorMessage(response.message);
      } else if(response && response.status) {
        resolve(response)
      }
    } catch (err) {
     reject(err);
    }
});
  



  const resendPhoneOTP=async(phone_number, email)=>{
    const payload={
      'phone_number':phone_number,
      'email':email
    }
    try {
      sendPhoneOTP(payload).then((data)=>{
        if (!data.status) {
          props.setErrorMessage(data.message);
        } else {
          setDisablePhoneResendOTP(true)
          setTimeout(() => setDisablePhoneResendOTP(false), 30000);
          setPhoneBalanceAttempts(parseInt(phoneBalanceAttempts)-1); 
          setShowPhoneAttempts(true);
          mobileTimerRef.current.getAlert()
          setMobileOTPError('')
          props.setErrorMessage('');
          resetMobileOTP();
        }
      })
      
    } catch (err) {
      props.setErrorMessage(err);
    }
   
  }

  const resendEmailOTP=async(phone_number, email)=>{
    const payload={
      'phone_number':phone_number,
      'email':email
    }
    try {
      sendEmailOTP(payload).then((data)=>{
        if (!data.status) {
          props.setErrorMessage(data.message);
        } else {
            setDisableEmailResendOTP(true)
            setTimeout(() => setDisableEmailResendOTP(false), 30000);
            setEmailBalanceAttempts(parseInt(emailBalanceAttempts)-1);
            setShowEmailAttempts(true); 
            emailTimerRef.current.getAlert()
            setEmailOTPError('');
            props.setErrorMessage('');
            resetEmailOTP();
        }
      })
    } catch (err) {
      props.setErrorMessage(err);
    }
  
  }

const resetMobileOTP=()=>{
  setotp1('');
  setotp2('');
  setotp3('');
  setotp4('');
  setotp5('');
  setotp6('');

  
}

const resetEmailOTP=()=>{
  
  setEotp1('');
  setEotp2('');
  setEotp3('');
  setEotp4('');
}
const verifyPhoneOTP = async(email,otp) =>
new Promise(async(resolve, reject) => {
  const payload={
    'email':email,
    'OTP':parseInt(otp)
  }
    try {
      const response = await fetchDataWithoutAuth(
        `${NODE_API_URL}/auth/verifyMobileOTP`,
        "POST",
        null,
        {"Content-Type":"application/json"},
        payload
      );

      if(response && !response.status) {
        // console.log("321", response.Error)
        // reject("Invalid phone");
        if(response.message.includes('Invalid')){
          resolve({status:"Error", message:'invalid'})
        }
        else{
          resolve({status:"Error", message:response.message})
        }
      } 
      else if(response && response.status) {
        setTimeout(() => setPhoneOTPVerified(true), 3000);     
        resolve({status:"Success"})
      }
    } catch (err) {
     reject(err);
    }
});


const verifyEmailOTP = async(email,otp) =>
new Promise(async(resolve, reject) => {
  const payload={
    'email':email,
    'OTP':parseInt(otp)
  }
    try {
      const response = await fetchDataWithoutAuth(
        `${NODE_API_URL}/auth/verifyEmailOTP`,
        "POST",
        null,
        {"Content-Type":"application/json"},
        payload
      );
      // console.log("response", response)
      if(response && !response.status) {
        if(response.message.includes('Invalid')){
          resolve({status:"Error", message:'invalid'})
        }
        else{
          resolve({status:"Error", message:response.message})
        }
      } 
      else if(response && response.status) {
        // console.log("response inside", response)
        setTimeout(() =>  setEmailOTPVerified(true), 3000);
        resolve({status:"Success"})
      }
    } catch (err) {
     reject(err);
    }
});


const afterOTPVerification=async()=>{
  try {
    const response = await fetchDataWithoutAuth(
      `${ADMIN_API_URL}/api/dashboard/email/agentRegistrationNew`,
      "GET",
      `email=${props.email}`
    );
    
  } catch (err) {
   console.log(err);
  }

  if(props.fromLogin){
    await authenticateUser(
      router.query.token,
      props.email,
      router.query.first_name,
      'complete',
      '',
      false
    );
    console.log("new login", router.query)
    router.replace(
      {
        pathname: '/profile',
        query: {newUser:true}
      },
            '/profile',
          );
  
     }
    else
    // router.replace('/login')  
    props.setAccountCreated(true);
}

  const verifyOTP=async(email)=>{
    let mobileError=false;
    let emailError=false;
    if (otp1.length == 0 || otp2.length == 0 || otp3.length == 0 || otp4.length == 0 || otp5.length == 0 || otp6.length == 0) {
      if(!phoneOTPVerified){
      setMobileOTPError("Please enter mobile OTP");
      mobileError=true;    
      }
  }
  if (eotp1.length == 0 || eotp2.length == 0 || eotp3.length == 0 || eotp4.length == 0) {
    if(!emailOTPVerified){
    setEmailOTPError("Please enter email OTP");
    emailError=true;    
    }
}
if(mobileError||emailError){
  // return;
}
  else {
    // resetOTP();
    if(otp1.length>0)
     OTP1.current.focus();
     if(eotp1.length>0)
      EOTP1.current.focus();
    resetEmailOTP();
    resetMobileOTP();
     
      var finalMobileOtp = otp1.toString() + otp2.toString() + otp3.toString() + otp4.toString() + otp5.toString() + otp6.toString();
      var finalEmailOtp = eotp1.toString() + eotp2.toString() + eotp3.toString() + eotp4.toString();
    
      if(!phoneOTPVerified && !emailOTPVerified){
     await Promise.all([verifyPhoneOTP(email,finalMobileOtp),verifyEmailOTP(email,finalEmailOtp)]).then(async(data) => {
      
        if(data[0]['status']=='Success' && data[1]['status']=='Success'){
        
       await afterOTPVerification();
      }
      else if(data[0]['status']=='Error' && data[1]['status']=='Error' &&data[0]['message']=='invalid' && data[1]['message']=='invalid' ){
      props.setErrorMessage(
          `Invalid mobile and email otp`
        );
      }
      else if(data[0]['status']=='Error' &&data[0]['message']=='invalid' ){
        props.setErrorMessage(
          `Invalid mobile otp`
        );
      }
      else if(data[1]['status']=='Error' && data[1]['message']=='invalid' ){
        props.setErrorMessage(
          `Invalid email otp`
        );
      }
      else{
        props.setErrorMessage(
          data[0]['message']
        );
      }
      // else{
      //   props.setErrorMessage(
      //     `Something went wrong! Please try again later.`
      //   );
      // }
  }).catch((err) => {
    // props.setErrorMessage(
    //       `Something went wrong! Please try again later.`
    //     );
        console.error(
          `Something went wrong! Error123: ${JSON.stringify(err)}`
        );
  })
}
else if(!phoneOTPVerified){
 await verifyPhoneOTP(email,finalMobileOtp).then(async(data) => {
    if(data['status']=='Success'){
      await afterOTPVerification();
    }
    else{
      if(data['status']=='Error' &&data['message']=='invalid' ){
        props.setErrorMessage(
          `Invalid mobile otp`
        );
      }
      else{
      props.setErrorMessage(
        data['message']
      );
      }
    }
}).catch((err) => {
  // props.setErrorMessage(
  //       `Something went wrong! Please try again later.`
  //     );
      console.error(
        `Something went wrong! Error: ${JSON.stringify(err)}`
      );
})
}
else if(!emailOTPVerified){
 await verifyEmailOTP(email,finalEmailOtp).then(async(data) => {
    if(data=='Success'){
      await afterOTPVerification();
    }
    else{
      if(data['status']=='Error' &&data['message']=='invalid' ){
        props.setErrorMessage(
          `Invalid email otp`
        );
      }
      else{
      props.setErrorMessage(
        data['message']
      );
      }
    }
}).catch((err) => {
  // console.log("123")
  // props.setErrorMessage(
  //       `Something went wrong! Please try again later.`
  //     );
      console.error(
        `Something went wrong! Error: ${JSON.stringify(err)}`
      );
})
}
  }
 
  }


  return(
      <>
         <p>Please enter the 2 unique OTPs sent to:</p>
                  <Row>
                    <Col md={6}>
                      <div className="d-flex">
                        <div className='border border-dark rounded mb-1 d-flex align-items-center justify-content-center' style={{ minWidth: '40px', height: '40px' }}>
                          <img src="/images/svg/otp-email.svg" alt="email-icon" />
                        </div>
                        <Col style={{ marginLeft: '10px' }}>
                          <Row><p style={{ margin: "0px", fontSize: '14px' }}>Email:</p></Row>
                          <Row style={{ width: "147px",wordBreak: "break-all"}}><p style={{ margin: "0px", fontSize: '12px' }}>{maskEmail(props.email)}</p></Row>
                          {!props.fromLogin&&<Row><span className={Styles.editText} onClick={() => props.editEmail()}>(Edit)</span></Row>}

                        </Col>
                      </div>

                    </Col>
                    <Col md={6}>
                      <div className="d-flex">

                        <div className='border border-dark rounded mb-1 d-flex align-items-center justify-content-center' style={{ minWidth: '40px', height: '40px' }}>
                          <img src="/images/svg/otp-mobile.svg" alt="mobile-icon" />
                        </div>
                        <Col style={{ marginLeft: '10px' }}>
                          <Row><p style={{ margin: "0px", fontSize: '14px' }}>Mobile:</p></Row>
                          <Row><p style={{ margin: "0px", fontSize: '12px' }}>{maskMobile(props.phone_number)}</p></Row>
                          {!props.fromLogin&&<Row><span className={Styles.editText} onClick={() => props.editMobile()}>(Edit)</span></Row>}
                        </Col>
                      </div>

                    </Col>
                  </Row>
                  <hr />
                  <div style={{ margin: "10px 0" }}>
                    <label className="small text-muted font-weight-bold form-label">MOBILE OTP</label>
                    <Row>
                      <Col md={9}>
                        <div style={{ width: "fit-content" }} className={phoneOTPVerified?Styles.disable:''}>
                          <OtpBoxes otp1={otp1} otp2={otp2} otp3={otp3} otp4={otp4} otp5={otp5} otp6={otp6} setotp1={setotp1} setotp2={setotp2} setotp3={setotp3} setotp4={setotp4} setotp5={setotp5} setotp6={setotp6}
                            OTP1={OTP1} OTP2={OTP2} OTP3={OTP3} OTP4={OTP4} OTP5={OTP5} OTP6={OTP6} phone={true} setOtpError={setMobileOTPError} setErrorMessage={props.setErrorMessage}/>
                          <Row style={{ padding: '0px 20px' }}>
                            <Col className="p-0">
                             {showPhoneAttempts&& !phoneOTPVerified && <span className={Styles.attemptsText}>Attempts: {phoneBalanceAttempts}/{phoneTotalAttempts}</span>}
                            </Col>
                            {!phoneOTPVerified &&  <Col className="text-right p-0">
                              <Timer ref={mobileTimerRef} />
                            </Col>}
                          </Row>
                          {mobileOTPError.length>0&&<span className={Styles.attemptsText}>{mobileOTPError}</span>}
                          {phoneBalanceAttempts<0&&mobileOTPError.length==0 &&<span className={Styles.attemptsText}>{phoneExceededText}</span>}
                          {phoneOTPVerified&&<span className={Styles.verifiedText}>Your mobile OTP has been verified</span>}
                        </div>
                      </Col>
                      <span className={phoneBalanceAttempts>0&&!disablePhoneResendOTP&&!phoneOTPVerified?Styles.resendText:Styles.resendTextDisable} onClick={() => {resendPhoneOTP(props.phone_number, props.email)}}>Resend OTP</span>

                    </Row>
                  </div>
                  <div style={{ margin: "10px 0" }}>
                    <label className="small text-muted font-weight-bold form-label">EMAIL OTP</label>
                    <Row>
                      <Col md={9}>
                        <div style={{ width: "fit-content" }} className={emailOTPVerified?Styles.disable:''}>
                          <OtpBoxes otp1={eotp1} otp2={eotp2} otp3={eotp3} otp4={eotp4} otp5={otp5} otp6={otp6} setotp1={setEotp1} setotp2={setEotp2} setotp3={setEotp3} setotp4={setEotp4} setotp5={setotp5} setotp6={setotp6}
                            OTP1={EOTP1} OTP2={EOTP2} OTP3={EOTP3} OTP4={EOTP4} OTP5={OTP5} OTP6={OTP6} phone={false} setOtpError={setEmailOTPError} setErrorMessage={props.setErrorMessage}/>
                          <Row style={{ padding: '0px 20px' }}>
                            <Col className="p-0">
                            {showEmailAttempts&& !emailOTPVerified  && <span className={Styles.attemptsText}>Attempts: {emailBalanceAttempts}/{emailTotalAttempts}</span>}
                            </Col>
                            {!emailOTPVerified && <Col className="text-right p-0">
                              <Timer ref={emailTimerRef} />
                            </Col>}
                          </Row>
                          {emailOTPError.length>0&&<span className={Styles.attemptsText}>{emailOTPError}</span>}
                          {emailBalanceAttempts<0&&emailOTPError.length==0 &&<span className={Styles.attemptsText}>{emailExceededText}</span>}
                          {emailOTPVerified&&<span className={Styles.verifiedText}>Your email OTP has been verified</span>}
                        </div>
                      </Col>
                      <span className={emailBalanceAttempts>0&&!disableEmailResendOTP&&!emailOTPVerified?Styles.resendText:Styles.resendTextDisable} onClick={() => {resendEmailOTP(props.phone_number, props.email)}}>Resend OTP</span>

                    </Row>
                  </div>
                  <Button
                  onClick={async()=>{
                   setDisableBtn(true);
                   await verifyOTP(props.email);
                   setDisableBtn(false);
                  }}
                    className="p-2 mt-4"
                    variant="primary"
                    disabled={emailBalanceAttempts<0|| phoneBalanceAttempts<0 || disableBtn?true:false}
                    block
                    
                  >
                    NEXT
                </Button>
      </>
  )

}

export default OTPForm;