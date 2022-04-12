import { useState, useEffect, useCallback } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import ReadMore from "../readMore";
import moment from "moment";
import { urls } from "../../../shared/urls";
import { API_URL, getCurrency } from "../../../utils/helper";
import { fetchBlobWithAuth } from "../../../utils/apiHelper";

const PackageCards = ({ packages, searchQuery }) => {
  const [offset, setOffset] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMore, setViewMore] = useState(false);
  const [sliced, setSliced] = useState([]);
  const [pageChanged, setPageChanged] = useState(false);
  let packageSliced = packages.slice(0, 10);

  let pageNumbers = [];
  let paginationPage = "";
  for (let i = 1; i <= Math.ceil(packages.length / 10); i++) {
    pageNumbers.push(i);
  }
  let startPage, endPage;
  if (pageNumbers.length <= 10) {
    startPage = 1;
    endPage = pageNumbers.length;
    pageNumbers.slice(startPage - 1, endPage);
    paginationPage = pageNumbers.slice(startPage - 1, endPage);
  } else {
    if (currentPage <= 6) {
      startPage = 1;
      endPage = 10;
      paginationPage = pageNumbers.slice(startPage - 1, endPage);
    } else if (currentPage + 4 >= pageNumbers.length) {
      startPage = pageNumbers.length - 9;
      endPage = pageNumbers.length;
      paginationPage = pageNumbers.slice(startPage - 1, endPage);
    } else {
      startPage = currentPage - 5;
      endPage = currentPage + 4;
      paginationPage = pageNumbers.slice(startPage, endPage);
    }
  }

  const changePage = useCallback((pageNumber) => {
    if (pageNumber !== currentPage) {
      setCurrentPage(pageNumber);
      setOffset(pageNumber * 10);
      packageSliced = packages.slice(offset, offset + 10);
      setSliced(packages.slice(offset, offset + 10));
    }
  });

  const renderPageNumbers = paginationPage.map((number, i) => {
    let classes = currentPage === number ? "active" : "";
    return (
      <li
        className={`page-item ${classes}`}
        aria-current="page"
        key={i}
        onClick={() => {
          setPageChanged(true);
          changePage(number)
        }}
      >
        <span className="page-link bg-beige">{number}</span>
      </li>
    );
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

  let packageArray = [];
  if(sliced.length !== 0) {
    packageArray = sliced;
  }
  else {
    packageArray = packageSliced;
  }

  return (
    <>
      {packages.length !== 0  ? (
        packageArray.map((item, i) => {
          const query =
            searchQuery.month && searchQuery.year
              ? `&month=${searchQuery.month}&year=${searchQuery.year}`
              : "";
          return (
            <Col md={12} className="mb-4" key={i}>
              <Card className="border-0 custom-shadow">
                <Row className="no-gutters">
                  <Col md={4}>
                    <a
                      href={`${urls.travelPackages_trips}/${
                        item.name_slug
                      }?searchValue=${encodeURIComponent(
                        item.name
                      )}&searchKey=trip${query}`}
                      rel="noreferrer"
                      target="_blank"
                      className="text-dark text-decoration-none d-flex h-100"
                    >
                      <picture>
                        <img
                          data-src={
                            item.hero_section_images.length !== 0
                              ? item.hero_section_images[0]
                                  .travel_packages_hero_images_url
                              : "/images/basic.png"
                          }
                        
                          alt=""
                          className="w-100 h-100 rounded-left"
                          style={{ objectFit: "cover" }}
                          src={
                            item.hero_section_images.length !== 0
                              ? item.hero_section_images[0]
                                  .travel_packages_hero_images_url
                              : "/images/basic.png"
                          }
                        />
                      </picture>
                      {item.type.travel_packages_type == "Customizable Tour" ? (
                        <div className="card-img-overlay">
                          <p className="badge badge-success badge badge-warning small mb-0 p-2">
                            Customizable
                          </p>
                        </div>
                      ) : null}
                    </a>
                  </Col>
                  <Col md={8}>
                    <Card.Body className="px-md-3 border-0">
                      <h1 className="text-xs mb-2 text-blue">
                        {item.seo_name}
                      </h1>
                      <h4 className="text-lg mb-0">
                        <a
                          href={`${urls.travelPackages_trips}/${
                            item.name_slug
                          }?searchValue=${encodeURIComponent(
                            item.name
                          )}&searchKey=trip${query}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-dark text-decoration-none"
                        >
                          {item.name}
                        </a>
                        <br />
                      </h4>
                      <Row className="mt-2">
                        <Col
                          md={6}
                          id="show-more-info-{{item.product_id}}"
                          className={
                            viewMore
                              ? ""
                              : "collapse dont-collapse-md show-more-info"
                          }
                        >
                          <dl className="row" style={{ lineHeight: 1.3 }}>
                            <dt className="col-5 pr-0">
                              <p className="text-xs text-muted mb-1">
                                Places Visited
                              </p>
                            </dt>
                            <dd className="col-7 mb-0">
                              <ReadMore cities={item.cities} />
                            </dd>

                            <dt className="col-5 pr-0">
                              <p className="text-xs text-muted mb-1">
                                Travel Style
                              </p>
                            </dt>
                            <dd className="col-7 mb-0">
                              <p className="text-xs text-muted mb-1">
                                {item.style.travel_packages_style_type}
                              </p>
                            </dd>
                            {item.type.travel_packages_type !==
                            "Customizable Tour" ? (
                              <>
                                <dt className="col-5 pr-0">
                                  <p className="text-xs text-muted mb-1">
                                    Departures
                                  </p>
                                </dt>
                                <dd className="col-7 mb-0">
                                  <p className="text-xs text-muted mb-1">
                                    {item.departures.length} Departures
                                  </p>
                                </dd>
                                <dt className="col-5 pr-0">
                                  <p className="text-xs text-muted mb-1">
                                    Next Departure
                                  </p>
                                </dt>
                                <dd className="col-7 mb-0">
                                  <p className="text-xs text-muted mb-1">
                                    {moment(item.next_available_date).format(
                                      "DD MMMM YYYY"
                                    )}
                                  </p>
                                </dd>
                              </>
                            ) : null}
                          </dl>
                        </Col>
                        <hr className="d-md-none" />
                        <div className="col-12 col-md-6 px-md-2">
                          <Row>
                            <div className="col-6 col-md-5">
                              <p className="mb-0 text-xs text-muted">
                                Duration
                              </p>
                              <p className="text-xs font-weight-bold">
                                {item.duration} days
                              </p>
                              <p className="mb-0 text-xs text-muted">
                                Tour Category
                              </p>
                              <p className="text-xs font-weight-bold">
                                {/* {item.category} */}
                              </p>
                            </div>
                            {item.type.travel_packages_type !==
                            "Customizable Tour" ? (
                              <div className="col-6 col-md-7">
                                <p className="mb-0 text-xs text-muted">
                                  Starting From
                                </p>
                                <p className="text-xs mb-0">
                                  <s>{getCurrency(item.start_price)}</s>
                                </p>
                                <h5 className="text-success mb-0">
                                  {" "}
                                  {getCurrency(item.offer_price)}
                                </h5>
                                <p className="text-xs text-muted">
                                  Save&nbsp;&nbsp;
                                  <span className="font-weight-bold text-dark">
                                  {getCurrency(item.save)}
                                  </span>
                                </p>
                              </div>
                            ) : null}
                          </Row>
                        </div>
                      </Row>

                      <Row>
                        <Col className="d-lg-flex justify-content-lg-end">
                          <Button
                            variant="outline-info"
                            size="sm"
                            className="px-md-4"
                            onClick={() => downloadBookingFile(item.product_id)}
                          >
                            Download Brochure
                          </Button>

                          <a
                            rel="noreferrer"
                            target="_blank"
                            className="btn btn-primary btn-sm text-decoration-none px-md-4 ml-3"
                            href={`${urls.travelPackages_trips}/${
                              item.name_slug
                            }?searchValue=${encodeURIComponent(
                              item.name
                            )}&searchKey=trip${query}`}
                          >
                            View Trip
                          </a>
                        </Col>
                      </Row>
                    </Card.Body>
                    <Card.Footer className="bg-white text-center d-md-none">
                      <div className="d-flex align-items-center justify-content-around">
                        <a
                          className="text-decoration-none more-info text-xs font-weight-bold"
                          onClick={() => setViewMore(!viewMore)}
                        >
                          {viewMore ? (
                            <span className="p-2">View Less</span>
                          ) : (
                            <span className="p-2">View More Info</span>
                          )}
                        </a>
                      </div>
                    </Card.Footer>
                  </Col>
                </Row>
              </Card>
            </Col>
          );
        })
      ) : (
        <h5>Sorry! We couldn't find the trip you were looking for</h5>
      )}
      <Col md={12}>
        <ul className="pagination d-flex justify-content-center">
          {currentPage > 1 ? (
            <li
              className="page-item"
              aria-current="page"
              onClick={() => {
                changePage(currentPage - 1);
              }}
            >
              <span className="page-link bg-beige">&laquo; </span>
            </li>
          ) : null}
          {renderPageNumbers}
          {packages.length > 1 && currentPage !== pageNumbers.length ? (
            <li
              className="page-item"
              aria-current="page"
              onClick={() => {
                changePage(currentPage + 1);
              }}
            >
              <span className="page-link bg-beige">&raquo; </span>
            </li>
          ) : null}
        </ul>
      </Col>
    </>
  );
};

PackageCards.Loading = () => {
  return (
    <Card
      className="border-0 custom-shadow mt-4 mb-4"
      style={{ height: "259px" }}
    >
      <Row className="no-gutters">
        <Col md={4}>
          <div className="w-100 rounded-left loading" />
        </Col>
        <Col md={8}>
          <Card.Body className="px-md-3 border-0">
            <Row className="mb-2">
              <Col md={7}>
                <h5
                  className="loading"
                  style={{ minHeight: "26px", width: "100%" }}
                ></h5>
              </Col>
              <Col></Col>
            </Row>
            <Row className="mb-4 d-none d-lg-flex">
              <Col md={8}>
                <div
                  className="loading mb-3"
                  style={{ minHeight: "35px", width: "100%" }}
                ></div>
                <div
                  className="loading"
                  style={{ minHeight: "38px", width: "100%" }}
                ></div>
              </Col>
              <Col md={4} className="text-md-right border-left">
                <h6
                  className="loading mb-3"
                  style={{ minHeight: "35px", width: "100%" }}
                ></h6>
                <p
                  className="loading"
                  style={{ minHeight: "20px", width: "100%" }}
                ></p>
                <p
                  className="loading"
                  style={{ minHeight: "15px", width: "100%" }}
                ></p>
              </Col>
            </Row>
            <Row className="d-none d-lg-flex">
              <Col className="d-lg-flex justify-content-lg-end">
                <Button
                  variant="light"
                  type="button"
                  className="btn-sm loading disabled"
                  style={{ minHeight: "31px", width: "125px" }}
                ></Button>
                <Button
                  variant="light"
                  type="button"
                  className="ml-4 btn-sm loading disabled"
                  style={{ minHeight: "31px", width: "125px" }}
                ></Button>
              </Col>
            </Row>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

export default PackageCards;
