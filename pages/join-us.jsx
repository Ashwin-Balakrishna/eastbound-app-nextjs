import { Button, Card, Col, Container, Image, Row } from "react-bootstrap";
import Footer from "../components/pageComponents/footer/footer";
import AuthLayout from "../components/layouts/authLayout";
import JoinUsForm from "../components/pageComponents/signUp/joinUsForm";
import { useWindowSize } from "../hooks/useWindowSize";
import { useState, useEffect } from "react";
import ModalComponent from "../components/elements/modal";
import { flickityCellHeight100Per } from "../utils/helper";
import Flickity from "react-flickity-component";
import { FaEnvelopeOpen, FaPhoneAlt } from "react-icons/fa";
import { AiFillFacebook, AiFillLinkedin } from "react-icons/ai";
import { BsFillPersonFill } from "react-icons/bs";
import { FiInstagram } from "react-icons/fi";
import Link from "next/link";
import {
  supportEmail,
  supportNumber,
  supportNumberFormated,
} from "../shared/contacts";



const testimonails = [
  {
    key: "1",
    src: "/images/ttl.jpeg",
    name: "Raghav Luthra (Operations Manager) ",
    companyNmae: "The Travellers Lounge - TTL Holidays Pvt. Ltd",
    description:
      "The services were up to the mark and as per the client, driver was very cooperative and knowledgeable.",
  },
  {
    key: "2",
    src: "/images/rezlive.jpg",
    name: "Munhasir Ali (Manager - Operations)",
    companyNmae: "Rezlive",
    description:
      "It was great working with your team, we got excellent support in concluding this booking. Would like to speak with you on further business opportunity with 2hub travel, please do let me know suitable time for call to discuss on same",
  },
  {
    key: "4",
    src: "/images/wwh.jpg",
    name: "Divya Sehgal",
    companyNmae: "Worldwide Holidays",
    description:
      "It is a pleasure to let you know that my clients are so happy with their tour. Thank you for the impeccable service and compliments for both drivers. They had a wonderful time throughout.",
  },
  {
    key: "5",
    src: "/images/a.jpeg",
    name: "Sumeet Dubey",
    companyNmae: "Astron Hospitality",
    description:
      "The kind of commitment shown by you and Ami is just brilliant, and this revert of yours at this time of the day is a proof of that. We are very happy to work with you and Ami and hope that we will continue working and growing together.",
  },
];

const flickityOptions = {
  contain: "true",
  cellAlign: "left",
};

