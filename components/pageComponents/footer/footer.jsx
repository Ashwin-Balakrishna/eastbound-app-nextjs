// import { Col, Container, Image, Row } from "react-bootstrap";
// import { AiFillFacebook, AiFillLinkedin } from "react-icons/ai";

// import { FiInstagram } from "react-icons/fi";
// import { urls } from "../../../shared/urls";

// const Footer = () => {
//   return (
//     <section className="text-center pt-5 text-md-left bg-shade1" id="footer">
//       <Container>
//         <Row>
//           <Col xs={12}>
//             <ul className="list-unstyled d-flex align-items-center justify-content-around flex-wrap flex-lg-nowrap">
//               <li
//                 className="mb-2"
//                 id="thawteseal"
//                 title="Click to Verify - This site chose Thawte SSL for secure e-commerce and confidential communications."
//               >
//                 <div>
//                   <script src="https://seal.thawte.com/getthawteseal?host_name=www.2hub.co.in&amp;size=M&amp;lang=en"></script>
//                 </div>
//                 <div>
//                   <a
//                     href="/ssl-certificates/"
//                     target="_blank"
//                     className=" text-uppercase font-weight-bold text-decoration-none text-jetblack"
//                   >
//                     About SSL Certificates
//                   </a>
//                 </div>
//               </li>

//               <li className="mb-2">
//                 <a
//                   href="/about-us"
//                   className="text-jetblack text-uppercase font-weight-bold"
//                   target="_blank"
//                   rel="noreferrer"
//                 >
//                   About Us
//                 </a>
//               </li>
//               <li className="mb-2">
//                 <a
//                   href="/contact-us"
//                   className="font-weight-bold text-uppercase text-jetblack"
//                   target="_blank"
//                   rel="noreferrer"
//                 >
//                   Contact Us
//                 </a>
//               </li>
//               <li className="mb-2">
//                 <a
//                   href={urls.paymentPolicy}
//                   className="font-weight-bold text-uppercase text-jetblack"
//                   target="_blank"
//                   rel="noreferrer"
//                 >
//                   Payment policy
//                 </a>
//               </li>
//             </ul>
//           </Col>
//         </Row>
//         <hr />
//         <Row>
//           <Col xs={12}>
//             <ul className="list-unstyled d-flex align-items-center justify-content-center">
//               <li>
//                 <a
//                   href="https://www.facebook.com/2hub.travel/"
//                   target="_blank"
//                   rel="noreferrer"
//                   className=" pr-1"
//                 >
//                   <AiFillFacebook size="1.5rem" className="text-jetblack" />
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="https://www.instagram.com/2hub.travelofficial/"
//                   target="_blank"
//                   rel="noreferrer"
//                   className=" p-1"
//                 >
//                   <FiInstagram size="1.5rem" className="text-jetblack" />
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="https://www.linkedin.com/company/2hub/"
//                   target="_blank"
//                   rel="noreferrer"
//                   className=" p-1"
//                 >
//                   <AiFillLinkedin size="1.5rem" className="text-jetblack" />
//                 </a>
//               </li>
//             </ul>
//           </Col>
//         </Row>
//       </Container>

//       <Col
//         className="text-center overflow-hidden mt-4 py-3"
//         style={{ backgroundColor: "#c2cfda" }}
//       >
//         <p className="small mb-0"> ©2020 Copyright: 2hub.co.in</p>
//       </Col>
//     </section>
//   );
// };

// export default Footer;

// new

import { Container } from "react-bootstrap";
import { FaLinkedin } from "react-icons/fa";
import { FiFacebook, FiInstagram, FiTwitter, FiGlobe } from "react-icons/fi";

const Footer = () => {
  return (
    <section className="footer__wrapper" id="footer">
      <Container>
        <div className="footer__top">
          <ul className="list-unstyled d-flex justify-content-around">
            <li>
              <a href="/about-us" target="_blank" rel="noreferrer">
                About us
              </a>
            </li>
            <li>
              <a href="/contact-us" target="_blank" rel="noreferrer">
                Contact us
              </a>
            </li>
            <li>
              <a href="/privacy-policy" target="_blank" rel="noreferrer">
                Privacy policy
              </a>
            </li>
          </ul>
        </div>
        <div className="footer__bottom d-flex align-items-center justify-content-between">
          <span>©2020 Copyright: 2hub.co.in</span>
          <div className="d-flex">
            <div className="lang-wrap">
              <FiGlobe size="1.2rem" />
              <span>English(IN)</span>
            </div>
            <ul className="list-unstyled d-flex">
              <li>
                <a
                  href="https://www.facebook.com/2hub.travel/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FiFacebook size="1.3rem" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/2hub/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaLinkedin size="1.3rem" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/2hub.travelofficial/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FiInstagram size="1.3rem" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Footer;
