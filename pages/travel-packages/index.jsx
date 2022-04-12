import PageLayout from "../../components/layouts/pageLayout";
import HeroImage from "../../components/pageComponents/heroImage/heroImage";
import Footer from "../../components/pageComponents/footer/footer";
import Flickity from "react-flickity-component";
import { Container, Row, Col, Button } from "react-bootstrap";
import DetailCard from "../../components/pageComponents/cards/detailCard";
import Testimonial from "../../components/pageComponents/testimonial/testimonial";
import Search from "../../components/search/search";
import {
  flickityCellHeight100Per,
  reloadPageWithUrl,
} from "../../utils/helper";
import { HiOutlineChatAlt2 } from "react-icons/hi";
import { RiGroup2Line, RiUserStarFill, RiUserStarLine } from "react-icons/ri";
import Advantages from "../../components/pageComponents/advantages";
import { FaAward } from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";
import { urls } from "../../shared/urls";

const advantageList = [
  {
    key: "1",
    icon: <RiGroup2Line size="2rem" />,
    title: "Like-minded travellers",
  },
  {
    key: "2",
    icon: <RiUserStarFill size="2rem" />,
    title: "Unique travel experiences",
  },
  {
    key: "3",
    icon: <GiReceiveMoney size="2rem" />,
    title: "Save time and money",
  },
  {
    key: "4",
    icon: <FaAward size="2rem" />,
    title: "Best price guarantee",
  },
  {
    key: "5",
    icon: <RiUserStarLine size="2rem" />,
    title: "Guest reviews & ratings",
  },
  {
    key: "6",
    icon: <HiOutlineChatAlt2 size="2rem" />,
    title: "24x7 live chat support",
  },
];

const testimonails = [
  {
    key: "1",
    name: "Anonymous",
    description:
      "2HUB is a young enterprise with a team of young professionals working round the clock. Especially Ami & Sameer have always found ways to get the best deals possible for us to clinch the biz. Their expertise and contacts make us speak confidently with our clients that we can get the best price for them. And, most importantly we can be at peace that our bookings are in safe hands. A Big Thank You to the entire team and best wishes for the future. 2HUB Rocks!",
  },
  {
    key: "2",
    name: "Shreya Ahuja",
    place: "Explore India - Mumbai",
    description:
      "Dear Ami, Sameer & team - Thank you so much for the excellent service that you have provided to our clients over the last few years we have been dealing with your company. It was only possible because of your professional attitude and prompt services at all times. Please keep up the good work and all the best to you and the team.",
  },
  {
    key: "3",
    name: "Rohan Shah",
    place: "Ethnic Hospitality - Mumbai",
    description:
      "Special mention for Ami Parekh and her team who have been relentlessly helping us by giving the best possible services they can at any point of the day to help keep our business and relationship stronger. Her support has helped in growing our business relationship with 2HUB and we are very grateful to her and 2HUB team. Keep the same energy for the upcoming season to help us better.",
  },
];

const trendings = [
  {
    key: "1",
    src: "images/hard_rock.jpg",
    title: "Hard Rock Maldives",
    rating: "5",
    location: "4 Days",
    href: `${urls.travelPackages_trips}/hard-rock-maldives-4-days?searchValue=Hard%20Rock%20Maldives%20-%204%20Days&searchKey=trip`,
  },
  {
    key: "2",
    src: "images/tt_2.jpg",
    title: "Bara Bungalow",
    rating: "4",
    location: "3 Days",
    href: `${urls.travelPackages_trips}/bara-bungalow-3-days?searchValue=Bara%20Bungalow%20-%203%20Days&searchKey=trip`,
  },
  {
    key: "3",
    src: "images/tt_4.jpg",
    title: "Maldives Dhoni Explorer",
    rating: "4.5",
    location: "7 Days",
    href: `${urls.travelPackages_trips}/maldives-dhoni-cruise-1744?searchValue=Maldives%20Dhoni%20Cruise&searchKey=trip`,
  },
  {
    key: "4",
    src: "images/tt_5.jpg",
    title: "Area 83",
    rating: "4.5",
    location: "3 Days",
    href: `${urls.travelPackages_trips}/area-83-3-days?searchValue=Area%2083%20-%203%20Days&searchKey=trip`,
  },

  {
    key: "5",
    src: "images/tt_6.jpg",
    title: "Dubai Break",
    rating: "4",
    location: "5 Days",
    href: `${urls.travelPackages_trips}/dubai-break-5-days?searchValue=Dubai%20Break%20-%205%20Days&searchKey=trip`,
  },
];

