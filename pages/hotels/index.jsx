import React, { useEffect, useState } from "react";
import { Col, Container, Row, Card, Image, Button } from "react-bootstrap";
import Flickity from "react-flickity-component";
import PageLayout from "../../components/layouts/pageLayout";
import DetailCard from "../../components/pageComponents/cards/detailCard";
import DealCard from "../../components/pageComponents/dealCard/dealCard";
import Footer from "../../components/pageComponents/footer/footer";
import HeroImage from "../../components/pageComponents/heroImage/heroImage";
// import Search from "../../components/search/search";
import HotelSearch from "../../components/pageComponents/hotelSearches";
import moment from "moment";
import { fetchDataWithoutToken } from "../../utils/apiHelper";
import { useRouter } from "next/router";
import nextCookie from "next-cookies";
import ModalComponent from "../../components/elements/modal";
import Login from "../../components/pageComponents/login";
import PosterCard from "../../components/pageComponents/cards/posterCard";
import BannerCarousel from "../../components/pageComponents/BannerCarousel";
import {
  flickityCellHeight100Per,
  getSessionToken,
  API_URL,
  IMAGE_URL,
} from "../../utils/helper";
import Advantages from "../../components/pageComponents/advantages";
import { AiOutlineBarChart } from "react-icons/ai";
import { GiCheckedShield, GiWireframeGlobe } from "react-icons/gi";
import { FiAward, FiCheckCircle, FiMousePointer } from "react-icons/fi";
import { FaRocketchat, FaServer, FaMoneyCheckAlt } from "react-icons/fa";
import { urls } from "../../shared/urls";
import HotelSearchFilter from '../../components/pageComponents/hotels/hotelSearchFilter';

const homeBanners = [
  {
    key: "1",
    src: "/images/home-banner-1.jpeg",
  },
  {
    key: "2",
    src: "/images/home-banner-2.jpeg",
  },
  {
    key: "3",
    src: "/images/home-banner-3.jpeg",
  },
  {
    key: "4",
    src: "/images/home-banner-4.jpeg",
  },
];

const homeBannersMob = [
  {
    key: "1",
    src: "/images/bannerMob1.jpg",
  },
  {
    key: "2",
    src: "/images/bannerMob2.jpg",
  },
  {
    key: "3",
    src: "/images/bannerMob3.jpg",
  },
  {
    key: "4",
    src: "/images/bannerMob4.jpg",
  },
];

const posters = [
  {
    key: "1",
    src: "/images/leela-banner.jpeg",
  },
  {
    key: "2",
    src: "/images/tajMahal-banner.jpeg",
  },
  {
    key: "3",
    src: "/images/tajView-banner.jpeg",
  },
  {
    key: "4",
    src: "/images/tajClub-banner.jpeg",
  },
  {
    key: "5",
    src: "/images/tajCoromandel-banner.jpeg",
  },
];

const topRatedHotels = [
  {
    key: "1",
    src: "/images/top-rated1.jpg",
    name: "Atlantis The Palm",
    city: "Dubai",
    rating: 5,
  },
  {
    key: "2",
    src: "/images/top-rated2.jpg",
    name: "Four Seasons Hotel",
    city: "Bosphorus",
    rating: 5,
  },
  {
    key: "3",
    src: "/images/top-rated3.jpg",
    name: "Taj Exotica Resort & Spa",
    city: "Maldives",
    rating: 5,
  },
  {
    key: "4",
    src: "/images/top-rated4.jpg",
    name: "Four Seasons Resort",
    city: "Koh Samui",
    rating: 5,
  },
  {
    key: "5",
    src: "/images/top-rated5.jpg",
    name: "Cinnamon Lodge",
    city: "Habarana",
    rating: 5,
  },
  {
    key: "6",
    src: "/images/ritzCarlton.jpeg",
    name: "The Ritz-Carlton",
    city: "Bali",
    rating: 5,
  },
];

