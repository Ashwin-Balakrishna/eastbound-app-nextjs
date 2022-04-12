import Head from "next/head";
import React from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
     
const AuthLayout = (props) => {
  return (
    <>
      <Head>
        <title>{props.title || "2Hub"}</title>
      </Head>
      <ToastContainer
        position="top-right"
        autoClose={3000}
      />
      {props.children}
    </>
  );
};

export default AuthLayout;