const categories = [
  {
    key: "1",
    src: "/images/cat3.jpg",
    title: "Adventure",
  },
  {
    key: "2",
    src: "/images/cat7.jpg",
    title: "Special Interest",
  },
  {
    key: "4",
    src: "/images/cat5.jpg",
    title: "Wildlife",
  },
  {
    key: "5",
    src: "/images/cat6.jpg",
    title: "Cultural",
  },
  {
    key: "5",
    src: "/images/cat2.jpg",
    title: "Marine",
  },
];

const recommendedTrips = [
  {
    key: "1",
    src: "images/rt_1.jpg",
    title: "Maldives",
    rating: "",
    location: "",
    href: `${urls.travelPackages_trips}?searchValue=Maldives&searchKey=destination`,
  },
  {
    key: "2",
    src: "images/india.jpg",
    title: "India",
    rating: "",
    location: "",
    href: `${urls.travelPackages_trips}?searchValue=India&searchKey=destination`,
  },
  {
    key: "3",
    src: "images/dubai.jpg",
    title: "Dubai",
    rating: "",
    location: "",
    href: `${urls.travelPackages_trips}?searchValue=Dubai&searchKey=destination`,
  },
  {
    key: "4",
    src: "images/nepal.jpg",
    title: "Nepal",
    rating: "",
    location: "",
    href: `${urls.travelPackages_trips}?searchValue=Nepal&searchKey=destination`,
  },
];

const flickityOptions = {
  cellAlign: "left",
  wrapAround: true,
  initialIndex: 1,
  friction: 0.2,
};

