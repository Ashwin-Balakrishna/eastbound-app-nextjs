import { Formik } from "formik";
import Link from "next/link";
import Router from "next/router";
import React, { useState, useRef, useEffect } from "react";
import { Row, Col, Button, Card, Form } from "react-bootstrap";
import * as Yup from "yup";
import { API_URL, getStateList, NODE_API_URL } from "../../../utils/helper";
import ErrorText from "../../elements/errorText";
import PhoneNumber from "../../elements/phoneNumber/phoneNumber";
import TextField from "../../elements/textField/textField";
import { fetchDataWithoutAuth } from "../../../utils/apiHelper";
import { useWindowSize } from "../../../hooks/useWindowSize";
import { FaHeart } from "react-icons/fa";
import FormLabel from "../../elements/formLabel";
import { useRouter } from "next/router";

//Elements
import OtpBoxes from '../../elements/otpBoxes'
import Timer from '../../elements/timer'

//scss
import Styles from './joinUsForm.module.scss'

//helper
import { maskMobile, maskEmail, validateEmail } from '../../../utils/helper.js'
import { values } from "lodash";

//OTP Form
import OTPForm from './otpForm';

const personalDetailsSchema = Yup.object({
  agency_name: Yup.string().trim().required("Agency name is required")
    .matches(/^\S+(?: \S+)*$/, "Please enter a valid agency name") //do not allow double space between characters
    // .matches(/^[^\s]+(\s+[^\s]+)*$/,"Please enter a valid agency name"), //do not allow space at start and end
    .matches(/(?!^\d+$)^.+$/, "Please enter a valid agency name") //do not allow only numbers
    .matches(/[A-Za-z0-9]/, "Please enter a valid agency name"),//do not allow only special characters
  first_name: Yup.string().trim().required("First name is required")
    .matches(/^[aA-zZ\s]+$/, "Please enter a valid first name"),
  last_name: Yup.string().trim().required("Last name is required")
    .matches(/^[aA-zZ\s]+$/, "Please enter a valid last name"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, 'Password is too short - should be 8 chars minimum.')
    .required("Password is required"),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required("Confirm password is required"),
  dial_code: Yup.string(),
  phoneIsValid: Yup.boolean(),
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
  ),
  agency_city: Yup.string().trim().required("City is required")
    .matches(/^[aA-zZ\s]+$/, "Please enter a valid city"),
    agency_state_id:Yup.string().trim().required("State is required")
});

