import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button, Form, Image } from "react-bootstrap";
import * as Yup from "yup";
import ErrorText from "../../components/elements/errorText";
import TextField from "../../components/elements/textField/textField";
import AuthLayout from "../../components/layouts/authLayout";
import { fetchDataWithoutAuth } from "../../utils/apiHelper";
import Styles from "./resetPassword.module.scss";

const RESET_PASSWORD_STEPS = {
  SET_PASSWORD: "setPassword",
  SUCCESS: "success",
};

const resetPasswordSchema = Yup.object({
  password: Yup.string().required("Password is required"),
  confirm_password: Yup.string().when("password", {
    is: (val) => val && val.length > 0,
    then: Yup.string()
      .oneOf([Yup.ref("password")], "Both passwords need to be the same")
      .required(),
  }),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const ResetPassword = () => {
  const router = useRouter();
  const { resetToken } = router.query;

  const [errorMessage, setErrorMessage] = useState("");
  const [pageStep, setPageStep] = useState(RESET_PASSWORD_STEPS.SET_PASSWORD);

  const setPasswordContent = (
    <>
      <div className="mb-lg-4 mb-4">
        <h4>Reset Password</h4>
        {/* <p className="text-muted small">Welcome Back</p> */}
      </div>
      <Formik
        key="reset_password_key"
        validationSchema={resetPasswordSchema}
        initialValues={{
          confirm_password: "",
          password: "",
          email: "",
        }}
        onSubmit={(data, { setSubmitting }) => {
          const setPassword = async (data) => {
            try {
              const response = await fetchDataWithoutAuth(
                `${process.env.global_url}/api/agent/auth/resetPassword`,
                "POST",
                null,
                { Token: resetToken.trim() },
                null,
                "Bearer " + btoa(`${data.email}:${data.password}`)
              );

              if (response.Error) {
                setErrorMessage(response.Error);
              } else {
                if (response.Msg) {
                  setPageStep(RESET_PASSWORD_STEPS.SUCCESS);
                } else {
                  setErrorMessage("Something went wrong! Please try again.");
                }
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
          setPassword(data);
        }}
      >
        {({ values, handleSubmit, isSubmitting, setFieldValue }) => (
          <Form onSubmit={handleSubmit}>
            <TextField
              type="email"
              name="email"
              value={values.email}
              label="Email"
            />
            <TextField
              type="password"
              name="password"
              value={values.password}
              label="Password"
            />
            <TextField
              type="password"
              name="confirm_password"
              value={values.confirm_password}
              label="Confirm Password"
            />
            <Button
              className="mt-3"
              block
              size="lg"
              variant="primary"
              type="submit"
            >
              Set Password
            </Button>
            <ErrorText error={errorMessage} />
          </Form>
        )}
      </Formik>
    </>
  );

  const successContent = (
    <div>
      <h5>Your password has been reset successfully!</h5>
      <p className="text-md text-muted">
        You can &nbsp;
        <Link href="/login">
          <a className="font-weight-bold">Sign in </a>
        </Link>
        &nbsp; with your new password
      </p>
    </div>
  );

  let content = null;

  switch (pageStep) {
    case RESET_PASSWORD_STEPS.SET_PASSWORD:
      content = setPasswordContent;
      break;
    case RESET_PASSWORD_STEPS.SUCCESS:
      content = successContent;
      break;
  }

  return (
    <AuthLayout title="Reset Password">
      <section className="d-lg-flex flex-lg-row align-items-center">
        <div className={`${Styles.imgDiv} position-relative`}>
          <Image
            src="/images/gallery1.jpg"
            className={`w-100 ${Styles.imgHeight}`}
          />
          <div className="card-img-overlay">
            <Image src="/images/logo.png" alt="2hub_logo" />
          </div>
        </div>
        <div className={`${Styles.formDiv} px-3 px-lg-0 pt-5 pt-lg-0`}>
          <div className={Styles.pxLg7}>{content}</div>
        </div>
      </section>
    </AuthLayout>
  );
};

export default ResetPassword;
