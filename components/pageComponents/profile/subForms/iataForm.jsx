import React, { useEffect, useState } from 'react'
import { Button, Form, Card, Row, Col } from "react-bootstrap";
import { Formik } from "formik";


//elements
import TextField from "../../../elements/textField/textField";
import UploadImage from "../../../elements/uploadImage";
import PhoneNumber from "../../../elements/phoneNumber/phoneNumber";
import FormLabel from "../../../elements/formLabel";
import NewRadioBtn from "../../../elements/newRadioBtn";
import RadioGroup from "../../../elements/radioGroup";
//scss
import Styles from '../profile.module.scss'

//icons
import { AiOutlineMinus, AiOutlineEdit } from "react-icons/ai";


const IataForm = (props) => {
  const [showPanForm, setShowPanForm] = useState(false);
  const [iataImage, setIataImage] = useState([]);
  return (
    <>
      <div className={Styles.outerBox}>
        <div className={Styles.boxHeader}>
          <div className="d-flex justify-content-between flex-wrap flex-lg-nowrap">
            <span>IATA</span>
            <div>
              <AiOutlineEdit size="0.9rem" style={{ margin: '0 10px' }} />
              <AiOutlineMinus size="0.9rem" style={{ margin: '0 10px' }} />

            </div>
          </div>
        </div>
        <div className={Styles.boxContent}>
          <Formik
            key="basic_key"
            //   validationSchema={personalDetailsSchema}
            onSubmit={(data, { setSubmitting, resetForm }) => {
            }}


            initialValues={{
                iata_yes: "true"
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
                  <div className={Styles.formContent}>Are you registered with IATA?</div>
                  <RadioGroup name="booking_detail.is_gst_input_claimed">
                              <div className="d-flex">
                <NewRadioBtn
                                  className="mb-2 text-muted mr-3"
                                  name="booking_detail.is_gst_input_claimed"
                                  id="is_gst_input_claimed_yes"
                                  value={"true"}
                                  checked={
                                    values.iata_yes === "true"
                                  }
                                  onClick={() => {
                                    alert("HI")
                                  }}
                                >
                                  Yes
                                </NewRadioBtn>
                                <NewRadioBtn
                                  className="mb-2 text-muted mr-3"
                                  name="booking_detail.is_gst_input_claimed"
                                  id="is_gst_input_claimed_yes"
                                  value={"true"}
                                  checked={
                                    values.iata_yes === "true"
                                  }
                                  onClick={() => {
                                    alert("HI")
                                  }}
                                >
                                  No
                                </NewRadioBtn>
                                </div>
                                </RadioGroup>
                <TextField
                          formGroupClassName="mr-lg-2 flex-fill"
                          name="pan_number"
                          label="Enter IATA code"
                          value={values.pan_number}
                        />
                 <UploadImage image={iataImage} setImage={setIataImage} docName="Upload IATA" sizeText="(Max size 5mb)" maxSize='5mb' />
                </Form>

              </>
            )}
          </Formik>
        </div>
      </div>
    </>);
}

export default IataForm;