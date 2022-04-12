import "flickity/css/flickity.css";
import Head from "next/head";
import NextNProgress from "nextjs-progressbar";
import "react-dates/lib/css/_datepicker.css";
import "react-phone-input-2/lib/bootstrap.css";
import "react-image-gallery/styles/css/image-gallery.css";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import "react-datetime/css/react-datetime.css";
// import 'bootstrap-daterangepicker/daterangepicker.css';
// import 'bootstrap/dist/css/bootstrap.css';

import "../public/scss/styles.scss";
import { useEffect } from "react";
import { Router } from "next/router";
import 'rsuite/dist/rsuite.css';
import { initGA, logPageView } from "../utils/analytics";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    initGA();
    logPageView();
    Router.events.on("routeChangeComplete", logPageView);
  }, []);

  return (
    <>
      <Head>
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="images/favicon-32x32.png"
        ></link>
        <script
          src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
          integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
          crossOrigin="anonymous"
        ></script>
        <script
          src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"
          integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <NextNProgress color="#f36b25" options={{ showSpinner: false }} />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
