import React, { useEffect, useState, useRef } from 'react'
import { Button, Form, Card, Row, Col } from "react-bootstrap";
import { Formik } from "formik";


//elements
import TextField from "../../../elements/textField/textField";
import UploadImage from "../../../elements/uploadImageProfile";
import PhoneNumber from "../../../elements/phoneNumber/phoneNumber";
import FormLabel from "../../../elements/formLabel";

import ErrorText from "../../../elements/errorText";

//scss
import Styles from '../profile.module.scss'

import { S3_URL } from "../../../../utils/helper";


const PanForm = (props) => {
    const [showPanForm, setShowPanForm] = useState(true);
    const [panImage, setPanImage] = useState([]);
    const animationRef = useRef();
    const [editPanForm, setEditPanForm] = useState(props.editPanForm);
    const [errorText, setErrorText] = useState('');
    const [status, setStatus] = useState('');
    const [rejectReason, setRejectReason] = useState('');

    useEffect(()=>{
        if(props.values?.pan_status=="pending"){
            setStatus('Pending')
        }
        else if(props.values?.pan_status=="approved"){
            setStatus('Approved')
        }
        else if(props.values?.pan_status=="rejected"){
            setStatus('Rejected')
            setRejectReason(props.values?.pan_reject_reason)
        }
        var image;
        if(props.values.pan_copy !=null){
            image={
                preview:S3_URL+props.values.pan_copy.toString()?.split("/").pop(),
                name:props?.values?.pan_file_name||'',
                size: props?.values?.pan_file_size||'',
                existing: true,
                data: props?.values?.pan_copy
            }
            setPanImage([image])
        }
    },[])

    useEffect(() => {
        if(props.resetForm && props.resetForm==true){
            setErrorText('');
            props.setErrors({});
                        }
        setEditPanForm(props.editPanForm)
        console.log("props",props);
        if(props.imageError=='error'){
          if(props.values.pan_copy==null){
            setErrorText('Please add image')
          }
        }
    },[props])

    useEffect(() => {
        setErrorText('')
        if(panImage.length>0){
            props.values.pan_copy =panImage
            props.values.pan_file_size = panImage[0].size
            props.values.pan_file_name = panImage[0].name
            // console.log("hey", panImage[0],panImage[0].size)
        }
    },[panImage])

    useEffect(() => {
     
        
        var elem = animationRef.current;
        if (showPanForm == false) {
            // setTimeout(function () {  elem.style.padding = '0px'; }, 200);
            elem.style.padding = "0px";
        }
        else {

            // elem.style.display = "block";
            // elem.style.padding = "15px";

        }

    }, [showPanForm])
    return (

        <div className={props?.newUser ? "profile-card-wrapper new-user-profile" : "profile-card-wrapper"}>
            <div className="profile-overview-top">
                <div className="profile-overview-heading">
                    <img src="/images/profile-status.png" />
                    <h4>{props?.newUser ? "Documents" : "PAN Details"}</h4>
                </div>
                {!props?.newUser && <div className="profile-overview-action">
                    <ul>
                    {status!='Pending'&&   <li>
                            <img src="/images/edit.png" onClick={()=>{props.callEditForm('panForm')}}/>
                        </li>}
                        <li>
                            <img src="/images/collapse.png" onClick={() => { setShowPanForm(!showPanForm) }} />
                        </li>
                    </ul>
                </div>}
            </div>
            <div className={showPanForm ? `${Styles.boxContent} ${Styles.openAnimation}` : `${Styles.boxContent} ${Styles.closeAnimation}`} ref={animationRef} >
               
                <div className={"profile-overview-bottom"}>
                    <div className="doc-wrapper">
                        <div className="profile-form">
                            <Form.Group className={editPanForm?"form-profile":"form-profile disable"}>
                                <Form.Label>PAN Number {editPanForm}</Form.Label>
                                <TextField
                                    formGroupClassName="mr-lg-2 flex-fill profile-input"
                                    name="pan_number"
                                    placeholder="Enter your PAN number"
                                    value={props.values.pan_number}
                                />
                            </Form.Group>
                            <div className={panImage.length>0?"upload-wrapper no-border h-140":"upload-wrapper h-140"}>
                                {/* <img src="/images/upload.png" /> */}
                                <UploadImage edit={editPanForm}  setError={setErrorText} image={panImage} setImage={setPanImage} docName="Upload PAN" sizeText="Drag & drop pdf, jpg or png file here (Max size 5mb)" maxSize='5mb' />
                               
                                
                                {/* <h5>Upload PAN card</h5>
              <span>Drag & drop pdf, jpg or png file here (Max size 5mb)</span> */}
                            </div>
                            {errorText.length>0 && <span className="image-error-text"><ErrorText error={errorText} /></span>}
                            {/* show upload data */}
                            {/* <div className="upload-show-wrapper">
              <div className="upload-show">
                <div className="upload-img-wraper">
                  <div className="upload-img">
                    <img src="/images/aadhar.png" />
                  </div>
                </div>
                <div className="upload-img-text">
                  <h3>Scanpdf20210823.pdf Scanpdf20210823.pdf</h3>
                  <span>1.3mb</span>
                  <div className="upload-show-action action-mobile">
                    <div className="btwn-btn">
                      <button class="btn btn__primary" type="submit">Change</button>
                      <button class="btn btn__outline">Remove</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="upload-show-action action-desktop">
                <div className="btwn-btn">
                  <button class="btn btn__primary" type="submit">Change</button>
                  <button class="btn btn__outline">Remove</button>
                </div>
              </div>
            </div> */}
                        </div>
                    </div>
                    {editPanForm&& !props.newUser&& 
                    <div className="justify-end mt-24">
                <div className="btwn-btn save-changes">
                    {/* <button class="btn btn__link">Discard Changes</button> */}
                    
                    <button disabled={props.loader} class="btn btn__primary" onClick={()=>{if(panImage==null || panImage.length==0)setErrorText('Please add image'); props.callSubmitForm('panForm')}}>Save Changes</button>
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

export default PanForm;