const JoinUsForm = (props) => {
  const router = useRouter();
  const routePayload = router.query;
  const screenSize = useWindowSize();
  const [errorMessage, setErrorMessage] = useState("");
  const [accountCreated, setAccountCreated] = useState(false);
  const [screen, setScreen] = useState(0);
  const [emailRegistered, setEmailRegistered] = useState(false);
  const [phoneBalanceAttempts, setPhoneBalanceAttempts] = useState(4);
  const [emailBalanceAttempts, setEmailBalanceAttempts] = useState(4);
  const [fromLogin, setFromLogin] = useState(false);
  const [phoneOTPVerified, setPhoneOTPVerified] = useState(false);
  const [emailOTPVerified, setEmailOTPVerified] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const [cityList, setCityList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [autoFocusEmail, setAutoFocusEmail] = useState(false);
  const [autoFocusMobile, setAutoFocusMobile] = useState(false);
  useEffect(() => {
    // console.log("rrr",router.query)
    if (Object.keys(router.query).length > 0) {
      setPhoneBalanceAttempts(router.query.phoneBalanceAttempts);
      setEmailBalanceAttempts(router.query.emailBalanceAttempts);
      setPhoneOTPVerified(router.query.phoneOTPVerified == "true" ? true : false)
      setEmailOTPVerified(router.query.emailOTPVerified == "true" ? true : false)
      setFromLogin(true)
      setScreen(1);

     
      // props.setShowJoinUsModal(true)
    }
    getStateList();
    // getCityList();
  }, [])

  useEffect(()=>{
    // getCityList();
  },[screen])

  const getStateList=async()=>{
    try{
    const response = await fetchDataWithoutAuth(
      `${NODE_API_URL}/user/admin/destination`,
      "GET",
      `market=state`,
      null,
    );

    if (response && !response.status) {
      console.error(`Something went wrong! Error: ${response.message}`);
     
    }
    else if (response && response.status) {
      //success
      var marketValueArray=[];
      marketValueArray = response.data.map(function (item) {
        return { value: item.id, label: item.value };
      });
      setStateList(marketValueArray)
      // resolve(response)
    }
  }catch (err) {
    console.error(`Something went wrong! Error: ${JSON.stringify(err)}`);
  }
  }


  const getCityList=async(id)=>{
    const stateName = stateList.find(element => element.value == id)
    try{
    const response = await fetchDataWithoutAuth(
      `${NODE_API_URL}/user/admin/destination`,
      "GET",
      `state=${stateName.label}`,
      null,
    );

    if (response && !response.status) {
      console.error(`Something went wrong! Error: ${response.message}`);
     
    }
    else if (response && response.status) {
      //success
      var marketValueArray=[];
      marketValueArray = response.data.map(function (item) {
        return { value: item.value, label: item.value };
      });
      setCityList(marketValueArray)
      // resolve(response)
    }
  }catch (err) {
    console.error(`Something went wrong! Error: ${JSON.stringify(err)}`);
  }
  }

  const sendPhoneOTP = async (data) =>
    new Promise(async (resolve, reject) => {
      // data.phone_number = data.phone_number.replace(
      //     data.dial_code,
      //     ""
      //   );
      const payload = {
        'phone': data.phone_number,
        'email': data.email
      }
      // resolve({'attempts_left':5})
      try {
        const response = await fetchDataWithoutAuth(
          `${NODE_API_URL}/auth/sendMobileOTP`,
          "GET",
          `email=${payload.email}&phone=${payload.phone}`,
          null,
          null,
          null
        );

        if (response && !response.status) {
          reject(response.message);
          setErrorMessage(response.message);
        } else if (response && response.status) {
          resolve(response)
        }
      } catch (err) {
        reject(err);
      }
    });


  const sendEmailOTP = (data) =>
    new Promise(async (resolve, reject) => {
      // data.phone_number = data.phone_number.replace(
      //     data.dial_code,
      //     ""
      //   );
      const payload = {
        'phone': data.phone_number,
        'email': data.email
      }
      try {
        const response = await fetchDataWithoutAuth(
          `${NODE_API_URL}/auth/sendEmailOTP`,
          "GET",
          `email=${payload.email}&phone=${payload.phone}`,
          null,
          null,
          null
        );
        // console.log("CHECK", response)
        if (response && !response.status) {
          reject(response.message);
          setErrorMessage(response.message);
        } else if (response && response.status) {
          // console.log("CHECK123", response)
          resolve(response)
        }
      } catch (err) {
        reject(err);
      }
    });

  const sendOTP = async (data) => {

    await sendPhoneOTP(data).then(async(res) => {
      if (res['attempts_left'] > 0) {
        setPhoneBalanceAttempts(res['attempts_left'])
        //email otp
         await sendEmailOTP(data).then((res) => {
          if (res['attempts_left'] > 0) {
            setEmailBalanceAttempts(res['attempts_left'])
            setScreen(1);
          }
          else {
            setErrorMessage(
              `OTP Limit Exceeded! Please try again later.`
            );
          }
        })
          .catch((err) => {
            setErrorMessage(
              `Something went wrong! Please try again later.`
            );
            console.error(
              `Something went wrong! Error: ${JSON.stringify(err)}`
            );

          })
      }
      else {
        setErrorMessage(
          `OTP Limit Exceeded! Please try again later.`
        );
      }
    })
      .catch((err) => {
        setErrorMessage(
          `Something went wrong! Please try again later.`
        );
        console.error(
          `Something went wrong! Error: ${JSON.stringify(err)}`
        );

      })



    //old flow
    //   Promise.all([sendPhoneOTP(data),sendEmailOTP(data)]).then((data) => {
    //     if(data[0]['attempts_left'] && data[1]['attempts_left']){
    //       if(data[0]['attempts_left']>0 && data[1]['attempts_left']>0){
    //         setPhoneBalanceAttempts(data[0]['attempts_left'])
    //         setEmailBalanceAttempts(data[1]['attempts_left'])
    //       setScreen(1);
    //       }
    //       else{
    //         setErrorMessage(
    //           `OTP Limit Exceeded! Please try again later.`
    //         );
    //       }
    //     }
    //     else{
    //       setErrorMessage(
    //         `Something went wrong! Please try again later.`
    //       );
    //     }
    // }).catch((err) => {
    //   setErrorMessage(
    //         `Something went wrong! Please try again later.`
    //       );
    //       console.error(
    //         `Something went wrong! Error: ${JSON.stringify(err)}`
    //       );

    // })

    //   sendEmailOTP(data).then((data) => {
    //     console.log("CHECK321", data)
    //     if(data['attempts_left']){
    //       if(data['attempts_left']>0){
    //         // setPhoneBalanceAttempts(data[0]['attempts_left'])
    //         setEmailBalanceAttempts(data['attempts_left'])
    //       setScreen(1);
    //       }
    //       else{
    //         setErrorMessage(
    //           `OTP Limit Exceeded! Please try again later.`
    //         );
    //       }
    //     }
    //     else{
    //       setErrorMessage(
    //         `Something went wrong! Please try again later.`
    //       );
    //     }
    // }).catch((err) => {
    //   setErrorMessage(
    //         `Something went wrong! Please try again later.`
    //       );
    //       console.error(
    //         `Something went wrong! Error: ${JSON.stringify(err)}`
    //       );

    // })


  }

  const callCheckDuplicate = async (email) => {
    // console.log(email)
    if (validateEmail(email)) {
      try {
        const response = await fetchDataWithoutAuth(
          `${API_URL}/api/agent/auth/emailValidation`,
          "GET",
          `queryEmail=${email}`
        );

        if (response.Error) {
          if (response.Error = "Email already exists")
            setEmailRegistered(true);
          else
            setErrorMessage(response.Error);
        }
        else if (response.Msg) {
          setEmailRegistered(false);
        }
        // else {
        //   setErrorMessage("Something went wrong! Please try again.");
        // }
      } catch (err) {
        setErrorMessage(`Something went wrong! Please try again.`);
        console.error(
          `Something went wrong! Error: ${JSON.stringify(err)}`
        );
      }
    }
  }



  if (accountCreated)
    return (
      <Card>
        <Card.Body>
          <div className="text-center">
            <FaHeart color="#ff0000" size="2.5rem" className="mb-3" />
            <h5 className="mb-3">Thank you so much for signing up!</h5>
            <p className="text-md text-muted">
              We’ve sent you a welcome email on how to complete your
              registration. Please check your email and follow the instructions.
            </p>
            <div className={Styles.marginBtn}>
              <Button
                // style={{margin:auto}}
                variant="outline-primary"
                size="sm"
                onClick={() => Router.replace('/login')}
              >
                Login
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    );

    const editMobile=()=>{
setScreen(0);
setAutoFocusMobile(true)
setAutoFocusEmail(false)
    }

    const editEmail=()=>{
      setScreen(0);
      setAutoFocusEmail(true)
      setAutoFocusMobile(false)
    }

  return (
    <Card>
      <Card.Body>
        {screenSize.width >= 768 ? <h4>Become a 2HUB partner</h4> : null}
        <Formik
          key="personal_details_key"
          validationSchema={personalDetailsSchema}
          onSubmit={async (data, { setSubmitting, resetForm }) => {
            setDisableBtn(true);
            // sendOTP(data);
            // return;
            // if(screen==1){
            //   verifyOTP(data.email);
            // }
            const createAccount = async (payload) => {
              // console.log("test", payload);
              // setScreen(1);

              try {
                const response = await fetchDataWithoutAuth(
                  `${API_URL}/api/agent/auth/register`,
                  "POST",
                  null,
                  null,
                  payload
                );

                if (response.Error) {
                  setErrorMessage(response.Error);
                } else {
                  // setAccountCreated(true);
                  await sendOTP(data);
                  // resetForm();
                }
              } catch (err) {
                setErrorMessage(
                  `Something went wrong! Please try again later.`
                );
                console.error(
                  `Something went wrong! Error: ${JSON.stringify(err)}`
                );
              }
            };

            const checkEmailDuplicate = async (payload) => {
              try {
                const response = await fetchDataWithoutAuth(
                  `${API_URL}/api/agent/auth/emailValidation`,
                  "GET",
                  `queryEmail=${payload.email}`
                );

                if (response.Error) {
                  setErrorMessage(response.Error);
                } else if (response.Msg) {
                  await createAccount(payload);
                } else {
                  setErrorMessage("Something went wrong! Please try again.");
                }
              } catch (err) {
                setErrorMessage(`Something went wrong! Please try again.`);
                console.error(
                  `Something went wrong! Error: ${JSON.stringify(err)}`
                );
              } finally {
                setSubmitting(false);
              }
            };

            const payload = { ...data };
            payload.agency_name = payload.agency_name.trim()
            payload.first_name = payload.first_name.trim()
            payload.last_name = payload.last_name.trim()
            payload.agency_city = payload.agency_city.trim()
            delete payload["phoneIsValid"];
            payload.phone_number = payload.phone_number.replace(
              data.dial_code,
              ""
            );

            setErrorMessage("");
            await checkEmailDuplicate(payload);
            setDisableBtn(false);
          }}


          initialValues={{
            agency_name: "",
            first_name: "",
            last_name: "",
            email: Object.keys(router.query).length > 0 ? router.query.email : "",
            password: "",
            confirm_password: "",
            phone_number: Object.keys(router.query).length > 0 ? router.query.phone_number : "",
            dial_code: "91",
            phoneIsValid: null,
            agency_city: "",
            agency_state_id:""
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
                {screen == 1 ? <>
                  <OTPForm  editMobile={editMobile} editEmail={editEmail}email={values.email} phone_number={values.phone_number} screen={screen} setScreen={setScreen} phoneBalance={phoneBalanceAttempts} emailBalance={emailBalanceAttempts} setErrorMessage={setErrorMessage} fromLogin={fromLogin} phoneOTPVerified={phoneOTPVerified} emailOTPVerified={emailOTPVerified} setAccountCreated={setAccountCreated} />
                </>
                  :

                  <>
                    <TextField
                      name="agency_name"
                      label="Agency Name*"
                      value={values.agency_name}
                    />
                    <FormLabel label="Contact Person*" />
                    <div className="d-lg-flex">
                      <TextField
                        formGroupClassName="mr-lg-2 flex-fill"
                        name="first_name"
                        placeholder="First Name"
                        value={values.first_name}
                      />
                      <TextField
                        formGroupClassName="flex-fill"
                        name="last_name"
                        placeholder="Last Name"
                        value={values.last_name}
                      />
                    </div>
                    <TextField
                      formGroupClassName={emailRegistered ? "mb-0" : ""}
                      type="email"
                      name="email"
                      label="Email address*"
                      value={values.email}
                      onKeyUp={() => { setEmailRegistered(false); }}
                      // onChange={()=>setEmailRegistered(false)}
                      helptext={emailRegistered ? "" : "We'll never share your email with anyone else."}
                      onBlur={() => callCheckDuplicate(values.email)}
                      autoFocus={autoFocusEmail}
                    />
                    {emailRegistered && <><span style={{ fontSize: '80%', color: "red" }}>Email already registered. <Link className="error-text" href={'/login'}><a style={{ color: '#0c3e55', textDecoration: 'underline' }}>Login</a></Link></span></>}
                    <TextField
                      formGroupClassName={emailRegistered ? "mt-3" : ""}
                      name="password"
                      label="New Password*"
                      type='password'
                      value={values.password}
                      helptext="Enter minimum 8 characters."
                    />
                    <TextField
                      name="confirm_password"
                      label="Confirm Password*"
                      type='password'
                      value={values.confirm_password}
                    />
                    <PhoneNumber
                     autoFocus={autoFocusMobile}
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
                    {/* <TextField
                      name="agency_city"
                      label="City*"
                      value={values.agency_city}
                    /> */}
                    {/* <Form.Label>Supporting documents</Form.Label> */}
                    <div className="form-group">
                    <FormLabel label="State*" />
              <select required value={values.agency_state_id} className={`form-select ${Styles.selectPlaceholder}`} onChange={(e)=>{setFieldValue('agency_state_id', e.target.value); getCityList(e.target.value)}}>
                <option value="" disabled selected>Select State</option>
                {stateList.map((item, i) => {
                      return <option value={item.value}>{item.label}</option>

                    })}
              </select>
              
              {errors.agency_state_id && touched.agency_state_id && <ErrorText error={errors.agency_state_id} />}
              </div>
              <div className="form-group">
                    <FormLabel label="City*" />
              <select  required value={values.agency_city} className={`form-select ${Styles.selectPlaceholder}`} onChange={(e)=>{setFieldValue('agency_city', e.target.value)}}>
                <option value="" disabled selected>Select City</option>
                {cityList.map((item, i) => {
                      return <option  value={item.value}>{item.value}</option>

                    })}
              </select>
              {errors.agency_city && touched.agency_city && <ErrorText error={errors.agency_city} />}
              </div>
                    <Button
                      className="p-2 mt-4"
                      variant="primary"
                      type="submit"
                      block
                      disabled={disableBtn}
                    >
                      NEXT
                </Button>
                  </>
                }
                {errorMessage && <ErrorText error={errorMessage} />}
              </Form>
            </>
          )}
        </Formik>
      </Card.Body>
    </Card>
  );
};

export default JoinUsForm;
