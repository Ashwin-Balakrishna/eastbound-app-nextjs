import React from 'react';
import nextCookie from "next-cookies";
import { Image } from "react-bootstrap";
import AuthLayout from "../../components/layouts/authLayout";
import Styles from "./login.module.scss";
import LoginForm from "../../components/pageComponents/login";
import { reloadPageWithUrl } from "../../utils/helper";
import { urls } from "../../shared/urls";
import { useRouter } from "next/router";
import StaffSignUpForm from '../../components/pageComponents/staffSignUp/staffSignUpForm';

const index = () => {
    const router = useRouter();
  return (
    <AuthLayout title="2Hub | SignUp">
      <section className="d-lg-flex flex-lg-row align-items-center">
        <div className={`${Styles.imgDiv} position-relative`}>
          <Image
            src="/images/bhutan.jpg"
            className={`w-100 ${Styles.imgHeight}`}
          />
          <div className="card-img-overlay">
            <Image src="/images/logo.png" alt="2hub_logo" />
          </div>
        </div>
        <div className={`${Styles.formDiv} px-3 px-lg-0 pt-4 pt-lg-0`}>
          <div className={Styles.pxLg7}>
            <StaffSignUpForm />
          </div>
        </div>
      </section>
    </AuthLayout>
  )
}

export default index