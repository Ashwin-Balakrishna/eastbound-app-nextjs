// import Head from "next/head";
// import React, { useEffect, useState } from "react";
// import NavBar from "../pageComponents/navbar/navBar";
// import {
//   SessionProvider,
//   useSessionUpdate,
// } from "../../context/sessionContext";

// const PageLayout = (props) => {
//   const updateSession = useSessionUpdate();
//   useEffect(() => updateSession, []);

//   return (
//     <SessionProvider>
//       <Head>
//         <title>{props.title || "2Hub"}</title>
//       </Head>
//       <NavBar />
//       <div
//         className={props.background ? `${props.background} mt-lg-5` : "mt-lg-5"}
//       >
//         {props.children}
//       </div>
//       <Card
//         className="p-2 position-fixed rounded-0 border-0 bg-white shadow-lg"
//         style={{ bottom: "50px", right: "40px" }}
//       >
//         <Image src="/images/beta.png" width="30" height="30"></Image>
//       </Card>
//     </SessionProvider>
//   );
// };

// export default PageLayout;

import Head from "next/head";
import React, { useEffect } from "react";
import NavBar from "../pageComponents/navbar/navBar";
import {
  SessionProvider,
  useSessionUpdate,
} from "../../context/sessionContext";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PageLayout = (props) => {
  const updateSession = useSessionUpdate();
  useEffect(() => updateSession, []);

  return (
    <SessionProvider>
      <Head>
        <title>{props.title || "2Hub"}</title>
      </Head>
      <NavBar changed={props.changed} />
      <main className="main__wrapper">{props.children}</main>

      <ToastContainer
        position="top-right"
        autoClose={3000}
      />
      
    </SessionProvider>
  );
};

export default PageLayout;
