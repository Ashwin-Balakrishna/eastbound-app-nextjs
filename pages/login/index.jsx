import nextCookie from "next-cookies";
import { Image } from "react-bootstrap";
import AuthLayout from "../../components/layouts/authLayout";
import Styles from "./login.module.scss";
import LoginForm from "../../components/pageComponents/login";
import { reloadPageWithUrl } from "../../utils/helper";
import { urls } from "../../shared/urls";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';

const Login = () => {
  const router = useRouter();

  useEffect(()=>{
    
    if(router.query?.sessionExpiry=='true'){
      toast.error('Session expired! Please login again',{autoClose:3000},{position: toast.POSITION.TOP_RIGHT})
    }
  },[])
  return (
    <AuthLayout title="2Hub | Login">
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
            <LoginForm
              loggedIn={({ redirectUrl }) => {
                if (redirectUrl) {
                  reloadPageWithUrl(redirectUrl);
                  return;
                }
                router.push("/");
              }}
            />
          </div>
        </div>
      </section>
    </AuthLayout>
  );
};

export const getServerSideProps = (context) => {
  const { token } = nextCookie(context);
  if (context.req && token) {
    context.res.writeHead(302, { Location: urls.additionalInfo });
    context.res.end();
    return;
  }
  return { props: {} };
};

export default Login;
