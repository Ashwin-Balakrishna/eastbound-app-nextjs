import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { fetchDataWithoutAuth } from "../../utils/apiHelper";
import ErrorText from "../elements/errorText";
import OtpField from "../elements/otpField/otpField";

const AuthOtp = ({ otpLength, phoneNumber, authProcess, next, back }) => {
  const [errorMessageResend, setErrorMessageResend] = useState("");
  const [errorMessageSubmit, setErrorMessageSubmit] = useState("");
  const [otp, setOtp] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [sendingOtp, setSendingOtp] = useState(true);
  const [resend, setResend] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (timeLeft > 0) {
      setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    }
  }, [timeLeft]);

  const numInputs = otpLength || 6;
  const clearErrorMessage = () => {
    setErrorMessageResend("");
    setErrorMessageSubmit("");
  };

  useEffect(() => {
    const getOtp = async (phoneNumber) => {
      try {
        const data = await fetchDataWithoutAuth(
          `${process.env.global_url}/api/agent/auth/otp`,
          "GET",
          `phone=${phoneNumber}`,
          null,
          null
        );

        if (data.Error) {
          setErrorMessageResend(data.Error);
        } else {
          setSessionId(data.session_id);
        }
      } catch (err) {
        setErrorMessageResend(`Something went wrong!`);
        console.error(`Something went wrong! Error: ${JSON.stringify(err)}`);
      } finally {
        setSendingOtp(false);
      }
    };

    setSendingOtp(true);
    setOtp("");
    clearErrorMessage();
    getOtp(phoneNumber);
  }, [resend]);

  let content = sendingOtp ? (
    <div className="text-center">
      <div className="spinner-border text-center"></div>
    </div>
  ) : errorMessageResend ? (
    <>
      <ErrorText error={errorMessageResend} className="mb-4" />
      <Button
        type="button"
        className="btn btn-info mr-3"
        onClick={() => back()}
      >
        Back
      </Button>
      <Button
        className="font-weight-bold"
        variant="primary"
        type="button"
        onClick={() => setResend(!resend)}
      >
        Resend Otp
      </Button>
    </>
  ) : (
    <Formik
      key="otp_key"
      onSubmit={(data, { setSubmitting }) => {
        const submitOtp = async (payload) => {
          try {
            const data = await fetchDataWithoutAuth(
              `${process.env.global_url}/api/agent/auth/otp`,
              "POST",
              null,
              null,
              payload
            );

            if (data.Error) {
              setErrorMessageSubmit(data.Error);
            } else {
              if (authProcess.toLowerCase() === "login") {
                if (data.auth_token) {
                  next(data.auth_token);
                } else {
                  setErrorMessageSubmit(data.Msg);
                }
              } else {
                next();
              }
            }
          } catch (err) {
            setErrorMessageSubmit(`Something went wrong!`);
            console.error(
              `Something went wrong! Error: ${JSON.stringify(err)}`
            );
          } finally {
            setSubmitting(false);
          }
        };

        const payload = {
          session_id: sessionId,
          otp: data.otp,
          phone_number: phoneNumber,
        };

        clearErrorMessage();
        submitOtp(payload);
      }}
      initialValues={{
        otp: otp,
      }}
    >
      {({ values, isSubmitting, handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <OtpField
            name="otp"
            value={values.otp}
            hasErrored={errorMessageSubmit}
            numInputs={numInputs}
            errorText=""
            disabled={isSubmitting}
          />
          <p className="d-flex align-items-center small font-weight-bold">
            <span>Dont receive the OTP?</span>

            <Button
              className="font-weight-bold"
              variant="link"
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                setTimeLeft(30);
                setResend(!resend);
              }}
              style={{ fontSize: "0.9rem" }}
              disabled={timeLeft > 0}
            >
              Resend OTP
            </Button>
            {timeLeft > 0 ? <span>{`00:${timeLeft}`}</span> : null}
          </p>
          <Button
            type="button"
            className="btn btn-info mr-3"
            onClick={() => back()}
          >
            Back
          </Button>
          <Button
            className="font-weight-bold"
            variant="primary"
            type="submit"
            disabled={isSubmitting || values.otp.length !== numInputs}
          >
            Verify and Login
          </Button>

          {errorMessageSubmit ? (
            <p className="invalid-feedback small mt-3">{errorMessageSubmit}</p>
          ) : null}
        </Form>
      )}
    </Formik>
  );

  return <>{content}</>;
};

export default AuthOtp;