const lastMinuteDeals = [
  {
    key: "1",
    src: "/images/leelaPalaceUdaipur.jpeg",
    name: "The Leela Palace",
    city: "Udaipur",
    rating: 5,
  },
  {
    key: "2",
    src: "/images/tajCoromandelChennai.jpeg",
    name: "Taj Coromandel",
    city: "Chennai",
    rating: 5,
  },
  {
    key: "3",
    src: "/images/rohetGarh.jpeg",
    name: "Rohet Garh",
    city: "Rohet",
    rating: 4,
  },
  {
    key: "4",
    src: "/images/tajMahalDelhi.jpeg",
    name: "Taj Mahal",
    city: "Delhi",
    rating: 5,
  },
  {
    key: "5",
    src: "/images/leelaGoa.jpeg",
    name: "The Leela",
    city: "Goa",
    rating: 5,
  },
];

const advantageList = [
  {
    key: "1",
    icon: <GiWireframeGlobe />,
    title: "Widest Network of Hotels",
  },
  {
    key: "2",
    icon: <FiCheckCircle />,
    title: "Unmatched Pricing",
  },
  {
    key: "3",
    icon: <FaRocketchat />,
    title: "24x7 Customer Support",
  },
  {
    key: "4",
    icon: <FaMoneyCheckAlt />,
    title: "Sell with Ease",
  },
  {
    key: "5",
    icon: <FaServer />,
    title: "Tech Driven Automation",
  },
  {
    key: "6",
    icon: <FiMousePointer />,
    title: "Customer Friendly UI/UX",
  },
];

const testimonails = [
  {
    key: "1",
    src: "",
    name: "Raghav Luthra (Operations Manager) ",
    companyNmae: "The Travellers Lounge - TTL Holidays Pvt. Ltd",
    description:
      "The services were up to the mark and as per the client, driver was very cooperative and knowledgeable.",
  },
  {
    key: "2",
    src: "",
    name: "Munhasir Ali (Manager - Operations)",
    companyNmae: "Rezlive",
    description:
      "It was great working with your team, we got excellent support in concluding this booking. Would like to speak with you on further business opportunity with 2hub travel.",
  },
  {
    key: "3",
    src: "",
    name: "Arijit Chanda",
    companyNmae: "",
    description:
      "Thanks for recommending the place. It is a beautiful place and food was great too. We were confined to the rooms for 3 days due to heavy rain that week but didn't mind as we got the rest and the peace that we were looking for. ",
  },
  {
    key: "4",
    src: "",
    name: "Divya Sehgal",
    companyNmae: "Worldwide Holidays",
    description:
      "It is a pleasure to let you know that my clients are so happy with their tour. Thank you for the impeccable service and compliments for both drivers. They had a wonderful time throughout.",
  },
  {
    key: "5",
    src: "",
    name: "Sumeet Dubey",
    companyNmae: "Astron Hospitality",
    description:
      "The kind of commitment shown by you and Ami is just brilliant, and this revert of yours at this time of the day is a proof of that. We are very happy to work with you and Ami and hope that we will continue working and growing together.",
  },
];

const flickityOptions = {
  cellAlign: "left",
  wrapAround: true,
  initialIndex: 1,
  friction: 0.2,
  autoPlay: true
};

const getHotelLinks = (hotel) => {
  // const today = moment();
  const checkinDate = moment().add(20, "days");
  const checkoutDate = moment().add(21, "days");
  const query = {
    hotels: {
      code: hotel.id,
      hotelName: hotel.name,
    },
    checkin: checkinDate,
    checkout: checkoutDate,
    rooms: [
      {
        roomId: 1,
        adults: 2,
        children: 0,
        children_age: [],
      },
    ],
    nationality: "IN",
  };

  return `/hotels/${hotel.code}?search=${encodeURIComponent(
    JSON.stringify(query)
  )}`;
};

