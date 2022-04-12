import React, { useEffect, useState, useRef } from 'react'
import { Button, Form, Card, Row, Col } from "react-bootstrap";
import { Formik } from "formik";
import Link from "next/link";

//scss
import Styles from '../../profile/profile.module.scss'

//elements
import TextField from "../../../elements/textField/textField";
import UploadImage from "../../../elements/uploadImage";
import PhoneNumber from "../../../elements/phoneNumber/phoneNumber";
import FormLabel from "../../../elements/formLabel";
import ErrorText from "../../../elements/errorText";

import { S3_URL } from "../../../../utils/helper";
import { useRouter } from "next/router";




const BasicForm = (props) => {
    const [showBasicForm, setShowBasicForm] = useState(true);
    const animationRef = useRef();
    const [editShowBasicForm, setEditShowBasicForm] = useState(props.editBasicForm);
    const [errorText, setErrorText] = useState('');
    const router = useRouter();
    useEffect(() => {
        // console.log('hey',props)

    }, [])

    useEffect(() => {
        if(props.resetForm && props.resetForm==true){
setErrorText('');
props.setErrors({});
            }
        setEditShowBasicForm(props.editBasicForm)
        
    },[props])


    useEffect(() => {
        var elem = animationRef.current;
        if (showBasicForm == false) {
            // setTimeout(function () {  elem.style.padding = '0px'; }, 200);
            elem.style.padding = "0px";
        }
        else {

            // elem.style.display = "block";
            //   elem.style.padding = "15px";

        }

    }, [showBasicForm])

    return (
        <div className="profile-card-wrapper">
            <div className="profile-overview-top">
                <div className="profile-overview-heading">
                    <img src="/images/profile-status.png" />
                    <h4>Basic</h4>
                </div>

                <div className="profile-overview-action">
                    <ul>
                        <li>
                            <img src="/images/edit.png" onClick={() => { props.callEditForm('basicForm') }} />
                        </li>
                        <li>
                            <img src="/images/collapse.png" onClick={() => { setShowBasicForm(!showBasicForm) }} />
                        </li>
                    </ul>
                </div>
            </div>



            <div className={showBasicForm ? `${Styles.boxContent} ${Styles.openAnimation}` : `${Styles.boxContent} ${Styles.closeAnimation}`} ref={animationRef}>
                <div className={editShowBasicForm ? "profile-overview-bottom" : "profile-overview-bottom disable"}>

                    <div className="profile-form">

                        {/* <div className="profile-divider"> */}
                            <div className="width-48">
                                <Form.Group className="form-profile">
                                    <Form.Label>Name</Form.Label>
                                    <TextField
                                        // label="City"
                                        formGroupClassName="mr-lg-2 profile-input"
                                        name="name"
                                        placeholder="Name"
                                        value={props.values.name}
                                    />
                                </Form.Group>
                            </div>
                            {/* </div> */}
                         
                        {/* <div className="profile-divider"> */}
                            <div className="width-48">
                                <Form.Group className="form-profile">
                                    <Form.Label>Mobile</Form.Label>
                                    <TextField
                                        // label="Years in Business"
                                        formGroupClassName={`${Styles.hideArrow} mr-lg-2 profile-input`}
                                        name="mobile"
                                        type='number'
                                        placeholder="Mobile"
                                        value={props.values.mobile}
                                    />
                                </Form.Group>
                            </div>
                            <div className="width-48">
                                <Form.Group className="form-profile">
                                    <Form.Label>Email</Form.Label>
                                    <TextField
                                        // label="Pincode"
                                        formGroupClassName="mr-lg-2 profile-input"
                                        name="email"
                                        placeholder="Email"
                                        value={props.values.email}
                                        disabled={true}
                                    />
                                </Form.Group>
                            
                        </div>
                        {/* </div> */}
                        {/* <div className="profile-divider"> */}
                            <div className="width-48">
                                <Form.Group className="form-profile">
                                    <Form.Label>Designation</Form.Label>
                                    <TextField
                                        // label="Years in Business"
                                        formGroupClassName={`${Styles.hideArrow} mr-lg-2 profile-input`}
                                        name="designation"
                                        type='text'
                                        placeholder="Designation"
                                        value={props.values.designation}
                                        disabled={true}
                                    />
                                </Form.Group>
                            </div>
                        {/* </div> */}

                        <div className="width-48">
                                <Form.Group className="form-profile">
                                    <Form.Label>Branch</Form.Label>
                                    <TextField
                                        // label="Years in Business"
                                        formGroupClassName={`${Styles.hideArrow} mr-lg-2 profile-input`}
                                        name="branch"
                                        type='text'
                                        placeholder="Branch"
                                        value={props.values.branch}
                                        disabled={true}
                                    />
                                </Form.Group>
                            </div>

                            <div className="width-48">
                                <Form.Group className="form-profile">
                                    <Form.Label>Manager</Form.Label>
                                    <TextField
                                        // label="Years in Business"
                                        formGroupClassName={`${Styles.hideArrow} mr-lg-2 profile-input`}
                                        name="manager"
                                        type='text'
                                        placeholder="Manager"
                                        value={props.values.manager}
                                        disabled={true}
                                    />
                                </Form.Group>
                            </div>

                            <div className="width-48">
                                <Form.Group className="form-profile">
                                    <Form.Label>Group</Form.Label>
                                    <TextField
                                        // label="Years in Business"
                                        formGroupClassName={`${Styles.hideArrow} mr-lg-2 profile-input`}
                                        name="group_name"
                                        type='text'
                                        placeholder="Group"
                                        value={props.values.group_name}
                                        disabled={true}
                                    />
                                </Form.Group>
                            </div>
                    </div>
                </div>
               
                    <>
                        {editShowBasicForm && <div className="justify-end" style={{marginLeft:'25px', marginBottom:'25px'}}>
                            <div className="btwn-btn save-changes">
                                {/* <button class="btn btn__link">Discard Changes</button> */}
                                <button disabled={props.loader} class="btn btn__primary" onClick={() => { props.callSubmitForm('basicForm') }}>Save Changes</button>
                            </div>
                        </div>}
                    </>
                
            </div>

           
        </div>

    );
};

export default BasicForm;
