import React, { useEffect, useState, useRef } from 'react'
import { Button, Form, Card, Row, Col } from "react-bootstrap";
import { Formik } from "formik";
import Link from "next/link";



//scss
import Styles from '../profile.module.scss'

//elements
import TextField from "../../../elements/textField/textField";
import UploadImage from "../../../elements/uploadImageProfile";
import PhoneNumber from "../../../elements/phoneNumber/phoneNumber";
import FormLabel from "../../../elements/formLabel";
import ErrorText from "../../../elements/errorText";

import { S3_URL, NODE_API_URL } from "../../../../utils/helper";
import { fetchFormDataWithAuth } from "../../../../utils/apiHelper";
import { useRouter } from "next/router";




const BasicForm = (props) => {
    const [showBasicForm, setShowBasicForm] = useState(true);
    const animationRef = useRef();
    const [logo, setLogo] = useState([]);
    const [editShowBasicForm, setEditShowBasicForm] = useState(props.editBasicForm);
    const [errorText, setErrorText] = useState('');
    const [cityList, setCityList] = useState([]);
    const router = useRouter();
    useEffect(() => {
        // console.log('hey',props)

        let image;
        if (props?.values?.agency_logo != null) {
            image = {
                preview: S3_URL + props?.values?.agency_logo.toString()?.split("/").pop(),
                name: props?.values?.agency_logo_file_name || '',
                size: props?.values?.agency_logo_file_size || '',
                existing: true,
                data: props?.values?.agency_logo
            }
            setLogo([image])
        }
        getCities(props.values.state_name)
    }, [])
    const getCities = async (state_name) => {
        // console.log("STATE=>", state_name);
        if(props.values.state_name){
        const city = await fetchFormDataWithAuth(
            
              `${NODE_API_URL}/user/admin/destination?market=city&state=${state_name}`,
              "GET",
              null,
              null
              
        );
        const cityOptions=city["data"]?.map((i) => ({ label: i.value, value: i.value }))

        if(props.values.agency_city!=''){
            let remove=true;
            city["data"]?.map((i)=> {
                if(i.value==props.values.agency_city){
remove=false;
                }
            })
            if(remove){
                props.values.agency_city=''
            }
        }
    
    setCityList(cityOptions)     
        }
      }
    useEffect(() => {
        if (props.resetForm && props.resetForm == true) {
            setErrorText('');
            props.setErrors({});
        }
        setEditShowBasicForm(props.editBasicForm)

    }, [props])

    useEffect(() => {
        setErrorText('')
        if (logo.length > 0) {
            props.values.agency_logo = logo
            props.values.agency_logo_file_size = logo[0].size
            props.values.agency_logo_file_name = logo[0].name
        }
    }, [logo])

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
                {!props?.newUser &&
                    <div className="profile-overview-action">
                        <ul>
                            <li>
                                <img src="/images/edit.png" onClick={() => { props.callEditForm('basicForm') }} />
                            </li>
                            <li>
                                <img src="/images/collapse.png" onClick={() => { setShowBasicForm(!showBasicForm) }} />
                            </li>
                        </ul>
                    </div>}
            </div>



            <div className={showBasicForm ? `${Styles.boxContent} ${Styles.openAnimation}` : `${Styles.boxContent} ${Styles.closeAnimation}`} ref={animationRef}>
                {/* <Formik
                    key="basic_key"
                    //   validationSchema={personalDetailsSchema}
                    onSubmit={(data, { setSubmitting, resetForm }) => {

                    }}

                    initialValues={{
                        agency_name: "",
                        phone_number: "",
                        land_line_pin: "",
                        land_line: "",
                        agency_address: "",
                        agency_city: "",
                        agency_pin_code: "",
                        years_in_business: ""
                    }}
                >
                    {({
                        handleSubmit,
                        setFieldValue,
                        values,
                        touched,
                        errors,
                        handleBlur,
                    }) => (
                        <>
                            <Form onSubmit={handleSubmit}> */}
                <div className={editShowBasicForm || props.newUser ? "profile-overview-bottom" : "profile-overview-bottom disable"}>
                    <div className="profile-form">
                        <div className="profile-divider">
                            <div className="width-60">
                                <Form.Group className="form-profile">
                                    <Form.Label>Agency name</Form.Label>
                                    <TextField
                                        formGroupClassName="mr-lg-2 flex-fill profile-input"
                                        name="agency_name"
                                        placeholder="Enter agency name"
                                        value={props.values.agency_name}
                                    />
                                </Form.Group>
                                <Form.Group className="form-profile">
                                    <Form.Label>Phone number</Form.Label>
                                    <PhoneNumber
                                        placeholder="Enter your mobile number"

                                        name="phone_number"
                                        country="in"
                                        preferredCountries={["in"]}
                                        value={props.values.dial_code + props.values.phone_number}
                                        onPhoneChange={(value, country, e, _, isValid) => {
                                            // setFieldValue("dial_code", country.dialCode);
                                            // setFieldValue("phone_number", value);
                                            // setFieldValue("phoneIsValid", isValid);
                                            props.values.dial_code = country.dialCode;
                                            props.values.phone_number = value;
                                        }}
                                        searchPlaceholder="Search by Country name or code"
                                        errorText={
                                            props.errors.phone_number && props.touched.phone_number
                                                ? props.errors.phone_number
                                                : ""
                                        }
                                        touched={props.touched.phone_number}
                                        onBlur={props.handleBlur}
                                    />

                                </Form.Group>
                            </div>
                            <div className="width-32">
                                <div className="agency-logo-text">
                                    <Form.Group className="form-profile">
                                        <Form.Label>Agency Logo</Form.Label>
                                    </Form.Group>
                                </div>
                                <div className={logo.length > 0 ? "upload-wrapper no-border h-170" : "upload-wrapper h-170"}>
                                    <div className="m-lg-2" style={{ width: '100%' }}>

                                        <UploadImage edit={editShowBasicForm} setError={setErrorText} image={logo} setImage={setLogo} docName="Upload Agent Logo" sizeText="(Max size 5mb), 150x50" maxSize='5mb' />

                                    </div>
                                </div>
                                {errorText.length > 0 && <span className="image-error-text"><ErrorText error={errorText} /></span>}
                            </div>
                        </div>
                        <div className="profile-form">
                            <Form.Group className="form-profile">
                                <Form.Label>Landline number</Form.Label>
                                <div className="d-flex">
                                    <Col md={2} sm={2} xs={4} className="p-0">
                                        <TextField
                                            formGroupClassName={`${Styles.hideArrow} mr-lg-2 profile-input`}
                                            name="landline_code"
                                            // type='text'
                                            // placeholder="First Name"
                                            value={props.values.landline_code}
                                        />
                                    </Col>
                                    <Col>
                                        <TextField
                                            formGroupClassName={`${Styles.hideArrow} profile-input`}
                                            name="landline_number"
                                            // type='text'
                                            // placeholder="Last Name"
                                            value={props.values.landline_number}
                                        />
                                    </Col>
                                </div>
                            </Form.Group>
                            <Form.Group className="form-profile">
                                <Form.Label>Agency address</Form.Label>
                                <TextField
                                    formGroupClassName="mr-lg-2 profile-input"
                                    placeholder="Enter your agency address"
                                    type="textarea"
                                    name="agency_address"
                                    // label="Agency Address"
                                    value={props.values.agency_address}
                                />
                            </Form.Group>

                            <div className="profile-divider">
                                <div className="width-48">
                                    <Form.Group className="form-profile">
                                        <Form.Label>State</Form.Label>
                                        <select disabled={true} value={props.values.state_name} class="form-select" onChange={(e) => { props.setFieldValue('state_name', e.target.value);getCities(e.target.value); props.setFieldValue('agency_city','')}}>
                                            <option hidden>Select State</option>
                                            {props.stateList&&props.stateList.length>0&&props.stateList.map((item) => {
                                                return <option value={item.label}>{item.label}</option>
                                            })}
                                        </select>
                                        {
                                            props.errors['state_name'] && props.touched['state_name'] && 
                                            
                                            <span className="image-error-text"><ErrorText error={props.errors['state_name']} /></span>
                                        }
                                    </Form.Group>
                                </div>
                                <div className="width-48">
                                    <Form.Group className="form-profile">
                                        <Form.Label>City</Form.Label>
                                        <select disabled={true} value={props.values.agency_city} class="form-select" onChange={(e) => {props.setFieldValue('agency_city', e.target.value) }}>
                                            <option hidden>Select City</option>
                                            {cityList && cityList.length>0&&cityList.map((item) => {
                                                return <option value={item.value}>{item.label}</option>
                                            })}
                                        </select>
                                        {
                                            props.errors['agency_city'] && props.touched['agency_city'] && 
                                            
                                            <span className="image-error-text"><ErrorText error={props.errors['agency_city']} /></span>
                                        }
                                    </Form.Group>
                                </div>

                            </div>
                            <div className="profile-divider">
                                <div className="width-48">
                                    <Form.Group className="form-profile">
                                        <Form.Label>Pincode</Form.Label>
                                        <TextField
                                            // label="Pincode"
                                            formGroupClassName="mr-lg-2 profile-input"
                                            name="agency_pin_code"
                                            placeholder="Enter your pincode"
                                            value={props.values.agency_pin_code}
                                        />
                                    </Form.Group>
                                </div>
                                <div className="width-48">
                                    <Form.Group className="form-profile">
                                        <Form.Label>Years in Business</Form.Label>
                                        <TextField
                                            // label="Years in Business"
                                            formGroupClassName={`${Styles.hideArrow} mr-lg-2 profile-input`}
                                            name="year_in_business"
                                            type='number'
                                            placeholder="Enter Year of business"
                                            value={props.values.year_in_business}
                                        />
                                    </Form.Group>
                                </div>
                            </div>
                        </div>
                    </div>
                    {props?.newUser ?
                        <>
                            <div className="profile-action-button justify-end ">
                                <div className="btwn-btn initial-btn">
                                    {/* <button role='button' class="btn btn__link"  onClick={()=>{router.push('/home')}}>I’ll do it later</button> */}
                                    <Link href='/home'>
                                        <a class="btn btn__link later-btn">I’ll do it later</a>
                                    </Link>
                                    <button class="btn btn__primary" onClick={() => { props.callSubmitForm('basicForm') }}>Next Step</button>
                                </div>
                            </div>
                        </> :
                        <>
                            {editShowBasicForm && <div className="justify-end">
                                <div className="btwn-btn save-changes">
                                    {/* <button class="btn btn__link">Discard Changes</button> */}
                                    <button disabled={props.loader} class="btn btn__primary" onClick={() => { props.callSubmitForm('basicForm') }}>Save Changes</button>
                                </div>
                            </div>}
                        </>
                    }
                </div>

                {/* </Form> */}

                {/* </>
                    )}
                </Formik> */}
            </div>
        </div>
    );
};

export default BasicForm;
