import { useState, useMemo, useEffect } from "react";
import {
  Accordion,
  Card,
  Col,
  Container,
  Image,
  ListGroup,
  Nav,
  Breadcrumb,
  Row,
} from "react-bootstrap";

import Flickity from "react-flickity-component";
import { BsInfoCircle } from "react-icons/bs";
import { FiCheckCircle } from "react-icons/fi";
import { RiCloseCircleLine } from "react-icons/ri";
import ModalComponent from "../../../../components/elements/modal";
import PageLayout from "../../../../components/layouts/pageLayout";
import AccordionHeader from "../../../../components/pageComponents/accordionHeader/accordionHeader";
import Footer from "../../../../components/pageComponents/footer/footer";
import { urls } from "../../../../shared/urls";
import {
  fetchBlobWithAuth,
  fetchgetServerSidePropsWithAuth,
} from "../../../../utils/apiHelper";
import {
  liToArray,
  API_URL,
  flickityCellHeight100Per,
  getCurrency,
} from "../../../../utils/helper";
import withAuth from "../../../../utils/withAuth";
import moment from "moment";
import { Img } from "react-image";
import Testimonial from "../../../../components/pageComponents/testimonial/testimonial";
import TripEnquireForm from "../../../../components/pageComponents/travelPackage/tripEnquireForm";
import Button from "../../../../components/elements/Button";
import { supportNumberFormated } from "../../../../shared/contacts";

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

const flickityOptions = {
  contain: "true",
  cellAlign: "left",
};

const getDepartureMonths = (departures) => {
  return departures
    .map((departure) =>
      moment(departure.travel_packages_departure_start_date).format("MMM YYYY")
    )
    .filter((v, i, a) => a.indexOf(v) === i);
};