const JoinUs = () => {
  const screenSize = useWindowSize();
  const [showJoinUsModal, setShowJoinUsModal] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    window.onscroll = () => {
      const fromTop = window.scrollY;

      if (fromTop <= 100) {
        setShowScrollTop(false);
      } else {
        setShowScrollTop(true);
      }
    };
  });

  return (
    <AuthLayout title="2Hub | Join Us">
      <section className="mb-5 mb-lg-7 position-relative">
        <div
          className="position-absolute d-flex justify-content-between align-items-center w-100 px-5 py-2"
          style={{ zIndex: "1" }}
        >
          <Image src="/images/2hub.png" alt="2hub_logo" width="120px" />
          <div className="d-md-flex">
            <a
              href={`tel:${supportNumber}`}
              className="text-white mr-3 small d-none d-md-block"
            >
              <FaPhoneAlt /> {supportNumberFormated}
            </a>
            <a
              href={`mailto:${supportEmail}`}
              className="text-white mr-3 small d-none d-md-block"
            >
              <FaEnvelopeOpen /> {supportEmail}
            </a>
            <Link href="/login">
              <a className="text-white mr-3 small">
                <BsFillPersonFill /> Sign In
              </a>
            </Link>
          </div>
        </div>
        <Image
          src="/images/join2.jpg"
          className="w-100 vh-100 bg-image"
          style={{  objectFit: "cover" }}
        
        />
        <Card.ImgOverlay
          className="d-flex align-items-center"
          style={{
            background: "linear-gradient(0deg,rgba(0,0,0,0.5),transparent)",
          }}
          
        >
          <Container className='pd-tp-50'>
            <Row className="justify-content-between">
              <Col
                xs={12}
                lg={5}
                className="text-white d-flex flex-column justify-content-center"
              >
                <h1 className="display-4">
                  The fastest and easiest way to book travel
                </h1>
                <p>
                  Trusted by <strong>18000+ travel agents</strong> worldwide,
                  our easy to use portal is designed to help you easily find and
                  book hotels and travel experiences for your clients at
                  exclusive rates. Backed by
                  <strong> 24×7 customer support</strong>.
                </p>
                {screenSize.width <= 768 ? (
                  <Button onClick={() => setShowJoinUsModal(true)}>
                    Join us
                  </Button>
                ) : null}
              </Col>
              <Col lg={5} className="px-md-4">
                {screenSize.width > 768 ? <JoinUsForm /> : null}
              </Col>
            </Row>
          </Container>
        </Card.ImgOverlay>
      </section>

      <section className="mb-5 mb-lg-7">
        <Container>
          <Row>
            <Col xs={12} md={8} lg={6} className="mx-auto text-center py-3">
              <p className="mb-4 text-muted">
                We are a global company with
                <strong>18000 + travel partners</strong> in India Singapore,
                Brazil, Nepal, Bhutan Europe, UAE, USA, and the UK. We enable
                travel agents to get access to an expansive portfolio of hotels
                and holidays at unmatched prices. The added convenience of
                booking through our online portal, attractive credit financing
                options and
                <strong> 24x7 customer support</strong>, will make it a breeze
                for you to sell to your customers.
              </p>
            </Col>

            <Col xs={12} lg={9} className="mx-auto text-center py-md-4">
              <Row className="justify-content-between">
                <Col xs={6} md={2} className="mb-2">
                  <h3>18000+</h3>
                  <div className="text-dark text-md">travel partners</div>
                </Col>
                <Col xs={6} md={3} className="mb-2">
                  <h3>50000+</h3>
                  <div className="text-dark text-md">
                    top rated hotel properties worldwide
                  </div>
                </Col>
                <Col xs={6} md={2} className="mb-2">
                  <h3>50</h3>
                  <div className="text-dark text-md">offices worldwide</div>
                </Col>
                <Col xs={6} md={2} className="mb-2">
                  <h3>100000+</h3>
                  <div className="text-dark text-md">
                    unique travel experiences
                  </div>
                </Col>
                <Col xs={6} md={3} className="mb-2">
                  <h3>15 years of</h3>
                  <div className="text-dark text-md">Industry experience</div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="mb-5 mb-lg-7">
        <Container>
          <Row className="mb-4">
            <Col xs={12}>
              <h4>Why register with us?</h4>
            </Col>
          </Row>
          <Row className="mb-4 d-flex flex-row flex-nowrap is-x-scrollable w-100 py-3">
            <Col xs={11} lg={3} md={6}>
              <Card
                className="text-center d-flex border-0 bg-primary-lightest custom-shadow h-100"
                style={{ borderRadius: "20px" }}
              >
                <Card.Body>
                  <Image
                    src="/images/Registration.svg"
                    className="h-45 w-45 mb-3"
                  />
                  <h5 className="mb-3 small text-uppercase font-weight-bold">
                    Free and quick registration
                  </h5>
                  <Card.Text className="small pb-5">
                    {`Sign up free, it's quick. Takes only 1 minute. No credit
                    card needed.`}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={11} lg={3} md={6}>
              <Card
                className="text-center d-flex border-0 custom-shadow h-100"
                style={{ borderRadius: "20px" }}
              >
                <Card.Body>
                  <Image
                    src="/images/UserInterface.svg"
                    className="h-45 w-45 mb-3"
                  />
                  <h5 className="mb-3 small text-uppercase font-weight-bold">
                    User-friendly interface
                  </h5>
                  <Card.Text className="small pb-5">
                    Simple-to-use website lets you easily search and find
                    availability and prices for a wide range of products, and
                    book instantly.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={11} lg={3} md={6}>
              <Card
                className="text-center d-flex border-0 bg-primary-lightest custom-shadow h-100"
                style={{ borderRadius: "20px" }}
              >
                <Card.Body>
                  <Image
                    src="/images/Experiences.svg"
                    className="h-45 w-45 mb-3"
                  />
                  <h5 className="mb-3 small text-uppercase font-weight-bold">
                    Get access to exclusive experiences
                  </h5>
                  <Card.Text className="small pb-5">
                    50K hotels and 100K global sightseeing options available, in
                    70+ countries and growing.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={11} lg={3} md={6}>
              <Card
                className="text-center d-flex border-0 custom-shadow h-100"
                style={{ borderRadius: "20px" }}
              >
                <Card.Body>
                  <Image src="/images/Payment.svg" className="h-45 w-45 mb-3" />
                  <h5 className="mb-3 small text-uppercase font-weight-bold">
                    Payment options
                  </h5>
                  <Card.Text className="small pb-5">
                    Access to online payments, financing and increased credit
                    limits.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={11} lg={3} md={6}>
              <Card
                className="text-center d-flex border-0 custom-shadow h-100 bg-primary-lightest"
                style={{ borderRadius: "20px" }}
              >
                <Card.Body>
                  <Image src="/images/Rates.svg" className="h-45 w-45 mb-3" />
                  <h5 className="mb-3 small text-uppercase font-weight-bold">
                    Exclusive rates and availability
                  </h5>
                  <Card.Text className="small pb-5">
                    Take advantage of the most competitive rates in the market.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={11} lg={3} md={6}>
              <Card
                className="text-center d-flex border-0 custom-shadow h-100"
                style={{ borderRadius: "20px" }}
              >
                <Card.Body>
                  <Image
                    src="/images/OnlineTraining.svg"
                    className="h-45 w-45 mb-3"
                  />
                  <h5 className="mb-3 small text-uppercase font-weight-bold">
                    Benefit from exclusive online training
                  </h5>
                  <Card.Text className="small pb-5">
                    Learn how to maximise your effectiveness
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={11} lg={3} md={6}>
              <Card
                className="text-center d-flex border-0 bg-primary-lightest custom-shadow h-100"
                style={{ borderRadius: "20px" }}
              >
                <Card.Body>
                  <Image src="/images/Support.svg" className="h-45 w-45 mb-3" />
                  <h5 className="mb-3 small text-uppercase font-weight-bold">
                    24 x 7 professional support
                  </h5>
                  <Card.Text className="small pb-5">
                    Quick assistance for your needs, whether minor requests or
                    trip-critical issues.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="mb-5 mb-lg-7">
        <Container>
          <Row className="mb-4">
            <Col xs={12}>
              <h4>How it works</h4>
            </Col>
          </Row>
          <Row>
            <Col xs={12} lg={4} className="mb-3">
              <Card
                className="d-flex h-100 text-center"
                style={{ borderRadius: "20px" }}
              >
                <Card.Body>
                  <p className="text-blue font-weight-bold small">Step 1</p>
                  <Image src="/images/svg/login.svg" className="w-45 mb-4" />
                  <h6 className="mb-2">Register</h6>
                  <Card.Text className="text-md text-muted">
                    Simply sign up to 2Hub by sharing your name and agency
                    details.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} lg={4} className="mb-3">
              <Card
                className="d-flex h-100 text-center"
                style={{ borderRadius: "20px" }}
              >
                <Card.Body>
                  <p className="text-blue font-weight-bold small">Step 2</p>
                  <Image src="/images/svg/access.svg" className="w-45 mb-4" />
                  <h6 className="mb-2">
                    Check your email to get early access to 2Hub
                  </h6>
                  <Card.Text className="text-md text-muted">
                    After your registration is complete, you will receive an
                    email to gain early access to the portal.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} lg={4} className="mb-3">
              <Card
                className="d-flex h-100 text-center"
                style={{ borderRadius: "20px" }}
              >
                <Card.Body>
                  <p className="text-blue font-weight-bold small">Step 3</p>
                  <Image src="/images/svg/travel.svg" className="w-45 mb-4" />
                  <h6 className="mb-2">Sell, sell, sell!</h6>
                  <Card.Text className="text-md text-muted">
                    Take advantage of 2Hub’s extensive products, exclusive deals
                    and offers, and easy payment options to wow your customers
                    and beat your sales targets!
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="mb-5 mb-lg-7 py-md-5 bg-primary-lightest">
        <Container>
          <Row className="align-items-center">
            <Col xs={12} md={6} className="text-center p-3">
              <Image src="images/svg/social1.svg" className="w-75 " />
            </Col>
            <Col xs={12} md={6} className="px-md-5 px-3 py-5">
              <h4 className="mb-4 font-weight-bold">
                {`We're on social media - find us, follow us, talk to us!`}
              </h4>
              <p className="mb-4 text-muted">
                Follow us on your favourite social media channel so you can stay
                up to date on flash sales, new product announcements, exclusive
                discounts, company updates and industry news.
              </p>
              <Row>
                <Col xs={12} md={7}>
                  <ul className="list-unstyled d-flex align-items-center">
                    <li>
                      <a
                        href="https://www.facebook.com/2hub.travel/"
                        target="_blank"
                        rel="noreferrer"
                        className=" mr-3"
                      >
                        <AiFillFacebook size="2rem" className="text-primary" />
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.instagram.com/2hub.travelofficial/"
                        target="_blank"
                        rel="noreferrer"
                        className=" mr-3"
                      >
                        <FiInstagram size="2rem" className="text-primary" />
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.linkedin.com/company/2hub/"
                        target="_blank"
                        rel="noreferrer"
                        className=" mr-3"
                      >
                        <AiFillLinkedin size="2rem" className="text-primary" />
                      </a>
                    </li>
                  </ul>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="bg-white pb-5">
        <Container className="mb-5">
          <Row className="mb-4 no-gutters">
            <Col xs={12}>
              <h3 className="font-weight-bold">What our clients think?</h3>
              <p>
                The love for our agent partners is mutual. See what they have to
                say...
              </p>
            </Col>
          </Row>

          <Flickity
            flickityRef={flickityCellHeight100Per}
            className={"testimonialCarousel w-100"}
            options={flickityOptions}
          >
            {testimonails.map((testimonial) => (
              <Col xs={12} md={7} lg={5} key={testimonial.key} className="pb-4">
                <Card className="border-0 custom-shadow h-100 rounded-10">
                  <Card.Body className="pl-md-5 custom-card-border-top">
                    <Row className="align-items-center mb-3">
                      <Col xs={4}>
                        <Image src={testimonial.src} className="w-100 mb-3" />
                      </Col>
                      <Col xs={8}>
                        <div className="font-weight-bold text-md">
                          <p className="text-primary mb-1">
                            {testimonial.name}
                          </p>
                          <p className="mb-1">{testimonial.companyNmae}</p>
                        </div>
                      </Col>
                    </Row>
                    <Row className="align-items-lg-center">
                      <Col xs={12}>
                        <p className="text-md font-italic text-muted">
                          {testimonial.description}
                        </p>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Flickity>
        </Container>
      </section>

      <Footer />

      <section
        className="position-fixed bottom-0 bg-white w-100 py-2 mt-5 d-md-none"
        style={{
          display: showScrollTop ? "block" : "none",
          opacity: showScrollTop ? "1" : "0",
          transition: "opacity 0.5s ease-in",
        }}
      >
        <Container>
          <Row>
            <Col xs={11} className="mx-auto">
              <Button block size="lg" onClick={() => setShowJoinUsModal(true)}>
                Join Us
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      <ModalComponent
        show={showJoinUsModal}
        onHide={() => setShowJoinUsModal(false)}
        title="Become a 2HUB partner"
        scrollable={true}
        body={<JoinUsForm setShowJoinUsModal={setShowJoinUsModal}/>}
      />
    </AuthLayout>
  );
};

export default JoinUs;
