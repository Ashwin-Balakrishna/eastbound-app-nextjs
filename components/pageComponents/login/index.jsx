import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import * as Yup from "yup";
import ErrorText from "../../elements/errorText";
import TextField from "../../elements/textField/textField";
import { fetchDataWithoutAuth, fetchDataWithAuth } from "../../../utils/apiHelper";
import Styles from "./login.module.scss";
import { API_URL, authenticateUser, ADMIN_API_URL, NODE_API_URL, setLogo, setUserType, setRole, setAccess } from "../../../utils/helper";
import { urls } from "../../../shared/urls";
import Cookies from "js-cookie";

const LOGIN_STEPS = {
  LOGIN: "login",
  FORGOTPASSWORD: "forgotPassword",
  FORGOTPASSWORDSUCCESS: "forgotPasswordSuccess",
};

const loginSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const Login = ({ loggedIn }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [loginStep, setLoginStep] = useState(LOGIN_STEPS.LOGIN);
  const router = useRouter();
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
      if (!data.phoneOTPVerified) {
        try {
          const response = await fetchDataWithoutAuth(
            `${NODE_API_URL}/auth/sendMobileOTP`,
            "GET",
            `email=${payload.email}&phone=${payload.phone}`
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
      }
      else {
        //Dummy resolve
        resolve({ 'attempts_left': 5 })
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
      if (!data.emailOTPVerified) {
        try {
          const response = await fetchDataWithoutAuth(
            `${NODE_API_URL}/auth/sendEmailOTP`,
            "GET",
            `email=${payload.email}&phone=${payload.phone}`
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
      }
      else {
        //Dummy resolve
        resolve({ 'attempts_left': 5 })

      }
    });

  const sendOTP = async (data1) => {

    Promise.all([sendPhoneOTP(data1), sendEmailOTP(data1)]).then((data) => {
      if (data[0]['attempts_left'] && data[1]['attempts_left']) {
        if (data[0]['attempts_left'] > 0 && data[1]['attempts_left'] > 0) {
          router.push(
            {
              pathname: '/join-us',
              query: {
                email: data1.email, phone_number: data1.phone_number, phoneBalanceAttempts: data[0]['attempts_left'], emailBalanceAttempts: data[1]['attempts_left'],
                token: data1.token, first_name: data1.first_name, phoneOTPVerified: data1.phoneOTPVerified, emailOTPVerified: data1.emailOTPVerified
              }
            },
            '/join-us',
          );
          //   setPhoneBalanceAttempts(data[0]['attempts_left'])
          //   setEmailBalanceAttempts(data[1]['attempts_left'])
          // setScreen(1);
        }
        else {
          setErrorMessage(
            `OTP Limit Exceeded! Please try again later.`
          );
        }
      }
      else {
        setErrorMessage(
          `Something went wrong! Please try again later.`
        );
      }
    }).catch((err) => {
      setErrorMessage(
        `Something went wrong! Please try again later.`
      );
      console.error(
        `Something went wrong! Error: ${JSON.stringify(err)}`
      );

    })


  }

  const loginContent = (
    <>
      <div className="mb-lg-4 mb-4">
        <h4>Login</h4>
        <p className="text-md mt-2">
          {"Don’t have an account? "}
          <Link href="/join-us">
            <a className="font-weight-bold"> Sign up now!</a>
          </Link>
        </p>
      </div>
      <Formik
        key="login_key"
        validationSchema={loginSchema}
        initialValues={{
          email: "",
          password: "",
        }}
        onSubmit={async (data, { setSubmitting }) => {
          const login = async (data) => {
            try {
              const response = await fetchDataWithoutAuth(
                `${API_URL}/api/agent/auth/login`,
                "GET",
                null,
                null,
                null,
                "Basic " + btoa(`${data.email}:${data.password}`)

              );

              if (response.Error) {

                setErrorMessage(response.Error);
              } else if (response.auth_token) {
                const accountStatus = {
                  redirectUrl: undefined,
                  status: "",
                };
                //oldAuthentication

                // if (
                //   response.profile_status === "Complete" &&
                //   response.is_approved &&
                //   !response.is_rejected &&
                //   !response.is_manually_added
                // ) {
                //   accountStatus.redirectUrl = urls.home;
                //   accountStatus.status = "complete";
                // }
                // if (
                //   response.profile_status === "Complete" &&
                //   response.is_approved &&
                //   !response.is_rejected &&
                //   response.is_manually_added
                // ) {
                //   accountStatus.redirectUrl = urls.home;
                //   accountStatus.status = "manuallycomplete";
                // } else if (
                //   response.profile_status === "Registered" &&
                //   response.is_approved &&
                //   !response.is_rejected &&
                //   response.is_manually_added
                // ) {
                //   accountStatus.redirectUrl = urls.profile;
                //   accountStatus.status = "manuallyregistered";
                // } else if (
                //   response.profile_status === "Registered" &&
                //   !response.is_approved &&
                //   !response.is_rejected &&
                //   !response.is_manually_added
                // ) {
                //   accountStatus.redirectUrl = urls.additionalInfo;
                //   accountStatus.status = "registered";
                // } else if (
                //   response.profile_status === "Complete" &&
                //   !response.is_approved &&
                //   !response.is_rejected
                // ) {
                //   accountStatus.status = "pending";
                // } else if (
                //   response.profile_status === "Complete" &&
                //   !response.is_approved &&
                //   response.is_rejected
                // ) {
                //   accountStatus.status = "rejected";
                // } else if (
                //   response.profile_status === "Change Request" &&
                //   response.is_approved &&
                //   !response.is_rejected
                // ) {
                //   accountStatus.redirectUrl = urls.profile;
                //   accountStatus.status = "changerequest";
                // }

                // authenticateUser(
                //   response.auth_token,
                //   data.email,
                //   response.first_name,
                //   accountStatus.status,
                //   response.reject_reason,
                //   response.is_manually_added
                // );

                //New Authentication



                if (response.email_status != "Success" || response.phone_status != "Success") {
                  // accountStatus.redirectUrl = urls.home;
                  // accountStatus.status = "complete";

                  if (parseInt(response.attempts_phone) > 0 && parseInt(response.attempts_email) > 0) {
                    var data = {
                      email: data.email,
                      phone_number: response.dial_code + response.phone_number,
                      token: response.auth_token,
                      first_name: response.first_name,
                      phoneOTPVerified: response.phone_status == "Success" ? true : false,
                      emailOTPVerified: response.email_status == "Success" ? true : false
                    }
                    sendOTP(data);
                    if (response.agency_logo && response.agency_logo != null)
                      await setLogo(response.agency_logo)


                    const res = await fetchDataWithAuth(
                      `${NODE_API_URL}/auth/agent/getUserType`,
                      "GET",
                      null,
                      null,
                      null,
                      response.auth_token
                    )
                    //cookies
                    if (res.user_type && res.user_type != null)
                      await setUserType(res.user_type)

                    if (res.role_id && res.role_id != null)
                      await setRole(res.role_id)

                    if (res.accesses && res.accesses != null)
                      await setAccess(res.accesses)

                  }

                  else {
                    setErrorMessage('Your account is blocked. Please try after sometime');
                  }
                }
                if (response.email_status == "Success" && response.phone_status == "Success") {
                  await authenticateUser(
                    response.auth_token,
                    data.email,
                    response.first_name,
                    'complete',
                    '',
                    false
                  );
                  if (response.agency_logo && response.agency_logo != null)
                    await setLogo(response.agency_logo)

                    // console.log("CALLED")
                    const res = await fetchDataWithAuth(
                      `${NODE_API_URL}/auth/agent/getUserType`,
                      "GET",
                      null,
                      null,
                      null,
                      response.auth_token
                    )
                    //cookies
                    if (res.user_type && res.user_type != null)
                      await setUserType(res.user_type)

                    if (res.role_id && res.role_id != null)
                      await setRole(res.role_id)

                    if (res.role_accesses && res.role_accesses != null)
                      await setAccess(res.role_accesses)

                  console.log("new login", JSON.stringify(res))
                  if (response.logged_in){
                    if(router.query?.redirect=='profile'){//from email
                      if(res.user_type=='staff'){
                        router.replace(
                          {
                            pathname: '/home',
                          },
                        );
                      }
                      else{
                      router.replace(
                        {
                          pathname: '/profile',
                        },
                      );
                      }
                    }
                    else
                    loggedIn('complete');
                  }
                  else{
                    if(res.user_type=='staff'){
                      router.replace(
                        {
                          pathname: '/home',
                          
                        },
                
                      );
                    }
                    else{
                    router.replace(
                      {
                        pathname: '/profile',
                        query: { newUser: true }
                      },
                      '/profile',
                    );
                    }
                  }
                }

                // loggedIn(accountStatus);
              } else {

                setErrorMessage(response.Msg);
              }
            } catch (err) {

              setErrorMessage(
                `Something went wrong! Error: ${JSON.stringify(err)}`
              );
              console.error(
                `Something went wrong! Error: ${JSON.stringify(err)}`
              );
            } finally {
              setSubmitting(false);
            }
          };

          setErrorMessage("");
          await login(data);
        }}
      >
        {({ values, handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <TextField
              type="email"
              name="email"
              label="Email"
              value={values.email}
            />

            <p className="small float-right mb-0">
              <span
                className={`font-weight-bold text-primary ${Styles.addPointerEvent}`}
                onClick={() => setLoginStep(LOGIN_STEPS.FORGOTPASSWORD)}
              >
                Forgot Password?
              </span>
            </p>
            <TextField
              label="Password"
              type="password"
              name="password"
              value={values.password}
            />

            <Button
              className="mt-3"
              block
              size="lg"
              variant="primary"
              type="submit"
              disabled={isSubmitting}
            >
              Login
            </Button>
            <ErrorText error={errorMessage} />
          </Form>
        )}
      </Formik>
    </>
  );

  const forgotPasswordContent = (
    <>
      <div className="mb-lg-4 mb-4">
        <h4>Forgot Password</h4>
      </div>
      <Formik
        key="forgot_password_key"
        validationSchema={forgotPasswordSchema}
        initialValues={{
          email: "",
        }}
        onSubmit={(data, { setSubmitting }) => {
          const resetPassword = async (data) => {
            try {
              const response = await fetchDataWithoutAuth(
                `${ADMIN_API_URL}/api/dashboard/email/requestResetPassword`,
                "GET",
                `email=${data.email}`
              );

              if (response.Error) {
                setErrorMessage(response.Error);
              } else if (response.Msg) {
                setLoginStep(LOGIN_STEPS.FORGOTPASSWORDSUCCESS);
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

          setErrorMessage("");
          resetPassword(data);
        }}
      >
        {({ values, handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <TextField
              type="email"
              name="email"
              value={values.email}
              label="Email"
            />
            <Button
              className="mt-3"
              block
              size="lg"
              variant="primary"
              type="submit"
              disabled={isSubmitting}
            >
              Submit
            </Button>
            <ErrorText error={errorMessage} />
          </Form>
        )}
      </Formik>
    </>
  );

  const forgotPasswordSuccessContent = (
    <div>
      <h5>We have send you mail to your mail id</h5>
    </div>
  );

  let content = null;

  switch (loginStep) {
    case LOGIN_STEPS.LOGIN:
      content = loginContent;
      break;
    case LOGIN_STEPS.FORGOTPASSWORD:
      content = forgotPasswordContent;
      break;
    case LOGIN_STEPS.FORGOTPASSWORDSUCCESS:
      content = forgotPasswordSuccessContent;
      break;
  }

  return content;
};

export default Login;
