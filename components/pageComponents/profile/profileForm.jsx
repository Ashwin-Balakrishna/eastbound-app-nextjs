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
import { getStatesOptions, getSessionToken, NODE_API_URL } from "../../../utils/helper";
import ThankYou from "../thankyou";
import ModalComponent from "../../elements/modal";
import { fetchFormDataWithAuth } from "../../../utils/apiHelper";
import PageLayout from "../../../components/layouts/pageLayout";
//scss
import Styles from './profile.module.scss'

import EllipsisWithTooltip from 'react-ellipsis-with-tooltip'

//Sub Forms
import BasicForm from './subFormsNew/basicForm'
import PanForm from './subFormsNew/panForm'
import IataForm from './subFormsNew/iataForm'
import GstForm from './subFormsNew/gstForm'
import OtherDocForm from './subFormsNew/otherDocForm'

import ProfileSteps from './profileSteps'
import { values } from "lodash";


import { useRouter } from "next/router";


const API_URL = process.env.global_url;

const basicForm = Yup.object({

  //basic form
  agency_name: Yup.string().trim().required("Agency name is required")
  .matches(/^\S+(?: \S+)*$/,"Please enter a valid agency name") //do not allow double space between characters
  // .matches(/^[^\s]+(\s+[^\s]+)*$/,"Please enter a valid agency name"), //do not allow space at start and end
  .matches(/(?!^\d+$)^.+$/,"Please enter a valid agency name") //do not allow only numbers
  .matches(/[A-Za-z0-9]/,"Please enter a valid agency name")//do not allow only special characters
  .nullable(),
  dial_code: Yup.string().nullable(),
  phoneIsValid: Yup.boolean().nullable(),
  phone_number: Yup.string().when(
    ["phoneIsValid", "dial_code"],
    (phoneIsValid, dial_code, schema) => {
      return phoneIsValid === false
        ? schema
          .test("requiredPhone", "Phone number is required", (value) => {
            return value && value.substr(dial_code.length) != "";
          })
          .test("validPhone", "Phone number is invalid", () => phoneIsValid)
        : schema.test("requiredPhone", "Phone number is required", (value) => {
          return value && value.substr(dial_code.length) != "";
        });
    }
  ).nullable(),
  landline_code: Yup.string().required('Landline code is required')
    .matches(/^[0-9]+$/, "Please enter a valid landline code")
    // .test('len', 'Enter a valid number', val => val.toString().length>1 && val.toString().length<5)
    .test(
      'characters-check',
      'Enter a valid number',
      landline_code => !landline_code || landline_code.toString().length>1 && landline_code.toString().length<5,
  )
    .nullable(),
    landline_number: Yup.string().required("Landline number is required")
    .matches(/^[0-9]+$/, "Please enter a valid landline numder")
    .test(
      'characters-check',
      'Enter a valid number',
      landline_number => !landline_number || landline_number.toString().length>5 && landline_number.toString().length<9,
  )
    // .test('len', 'Enter a valid number', val => val.toString().length>5 && val.toString().length<9)
    .nullable(),
  agency_address: Yup.string().trim().required("Agency Address is required")
  // .matches(/^\S+(?: \S+)*$/,"Please enter a valid agency address 123") //do not allow double space between characters
  // .matches(/^[^\s]+(\s+[^\s]+)*$/,"Please enter a valid agency name"), //do not allow space at start and end
  // .matches(/(?!^\d+$)^[\s\S]+$/,"Please enter a valid agency address 321") //do not allow only numbers
  // .matches(/[A-Za-z0-9]/,"Please enter a valid agency address 456")//do not allow only special characters
  .nullable(),
  // agency_city: Yup.string().trim().required("City is required")
  //   .matches(/^[aA-zZ\s]+$/, "Please enter a valid city").nullable(),
  agency_city: Yup.string().trim().required("City is required").nullable(),
  state_name: Yup.string().trim().required("State is required").nullable(),
  agency_pin_code: Yup.string().required('Pincode is required')
    .matches(/^[0-9]+$/, "Please enter a valid pincode")
    .test(
      'characters-check',
      'Please enter a valid pincode',
      agency_pin_code => !agency_pin_code || agency_pin_code.toString().length>5 && agency_pin_code.toString().length<=6,
  ).nullable(),
  year_in_business: Yup.string().required("Years in Business is required")
  .test(
    'characters-check',
    'Please enter a valid Years in Business',
    year_in_business => !year_in_business || year_in_business.toString().length>0 && year_in_business.toString().length<=2,
)
    .test(
      'greater than zero check',
      'Please enter a valid Years in Business',
      year_in_business => !year_in_business || parseInt(year_in_business)>=0,
  )
    .matches(/^[0-9]+$/, "Please enter a valid Years in Business").nullable(),
  // agency_logo: Yup.string().required("Agency Logo is required").nullable(),

  });
  //pan form
  const panForm = Yup.object({
  pan_number: Yup.string().required('Pan Number is required')
    .matches(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/, "Please enter a valid PAN number")
    .test(
      'characters-check',
      'Please enter a valid PAN number',
      pan_number => !pan_number || pan_number.toString().length>9 && pan_number.toString().length<11,
  )
    .nullable(),
  pan_copy: Yup.string().required("Pan Copy is required").nullable(),
  })

   //iata form
  const iataForm = Yup.object({
    agency_iata_code:Yup.string().when("agency_iata_regd", {
      is: true,
      then: Yup.string().required("IATA code is required")
    }).nullable(),
    iata_regd_doc:Yup.string().when("agency_iata_regd", {
      is: true,
      then: Yup.string().required("IATA copy is required")
    }).nullable(),

  });
  //gst form
   const gstForm = Yup.object({
    gst_regd:Yup.boolean().required().nullable(),
    gstNumber:Yup.string().when("gst_regd", {
      is: true,
      then: Yup.string().required("GSTIN is required")
    })
    .matches(/\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/,'Enter a valid GST number')
    .nullable(),
    gstCopy:Yup.string().when("gst_regd", {
      is: true,
      then: Yup.string().required("GST copy is required")
    })
    
    .nullable(),
    gst_state_id:Yup.string().when("gst_regd", {
      is: true,
      then: Yup.string().required("State is required")
    }).nullable(),
    supporting_doc:Yup.string().when("gst_regd", {
      is: false,
      then: Yup.string().required("Supporting Doc is required")
    }).nullable(),
    supporting_doc_copy:Yup.string().when("gst_regd", {
      is: false,
      then: Yup.string().required("Supporting Doc Image is required")
    }).nullable(),
   });
  //other doc form
  const otherDocForm = Yup.object({
  // accreditation:Yup.string().required('Accreditation is required').nullable(),
  guarantee_mode_doc:Yup.string().when("agency_guarantee_mode", {
    is: (agency_guarantee_mode)=> agency_guarantee_mode!=1,
    then: Yup.string().required("Guarantee doc is required").nullable()
  })
  
  .nullable(),
  // guarantee_mode_doc:Yup.string().required('Guarantee doc is required').nullable(),
  agency_guarantee_mode: Yup.number().required('Guarantee mode is required').nullable()
  });


  //threeForm
  const threeForm = Yup.object({
    pan_number: Yup.string().required('Pan Number is required')
    .matches(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/, "Please enter a valid PAN number")
    .test(
      'characters-check',
      'Please enter a valid PAN number',
      pan_number => !pan_number || pan_number.toString().length>9 && pan_number.toString().length<11,
  )
    .nullable(),
    pan_copy: Yup.string().required("Pan Copy is required").nullable(),
    agency_iata_code:Yup.string().when("agency_iata_regd", {
      is: true,
      then: Yup.string().required("IATA code is required")
    }).nullable(),
    iata_regd_doc:Yup.string().when("agency_iata_regd", {
      is: true,
      then: Yup.string().required("IATA copy is required")
    }).nullable(),
    // agency_gst_code:Yup.string().required('Gst is required').nullable(),
    gst_regd:Yup.boolean().required().nullable(),
    gstCopy:Yup.string().when("gst_regd", {
      is: true,
      then: Yup.string().required("GSTIN is required")
    }).nullable(),
    gstNumber:Yup.string().when("gst_regd", {
      is: true,
      then: Yup.string().required("GST copy is required")
    })
    .matches(/\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/,'Please enter a valid GST number')
    .nullable(),

    gst_state_id:Yup.string().when("gst_regd", {
      is: true,
      then: Yup.string().required("State is required")
    }).nullable(),

    supporting_doc:Yup.string().when("gst_regd", {
      is: false,
      then: Yup.string().required("Supporting Doc is required")
    }).nullable(),
    supporting_doc_copy:Yup.string().when("gst_regd", {
      is: false,
      then: Yup.string().required("Supporting Doc Image is required")
    }).nullable(),
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

const ProfileForm = ({ profile, accountManager,handleSubmitProfile }) => {
  const [showDocument, setShowDocument] = useState(false);
  const [documentUrl, setDocumentUrl] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isRegistrationAccepted, setIsRegistrationAccepted] = useState(false);

  const [newUser, setNewUser] = useState(false);
  const [steps, setSteps] = useState(0);
  const submitForm = useRef();
  const [selectedSchema, setSelectedSchema] = useState(basicForm);
  const [threeFormImageError, setThreeFormImageError] = useState('');
  const [otherDocImageError, setOtherDocImageError] = useState('');
  const [resetForm, setResetForm] = useState(false);
  let schema = basicForm;
  const [isSubmitLocked, setIsSubmitLocked] = useState(false);

  const [editBasicForm, setEditBasicForm] = useState(true);
  const [editPanForm, setEditPanForm] = useState(false);
  const [editIataForm, setEditIataForm] = useState(false);
  const [editGstForm, setEditGstForm] = useState(false);
  const [editOtherDocForm, setEditOtherDocForm] = useState(false);

  const [loader, setLoader] = useState(false);

  const [stateList, setStateList] = useState([]);

  const router = useRouter();

  // const [gstNumber, setGstNumber] = useState(null);
  // const [gstCopy, setGstCopy] = useState(null);
 
  

  useEffect(() => {
  if(newUser){
    if(steps==0){
setSelectedSchema(basicForm)
    }
    else if(steps==1){
      setSelectedSchema(threeForm)
    }
    else if(steps==2){
      setSelectedSchema(otherDocForm)
    }
  }
  }, [steps])
  useEffect(() => {

    getStates();
    //new user check

    if (Object.keys(router.query).length > 0) {
      if(router.query.newUser){
        setNewUser(true)
      }
    }

    if(profile?.gst_details?.length>0){
      // setGstNumber(profile.gst_details[0]['gstin'])
      // setGstCopy(profile.gst_details[0]['gst_certificate'])
      profile['gstNumber'] = profile.gst_details[0]['gstin'];
      // profile['gstCopy'] = profile.gst_details[0]['gst_certificate'];
      // console.log("testtt", profile.gst_details[0]['gst_certificate'].split("/").pop())
      if(profile.gst_details[0]['gst_certificate'])
      profile['gstCopy'] = profile.gst_details[0]['gst_certificate'].split("/").pop();

    }
    else{
      profile['gstNumber'] = null;
      profile['gstCopy'] = null;
    }
    // console.log("profile123", profile);
  }, [])

  const getStates = async () => {
    const state = await fetchFormDataWithAuth(
          `${NODE_API_URL}/user/admin/destination?market=state`,
          "GET",
          null,
          null
          
    );
    const stateOptions=state["data"]?.map((i) => ({ label: i.value, value: i.id }))
    
    setStateList(stateOptions)    
  }

  const setEditForm=(basic, pan, iata, gst, other)=>{
    // alert("called123")
    setEditBasicForm(basic);
    setEditPanForm(pan);
    setEditIataForm(iata);
    setEditGstForm(gst);
    setEditOtherDocForm(other);
    // console.log("basic", editPanForm, pan)
  }

  const callEditForm=(schema)=>{
    setResetForm(true);
    setTimeout(function(){setResetForm(false)}, 500);
    if(schema=="basicForm"){
    setSelectedSchema(basicForm);
    setEditForm(!editBasicForm, false, false, false, false)
    }
    else if(schema=="panForm"){
      // alert("called")
    setSelectedSchema(panForm);
    setEditForm(false, !editPanForm, false, false, false)
    }
    else if(schema=="iataForm"){
      setEditForm(false, false, !editIataForm, false, false)
    setSelectedSchema(iataForm);
    }
    else if(schema=="gstForm"){
      setEditForm(false, false, false, !editGstForm, false)
    setSelectedSchema(gstForm);
    }
    else if(schema=="otherDocForm"){
      setEditForm(false, false, false, false, !editOtherDocForm)
    setSelectedSchema(otherDocForm);
    }
    
  }

  const callSubmitForm=(schema, values)=>{
    // console.log('called', profile)
    if(schema=="basicForm")
    setSelectedSchema(basicForm);
    else if(schema=="panForm")
    setSelectedSchema(panForm);
    else if(schema=="iataForm")
    setSelectedSchema(iataForm);
    else if(schema=="gstForm"){
      // console.log("from gst", values)
      if(values.gst_regd==null){
        setThreeFormImageError('error');
        setTimeout(function(){setThreeFormImageError('')}, 2000);
        // return;
      }
      if(values.gst_regd==false && values.supporting_doc_copy==null){
        setThreeFormImageError('error');
        setTimeout(function(){setThreeFormImageError('')}, 2000);
        // return;
      }
    setSelectedSchema(gstForm);
    }
    else if(schema=="otherDocForm"){
      if(values.guarantee_mode_doc==null && values.agency_guarantee_mode!=1){
        setOtherDocImageError('error');
        setTimeout(function(){setOtherDocImageError('')}, 2000);
        // return;
      }
    setSelectedSchema(otherDocForm);

    }
    else if(schema=="threeForm"){
      // console.log("profile1234",values);
      if(values.pan_copy==null||values.iata_regd_doc==null||values.gstCopy==null || values.supporting_doc_copy==null){
        setThreeFormImageError('error');
        setTimeout(function(){setThreeFormImageError('')}, 2000);
        // return;
      }
    setSelectedSchema(threeForm);
    }

    
    setTimeout(function () {
      if(submitForm.current && submitForm.current!=null)
        submitForm.current.click();
      
  }, 1000);
  }

  const handleDocumentView = async (fileName, profileId, gstDetailId) => {
    try {
      const res = await fetch(
        `${API_URL}/api/dashboard/account/fetch/${fileName}/${profileId}/${gstDetailId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${getSessionToken()}`,
          },
        }
      );

      if (res.status !== 200) {
        console.error("Something went wrong");
        return;
      }

      const blob = await res.blob();
      const objectURL = URL.createObjectURL(blob);
      setDocumentUrl(objectURL);
      setShowDocument(true);
    } catch (err) {
      console.error("Something went wrong", err);
    }
  };

  const acceptRegistration = async () => {
    try {
      const resp = await fetchFormDataWithAuth(
        `${API_URL}/api/agent/auth/acceptRegistration`,
        "GET",
        null,
        null,
        null
      );
      if (resp.Error) {
        console.error(`Something went wrong!`);
      } else {
        setIsRegistrationAccepted(true);
      }
    } catch (err) {
      console.error(`Something went wrong! Error: ${JSON.stringify(err)}`);
    }
  };

  return (
    <>
      {!isRegistrationAccepted ? (
        <Formik
          key="credit_approval_key"
          validationSchema={selectedSchema}
          onSubmit={async(data, { setSubmitting, }) => {
            if(!isSubmitLocked){
              
              setIsSubmitLocked(true);
              if(newUser){
              if(steps==0){
                setSteps(1)
                window.scrollTo({
                  top: 400,
                  behavior: "smooth"
                });
                
              }
              else if(steps==1){
                // console.log("33333")
                window.scrollTo({
                  top: 400,
                  behavior: "smooth"
                });
                setSteps(2)
              }
              else if(steps==2){
                // console.log("final data", data)
                if(data.agency_address && data.agency_address!=null)
                data.agency_address = data.agency_address.trim()
                await handleSubmitProfile(data, 'all');
              }
              // console.log("test", newUser, steps)
            }
            else{
              if(data.agency_address && data.agency_address!=null)
              data.agency_address = data.agency_address.trim()
              // console.log("final data123", data)
              let form;
              if(selectedSchema==basicForm)
              form = 'basic'
              if(selectedSchema==panForm)
              form = 'pan'
              if(selectedSchema==iataForm)
              form = 'iata'
              if(selectedSchema==gstForm)
              form = 'gst'
              if(selectedSchema==otherDocForm)
              form = 'otherDoc'
            await handleSubmitProfile(data, form);
            }
            
            // console.log('came',isSubmitLocked)
            if(newUser&& steps!=2)
            setTimeout(function () {setIsSubmitLocked(false)}, 1000);
            else
            setTimeout(function () {setIsSubmitLocked(false)}, 3000);
          }
        
        }
        }
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
      {accountManager?.email&&
      <div className="profile_container">
      <div className="manager-profile">
          <h2>2Hub Account Manager</h2>
          <div className="contacting_ways">
            <img src="/images/contact.png" alt="contact" />
            <label>{accountManager?.first_name||''}</label>
          </div>
          <div className="contacting_ways">
            <img style={{marginBottom:'10px'}} src="/images/email.svg" alt="email" />
            <label style={{maxWidth:'150px'}}><EllipsisWithTooltip placement="bottom">{accountManager?.email||''}</EllipsisWithTooltip></label>
          </div>
          <div className="contacting_ways">
            <img src="/images/phone.svg" alt="phone" />
            <label>{accountManager?.dial_code||''} {accountManager.phone_number||''}</label>
          </div>
        </div>
      </div>
       } 
     
              <Form onSubmit={(e) => { e.preventDefault(); handleSubmit(e)}}>
                {!newUser ?
                  <>
                    <BasicForm stateList={stateList} loader={isSubmitLocked} resetForm={resetForm} editBasicForm={editBasicForm} callEditForm={callEditForm} callSubmitForm={callSubmitForm} newUser={newUser} values={values} isSubmitting={isSubmitting} errors={errors} touched={touched} handleBlur={handleBlur} setErrors={setErrors} setFieldValue={setFieldValue}/>
                    <PanForm loader={isSubmitLocked} resetForm={resetForm} editPanForm={editPanForm} callEditForm={callEditForm} callSubmitForm={callSubmitForm} newUser={newUser} values={values} isSubmitting={isSubmitting} errors={errors} touched={touched} handleBlur={handleBlur} setErrors={setErrors}/>
                    <IataForm loader={isSubmitLocked} resetForm={resetForm} editIataForm={editIataForm} callEditForm={callEditForm} callSubmitForm={callSubmitForm} newUser={newUser} values={values} isSubmitting={isSubmitting} errors={errors} touched={touched} handleBlur={handleBlur} setErrors={setErrors}/>
                    <GstForm stateList={stateList} loader={isSubmitLocked} resetForm={resetForm} editGstForm={editGstForm} callEditForm={callEditForm} callSubmitForm={callSubmitForm} newUser={newUser} values={values} isSubmitting={isSubmitting} errors={errors} touched={touched} handleBlur={handleBlur} setErrors={setErrors}/>
                    <OtherDocForm loader={isSubmitLocked} resetForm={resetForm} editOtherDocForm={editOtherDocForm} callEditForm={callEditForm} callSubmitForm={callSubmitForm} newUser={newUser} values={values} isSubmitting={isSubmitting} errors={errors} touched={touched} handleBlur={handleBlur} setErrors={setErrors}/>
                  </>
                  :
                  <>
                    <ProfileSteps steps={steps} />
                    {
                      <>
                        <div className={steps == 0 ? Styles.show : Styles.hide}>
                          <BasicForm stateList={stateList} loader={isSubmitLocked} editBasicForm={true} setNewUser={setNewUser} callSubmitForm={callSubmitForm} newUser={newUser} setSteps={setSteps} values={values} isSubmitting={isSubmitting} errors={errors} touched={touched} handleBlur={handleBlur} setFieldValue={setFieldValue}/>
                        </div>
                        <div className={steps == 1 ? Styles.show : Styles.hide}>
                          <PanForm loader={isSubmitLocked} editPanForm={true} callSubmitForm={callSubmitForm} newUser={newUser} setSteps={setSteps} values={values} isSubmitting={isSubmitting} errors={errors} touched={touched} handleBlur={handleBlur} imageError={threeFormImageError}/>
                          <IataForm loader={isSubmitLocked} editIataForm={true} callSubmitForm={callSubmitForm} newUser={newUser} setSteps={setSteps} values={values} isSubmitting={isSubmitting} errors={errors} touched={touched} handleBlur={handleBlur} imageError={threeFormImageError}/>
                          <GstForm stateList={stateList} loader={isSubmitLocked} editGstForm={true} callSubmitForm={callSubmitForm} newUser={newUser} setSteps={setSteps} values={values} isSubmitting={isSubmitting} errors={errors} touched={touched} handleBlur={handleBlur} imageError={threeFormImageError}/>
                        </div>
                        <div className={steps == 2 ? Styles.show : Styles.hide}>
                          <OtherDocForm loader={isSubmitLocked}  editOtherDocForm={true} callSubmitForm={callSubmitForm} newUser={newUser} setSteps={setSteps} values={values} isSubmitting={isSubmitting} errors={errors} touched={touched} handleBlur={handleBlur} imageError={otherDocImageError}/>
                        </div>
                      </>
                    }
                  </>
                }
                <button onClick={handleSubmit} ref={submitForm} hidden></button>
              </Form>
              
              </>
              // </PageLayout>
           
            );
          }}
        </Formik>
      ) : (
        <ThankYou
          message="Accept request has been sent"
          subText="Allow us to review your request. We will come back
          to you shortly!."
        />
      )}

      <ModalComponent
        size="lg"
        show={showDocument}
        scrollable={true}
        onHide={() => setShowDocument(false)}
        title="Document"
        body={
          <Row>
            <Col md={12}>
              <div className="mx-auto d-block">
                <div className="text-center">
                  <iframe
                    style={{ width: "100%", height: "100vh" }}
                    src={documentUrl}
                    frameBorder="0"
                    allowFullScreen
                  />
                </div>
              </div>
            </Col>
          </Row>
        }
      />
      <ModalComponent
        size="md"
        show={showConfirmationModal}
        onHide={() => setShowConfirmationModal(false)}
        title="Accept"
        body={
          <Row>
            <Col md={12}>Are you sure?</Col>
          </Row>
        }
        footer={
          <Button variant="primary" onClick={() => acceptRegistration()}>
            Yes
          </Button>
        }
      />
    </>
  );
};

export default ProfileForm;
