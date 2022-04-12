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
import iataForm from './gstForm';

import { S3_URL } from "../../../../utils/helper";

const IataForm = (props) => {
    const [showIataForm, setShowIataForm] = useState(true);
    const [iataRadio, setIataRadio] = useState(props.values.agency_iata_regd);
    const [iataImage, setIataImage] = useState([]);
    const animationRef = useRef();
    const [editIataForm, setEditIataForm] = useState(props.editIataForm);
    const [errorText, setErrorText] = useState('');
    const [status, setStatus] = useState('');
    const [rejectReason, setRejectReason] = useState('');

    useEffect(() => {

        if(props.values?.iata_status=="pending"){
            setStatus('Pending')
        }
        else if(props.values?.iata_status=="approved"){
            setStatus('Approved')
        }
        else if(props.values?.iata_status=="rejected"){
            setStatus('Rejected')
            setRejectReason(props.values?.iata_reject_reason)
        }
        
        if(props.values.agency_iata_regd==null){
            setIataRadio(false)
          props.values.agency_iata_regd=false;
        }

        var image;
        if(props.values.iata_regd_doc !=null){
            image={
                preview:S3_URL+props.values.iata_regd_doc.toString()?.split("/").pop(),
                name:props?.values?.iata_file_name||'',
                size: props?.values?.iata_file_size||'',
                existing: true,
                data: props?.values?.iata_regd_doc
            }
            setIataImage([image])
        }
       
      }, [])

    useEffect(() => {
        props.values.agency_iata_regd = iataRadio
       },[iataRadio])
  
    useEffect(() => {
        if(props.resetForm && props.resetForm==true){
            setErrorText('');
            props.setErrors({});
                        }
        setEditIataForm(props.editIataForm)
        if(props.imageError=='error' && props.values.agency_iata_regd==true){
          if(props.values.iata_regd_doc==null){
            setErrorText('Please add image')
          }
        }
    },[props])
    useEffect(() => {
        
        setErrorText('')
        if(iataImage.length>0){
            props.values.iata_regd_doc =iataImage
            props.values.iata_file_size = iataImage[0].size
            props.values.iata_file_name = iataImage[0].name
            // console.log("hey", panImage[0],panImage[0].size)
        }
    },[iataImage])
  

    useEffect(() => {
       

        var elem = animationRef.current;
        if (showIataForm == false) {
            // setTimeout(function () {  elem.style.padding = '0px'; }, 200);
            elem.style.padding = "0px";
        }
        else {

            // elem.style.display = "block";
            if(props.newUser){
                elem.style.padding = "0px 15px 15px 15px";
            }
            else{
            // elem.style.padding = "15px";
            }

        }

    }, [showIataForm])
    return (
        <div className={props?.newUser?"profile-card-wrapper new-user":"profile-card-wrapper"}>
           {!props?.newUser &&  <div className="profile-overview-top">
             <div className="profile-overview-heading">
                    <img src="/images/profile-status.png" />
                    <h4>IATA</h4>
                </div>
                 <div className="profile-overview-action">
                    <ul>
                    {status!='Pending'&&<li>
                            <img src="/images/edit.png"  onClick={()=>{props.callEditForm('iataForm')}}/>
                        </li>}
                        <li>
                            <img src="/images/collapse.png" onClick={() => { setShowIataForm(!showIataForm) }} />
                        </li>
                    </ul>
                </div>
            </div>}
            <div className={showIataForm ? `${Styles.boxContent} ${Styles.openAnimation}` : `${Styles.boxContent} ${Styles.closeAnimation}`} ref={animationRef}>
                                <div className={props?.newUser?"profile-overview-bottom new-user-bottom":"profile-overview-bottom"}>
                                    <div className="doc-wrapper">
                                        <div className="form-question">
                                            <Form.Group className={editIataForm?'':'disable'}>
                                                <Form.Label>Are you registered with IATA?</Form.Label>
                                                <RadioGroup name="booking_detail.is_gst_input_claimed">
                                                    <div className="d-flex">
                                                        <NewRadioBtn
                                                        className={iataRadio==true?"mb-2 radio-profile color-black":"mb-2 text-muted radio-profile"}
                                                        
                                                            // name="booking_detail.is_gst_input_claimed"
                                                            // id="is_gst_input_claimed_yes"
                                                            value={true}
                                                            checked={
                                                                iataRadio == true
                                                            }
                                                            onClick={() => {
                                                                setIataRadio(true)
                                                            }}
                                                        >
                                                            Yes
                                </NewRadioBtn>
                                                        <NewRadioBtn
                                                        className={iataRadio==false?"mb-2 mr-5 color-black":"mb-2 text-muted mr-5"}
                                                
                                                            //   name="booking_detail.is_gst_input_claimed"
                                                            //   id="is_gst_input_claimed_yes"
                                                            value={false}
                                                            checked={
                                                                iataRadio == false
                                                            }
                                                            onClick={() => {
                                                                setIataRadio(false)
                                                            }}
                                                        >
                                                            No
                                </NewRadioBtn>
                                                    </div>
                                                </RadioGroup>
                                            </Form.Group>
                                        </div>

                                        {iataRadio &&     <div className="profile-form">
                                            <Form.Group className={editIataForm?"form-profile":'form-profile disable'}>
                                                <Form.Label>IATA code</Form.Label>

                                                <TextField
                                                    formGroupClassName="mr-lg-2 flex-fill profile-input"
                                                    name="agency_iata_code"
                                                    placeholder="Enter IATA Code"
                                                    value={props.values.agency_iata_code}
                                                />
                                            </Form.Group>
                                            <div className={iataImage.length>0?"upload-wrapper no-border h-140":"upload-wrapper h-140"}>
                                                <UploadImage edit={editIataForm} setError={setErrorText} image={iataImage} setImage={setIataImage} docName="Upload IATA" sizeText="Drag & drop pdf, jpg or png file here (Max size 5mb)" maxSize='5mb' />
                                                
                                            </div>
                                            {errorText.length>0 && <span className="image-error-text"><ErrorText error={errorText} /></span>}
                                        </div>}
                                    </div>
                                    {editIataForm&& !props.newUser&& <div className="justify-end mt-24">
                <div className="btwn-btn save-changes">
                    {/* <button class="btn btn__link">Discard Changes</button> */}
                    
                    <button disabled={props.loader} class="btn btn__primary" onClick={()=>{if(iataImage==null || iataImage.length==0)setErrorText('Please add image'); props.callSubmitForm('iataForm')}}>Save Changes</button>
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
                                </div>
                       
            </div>
        </div>
    );
};

export default IataForm;