const Hotels = () => {
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [twohubHotels, setTwohubHotels] = useState([]);
  const token = getSessionToken();
  const [data,setData]=useState([]);
  const [checkboxFilters, setCheckboxFilters] = useState({})
  const [hotelPrice,setHotelPrice]=useState([]); 
  const [callHotel,setCallhotel]=useState(0);
  const [booking, setBooking] = useState({});
  const [loader,setLoader]=useState(false);
  const [showSearch, setShowSearch] = useState(false);


  return (
    <>
      <PageLayout title="2hub | Home">
        {/* <HeroImage /> */}
        <section className="d-none d-md-block">
          {/* <Container> */}
            <Flickity
              className={"offerCarousel w-100"}
              options={flickityOptions}
            >
              {homeBanners.map((poster) => (
                <Col xs={12} md={12} lg={12} key={poster.key} className="pl-0 pr-0">
                  <BannerCarousel src={poster.src} />
                </Col>
              ))}
            </Flickity>
          {/* </Container> */}
        </section>
        <section className="d-block d-md-none">
          {/* <Container> */}
            <Flickity
              className={"offerCarousel w-100"}
              options={flickityOptions}
            >
              {homeBannersMob.map((poster) => (
                <Col xs={12} md={12} lg={12} key={poster.key} className="pl-0 pr-0">
                  <BannerCarousel src={poster.src} />
                </Col>
              ))}
            </Flickity>
          {/* </Container> */}
        </section>
        <section className="pb-3 bg-primary-lightest" id="search" 
        onClick={(e) => {
                            if (!token) {
                              e.stopPropagation();
                              setShowLoginModal(true);
                            }
                          }} >
        
            {/* <Row>
              <Col xs={12} lg={11} className="mx-auto">
                <Search
                  onHotelSearch={(data) => {
                    router.push(
                      {
                        pathname: urls.hotels_listing,
                        query: {
                          search: JSON.stringify(data),
                        },
                      },
                      {
                        pathname: urls.hotels_listing,
                        query: {
                          search: JSON.stringify(data),
                        },
                      }
                    );
                  }}
                />
              </Col>
            </Row> */}
            <HotelSearch  loader={loader} setLoader={setLoader} data={data} setData={setData} setHotelPrice={setHotelPrice} checkboxFilters={checkboxFilters} callHotel={callHotel} setCallhotel={setCallhotel} setBooking={setBooking} setShowSearch={setShowSearch} background="#ffe5d7" labelc="black"/>

          
        </section>

        <section className="bg-primary-lightest pb-3 mb-5 mb-lg-7">
          <Container className="pt-3">
            <Row>
              <Advantages advantages={advantageList} />
            </Row>
          </Container>
        </section>

        <section className="mb-5 mb-lg-7">
          <Container>
            <Row>
              <Col>
                <a
                  href="https://www.dubaiparksandresorts.com/en/booking/tickets"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    src="/images/dpr-banner.jpeg"
                    className="w-100 rounded-10"
                    style={{ height: "auto" }}
                  />
                </a>
              </Col>
            </Row>
          </Container>
        </section>

        <section className="mb-5 mb-lg-7">
          <Container className="pl-0">
            <Flickity
              className={"offerCarousel w-100"}
              options={flickityOptions}
            >
              {posters.map((poster) => (
                <Col xs={11} md={7} lg={5} key={poster.key}>
                  <PosterCard src={poster.src} />
                </Col>
              ))}
            </Flickity>
          </Container>
        </section>

        <section className="mb-5 mb-lg-7">
          {topRatedHotels.length > 0 ? (
            <Container className="pb-4">
              <Row className="mb-4">
                <Col xs={12}>
                  <h3 className="font-weight-bold">
                    Top-rated hotels in 70+ countries
                  </h3>
                  <p>
                  Whether your customer needs a hotel for a business trip or family vacation, 
                  our hand-picked selection guarantees a memorable experience, with the best 
                  price guaranteed!
                  </p>
                </Col>
              </Row>
              <Row>
                <Flickity
                  className={"offerCarousel w-100"}
                  options={flickityOptions}
                >
                  {topRatedHotels.map((hotel, i) => {
                    return i < 5 ? (
                      <Col
                        xs={8}
                        md={5}
                        lg={3}
                        key={hotel.key}
                        className="px-2"
                      >
                        <DetailCard
                          title={hotel.name}
                          src={hotel.src}
                          // src={
                          //   hotel.src
                          //     ? `${IMAGE_URL}${hotel.images[0].image_file}`
                          //     : "/images/demo-img4.jpg"
                          // }
                          rating={hotel.rating}
                          className="standard-card-height"
                          location={hotel.city}
                          // onClick={(e) => {
                          //   if (!token) {
                          //     e.stopPropagation();
                          //     setShowLoginModal(true);
                          //   }
                          // }}
                          // href={token ? getHotelLinks(hotel) : undefined}
                          // target={token ? "_blank" : undefined}
                        />
                      </Col>
                    ) : null;
                  })}
                </Flickity>
              </Row>
            </Container>
          ) : null}
        </section>

        {/* <Container className="mb-5 mb-lg-7">
          <DealCard />
        </Container> */}

        <section className="mb-5 mb-lg-7">
          <Container>
            <Row className="mb-4">
              <Col xs={12}>
                <h3 className="font-weight-bold">
                  Best last-minute travel deals
                </h3>
                <p>
                Need a last-minute hotel for a client’s unexpected trip? Choose 
                from exclusive last-minute deals available for hundreds of hotels 
                and grab an unbelievable bargain.
                </p>
              </Col>
            </Row>
            <Row>
                <Flickity
                  className={"offerCarousel w-100"}
                  options={flickityOptions}
                >
                  {lastMinuteDeals.map((hotel, i) => {
                    return i < 5 ? (
                      <Col
                        xs={8}
                        md={5}
                        lg={3}
                        key={hotel.key}
                        className="px-2"
                      >
                        <DetailCard
                          title={hotel.name}
                          src={hotel.src}
                          // src={
                          //   hotel.src
                          //     ? `${IMAGE_URL}${hotel.images[0].image_file}`
                          //     : "/images/demo-img4.jpg"
                          // }
                          rating={hotel.rating}
                          className="standard-card-height"
                          location={hotel.city}
                          // onClick={(e) => {
                          //   if (!token) {
                          //     e.stopPropagation();
                          //     setShowLoginModal(true);
                          //   }
                          // }}
                          // href={token ? getHotelLinks(hotel) : undefined}
                          // target={token ? "_blank" : undefined}
                        />
                      </Col>
                    ) : null;
                  })}
                </Flickity>
              </Row>
          </Container>
        </section>
        <section className="mb-5 mb-lg-7">
          <Container className="mb-5">
            <Row className="mb-4 no-gutters">
              <Col xs={12}>
                <h3 className="font-weight-bold">
                  What our travel agent partners say
                </h3>
                <p>
                Every company says they are great, 
                but don’t take our word for it. Here’s what 
                some travel agents have said about our service.
                </p>
              </Col>
            </Row>

            <Flickity
              flickityRef={flickityCellHeight100Per}
              className={"testimonialCarousel w-100"}
              options={flickityOptions}
            >
              {testimonails.map((testimonial) => (
                <Col
                  xs={12}
                  md={7}
                  lg={5}
                  key={testimonial.key}
                  className="pb-4"
                >
                  <Card className="border-0 custom-shadow h-100 rounded-10">
                    <Card.Body className="pl-md-5 custom-card-border-top">
                      <Row className="align-items-lg-center">
                        <Col xs={12}>
                          <Image src={testimonial.src} className="w-100 mb-3" />
                        </Col>
                        <Col xs={12}>
                          <div className="font-weight-bold text-md">
                            <p className="text-primary mb-1">
                              {testimonial.name}
                            </p>
                            <p className="mb-1">{testimonial.companyNmae}</p>
                          </div>
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

        {/* <section className="mb-5 mb-lg-7">
          <Container className="py-4">
            <Row>
              <Col xs={12} className="text-center mb-3">
                <h3 className="font-weight-bold">
                  Subscribe to our Newsletter
                </h3>
              </Col>
              <Col xs={11} md={8} className="mx-auto text-center">
                <p>
                  Sign up for our newsletter and get access to information about
                  all our upcoming trips, early bird discounts, fabulous and
                  inspirational travel stories as well other fun things that
                  happen in our offices.
                </p>
                <Button
                  variant="primary"
                  target="_blank"
                  href="https://2hub.us10.list-manage.com/subscribe?u=13547347a7a832def3d04cef8&id=2378e6608c"
                >
                  Subscribe
                </Button>
              </Col>
            </Row>
          </Container>
        </section> */}

        <Footer id="footer" />
      </PageLayout>
      <ModalComponent
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
        bodyClassName="p-5 mb-3"
        body={
          <Login
            loggedIn={() => {
              setShowLoginModal(false);
              router.reload();
            }}
          />
        }
      />
    </>
  );
};

export default Hotels;