const Departures = ({ trips, enquiry }) => {
  const sortedDepartures = useMemo(
    () =>
      trips.departures.sort(
        (a, b) =>
          moment(a.travel_packages_departure_start_date).format("YYYYMMDD") -
          moment(b.travel_packages_departure_start_date).format("YYYYMMDD")
      ),
    []
  );
  const departureMonths = useMemo(
    () => getDepartureMonths(trips.departures),
    []
  );

  const [departures, setDepartures] = useState(sortedDepartures);
  const [showMore, setShowMore] = useState(false);

  const filterDepartures = (filterOption) => {
    if (!filterOption) {
      setDepartures(sortedDepartures);
      return;
    }

    const originalDepartures = trips.departures;
    const filteredDepartures = originalDepartures.filter(
      (departure) =>
        moment(departure.travel_packages_departure_start_date).format(
          "MMM YYYY"
        ) === moment(filterOption).format("MMM YYYY")
    );
    setDepartures(filteredDepartures);
  };

  return (
    <Container className="product-departures">
      <Row className="mb-4">
        <Col xs={12}>
          <h4 className="font-weight-bold">Dates and prices</h4>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col xs={12}>
          <Nav
            variant="pills"
            defaultActiveKey="upcoming"
            className="highlight-pill d-flex flex-row  is-x-scrollable"
          >
            <Nav.Item>
              <Nav.Link
                className="small text-jetblack mr-2 mb-2 text-center"
                eventKey="upcoming"
                onClick={() => filterDepartures("")}
              >
                Upcoming trips
              </Nav.Link>
            </Nav.Item>
            {departureMonths.map((month) => (
              <Nav.Item key={month}>
                <Nav.Link
                  className="small mr-2 mb-2 text-jetblack text-center"
                  eventKey={month}
                  onClick={() => filterDepartures(month)}
                >
                  {month}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </Col>
      </Row>

      {departures.slice(0, !showMore ? 5 : undefined).map((departure, i) => (
        <Row className="mb-4 px-3" key={i}>
          <Col xs={6} md={3} lg={2} className="p-0">
            <Card className="d-flex h-100 p-3 p-md-3 rounded-0 justify-content-center align-items-center align-items-md-start bg-light border-0">
              <p className="text-xs mb-0 text-uppercase text-muted">
                Start date
              </p>
              <h6 className="mb-0 small">
                {moment(departure.travel_packages_departure_start_date).format(
                  "MMM Do YYYY"
                )}
              </h6>
            </Card>
          </Col>
          <Col xs={6} md={3} lg={2} className="p-0">
            <Card className="d-flex h-100 p-3 p-md-3 rounded-0 justify-content-center align-items-center align-items-md-start bg-light border-0">
              <p className="text-xs mb-0 text-uppercase text-muted">End date</p>
              <h6 className="mb-0 small">
                {moment(departure.travel_packages_departure_end_date).format(
                  "MMM Do YYYY"
                )}
              </h6>
            </Card>
          </Col>
          <Col xs={6} md={3} lg={2} className="p-0">
            <Card
              className="d-flex h-100 p-3 p-md-3 rounded-0 justify-content-center align-items-center align-items-md-start border-0"
              style={{ backgroundColor: "#e2eff5" }}
            >
              <p className="small mb-0">
                {departure.travel_packages_departure_availability}+ Spots left
              </p>
              <p className="small mb-0 text-muted">
                {trips.duration} Days / {trips.duration - 1} Nights
              </p>
            </Card>
          </Col>
          <Col xs={6} md={3} lg={2} className="p-0">
            <Card
              className="d-flex h-100 p-3 p-md-3 rounded-0 justify-content-center align-items-center align-items-md-start border-0"
              style={{ backgroundColor: " #e2eff5" }}
            >
              {departure.travel_packages_departure_offer_inr_price > 0 ? (
                <p className="mb-0 small">
                  <s>
                    {getCurrency(
                      departure.travel_packages_departure_actual_inr_price
                    )}
                  </s>
                </p>
              ) : null}
              <p className="text-success mb-0" style={{ lineHeight: "1em" }}>
                <strong>
                  {getCurrency(
                    departure.travel_packages_departure_actual_inr_price -
                      departure.travel_packages_departure_offer_inr_price
                  )}
                  <span className="text-xs text-muted"> </span>
                </strong>
              </p>
            </Card>
          </Col>
          <Col xs={6} md={6} lg={2} className="p-0">
            <Card
              className="d-flex h-100 p-3 p-md-3  rounded-0 justify-content-center align-items-center align-items-md-start border-0"
              style={{ backgroundColor: "#e2eff5" }}
            >
              <a
                href={`${urls.travelPackages_trips}/${trips.name_slug}/customise-trip/number-of-days/`}
                target="_blank"
                rel="noreferrer"
                role="button"
                className="btn btn-outline-info btn-sm btn-block p-2 bg-white text-jetblack"
              >
                <small className="font-weight-bold mb-0 text-md">
                  Customise this tour
                </small>
              </a>
            </Card>
          </Col>
          <Col xs={6} md={6} lg={2} className="p-0">
            <Card
              className="d-flex h-100 p-3 p-md-3 rounded-0 justify-content-center align-items-center align-items-md-start border-0"
              style={{ backgroundColor: "#e2eff5" }}
            >
              <Button
                variant="primary"
                size="sm"
                block
                className="font-weight-bold p-2"
                onClick={() => enquiry(departure.travel_packages_departure_id)}
              >
                Enquire
              </Button>
            </Card>
          </Col>
        </Row>
      ))}
      {departures.length > 5 && (
        <Row className="text-center">
          <Container>
            <Button
              variant="outline-secondary"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? "Show less departures" : "Show more departures"}
            </Button>
          </Container>
        </Row>
      )}
    </Container>
  );
};

const TripCode = ({ error, trips }) => {
  const [expandAll, setExpandAll] = useState("default");
  const [enquireDetails, setEnquireDetails] = useState({
    showEnquire: false,
    departureId: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [downloadErrorMessage, setDownloadErrorMessage] = useState("");

  const downloadBookingFile = async (id) => {
    try {
      setIsLoading(true);
      const file = await fetchBlobWithAuth(
        `${API_URL}/api/travelPackages/downloadBrochure/${id}`,
        "GET"
      );

      const url = window.URL.createObjectURL(
        new Blob([file], { type: "application/pdf" })
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("target", "_blank");

      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      setDownloadErrorMessage(`Something went wrong! Please try again later.`);
      console.error(`Something went wrong! Error: ${JSON.stringify(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) return <div>{error}</div>;

  return (
    <>
      <PageLayout title="2hub | Travel Packages">
        <section className="pt-lg-4">
          <Container>
            <Breadcrumb className="bg-transparent">
              <Breadcrumb.Item href="/" className="small">
                Home
              </Breadcrumb.Item>
              <Breadcrumb.Item active className="small">
                {trips.destination}
              </Breadcrumb.Item>
            </Breadcrumb>
          </Container>
        </section>

        <section className="mb-5 mb-lg-7">
          <Container>
            <Row className="no-gutters align-items-center">
              <Col xs={12} lg={7}>
                <Img
                  src={[
                    trips.hero_section_images.length > 0 &&
                      trips.hero_section_images[0]
                        .travel_packages_hero_images_url,
                    "/images/basic.png",
                  ]}
                  className="w-100 rounded-10 productHeroImage mb-3 mb-md-0"
                />
              </Col>
              <Col xs={12} lg={5} className="px-lg-4">
                <div>
                  <p className="text-primary font-weight-bold mt-4 mt-lg-0">
                    {trips.style.travel_packages_style_type}
                  </p>
                  <h2 className="mb-2">{trips.name}</h2>
                  <ListGroup variant="flush" className="mb-4">
                    {trips.type?.travel_packages_type ===
                    "Fixed Departure Group Tour" ? (
                      <>
                        <ListGroup.Item className="pl-0 text-secondary d-flex flex-row border-0">
                          <div className="mr-5">
                            <p className="text-md mb-1">Duration </p>
                            <h6 className="font-weight-bold text-jetblack">
                              {trips.duration} Days
                            </h6>
                          </div>

                          <div className="mr-5">
                            <p className="text-md mb-1">Age range </p>
                            <h6 className="font-weight-bold text-jetblack">
                              15 to 60
                            </h6>
                          </div>
                        </ListGroup.Item>
                        <ListGroup.Item className="pl-0 text-secondary d-flex flex-row border-0">
                          <div>
                            <p className="text-md mb-1">{`Starting From`}</p>
                            <div className="d-flex flex-wrap align-items-baseline">
                              <h3 className="mb-0 text-jetblack">
                                {getCurrency(trips.start_price)}
                              </h3>
                              <span className="text-md text-muted font-weight-normal">{`/person`}</span>
                            </div>
                            <div className="text-md">on Twin sharing </div>
                          </div>
                        </ListGroup.Item>
                      </>
                    ) : null}
                    <ListGroup.Item className="d-flex align-items-center pl-0 text-secondary">
                      <span className="text-md mr-1">
                        Terms and condition applied
                      </span>
                      <BsInfoCircle className="text-primary" />
                    </ListGroup.Item>
                  </ListGroup>
                </div>
                <Row>
                  <Col xs={12} md={7}>
                    {trips.type?.travel_packages_type ===
                    "Fixed Departure Group Tour" ? (
                      <Button
                        block
                        onClick={() => {
                          setEnquireDetails({
                            showEnquire: true,
                            departureId:
                              trips.departures[0].travel_packages_departure_id,
                          });
                        }}
                      >
                        Enquire
                      </Button>
                    ) : (
                      <a
                        href={`${urls.travelPackages_trips}/${trips.name_slug}/customise-trip/number-of-days/`}
                        target="_blank"
                        rel="noreferrer"
                        role="button"
                        className="btn btn-primary  btn-block"
                      >
                        <small className="font-weight-bold mb-0 text-md">
                          Customise this tour
                        </small>
                      </a>
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </section>

        <section className="mb-5 mb-lg-7">
          <Container>
            <Row>
              <Col xs={12}>
                <p className="text-md font-weight-bold">{trips.seo_name}</p>
                <div
                  className="text-secondary"
                  dangerouslySetInnerHTML={{
                    __html: trips.hero_section_description,
                  }}
                />
                <div
                  className="text-secondary"
                  dangerouslySetInnerHTML={{
                    __html: trips.hero_section_summary,
                  }}
                />
              </Col>
            </Row>
          </Container>
        </section>

        {trips.highlights.length > 0 ? (
          <section className="mb-5 mb-lg-7">
            <Container>
              <Row className="mb-4">
                <Col xs={12}>
                  <h4 className="">Trip highlights</h4>
                </Col>
              </Row>
              <Row>
                <div className="d-flex flex-row flex-nowrap is-x-scrollable w-100 pb-3 px-2">
                  {trips.highlights.map((highlight, i) => (
                    <Col xs={11} md={5} key={i}>
                      <Card className="rounded-10 border-0 overflow-hidden d-flex h-100">
                        <Img
                          src={[
                            `https://djq098wr042w0.cloudfront.net/media/${highlight.travel_packages_highlight_picture}`,
                            "/images/demo-img2.jpg",
                          ]}
                          className="h-30vh rounded-10 mb-3"
                        />

                        <h6 className="text-blue small text-uppercase font-weight-bold">
                          {`HIGHLIGHT # ${i + 1}`}
                        </h6>

                        <h5
                          className=""
                          dangerouslySetInnerHTML={{
                            __html: highlight.travel_packages_highlight_title,
                          }}
                        />

                        <p
                          className="text-md text-secondary"
                          dangerouslySetInnerHTML={{
                            __html:
                              highlight.travel_packages_highlight_description,
                          }}
                        />
                      </Card>
                    </Col>
                  ))}
                </div>
              </Row>
            </Container>
          </section>
        ) : null}

        <section className="mb-5 mb-lg-7 pb-lg-4">
          <Container>
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
                    md={8}
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
          <Container>
            <Row className="align-items-start">
              <Col xs={12} lg={7}>
                <div className="d-flex w-100 mb-4" id="itinerary">
                  <div className="w-50">
                    <h4 className="font-weight-bold mb-3">Itinerary</h4>
                  </div>
                  <div className="w-50 text-right">
                    <Button
                      variant="outline-info"
                      onClick={() => downloadBookingFile(trips.product_id)}
                      size="sm"
                      // isLoading={isLoading}
                    >
                      Download Brochure
                    </Button>
                  </div>
                </div>
                <div className="text-right mb-2">
                  <Button
                    variant="link"
                    onClick={() =>
                      setExpandAll(
                        expandAll === "expandAll" ? "collapseAll" : "expandAll"
                      )
                    }
                  >
                    {expandAll === "expandAll" ? "Collapse All" : "Expand all"}
                  </Button>
                </div>
                <div className="itinerary-container mb-4">
                  {trips.itinerary.map((itinerary, i) => (
                    <Accordion
                      defaultActiveKey={
                        expandAll === "default" && i === 0 ? "0" : ""
                      }
                      key={i}
                      activeKey={expandAll === "expandAll" ? "0" : undefined}
                    >
                      <Card className="border-0">
                        <Card.Header className="bg-transparent mb-0 text-secondary">
                          <AccordionHeader eventKey="0">{`Day ${
                            i + 1
                          }`}</AccordionHeader>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                          <Card.Body>
                            <div
                              className="mb-3 font-weight-bold"
                              dangerouslySetInnerHTML={{
                                __html:
                                  itinerary.travel_packages_day_short_description,
                              }}
                            ></div>
                            <div
                              className="text-md text-secondary"
                              dangerouslySetInnerHTML={{
                                __html:
                                  itinerary.travel_packages_day_description,
                              }}
                            ></div>
                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                    </Accordion>
                  ))}
                </div>
                <div className="incllusion-container mb-4">
                  <div className="d-flex w-100 mb-4" id="itinerary">
                    <div className="w-50">
                      <h4 className="font-weight-bold mb-3">Inclusion</h4>
                    </div>
                    <div className="w-50 text-right">
                      <Button
                        variant="outline-info"
                        size="sm"
                        onClick={() => downloadBookingFile(trips.product_id)}
                        // isLoading={isLoading}
                      >
                        Download Brochure
                      </Button>
                    </div>
                  </div>
                  {liToArray(
                    trips.inclusions.travel_packages_inclusions_details
                  ).map((travelDetail, i) => (
                    <div
                      className="d-flex align-items-center mb-3 px-3"
                      key={i}
                    >
                      <div className="d-flex align-items-center justify-content-center">
                        <FiCheckCircle className="text-success" />
                      </div>
                      <p
                        className="mb-0 pl-3 text-md text-secondary"
                        dangerouslySetInnerHTML={{
                          __html: travelDetail,
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className="exclusion-container mb-4">
                  <div className="d-flex w-100 mb-4" id="itinerary">
                    <div className="w-50">
                      <h4 className="font-weight-bold mb-3">Not Included</h4>
                    </div>
                    <div className="w-50 text-right">
                      <Button
                        variant="outline-info"
                        size="sm"
                        onClick={() => downloadBookingFile(trips.product_id)}
                        // isLoading={isLoading}
                      >
                        Download Brochure
                      </Button>
                    </div>
                  </div>
                  {liToArray(
                    trips.exclusions.travel_packages_exclusions_details
                  ).map((travelDetail, i) => (
                    <div
                      className="d-flex align-items-center mb-3 px-3"
                      key={i}
                    >
                      <div className="d-flex align-items-center justify-content-center">
                        <RiCloseCircleLine className="text-primary" />
                      </div>
                      <p
                        className="mb-0 pl-3 text-md text-secondary"
                        dangerouslySetInnerHTML={{
                          __html: travelDetail,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </Col>
              <Col
                xs={12}
                lg={5}
                className="sticky-card"
                style={{ top: "6rem" }}
              >
                <Card className="text-center border-0 mb-3 rounded-10 bg-shade1">
                  <Card.Body>
                    <p className="font-weight-bold">
                      Want to speak to a travel expert?
                    </p>
                    <ul className="list-unstyled d-flex flex-row flex-nowrap justify-content-center mr-3 mb-4">
                      <li className="mr-n3">
                        <Image
                          className="rounded-circle shadow-lg"
                          width="80"
                          height="78"
                          src="/images/Parvesh.jpeg"
                          style={{ objectFit: "cover" }}
                        />
                      </li>
                      <li className="mr-n3">
                        <Image
                          className="rounded-circle shadow-lg"
                          width="80"
                          height="78"
                          src="/images/Aman.jpeg"
                          style={{ objectFit: "cover" }}
                        />
                      </li>
                      <li className="mr-n3">
                        <Image
                          className="rounded-circle shadow-lg"
                          width="80"
                          height="78"
                          src="/images/Vidya.jpeg"
                          style={{ objectFit: "cover" }}
                        />
                      </li>
                      <li className="mr-n3">
                        <Image
                          className="rounded-circle shadow-lg"
                          width="80"
                          height="78"
                          src="/images/Jithin.jpeg"
                          style={{ objectFit: "cover" }}
                        />
                      </li>
                    </ul>
                    <p className="font-weight-bold text-primary">
                      Call us now {supportNumberFormated}
                    </p>
                    <p className="small">
                      Let our team of experts help you pick the best option for
                      you!
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>

        <section className="mb-5 mb-lg-7">
          {trips.type?.travel_packages_type === "Fixed Departure Group Tour" ? (
            <Departures
              trips={trips}
              enquiry={(departureId) =>
                setEnquireDetails({
                  showEnquire: true,
                  departureId: departureId,
                })
              }
            />
          ) : (
            <Container className="py-4">
              <Row>
                <Col xs={12} className="text-center mb-3">
                  <h3 className="font-weight-bold">Customise this tour!</h3>
                </Col>
                <Col xs={11} md={8} className="mx-auto text-center">
                  <p>
                    Based on your personal preferences, budget, and interests,
                    we’ll plan every detail of your trip just the way you want.
                    Just click on the button below to get started!
                  </p>
                  <a
                    href={`${urls.travelPackages_trips}/${trips.name_slug}/customise-trip/number-of-days/`}
                    target="_blank"
                    rel="noreferrer"
                    role="button"
                    className="btn btn-primary"
                  >
                    <small className="font-weight-bold mb-0 text-md">
                      Customise this tour
                    </small>
                  </a>
                </Col>
              </Row>
            </Container>
          )}
        </section>

        <Footer />
      </PageLayout>

      <ModalComponent
        show={enquireDetails.showEnquire}
        onHide={() =>
          setEnquireDetails({
            showEnquire: false,
            departureId: "",
          })
        }
        scrollable={true}
        body={
          <TripEnquireForm
            productId={trips.product_id}
            departureId={enquireDetails.departureId}
          />
        }
      />
    </>
  );
};

export const getServerSideProps = async (context) => {
  const { searchValue, searchKey, month, year, tripCode } = context.query;

  const query = month && year ? `&month=${month}&year=${year}` : "";
  const url = `${API_URL}/api/travelPackages/search?searchValue=${searchValue}&searchKey=trip${query}`;

  try {
    const data = await fetchgetServerSidePropsWithAuth(
      url,
      "GET",
      null,
      null,
      null,
      context
    );

    if (data.error || data.Error) {
      return {
        props: {
          searchValue: searchValue || null,
          searchKey: searchKey || null,
          month: month || null,
          year: year || null,
          tripCode: tripCode || null,
          error: "Something went wrong",
        },
      };
    }

    return {
      props: {
        searchValue: searchValue || null,
        searchKey: searchKey || null,
        month: month || null,
        year: year || null,
        tripCode: tripCode || null,
        trips: data.trips,
      },
    };
  } catch (err) {
    console.error(JSON.stringify(err));
    return {
      props: {
        searchValue: searchValue || null,
        searchKey: searchKey || null,
        month: month || null,
        year: year || null,
        tripCode: tripCode || null,
        error: JSON.stringify(err),
      },
    };
  }
};

export default withAuth(TripCode);
