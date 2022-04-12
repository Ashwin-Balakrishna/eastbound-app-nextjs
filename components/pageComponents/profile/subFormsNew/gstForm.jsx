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

const GstForm = (props) => {
  const [showGstForm, setShowGstForm] = useState(true);
  const [gstImage, setGstImage] = useState([]);
  const animationRef = useRef();
  const [gstRadio, setGstRadio] = useState(props.values.gst_regd);
  const [editGstForm, setEditGstForm] = useState(props.editGstForm);
  const [errorText, setErrorText] = useState('');
  const [radioErrorText, setRadioErrorText] = useState('');
  const [supportingErrorText, setSupportingErrorText] = useState('');
  const [supportingDoc, setSupportingDoc] = useState('');
  const [supportingDocCopy, setSupportingDocCopy] = useState([]);
  const [errorTextSup, setErrorTextSup] = useState('');
  const [status, setStatus] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [stateId, setStateId] = useState('');
  const [stateError, setStateError] = useState('');

  useEffect(() => {
    // if(props.values.gst_details.length>0){
    // props.values['gstNumber']  = props.values.gst_details[0]['gst_in']
    // console.log("what",props.values.gst_details[0]['gstin'], props.values.gstNumber)

    // }
    // if(props.values.gst_regd==null){
    //   setGstRadio(false)
    //   props.values.gst_regd=false;
    //   if(props.values.supporting_doc==null)
    //   props.values.supporting_doc = supportingDoc;

    // }
    // console.log('testt',props.values.gstCopy)
    if(props.values.supporting_doc!=null && props.values.gst_regd==false){
      if(props.values?.supporting_status=="pending"){
        setStatus('Pending')
    }
    else if(props.values?.supporting_status=="approved"){
        setStatus('Approved')
    }
    else if(props.values?.supporting_status=="rejected"){
      setStatus('Rejected')
      setRejectReason(props.values?.supporting_reject_reason)
  }
      
    }
    if(props.values.supporting_doc!=null)
    setSupportingDoc(props.values.supporting_doc)
    
    if(props.values.gst_regd){
      if(props.values?.gst_status=="pending"){
        setStatus('Pending')
    }
    else if(props.values?.gst_status=="approved"){
        setStatus('Approved')
    }
    else if(props.values?.gst_status=="rejected"){
      setStatus('Rejected')
      setRejectReason(props.values?.gst_reject_reason)
  }
    }
    var image;
    if(props.values.gst_details.length>0){
      if(props.values.gst_details[0]['gst_certificate']){
        image={
          preview:S3_URL+props.values.gst_details[0]['gst_certificate'].split("/").pop(),
            name:props?.values?.gst_file_name||'',
            size: props?.values?.gst_file_size||'',
            existing: true,
            data: props.values.gst_details[0]['gst_certificate'].split("/").pop()
        }
        setGstImage([image])
      }
    }
    else if(props.values.supporting_doc_copy!=null){
      image={
        preview:S3_URL+props.values.supporting_doc_copy.toString()?.split("/").pop(),
          name:props?.values?.supporting_doc_file_name||'',
          size: props?.values?.supporting_doc_file_size||'',
          existing: true,
          data: props?.values?.supporting_doc_copy
      }
      setSupportingDocCopy([image])
    }
  }, [])

  useEffect(() => {
if(gstRadio==false){
  props.values.supporting_doc = supportingDoc;
}
if(gstRadio==true){
  props.values.gst_state_id = stateId;
}
// }
// else{
//   props.values.supporting_doc = null;
// }
  }, [gstRadio])

  useEffect(() => {
    setEditGstForm(props.editGstForm)
    if(props.resetForm && props.resetForm==true){
      setErrorText('');
      setRadioErrorText('');
      setSupportingErrorText('')
      props.setErrors({});
                  }
    console.log("gst123",props)
    if(props.imageError=='error'){
    if(props.values.gst_regd==null)
      setRadioErrorText('Please select an option');
    }
    if(props.imageError=='error' && props.values.gst_regd==true){
      if(props.values.gstCopy==null){
        setErrorText('Please add image')
      }

    }
    else{
      // alert('hi');
      if(props.imageError=='error' && props.values.gst_regd==false){
        if(props.values.supporting_doc_copy==null)
        setErrorTextSup('Please add image')

        if(props.values.supporting_doc==null)
          setSupportingErrorText('Please select a document')
      }

    }
},[props])

  useEffect(() => {
    setErrorText('')
    if(gstImage.length>0){
      
        props.values.gstCopy =gstImage;
        props.values.gst_file_size = gstImage[0].size
        props.values.gst_file_name = gstImage[0].name
        // console.log("gst",props.values)
    }
},[gstImage])

useEffect(() => {
  setErrorTextSup('')
  if(supportingDocCopy.length>0){
      props.values.supporting_doc_copy =supportingDocCopy;
      props.values.supporting_doc_file_size = supportingDocCopy[0].size
      props.values.supporting_doc_file_name = supportingDocCopy[0].name
  }
},[supportingDocCopy])

useEffect(() => {
 props.values.gst_regd = gstRadio
},[gstRadio])

  useEffect(() => {
    var elem = animationRef.current;
    if (showGstForm == false) {
      // setTimeout(function () {  elem.style.padding = '0px'; }, 200);
      elem.style.padding = "0px";
    }
    else {
      if(props.newUser){
        elem.style.padding = "0px 15px 15px 15px";
        
    }
      // elem.style.display = "block";
      // elem.style.padding = "15px";

    }

  }, [showGstForm])

  const validateForm=()=>{
    if(gstRadio==null)
      setRadioErrorText('Please select an option');
    else{
    if(gstRadio){
      if(gstImage==null || gstImage.length==0)
      setErrorText('Please add image');
      if(stateId==null || stateId.length==0)
      setStateError('Please select a state');
      
      }
      else{
        if(supportingDocCopy==null || supportingDocCopy.length==0)
      setErrorText('Please add image');
      if(supportingDoc==null || supportingDoc.length==0)
      setSupportingErrorText('Please select a document');
      } 
    }
  }
  return (
    <div className={props?.newUser ? "profile-card-wrapper new-user-gst" : "profile-card-wrapper"}>
      {!props?.newUser && <div className="profile-overview-top">
        <div className="profile-overview-heading">
          <img src="/images/profile-status.png" />
          <h4>GST</h4>
        </div>
        <div className="profile-overview-action">
          <ul>
           {status!='Pending'&& <li>
              <img src="/images/edit.png" onClick={() => { props.callEditForm('gstForm') }} />
            </li>}
            <li>
              <img src="/images/collapse.png" onClick={() => { setShowGstForm(!showGstForm) }} />
            </li>
          </ul>
        </div>
      </div>}
      <div className={showGstForm ? `${Styles.boxContent} ${Styles.openAnimation}` : `${Styles.boxContent} ${Styles.closeAnimation}`} ref={animationRef}>
        <div className={props?.newUser ? "profile-overview-bottom new-user-bottom" : "profile-overview-bottom"}>
          <div className="doc-wrapper">
            <div className="form-question">
              <Form.Group className={ editGstForm ?"":'disable'}>
                <Form.Label>Are you registered for GST?</Form.Label>
                <RadioGroup name="booking_detail.is_gst_input_claimed">
                  <div className="d-flex">
                    <NewRadioBtn
                      className={gstRadio==true?"mb-2 radio-profile color-black":"mb-2 text-muted radio-profile"}
                      // name="booking_detail.is_gst_input_claimed"
                      // id="is_gst_input_claimed_yes"
                      value={true}
                      checked={
                        gstRadio == true
                      }
                      onClick={() => {
                        setRadioErrorText('')
                        setGstRadio(true)
                      }}
                    >
                      Yes
                                </NewRadioBtn>
                    <NewRadioBtn
                    className={gstRadio==false?"mb-2 mr-3 color-black":"mmb-2 text-muted mr-3"}
                      //   name="booking_detail.is_gst_input_claimed"
                      //   id="is_gst_input_claimed_yes"
                      value={false}
                      checked={
                        gstRadio == false
                      }
                      onClick={() => {
                        setRadioErrorText('')
                        setGstRadio(false)
                      }}
                    >
                      No
                                </NewRadioBtn>
                  </div>
                  {radioErrorText.length > 0 && <span className="image-error-text"><ErrorText error={radioErrorText} /></span>}
                </RadioGroup>
              </Form.Group>
            </div>
            {gstRadio && <div className="profile-form">
              <Form.Group className={editGstForm?"form-profile":"form-profile disable"}>
                <Form.Label>GSTIN</Form.Label>

                <TextField
                  formGroupClassName="mr-lg-2 flex-fill profile-input"
                  name="gstNumber"
                  placeholder="Enter GSTIN"
                  value={props.values.gstNumber}
                />
              </Form.Group>

              <div className={editGstForm?"form-profile":"form-profile disable"}>
                <Form.Group className="mt-24 form-profile">
                <Form.Label>Select State</Form.Label>
              
                <select value={stateId} class="form-select" onChange={(e)=>{setStateError(''); setStateId(e.target.value); props.values.gst_state_id=e.target.value}}>
                  <option hidden>Select State</option>
                  {props.stateList.map((item)=>{
                    return <option value={item.value}>{item.label}</option>
                  })}
                </select>
                {stateError.length > 0 && <span className="image-error-text"><ErrorText error={stateError} /></span>}
              </Form.Group>
              </div>

              <div className={gstImage.length > 0 ? "upload-wrapper no-border h-140" : "upload-wrapper h-140"}>
                <UploadImage edit={editGstForm} setError={setErrorText} image={gstImage} setImage={setGstImage} docName="Upload GSTIN" sizeText="Drag & drop pdf, jpg or png file here (Max size 5mb)" maxSize='5mb' />
                
              </div>
              {errorText.length>0 && <span className="image-error-text"><ErrorText error={errorText} /></span>}
            </div>}
          </div>

          {gstRadio==false &&
            // <div className={"profile-overview-bottom new-user-bottom"}>
            <div className="doc-wrapper">
                {/* <div className="form-question"> */}
                <div className={editGstForm?"form-profile":"form-profile disable"}>
                <Form.Group className="mt-24 form-profile">
                <Form.Label>Supporting documents</Form.Label>
              
                <select value={supportingDoc} class="form-select" onChange={(e)=>{setSupportingErrorText(''); setSupportingDoc(e.target.value); props.values.supporting_doc=e.target.value}}>
                  <option hidden>Select Supporting Doc</option>
                  <option value="Electric Bill">Electric Bill</option>
                  <option value="Shop Establishment Certificate">Shop Establishment Certificate</option>
                  <option value="Udhyog Aadhar">Udhyog Aadhar</option>
                  <option value="Rental Agreement">Rental Agreement</option>
                </select>
                {supportingErrorText.length > 0 && <span className="image-error-text"><ErrorText error={supportingErrorText} /></span>}
              </Form.Group>
              </div>
                {/* </div> */}

                    
                <div className="profile-form">
                    <div className={supportingDocCopy.length>0?"upload-wrapper no-border h-140":"upload-wrapper h-140"}>
                        <UploadImage edit = {editGstForm} setError={setErrorTextSup} image={supportingDocCopy} setImage={setSupportingDocCopy} docName={`Upload ${supportingDoc}`} sizeText="Drag & drop pdf, jpg or png file here (Max size 5mb)" maxSize='5mb' />
                        
                    </div>
                    {errorTextSup.length>0 && <span className="image-error-text"><ErrorText error={errorTextSup} /></span>}
                </div>
            </div>
            // </div>
          
          }
          {editGstForm && !props.newUser&&<div className="justify-end mt-24">
            <div className="btwn-btn save-changes">
              {/* <button class="btn btn__link">Discard Changes</button> */}
              <button class="btn btn__primary" disabled={props.loader} onClick={()=>{
                validateForm();
                props.callSubmitForm('gstForm', props.values)}}
                
                
                >Save Changes</button>
            </div>
          </div>}
          {status&& !props.newUser && (status=='Pending'||status=='Approved')&&<div className="justify-end" style={{textAlign:'end', marginTop:'10px'}}>
                <div className="">
                
                <div >Status: <span className={status=='Pending'?'pendingText':'approvedText'}>{status}</span></div>
                </div>
             </div>}

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
              <button type='button' class="btn btn__primary" onClick={() => {props.setSteps(0); window.scrollTo({
                  top: 400,
                  behavior: "smooth"
                })}}>Previous Step</button>
              <button class="btn btn btn__outline" onClick={() =>{ validateForm(); props.callSubmitForm('threeForm', props.values)}}>Next Step</button>
              
            </div>
          }
        </div>

      </div>
    </div>
  );
};

export default GstForm;
