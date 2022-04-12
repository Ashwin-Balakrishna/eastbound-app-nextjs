import React, { useEffect, useState } from 'react'
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


const PanForm = (props) => {
  const [showPanForm, setShowPanForm] = useState(false);
  const [panImage, setPanImage] = useState([]);
  return (
    <>
      <div className={Styles.outerBox}>
        <div className={Styles.boxHeader}>
          <div className="d-flex justify-content-between flex-wrap flex-lg-nowrap">
            <span>PAN</span>
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
              pan_number: "",
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
                <TextField
                          formGroupClassName="mr-lg-2 flex-fill"
                          name="pan_number"
                          label="Enter PAN number"
                          value={values.pan_number}
                        />
                 <UploadImage image={panImage} setImage={setPanImage} docName="Upload PAN" sizeText="(Max size 5mb)" maxSize='5mb' />
                </Form>

              </>
            )}
          </Formik>
        </div>
      </div>
    </>);
}

export default PanForm;