import React, { useEffect, useState, useRef } from 'react'
import { Button, Form, Card, Row, Col } from "react-bootstrap";
import { Formik } from "formik";


//elements
import TextField from "../../../elements/textField/textField";
import UploadImage from "../../../elements/uploadImage";
import PhoneNumber from "../../../elements/phoneNumber/phoneNumber";
import FormLabel from "../../../elements/formLabel";

//scss
import Styles from '../profile.module.scss'

//icons
import { AiOutlineMinus, AiOutlineEdit } from "react-icons/ai";


const BasicForm = (props) => {
  const [showBasicForm, setShowBasicForm] = useState(true);
  const [logo, setLogo] = useState([]);
  const animationRef = useRef();
  useEffect(()=>{
    var elem = animationRef.current;
    if (showBasicForm == false) {
      // setTimeout(function () {  elem.style.padding = '0px'; }, 200);
      elem.style.padding = "0px";
  }
  else {

      // elem.style.display = "block";
      elem.style.padding = "15px";

  }
   
  },[showBasicForm])
  return (
    <>
      <div className={Styles.outerBox}>
        <div className={Styles.boxHeader}>
          <div className="d-flex justify-content-between flex-wrap flex-lg-nowrap">
            <span>Basic</span>
            <div>
              <AiOutlineEdit size="0.9rem" style={{ margin: '0 10px' }} />
              <span onClick={()=>{setShowBasicForm(!showBasicForm)}}>
              <AiOutlineMinus size="0.9rem" style={{ margin: '0 10px' }} />
              </span>
            </div>
          </div>
        </div>
        <div className={showBasicForm?`${Styles.boxContent} ${Styles.openAnimation}`:`${Styles.boxContent} ${Styles.closeAnimation}`} ref={animationRef}>
          <Formik
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
                <Form onSubmit={handleSubmit}>
                  <Row className="flex-column-reverse flex-md-row">
                    <Col md={8}>
                      <div>
                        <TextField
                          formGroupClassName="mr-lg-2 flex-fill"
                          name="agency_name"
                          label="Agency Name"
                          value={values.agency_name}
                        />
                        <PhoneNumber
                          label="Mobile Number*"
                          name="phone_number"
                          country="in"
                          preferredCountries={["in"]}
                          value={values.phone_number}
                          onPhoneChange={(value, country, e, _, isValid) => {
                            setFieldValue("dial_code", country.dialCode);
                            setFieldValue("phone_number", value);
                            setFieldValue("phoneIsValid", isValid);
                          }}
                          searchPlaceholder="Search by Country name or code"
                          errorText={
                            errors.phone_number && touched.phone_number
                              ? errors.phone_number
                              : ""
                          }
                          touched={touched.phone_number}
                          onBlur={handleBlur}
                        />

                      </div>
                    </Col>
                    <Col md={4} >
                      <div className="m-lg-2" style={{height:'100%'}}>
                      <UploadImage  image={logo} setImage={setLogo} docName="Agent Logo" sizeText="(Max size 5mb)" maxSize='5mb' />
                      </div>
                    </Col>
                  </Row>
                  <FormLabel label="Landline number" />
                  <div className="d-flex">
                    <Col md={2} sm={2} xs={2} className="p-0">
                      <TextField
                        formGroupClassName={`${Styles.hideArrow} mr-lg-2`}
                        name="land_line_pin"
                        type='number'
                        // placeholder="First Name"
                        value={values.land_line_pin}
                      />
                    </Col>
                    <Col>
                      <TextField
                        formGroupClassName={Styles.hideArrow}
                        name="land_line"
                        type='number'
                        // placeholder="Last Name"
                        value={values.land_line}
                      />
                    </Col>
                  </div>
                  <TextField
                    type="textarea"
                    name="agency_address"
                    label="Agency Address"
                    value={values.agency_address}
                  />
                  <Row>
                    <Col md={6}>
                      <FormLabel label="City" />


                      <TextField
                        formGroupClassName="mr-lg-2"
                        name="agency_city"
                        // placeholder="First Name"
                        value={values.agency_city}
                      />
                    </Col>

                    <Col md={6}>
                      <FormLabel label="Pincode" />


                      <TextField
                        formGroupClassName="mr-lg-2"
                        name="agency_pin_code"
                        // placeholder="First Name"
                        value={values.agency_pin_code}
                      />
                    </Col>
                  </Row>
                  <Col md={6} className='pl-0'>
                    <FormLabel label="Years in Business" />


                    <TextField
                      formGroupClassName={`${Styles.hideArrow} mr-lg-2`}
                      name="years_in_business"
                      type='number'
                      // placeholder="First Name"
                      value={values.years_in_business}
                    />
                  </Col>
                  <Col md={6} className='pl-0'>
                    <div className="mr-lg-2">
                      <Button
                        className={`${Styles.formBtn}`}
                        variant="primary"
                        type="button"
                        onClick={() => { }}
                      >
                        Save Changes
      </Button>
                    </div>
                  </Col>

                </Form>

              </>
            )}
          </Formik>
        </div>
      </div>
    </>);
}

export default BasicForm;