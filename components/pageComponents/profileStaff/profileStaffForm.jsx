import { Fragment, useEffect, useState, useRef } from "react";
import { Formik, FieldArray } from "formik";
import { Button, Form, Card, Row, Col } from "react-bootstrap";
import * as Yup from "yup";
import PhoneNumber from "../../elements/phoneNumber/phoneNumber";
import TextField from "../../elements/textField/textField";
import FileUpload from "../../elements/fileUpload";
import SelectField from "../../elements/selectField";
import Radio from "../../elements/radio";
import RadioGroup from "../../elements/radioGroup";
import accreditationData from "../../../public/json/accreditations.json";
import { getStatesOptions, getSessionToken } from "../../../utils/helper";
import ThankYou from "../thankyou";
import ModalComponent from "../../elements/modal";
import { fetchFormDataWithAuth } from "../../../utils/apiHelper";
import PageLayout from "../../../components/layouts/pageLayout";
//scss
import Styles from '../profile/profile.module.scss'

//Sub Forms
import BasicForm from './subForms/basicForm'

import { values } from "lodash";


import { useRouter } from "next/router";


const API_URL = process.env.global_url;

const basicFormSchema = Yup.object({

  //basic form
  name: Yup.string().trim().required("Name is required")
  .matches(/^\S+(?: \S+)*$/,"Please enter a valid agency name") //do not allow double space between characters
  // .matches(/^[^\s]+(\s+[^\s]+)*$/,"Please enter a valid agency name"), //do not allow space at start and end
  .matches(/(?!^\d+$)^.+$/,"Please enter a valid agency name") //do not allow only numbers
  .matches(/[A-Za-z0-9]/,"Please enter a valid agency name")//do not allow only special characters
  .nullable(),
  email: Yup.string().trim().email('Please enter a valid email id').required("Email ID is required"),
  mobile: Yup.string().required('Mobile No is required')
    .matches(/^[0-9]+$/, "Please enter a valid mobile no")
    .test(
      'characters-check',
      'Please enter a valid mobile no',
      mobile => !mobile || mobile.toString().length==10,
  )
    .nullable(),
  });

    
  


const letter = /[A-Z]/i;
const digit = /[0-9]/;
const maskPAN = [
  letter,
  letter,
  letter,
  letter,
  letter,
  digit,
  digit,
  digit,
  digit,
  letter,
];

const FILE_SIZE = 15 * 1024 * 1024;
const SUPPORTED_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/gif",
  "image/png",
  "application/pdf",
  "application/zip",
];

const ProfileStaffForm = ({ profile, handleSubmitProfile }) => {


  const [steps, setSteps] = useState(0);
  const submitForm = useRef();
  const [resetForm, setResetForm] = useState(false);
  const [editBasicForm, setEditBasicForm] = useState(true);
  const [loader, setLoader] = useState(false);
  const router = useRouter();
  const [isSubmitLocked, setIsSubmitLocked] = useState(false);
  // useEffect(() => {
  // console.log("STEPS CHANGED", steps)
  // }, [steps])
  useEffect(() => {

    //new user check
    // console.log("profile123", profile);
  }, [])


  const callEditForm=(schema)=>{
    setResetForm(true);
    setTimeout(function(){setResetForm(false)}, 500);
    if(schema=="basicForm"){
        setEditBasicForm(!editBasicForm)
    }
  }

  const callSubmitForm=(schema, values)=>{
    setTimeout(function () {
      if(submitForm.current && submitForm.current!=null)
        submitForm.current.click();
      
  }, 1000);
  }

  return (
    <>
        <Formik
          key="staff_profile"
          validationSchema={basicFormSchema}
          onSubmit={async(data, { setSubmitting, }) => {
      
            if(!isSubmitLocked){
                console.log("called", data)
                setIsSubmitLocked(true);
                await handleSubmitProfile(data);
            }
            setTimeout(function () {setIsSubmitLocked(false)}, 1000);
        }}
          initialValues={profile}
        >
          {({
            handleSubmit,
            setFieldValue,
            values,
            touched,
            errors,
            handleBlur,
            isSubmitting,
            setErrors
          }) => {
            return (
              // <PageLayout title="2hub | Hotels">
              <>
     
              <Form onSubmit={(e) => { e.preventDefault(); handleSubmit(e)}}>
              
                  <>
                    <BasicForm loader={isSubmitLocked} resetForm={resetForm} editBasicForm={editBasicForm} callEditForm={callEditForm} callSubmitForm={callSubmitForm} values={values} errors={errors} touched={touched} handleBlur={handleBlur} setErrors={setErrors}/>
                  </>
                  
                
                <button onClick={handleSubmit} ref={submitForm} hidden></button>
              </Form>
              
              </>
              // </PageLayout>
           
            );
          }}
        </Formik>
    

    </>
  );
};

export default ProfileStaffForm;