const Travels = () => {
  return (
    <>
      <PageLayout title="2hub | Home">
        <HeroImage src="/images/maldives.jpg" />

        <section
          className="px-lg-5 pb-3 pb-lg-6 bg-primary-lightest"
          id="search"
        >
          <Container fluid className="m-n6">
            <Row>
              <Col xs={12} lg={11} className="mx-auto">
                <Search
                  onTravelPackageSearch={({
                    searchValue,
                    searchKey,
                    month,
                    year,
                    slug,
                  }) => {
                    const query =
                      month && year ? `&month=${month}&year=${year}` : "";

                    if (searchKey === "trip") {
                      reloadPageWithUrl(
                        `${
                          urls.travelPackages_trips
                        }/${slug}?searchValue=${encodeURIComponent(
                          searchValue
                        )}&searchKey=${searchKey}${query}`
                      );
                    } else {
                      reloadPageWithUrl(
                        `${
                          urls.travelPackages_trips
                        }?searchValue=${encodeURIComponent(
                          searchValue
                        )}&searchKey=${searchKey}${query}`
                      );
                    }
                  }}
                />
              </Col>
            </Row>
          </Container>
        </section>

        <section className="bg-primary-lightest pb-3 mb-5 mb-lg-7">
          <Container className="pt-3">
            <Row>
              <Advantages advantages={advantageList} />
            </Row>
          </Container>
        </section>

        <section className="mb-5 mb-lg-7">
          <Container className="py-4">
            <Row className="mb-4">
              <Col xs={12} md={9}>
                <h3 className="font-weight-bold">
                  Top-rated travel experiences, handpicked by experts
                </h3>
                <p>
                  Island-hopping in Greece. Exciting African safaris. Visiting
                  Santa Claus himself. Find and book unforgettable travel
                  experiences at the best rates for destinations all around the
                  world.
                </p>
              </Col>
            </Row>
            <Row>
              <Flickity
                flickityRef={flickityCellHeight100Per}
                className={"trendingCarousel w-100"}
                options={flickityOptions}
              >
                {trendings.map((trending) => (
                  <Col xs={8} md={5} lg={3} className="px-2" key={trending.key}>
                    <DetailCard
                      title={trending.title}
                      src={trending.src}
                      rating={trending.rating}
                      location={trending.location}
                      href={trending.href}
                      target="_blank"
                      className="standard-card-height"
                    />
                  </Col>
                ))}
              </Flickity>
            </Row>
          </Container>
        </section>

        <section className="mb-5 mb-lg-7">
          <Container className="py-4">
            <Row className="mb-4">
              <Col xs={12} md={9}>
                <h3 className="font-weight-bold">
                  Tours for every travel style
                </h3>
                <p>
                  Browse and book tours for all travel styles. No matter what
                  kind of trip you’re looking for, you’ll find it here.
                </p>
              </Col>
            </Row>
            <Row>
              <Flickity
                flickityRef={flickityCellHeight100Per}
                className={"testimonialCarousel w-100"}
                options={flickityOptions}
              >
                {categories.map((category) => (
                  <Col xs={8} md={4} lg={3} className="px-2" key={category.key}>
                    <DetailCard
                      title={category.title}
                      src={category.src}
                      rating={category.rating}
                      location={category.location}
                      className="standard-card-height-md"
                      onClick={() =>
                        reloadPageWithUrl(
                          `${urls.travelPackages_trips}?categories=${category.title}&searchKey=trips`
                        )
                      }
                    />
                  </Col>
                ))}
              </Flickity>
            </Row>
          </Container>
        </section>

        <section className="mb-5 mb-lg-7">
          <Container className="py-4">
            <Row className="mb-4">
              <Col xs={12} md={9}>
                <h3 className="font-weight-bold">Our travellers love us</h3>
              </Col>
            </Row>
            <Row>
              <Flickity
                flickityRef={flickityCellHeight100Per}
                className={"testimonialCarousel w-100"}
                options={flickityOptions}
              >
                {testimonails.map((testimonial) => (
                  <Col
                    xs={12}
                    md={5}
                    lg={5}
                    key={testimonial.key}
                    className="pb-3"
                  >
                    <Testimonial
                      src={testimonial.src}
                      name={testimonial.name}
                      place={testimonial.place}
                      description={testimonial.description}
                      href={testimonial.href}
                    />
                  </Col>
                ))}
              </Flickity>
            </Row>
          </Container>
        </section>

        <section className="mb-5 mb-lg-7">
          <Container className="py-4">
            <Row className="mb-4">
              <Col xs={12} md={9}>
                <h3 className="font-weight-bold">Recommended destinations</h3>
                <p>
                  Find the best deals for tour packages worldwide. Browse 100K
                  global sightseeing options available in 70+ countries.
                </p>
              </Col>
            </Row>
            <Row>
              <div className="d-flex flex-row flex-nowrap is-x-scrollable w-100 pb-3 px-2">
                {recommendedTrips.map((recommendedTrip) => (
                  <Col
                    xs={8}
                    md={5}
                    lg={3}
                    className="px-2"
                    key={recommendedTrip.key}
                  >
                    <DetailCard
                      title={recommendedTrip.title}
                      src={recommendedTrip.src}
                      rating={recommendedTrip.rating}
                      href={recommendedTrip.href}
                      location={recommendedTrip.location}
                      className="standard-card-height"
                      target="_blank"
                    />
                  </Col>
                ))}
              </div>
            </Row>
          </Container>
        </section>

        <section className="mb-5 mb-lg-7">
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
        </section>

        <Footer id="footer" />
      </PageLayout>
    </>
  );
};

export default Travels;
