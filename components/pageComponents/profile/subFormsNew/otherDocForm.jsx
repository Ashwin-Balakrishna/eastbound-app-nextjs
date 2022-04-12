import React, { useEffect, useState, useRef } from 'react'
import { Button, Form, Card, Row, Col } from "react-bootstrap";
import { Formik } from "formik";


//elements
import TextField from "../../../elements/textField/textField";
import UploadImage from "../../../elements/uploadImageProfile";
import PhoneNumber from "../../../elements/phoneNumber/phoneNumber";
import FormLabel from "../../../elements/formLabel";
import NewRadioBtn from "../../../elements/newRadioBtn";
import RadioGroup from "../../../elements/radioGroup";
import ErrorText from "../../../elements/errorText";

//scss
import Styles from '../profile.module.scss'

import { S3_URL } from "../../../../utils/helper";

const OtherDocForm = (props) => {
  const [showOtherDocForm, setShowOtherDocForm] = useState(true);
  const [otherDocImage, setOtherDocImage] = useState([]);
  const animationRef = useRef();
  const [otherDocRadio, setOtherDocRadio] = useState(props.values.agency_guarantee_mode);
  const [editOtherDocForm, setEditOtherDocForm] = useState(props.editOtherDocForm);
  const [errorText, setErrorText] = useState('');
  const [radioErrorText, setRadioErrorText] = useState('');
  const [accErrorText, setAccErrorText] = useState('');
  const [accreditation, setAccreditation] = useState(props.values.accreditation);
  const [status, setStatus] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  useEffect(() => {
    var image;
    if (props.values.guarantee_mode_doc != null) {
      image = {
        preview:S3_URL+props.values.guarantee_mode_doc.toString()?.split("/").pop(),
        name: props?.values?.agency_guarantee_file_name||'',
        size: props?.values?.agency_guarantee_file_size||'',
        existing: true,
                data: props?.values?.guarantee_mode_doc
      }
      setOtherDocImage([image])
    }
    // if(props.values.accreditation==null){
    //   setAccreditation('1')
    //   props.values.accreditation=parseInt(1);
    // }
    // if(props.values.agency_guarantee_mode==null){
    //   setOtherDocRadio(1)
    //   props.values.agency_guarantee_mode=1;
    // }
    if(props.values?.guarantee_status=="pending"){
      setStatus('Pending')
  }
  else if(props.values?.guarantee_status=="approved"){
      setStatus('Approved')
  }
  else if(props.values?.guarantee_status=="rejected"){
    setStatus('Rejected')
    setRejectReason(props.values?.guarantee_reject_reason)
}
  }, [])
  // useEffect(() => {
  //   if(props.values.agency_guarantee_mode==null){
  //     props.values.agency_guarantee_mode = 1;
  //   }
  // }, [otherDocRadio])

  useEffect(() => {
    props.values.agency_guarantee_mode = otherDocRadio
   },[otherDocRadio])


   const validateForm=()=>{
    if (otherDocImage == null || otherDocImage.length == 0) 
    setErrorText('Please add image');
    if (otherDocRadio == null || otherDocRadio.length == 0) 
    setRadioErrorText('Please select guarantee mode')
    // if (accreditation == null || accreditation.length == 0) 
    // setAccErrorText('Please select accreditation')
   }

  useEffect(() => {
    if(props.resetForm && props.resetForm==true){
      setErrorText('');
      setRadioErrorText('');
      setAccErrorText('')
      props.setErrors({});
                  }
    setEditOtherDocForm(props.editOtherDocForm)
   
      
      if(props.imageError=='error'){
        if(props.values.agency_guarantee_mode==null){
          setRadioErrorText('Please select guarantee mode')
        }
        if(props.values.guarantee_mode_doc==null && props.values.agency_guarantee_mode!=1){
          setErrorText('Please add image')
        }
        // if(props.values.accreditation==null){
        //   setAccErrorText('Please select accreditation')
        // }
      }
 
},[props])

  useEffect(() => {
    setErrorText('')
    if (otherDocImage.length > 0) {
      props.values.guarantee_mode_doc = otherDocImage
      props.values.agency_guarantee_file_size = otherDocImage[0].size
      props.values.agency_guarantee_file_name = otherDocImage[0].name
      // console.log("hey", panImage[0],panImage[0].size)
    }
  }, [otherDocImage])

  useEffect(() => {
    

    var elem = animationRef.current;
    if (showOtherDocForm == false) {
      // setTimeout(function () {  elem.style.padding = '0px'; }, 200);
      elem.style.padding = "0px";
    }
    else {

      // elem.style.display = "block";
      // elem.style.padding = "15px";

    }

  }, [showOtherDocForm])
  return (
    <div className={"profile-card-wrapper"}>
      <div className="profile-overview-top">
        <div className="profile-overview-heading">
          <img src="/images/profile-status.png" />
          <h4>Other documents</h4>
        </div>
        {!props?.newUser && <div className="profile-overview-action">
          <ul>
          {status!='Pending'&&<li>
              <img src="/images/edit.png" onClick={() => { props.callEditForm('otherDocForm') }} />
            </li>}
            <li>
              <img src="/images/collapse.png" onClick={() => { setShowOtherDocForm(!showOtherDocForm) }} />
            </li>
          </ul>
        </div>}
      </div>
      <div className={showOtherDocForm ? `${Styles.boxContent} ${Styles.openAnimation}` : `${Styles.boxContent} ${Styles.closeAnimation}`} ref={animationRef}>
        <div className={"profile-overview-bottom"}>
          <div className="doc-wrapper">
            <div className="form-question">
              <Form.Group className={editOtherDocForm?'':'disable'}>
                <Form.Label>Guarantee mode</Form.Label>
                <RadioGroup name="booking_detail.is_gst_input_claimed">
                  <div className="guarantee-mode">
                    <NewRadioBtn
                    className={otherDocRadio == 1?"mb-2 radio-profile color-black":"mb-2 text-muted radio-profile"}
                      
                      // name="booking_detail.is_gst_input_claimed"
                      // id="is_gst_input_claimed_yes"
                      value={1}
                      checked={
                        otherDocRadio == 1
                      }
                      onClick={() => {
                        setRadioErrorText('')
                        setErrorText('')
                        setOtherDocRadio(1)
                      }}
                    >
                      No Guarantee
                                </NewRadioBtn>
                    <NewRadioBtn
                    className={otherDocRadio == 2?"mb-2 radio-profile color-black":"mb-2 text-muted radio-profile"}
   
                      // name="booking_detail.is_gst_input_claimed"
                      // id="is_gst_input_claimed_yes"
                      value={1}
                      checked={
                        otherDocRadio == 2
                      }
                      onClick={() => {
                        setRadioErrorText('')
                        setOtherDocRadio(2)
                      }}
                    >
                      Bank Guarantee
                                </NewRadioBtn>

                    <NewRadioBtn
                    className={otherDocRadio == 3?"mb-2 mr-4 color-black":"mb-2 text-muted mr-4"}
                      
                      // name="booking_detail.is_gst_input_claimed"
                      // id="is_gst_input_claimed_yes"
                      value={2}
                      checked={
                        otherDocRadio == 3
                      }
                      onClick={() => {
                        setRadioErrorText('')
                        setOtherDocRadio(3)
                      }}
                    >
                      Post Dated Cheque
                                </NewRadioBtn>
                                
                  </div>
                  {radioErrorText.length > 0 && <span className="image-error-text"><ErrorText error={radioErrorText} /></span>}
                </RadioGroup>
               
              </Form.Group>
              
            </div>
            <div className="profile-form">

            {otherDocRadio!=1&&
            
            <div className={otherDocImage.length > 0 ? "upload-wrapper no-border h-140" : "upload-wrapper h-140"}>
                <UploadImage edit={editOtherDocForm} setError={setErrorText} image={otherDocImage} setImage={setOtherDocImage} docName="Upload documents" sizeText="Drag & drop pdf, jpg or png file here (Max size 5mb)" maxSize='5mb' />
                
              </div>}
              {errorText.length > 0 &&otherDocRadio!=1 && <span className="image-error-text"><ErrorText error={errorText} /></span>}
              <Form.Group className={editOtherDocForm?"mt-24 form-profile":'mt-24 form-profile disable'}>
                <Form.Label>Other Accreditation</Form.Label>
                <select value={accreditation} class="form-select" onChange={(e)=>{setAccreditation(e.target.value); props.values.accreditation=parseInt(e.target.value)}}>
                  <option hidden>Select accreditation</option>
                  <option value="1">IATA</option>
                  <option value="2">PATA</option>
                  <option value="3">TAAI</option>
                  <option value="4">OTAI</option>
                  <option value="5">UFTA</option>
                  <option value="6">TAFI</option>
                  <option value="7">ADTOI</option>
                </select>
                {accErrorText.length > 0 && <span className="image-error-text"><ErrorText error={accErrorText} /></span>}
              </Form.Group>
              
            </div>
            
          </div>
          {editOtherDocForm && !props.newUser&& <div className="justify-end">
            <div className="btwn-btn save-changes">
              {/* <button class="btn btn__link">Discard Changes</button> */}
              <button disabled={props.loader} class="btn btn__primary" onClick={() => { validateForm(); props.callSubmitForm('otherDocForm', props.values) }}>Save Changes</button>
            </div>
          </div>}
          {status&& !props.newUser && (status=='Pending'||status=='Approved')&&
          <div className="justify-end" style={{textAlign:'end', marginTop:'10px'}}>
                <div className="">
                
                <div >Status: <span className={status=='Pending'?'pendingText':'approvedText'}>{status}</span></div>
                </div>
             </div>
             
             }
              {status&& !props.newUser && status=='Rejected'&&
          <Row>
            <Col md={6}>
            <div >Status: <span className={'pendingText'}>{status}</span></div>
            </Col>
            <Col md={6}>
            <div >Reason: <span>{rejectReason}</span></div>
            </Col>
          </Row>
             
             }
          {props.newUser &&

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
              <button type='button' class="btn btn__outline" onClick={() => {props.setSteps(1);
              window.scrollTo({
                top: 400,
                behavior: "smooth"
              });}}>Previous Step</button>
              <button disabled={props.loader} class="btn btn btn__primary" onClick={() => { validateForm(); props.callSubmitForm('otherDocForm', props.values) }}>Submit KYC</button>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default OtherDocForm;
