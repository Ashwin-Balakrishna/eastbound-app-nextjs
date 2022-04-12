import Link from "next/link";
import { useWindowSize } from "../../../hooks/useWindowSize";
import { useRouter } from "next/router";
import React, { useState, useCallback, useEffect } from "react";
import { Badge, Button, Card, Col, Image, Row } from "react-bootstrap";
import { FiCheckCircle, FiStar, FiInfo } from "react-icons/fi";
import {GiHotMeal} from "react-icons/gi";
import { urls } from "../../../shared/urls";
import { Img } from "react-image";
import {AiOutlineStar} from "react-icons/ai"
import { IMAGE_URL } from "../../../utils/helper";
import moment from "moment";
import styles from "./hotelCards.module.scss";

const formatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumSignificantDigits: 3,
});


const HotelCards = ({ hotels, query_data }) => {
  const screenSize = useWindowSize();
  if(hotels.length == undefined) {
    hotels = [hotels]
  }
  const [sliced, setSliced] = useState([]);
  const [offset, setOffset] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  let imagePath = "";
  let hotelSliced = hotels.slice(0, 10);
  let pageNumbers = [];
  let paginationPage = "";
  for (let i = 1; i <= Math.ceil(hotels.length / 10); i++) {
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


const [isMobile, setIsMobile] = useState(false);

useEffect(() => setIsMobile(screenSize.width <= 991), [screenSize]);

  const changePage = useCallback((pageNumber) => {
    if (pageNumber !== currentPage) {
      setCurrentPage(pageNumber);
      setOffset(pageNumber * 10);
      hotelSliced = hotels.slice(offset, offset + 10);
      setSliced(hotels.slice(offset, offset + 10));
    }
  });
  const renderPageNumbers = paginationPage.map((number, i) => {
    let classes = currentPage === number ? "active" : "";
    return (
      <li
        className={`page-item ${classes}`}
        aria-current="page"
        key={i}
        onClick={() => changePage(number)}
      >
        <span className="page-link bg-beige">{number}</span>
      </li>
    );
  });

  let hotelArray = [];
  if(sliced.length !== 0) {
    hotelArray = sliced;
  }
  else {
    hotelArray = hotelSliced;
  }

  return (
    <div id="hotel-cards">
      {hotelArray.map((hotel) => {
        imagePath = hotel.images.filter(
          (image) =>
            image.code === "GEN" || image.code === "COM" || image.code === "HAB"
        );
        if (imagePath.length !== 0) {
          imagePath = imagePath[0].image_file;
        } else {
          imagePath = "";
        }
        return ( 
          <Col md={12} className="mb-4" key={hotel.hotel_id}>
            <Card className="border-0 custom-shadow">
              <Row className="no-gutters">
                <Col md={4}>
                  <a
                    href={`${urls.hotels}/${
                      hotel.code
                    }?search=${encodeURIComponent(JSON.stringify(query_data))}`}
                    rel="noreferrer"
                    target="_blank"
                    className="text-dark text-decoration-none d-flex h-100"
                  >
                    <picture>
                      <Img
                        alt=""
                        className="w-100 h-100  rounded-left"
                        src={[`${IMAGE_URL}${imagePath}`, "/images/basic.png"]}
                        style={{ objectFit: "cover", maxHeight: "260px" }}
                      />
                    </picture>
                    <div className="card-img-overlay">
                      <p className="badge badge-success badge badge-warning small mb-0 p-2">
                        {hotel.marketing_tag}
                      </p>
                    </div>
                  </a>
                </Col>
                <Col md={8}>
                  
                  <Card.Body className="pl-md-2 border-0">

                  <Row>
                    <Col md={7}>

                      <Row>
                        <Col md="auto">
                          <h5 className="text-lg mb-0" style={{fontWeight:"500",fontSize:"18px",color:"#1A1A1A"}}>{hotel.name} </h5>
                        </Col>
                        <Col >
                        
                          {/* <Badge className="border border-primary text-primary">
                            {hotel.categoryName?.replace("STARS", "")}{" "}
                            <FiStar style={{ verticalAlign: "bottom" }} />
                          </Badge> */}
                        </Col>
                      </Row>

                      <Row class="mt-2 px-1">
                          <Col md="auto" xs="auto" className="pt-0">
                            <span className="text-sm text-muted">City Name ⭐⭐⭐⭐⭐</span>
                          </Col>
                          <Col md="auto" xs="auto" className="m-0 p-0" >
                            <span style={{background:"#2AC084",color:"#FFF",padding:"2px 6px", borderRadius:"4px", fontSize:"12px",fontWeight:"600"}}>4 / 5</span>
                          </Col>
                      </Row>

                      <Row className="px-1 pt-2">
                        <Col md={1} xs={1}>
                          <GiHotMeal size="1.25rem" />
                        </Col>
                        <Col>
                          <span style={{fontSize:"12px"}}>Breakfast Included <span className="text-muted">optional</span></span>
                        </Col>
                      </Row>
                      
                      <Row >
                        <Col>
                          {/* <div className="pr-0 d-flex align-items-center">
                            <Image src="/images/svg/map.svg" />
                            <p className="small text-muted pt-3 ml-2">
                              {hotel.address}
                            </p>
                          </div> */}
                          <ul className="list-unstyled list-inline small text-muted">
                            {hotel.facilities.slice(0, 5).map((facility) => (
                              <li style={{background:"#EDF8FD",borderRadius:"4px", padding:"4px",color:"#1A1A1A"}}
                                className="list-inline-item m-1"
                                key={facility.facility_id}
                              >
                                {hotel.type==="hg"?facility:facility.description}
                              </li>

                            ))}
                            
                            {hotel.facilities.length>5?
                            <li className={`${styles.extrafacility} list-inline-item`}>
                              <span className=" px-1">
                                <Link
                                  href={`/hotels/${
                                    hotel.code
                                  }?search=${encodeURIComponent(
                                    JSON.stringify(query_data)
                                  )}`}
                                >
                                  <a style={{color:"#1A1A1A" }}>+{hotel.facilities.length - 5} more</a>
                                </Link>
                              </span>
                            </li>:""}
                          </ul>
                        </Col>
                        
                      </Row>
                      
                    </Col>

                  {/* Rate Description */}
                    <Col md={5} className="text-md-left text-xs-left border-left m-0 p-0">
                    {hotel.rooms == "Not Available" ? (
                          <Col className=" mt-2">
                            <small className="text-primary">
                              Online booking for this property is not available right now. 
                            </small>
                          </Col>
                        ) : (
                          <Col>

                            {/* WEB VIEW */}
                            <div className={`${styles.rateweb}`}>
                            <Row className="mt-2 pt-0">
                              {/* Rack Rate */}
                              <Col md="auto">
                              <small className={`${styles.pricetype} text-md-left `} style={{color:"#1A1A1A"}}>Hotel Rack Rate</small>  
                              </Col>
                              <Col style={{textAlign:"right",color:"#1A1A1A"}}>
                                <span className={`${styles.price} mt-4`}>
                                {formatter.format(
                                  parseFloat(hotel.minRate).toFixed(0)
                                )}
                              </span>  

                              </Col>
                            </Row>

                              {/* Net Rate */}
                            <Row>
                              <Col md="auto">
                              <small className={`${styles.pricetype} text-md-left `} style={{color:"#1A1A1A"}} >Net Payable</small>  
                              </Col>
                              <Col style={{textAlign:"right",color:"#1A1A1A"}} className={`${styles.prices} text-md-right`}>
                                <span className={`${styles.price} mt-4`}>
                                {formatter.format(
                                  parseFloat(hotel.minRate).toFixed(0)
                                )}
                              </span>  

                              </Col>
                            </Row>

                            <hr/>
                            <Row>
                              <Col>
                              <small className={`${styles.pricetype} text-md-left `} style={{color:"#1A1A1A"}} >Margin(2%)</small>  
                              </Col>
                              <Col style={{textAlign:"right",color:"#1A1A1A"}} className={`${styles.prices} text-md-right`}>
                                <span className={`${styles.price} mt-4`} style={{fontSize:"18px",lineHeight:"24px"}} >
                                {formatter.format(
                                  parseFloat(hotel.minRate+(hotel.minRate * 0.02)).toFixed(0)
                                )}
                              </span>  <br/>
                              <span className="text-muted " style={{fontSize:"10px"}}>2300/Night</span>
                              </Col>
                            </Row>

                          {hotel.rooms !== "Not Available" ? (
                              <Row >
                                <Col className="">
                                  <a style={{background:"#F36B25",color:"#fff"}}
                                    className="px-md-4 btn btn-sm w-100"
                                    href={`${urls.hotels}/${
                                      hotel.code
                                    }?search=${encodeURIComponent(
                                      JSON.stringify(query_data)
                                    )}`}
                                    rel="noreferrer"
                                    target="_blank"
                                  >
                                    Explore
                                  </a>
                                  <div style={{textAlign:"center"}}>
                                    <span className="text-muted " style={{fontSize:"10px"}}>Free Cancelation · No Prepayment</span>
                                  </div>
                                 

                                  {/* <Button
                                    variant="primary ml-3"
                                    size="sm"
                                    className="px-md-4"
                                    onClick={() =>
                                      router.push(
                                        {
                                          pathname: "/hotels/[hotelCode]",
                                          query: {
                                            search: JSON.stringify(query_data),
                                            page: "booking",
                                          },
                                        },
                                        {
                                          pathname: `/hotels/${hotel.code}`,
                                          query: {
                                            search: JSON.stringify(query_data),
                                            page: "booking",
                                          },
                                        }
                                      )
                                    }
                                  >
                                    Book Now
                                  </Button> */}

                                </Col>
                              </Row>
                            ) : (
                              <div className="text-primary text-sm">
                                Contact us on 
                                <a href="tel:+91 72900 22933">
                                  <span className="ml-1">+91 72900 22933 </span>
                                </a>
                                or 
                                <a href="mailto:enquiry@2hub.travel"> 
                                  &nbsp;enquiry@2hub.travel&nbsp;
                                </a>
                                for instant assistance
                              </div>
                            )}



                            </div>
                            
                            {/* MOBILE VIEW */}
                            <div className={`${styles.ratemobile}`}>
                            

                            <Row className="border m-0 p-0 w-100"> 

                              <Col md="auto" xs="auto" className="m-0 p-0">
                                <Row className="m-0 p-0">
                                  <Col xs="auto" className="m-0 p-0 px-2">
                                  <small className={`${styles.pricetypemobile} text-xs-left m-0 p-0 `} style={{color:"#808080"}}>Hotel Rack Rate </small>  
                                  </Col>

                                  <Col xs="auto" className="px-2 border-left">
                                      <b className="p-0 m-0" style={{fontSize:"11px",color:"#000"}}>{formatter.format(
                                            parseFloat(hotel.minRate).toFixed(0)
                                          )}</b>
                                  </Col>
                                </Row>
                                
                              </Col>

                              <Col md="auto" xs="auto" className="border-left p-0 m-0">
                              <Row className="m-0 p-0">
                                  <Col xs="auto" className="m-0 p-0">
                                  <small className={`${styles.pricetypemobile} text-xs-left m-0 p-0 px-2 `} style={{color:"#808080"}}>Net Payable </small>  
                                  </Col>

                                  <Col xs="auto" className="p-0 m-0 px-2 border-left">
                                      <b className="m-0" style={{fontSize:"11px",color:"#000"}}>{formatter.format(
                                            parseFloat(hotel.minRate).toFixed(0)
                                          )}</b>
                                  </Col>
                                </Row>
                              </Col>

                            </Row>
                              <Row className="mr-0 pr-0">
                                <Col xs={6} className="mt-3 pl-2 pr-2">
                                  <Row>
                                    <Col xs="auto" className="mr-0 pr-0 ml-1 pl-4">
                                    <span className={`${styles.pricemobile} text-left`} style={{color:"#1A1A1A"}}>
                                      {formatter.format(
                                        parseFloat(hotel.minRate+(hotel.minRate * 0.02)).toFixed(0)
                                      )} 
                                    </span> 
                                    </Col>
                                    <Col className="text-muted mt-1 ml-0 pl-1 mr-0 pr-0" xs="auto" style={{fontSize:"12px"}}> for 3 nights <FiInfo size="0.5rem"/></Col>

                                  </Row> 
                                </Col>

                                {/* Explore Button Mobile view */}
                                <Col className="ml-0  pl-3 pr-0" md="auto" xs={6}>
                                 {hotel.rooms !== "Not Available" ? (
                                  <Row className="mt-3">
                                    <Col className="mr-0 pr-0" >
                                      <a style={{background:"#F36B25",color:"#fff",fontSize:"12px", borderRadius:"5px"}}
                                        className="px-md-4 px-5 py-2 w-100"
                                        href={`${urls.hotels}/${
                                          hotel.code
                                        }?search=${encodeURIComponent(
                                          JSON.stringify(query_data)
                                        )}`}
                                        rel="noreferrer"
                                        target="_blank"
                                      >
                                        Explore
                                      </a>

                                      {/* <Button
                                        variant="primary ml-3"
                                        size="sm"
                                        className="px-md-4"
                                        onClick={() =>
                                          router.push(
                                            {
                                              pathname: "/hotels/[hotelCode]",
                                              query: {
                                                search: JSON.stringify(query_data),
                                                page: "booking",
                                              },
                                            },
                                            {
                                              pathname: `/hotels/${hotel.code}`,
                                              query: {
                                                search: JSON.stringify(query_data),
                                                page: "booking",
                                              },
                                            }
                                          )
                                        }
                                      >
                                        Book Now
                                      </Button> */}

                                    </Col>
                                  </Row>
                                ) : (
                                  <div className="text-primary text-sm">
                                    Contact us on 
                                    <a href="tel:+91 72900 22933">
                                      <span className="ml-1">+91 72900 22933 </span>
                                    </a>
                                    or 
                                    <a href="mailto:enquiry@2hub.travel"> 
                                      &nbsp;enquiry@2hub.travel&nbsp;
                                    </a>
                                    for instant assistance
                                  </div>
                                )}
                                </Col>
                              </Row>
                            </div>

                          </Col>
                        )}
                    </Col>
                  </Row>

                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>
        ); 
      })} 
      <Col md={12} style={{textAlign:"center"}}>
        {/* <ul className="pagination d-flex justify-content-center">
          {currentPage > 1 ? (
            <li
              className="page-item"
              aria-current="page"
              onClick={() => changePage(currentPage - 1)}
            >
              <span className="page-link bg-beige">&laquo; </span>
            </li>
          ) : null}
          {renderPageNumbers}
          {hotels.length > 1 && currentPage !== pageNumbers.length ? (
            <li
              className="page-item"
              aria-current="page"
              onClick={() => changePage(currentPage + 1)}
            >
              <span className="page-link bg-beige">&raquo; </span>
            </li>
          ) : null}
        </ul> */}
        <Button variant="outline-secondary" classname="text-12 px-5 py-2 btn-block" style={{width:"100%"}} >
          Load more
        </Button>
      </Col>
    </div>
  );
};

HotelCards.Loading = () => {
  return (
    <Card className="border-0 shadow-sm mb-4" style={{ height: "259px" }}>
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
            <Row className="mb-4">
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
            <Row>
              <Col className="d-flex justify-content-end">
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

export default HotelCards;