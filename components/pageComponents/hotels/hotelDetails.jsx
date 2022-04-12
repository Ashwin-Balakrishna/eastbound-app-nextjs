import {
  Col,
  Container,
  Row,
  Card,
  Accordion,
  Button,
  Nav,
  CardColumns,
} from "react-bootstrap";
import AnchorLink from 'react-anchor-link-smooth-scroll';
import ReadMoreReact from 'read-more-react';
import { useWindowSize } from "../../../hooks/useWindowSize";
import { BiUser,BiWifi} from "react-icons/bi";
import { RiRadioButtonFill} from "react-icons/ri";
import { IoIosArrowRoundForward, IoIosArrowRoundBack, IoIosCalendar} from "react-icons/io";
import {FaBed,FaRegSnowflake} from "react-icons/fa";
import HotelSearch from "../../search/hotel/hotelSearch";
import BreadCrumb from "../breadCrumbs/breadCrumb";
import DetailCard from "../cards/detailCard";
import GridGallery from "../detailViewHotel/gridGallery";
import DetailViewHero from "../detailViewHotel/hero";
import DetailViewOptions from "../detailViewHotel/options";
import { BsDot } from "react-icons/bs";
import { RiCloseLine } from "react-icons/ri";
import Footer from "../footer/footer";
import LargeText from "../../elements/largeText";
import moment from "moment";
import { useEffect, useState } from "react";
import { fetchFormDataWithAuth } from "../../../utils/apiHelper";
import { API_URL, IMAGE_URL, reloadPageWithUrl } from "../../../utils/helper";
import DetailCardHorizontal from "../cards/detailCardHorizontal";
import { urls } from "../../../shared/urls";
import { Fragment } from "react";
import Carousels from "../detailViewHotel/HotelCarousel";
import styles from './hotelDetails.module.scss';


const SIMILAR_HOTEL_STEPS = {
  LOADING: "LOADING",
  LOADED: "LOADED",
  FAILED: "FAILED",
};

const default_or_value = (obj_to_check, key, default_val) => {
  if (obj_to_check == undefined) {
    return default_val;
  } else {
    return obj_to_check[key];
  }
};

const HotelDetails = ({ hotel_data, query_data, bookingClicked }) => {
  const [similarHotels, setSimilarHotels] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [similarHotelSteps, setSimilarHotelSteps] = useState(
    SIMILAR_HOTEL_STEPS.LOADING
  );
  const [showMore, setShowMore] = useState(false);
  const [amenitiesShowMore, setAmenitiesShowMore] = useState(false);
console.log("fromdata", hotel_data)
  const pricePerRoom = hotel_data.minRate;
  const tax = hotel_data.rooms[0].rates[0].tax;
  const taxAndServices = pricePerRoom * tax * 0.01;
  const totalAmount = pricePerRoom + taxAndServices;
  const screenSize = useWindowSize();
  const [isMobile, setIsMobile] = useState(false);
  const surroundingText="Guests loved walking around the neighbourhood! The property is situated 800 m from Rembrandtplein and 750 m and a wide range of amenities to support your trip and have the best experience.";

  useEffect(() => setIsMobile(screenSize.width <= 991), [screenSize]);

  useEffect(() => {
    const getSimilarHotels = async (payload) => {
      try {
        const data = await fetchFormDataWithAuth(
          `${API_URL}/api/agent/hotel/search`,
          "POST",
          null,
          null,
          JSON.stringify(payload)
        );

        if (data.Error || data.error) {
          setSimilarHotelSteps(SIMILAR_HOTEL_STEPS.FAILED);
          console.error(
            `Something went wrong! Error: ${JSON.stringify(data.error)}`
          );
        } else {
          setSimilarHotels(data.response);
          setSimilarHotelSteps(SIMILAR_HOTEL_STEPS.LOADED);
        }
      } catch (err) {
        console.error(`Something went wrong! Error: ${JSON.stringify(err)}`);
        setSimilarHotelSteps(SIMILAR_HOTEL_STEPS.FAILED);
      }
    };

    const payload = {
      ...query_data,
      //price: parseFloat(hotel_data.minRate),
      city: hotel_data.city,
    };

    getSimilarHotels(payload);
  }, []);

  let similarHotelsContent = null;
  switch (similarHotelSteps) {
    case SIMILAR_HOTEL_STEPS.LOADING:
      similarHotelsContent = (
        <>
          <Col xs={10} md={7} lg={4}>
            <DetailCardHorizontal.Loading />
          </Col>
          <Col xs={10} md={7} lg={4}>
            <DetailCardHorizontal.Loading />
          </Col>
          <Col xs={10} md={7} lg={4}>
            <DetailCardHorizontal.Loading />
          </Col>
        </>
      );
      break;
    case SIMILAR_HOTEL_STEPS.LOADED:
      similarHotelsContent = (
        <>
          {similarHotels.map((similarHotel) => {
            if (similarHotel.hotel_id !== hotel_data.hotel_id) {
              return (
                <Col xs={10} md={7} lg={4} key={similarHotel.hotel_id}>
                  <DetailCardHorizontal
                    title={similarHotel.name}
                    src={similarHotel.images[0]?.image_file}
                    rating={similarHotel.categoryName?.replace("STARS", "")}
                    location={similarHotel.city}
                    onClick={() => {
                      const query = query_data;
                      query.hotels.code = similarHotel.code;
                      query.hotels.hotelName = similarHotel.name;
                      reloadPageWithUrl(
                        `/hotels/${
                          similarHotel.code
                        }?search=${encodeURIComponent(JSON.stringify(query))}`
                      );
                    }}
                  />
                </Col>
              );
            } else {
              return null;
            }
          })}
        </>
      );
      break;
    case SIMILAR_HOTEL_STEPS.FAILED:
    default:
      break;
  }

  return (
    <>
      <Card
        className={`d-md-none bg-info text-white rounded-0 mb-1 sticky-search ${
          showSearch ? "d-none" : "d-block"
        }`}
      >
        <Card.Body className="d-flex justify-content-between align-items-center py-2">
          <p className="mb-0">
            <span>{moment(query_data.checkin).format("MMM Do YY")}</span>
            <BsDot />
            <span>{moment(query_data.checkout).format("MMM Do YY")}</span>
          </p>

          <Button
            style={{ fontWeight: 500 }}
            variant="link"
            onClick={() => setShowSearch(true)}
          >
            Modify
          </Button>
        </Card.Body>
      </Card>

      <section
        className={`mt-md-5 bg-info pt-md-4 pb-md-3 mb-4 ${
          !showSearch ? "d-none" : "d-block"
        } d-lg-block`}
        style={{ top: "-10px" }}
      >
        <section className="mx-5">
          <Row>
            <Col className="pb-5 pb-md-0">
              <div className="d-md-none p-2  mb-2 text-right">
                <RiCloseLine
                  onClick={() => setShowSearch(false)}
                  className="d-inline-block"
                  size="2rem"
                  color="white"
                />
              </div>
              <HotelSearch
                query_data={query_data}
                onSearch={(data) => {
                  reloadPageWithUrl(
                    `${urls.hotels_listing}?search=${encodeURIComponent(
                      JSON.stringify(data)
                    )}`
                  );
                }}
              />
            </Col>
          </Row>
        </section>
      </section>

      <Container className="ml-3 pl-3">
        <Row className="">
          <Col>
            <BreadCrumb
              city={hotel_data.city}
              query_data={query_data}
              code={hotel_data.code}
              name={hotel_data.name}
              page="View Details"
            />
          </Col>
        </Row>
      </Container>
      <Container className="ml-4 pl-4 m-0">
        <p className="m-1" style={{fontSize:"20px", fontWeight:"500"}} >{hotel_data.name}</p> 
        <div className="d-flex justify-content-start">
        <span className="text-muted m-1" style={{fontSize:"14px"}}>{hotel_data.city} ⭐⭐⭐⭐</span>
        <span className="pt-1 px-2 m-1" style={{background:"#2AC084",color:"#FFF",fontSize:"10px",borderRadius:"4px",fontWeight:"600"}}>4.6/5</span>
        </div>
        
      </Container>
      {/* Carousel and Trip detail section */}
      <Row className={!isMobile?"mx-1":"mx-0"}>
        <Col md={8} xs={12} >
            <Container>
              <Carousels/>
            </Container>
        </Col>
        
        {/* Trip Details */}
        
        <Col md={4} xs={12}>
                <Card className="overflow-hidden mb-4 p-3">
              
                  <div className="w-100 my-2" style={{ border: "2px solid #EBEBEB ", borderRadius: "5%" }} >
                    <Row className="ml-2 pt-3">
                      <Col md={1} xs={1} style={{ marginTop: "-5px" }}>
                        <IoIosCalendar color="#F36B25" size="1.5rem" />
                      </Col>
                      <Col md="auto" xs={4}>

                        <p className="font-weight-400 text-md">
                          {moment(query_data.checkin).format(
                            "DD MMM"
                          )}
                        </p>
                      </Col>
                      <Col md={1} xs={1} className="mt-">-</Col>
                      <Col md="auto" xs={4}>
                        <div >
                          <p className="font-weight-400 text-md">
                            {moment(query_data.checkout).format(
                              "DD MMM "
                            )}
                          </p>
                        </div>

                      </Col>
                    </Row>
                  </div>



                  <div style={{ border: "2px solid #EBEBEB ", borderRadius: "5%" }} className="w-100 my-2">
                    <Row className="ml-2  py-3">
                      <Col md={1} xs={1} >
                        <BiUser color="#F36B25" size="1.5rem" />
                      </Col>
                      <Col >
                        <p className="small mb-1 text-grey">
                          3 Guests 1 Room
                          
                        </p>
                      </Col>

                    </Row>
                  </div>


                  {/* <div className="w-100 my-2 md">
                    <InputGroup className="mb-3">

                      <FormControl
                        placeholder="Enter Discount Amount"
                      />
                      <InputGroup.Text id="basic-addon1" style={{background:"#F36B25",color:"#fff"}}>₹</InputGroup.Text>
                    </InputGroup>
                  </div> */}

                  {/* Price Detail Section */}
                  
                  <div className="container">
                  <Row className="mt-1">
                    <Col md={8} className="text-muted "><span style={{fontSize:"14px"}}>Hotel Rack Rate</span></Col>
                    <Col md={4} style={{textAlign:"right"}}>₹7000</Col>
                  </Row>
{/* 
                  <Row className="mt-1">
                    <Col md={8} className="text-muted"><span>Discount</span></Col>
                    <Col md={4} style={{textAlign:"right",color:"#2AC084"}}>-12000</Col>
                  </Row> */}

                  <Row className="mt-1">
                    <Col md={8} className="text-muted "><span style={{fontSize:"14px"}}>Net Payable</span></Col>
                    <Col md={4} style={{textAlign:"right"}}>₹8000</Col>
                  </Row>


                  <hr />
                  <Row className="mt-1">
                    <Col md={8} className="text-muted" style={{fontWeight:"400",fontSize:"14px"}}><span>Margin (2%)</span></Col>
                    <Col md={4} style={{textAlign:"right",fontWeight:"bold"}}>₹16000</Col>
                  </Row>


                  </div>
                  
                </Card>
                

            </Col>

        
      </Row>

      {/* <Container className="mb-5  mb-lg-7">
        <DetailViewHero
          type={hotel_data.type}
          name={hotel_data.name}
          address={hotel_data.address}
          facilities={hotel_data.facilities}
          amenities={hotel_data.amenities}
          rooms={hotel_data.rooms}
          city={hotel_data.city}
          images={hotel_data.images}
          checkin={query_data.checkin}
          checkout={query_data.checkout}
          categoryName={hotel_data.categoryName}
          code={hotel_data.code}
          query_data={query_data}
          contracted_hotel={hotel_data.contracted_hotel}
          minRate={hotel_data.minRate}
          bookingClicked={() => bookingClicked()}
          prices={{
            basePrice: pricePerRoom,
            taxAndServices,
            tax: tax,
            totalAmount,
          }}
        />
      </Container> */}

    
      
      <Row>
        <Col md={8}>
      {/* Cancellation Policies */}  
      <Container className={!isMobile?"ml-3 mb-5  mb-lg-7":""}>
        {/* <GridGallery images={hotel_data.images} /> */}
        <Row className="d-flex justify-content-start">
          <Col md={3} xs={12} className="mx-2">
            <div className="d-flex">
              <div className="m-1" >
                <FaBed style={{background:"#FDF3ED",padding:"5px", borderRadius:"5px"}} color="#F36B25" size="2rem"/>
              </div>
              <div>
                <span style={{fontSize:"14px", fontWeight:"500"}}>3 Bedrooms</span>
                <p className="text-sm text-muted">Highly rated appartments</p>
              </div>
            </div>
          </Col>

          <Col md={3} xs={12} className="mx-2">
            <div className="d-flex">
              <div className="m-1" >
                <FaBed style={{background:"#FDF3ED",padding:"5px", borderRadius:"5px"}} color="#F36B25" size="2rem"/>
              </div>
              <div>
                <span style={{fontSize:"14px", fontWeight:"500"}}>Cancellation Policy</span>
                <p className="text-sm text-muted">Free cancellation policy</p>
              </div>
            </div>
          </Col>

          <Col md={3} xs={12} className="mx-2">
            <div className="d-flex">
              <div className="m-1" >
                <FaBed style={{background:"#FDF3ED",padding:"5px", borderRadius:"5px"}} color="#F36B25" size="2rem"/>
              </div>
              <div>
                <span style={{fontSize:"14px", fontWeight:"500"}}>Cancellation Policy</span>
                <p className="text-sm text-muted">Free cancellation policy</p>
              </div>
            </div>
          </Col>

        </Row>
      </Container>
      
      {/* Amenitiessssss Section */}
      <Container id="amenities" className={!isMobile?"ml-4 mb-5  mb-lg-7":""}>
      {!isMobile?
          <section style={{borderBottom:"1px solid #EBEBEB"}} >
            <AnchorLink className="m-1 px-3" href='#amenities'>Ameneties</AnchorLink>
            <AnchorLink className="m-1 px-3" href='#rooms'>Rooms</AnchorLink>
            <AnchorLink className="m-1 px-3" href='#about'>About</AnchorLink>
            <AnchorLink className="m-1 px-3" href='#surroundings'>Surroundings</AnchorLink>
            <AnchorLink className="m-1 px-3" href='#r&p'>Rules & Policies</AnchorLink>
            <AnchorLink className="m-1 px-3" href='#reviews'>Reviews</AnchorLink>
          </section> :""
          }
          {/* Amenities */}
          <section id="amenities" className="m-1 my-3 " >
            <h5 className="m-2">Amenities</h5>
            <div className="text-muted">
              <Row className="my-3 mx-1">
                  <Col md={4} xs="auto"><BiWifi /> wifi</Col>
                  <Col md={4} xs="auto"><BiWifi /> wifi</Col>
                  <Col md={4} xs="auto"><BiWifi /> wifi</Col>
              </Row>
              <Row className="my-3 mx-1">
                  <Col md={4} xs="auto"><BiWifi /> wifi</Col>
                  <Col md={4} xs="auto"><BiWifi /> wifi</Col>
                  <Col md={4} xs="auto"><BiWifi /> wifi</Col>
              </Row>
              <Row className="my-3 mx-1">
                  <Col md={4} xs="auto"><BiWifi /> wifi</Col>
                  <Col md={4} xs="auto"><BiWifi /> wifi</Col>
                  <Col md={4} xs="auto"><BiWifi /> wifi</Col>
              </Row>
            </div>
            <hr  />
          </section>
         
        {/* Rooms */}
      <section id="rooms" className="my-3">
        <h5 className="m-2">Rooms</h5>
         <Accordion className="m-2" defaultActiveKey="0">
             <Card className="my-3">
                 <Accordion.Toggle as={Card.Header} eventKey="0">
                     <div className="d-flex justify-content-between">
                       <div><RiRadioButtonFill color="#F36B25" size="1.5rem"/> <span className="text-bold">Queen or Two Double Beds Room</span></div>
                       <div>
                         <p className="text-muted">Starting from <b style={{color:"black"}}>₹ 7,200</b></p>
                       </div>
                     </div>
                 </Accordion.Toggle>
                 <Accordion.Collapse eventKey="0">
                     <Card.Body>
                       <div>
                         <Row className="pb-3" style={{borderBottom:"1px solid #EBEBEB"}}>
                           <Col className="text-muted">
                            <span><FaBed size="1.25rem" /> 1 large double bed</span>
                            <br /><br />
                            <span><FaRegSnowflake size="1rem"/> Air conditioned room</span>
                           </Col>
                           <Col className="text-muted " style={{textAlign:"center"}}>
                            <span><IoIosArrowRoundBack size="1.5rem"/>31 m<sup>2</sup> living space </span>
                           </Col>
                           <Col className="m-0 p-0">
                           <div className="p-2 mt-0" style={{background:"#EDF8FC",borderRadius:"8px"}}>
                            <div className="mb-1">
                                <span style={{fontWeight:"600"}}>
                                  Free Cancellation
                                </span>
                                <br />
                                <small className="text-muted">unitl 23:59 on 6 December 2022</small>
                              </div>
                              <div className="mb-1">
                                <span style={{fontWeight:"600"}}>
                                  Pre Payment
                                </span>
                                <br />
                                <small className="text-muted">Not Required</small>
                              </div>
                           </div>
                            
                           </Col>
                         </Row>

                         <Row className="my-2" style={{borderBottom:"1px solid #EBEBEB"}}>
                           <Col md={5} className="pt-2"><span style={{fontSize:"14px",fontWeight:"600"}}>Room Only</span></Col>
                           <Col md={2}>
                              <div className="mb-1">
                                <span className="mt-0 text-muted" style={{fontSize:"12px"}}>
                                  Hotel Rack Rate
                                </span>
                                <br />
                                <small className="text-muted" style={{fontSize:"12px"}}>₹ 7,200</small>
                              </div>
                           </Col>
                           <Col md={2}>
                           <div className="mb-1">
                                <span className="mt-0 text-muted" style={{fontSize:"12px"}}>
                                  Net Payable
                                </span>
                                <br />
                                <small className="text-muted" style={{fontSize:"12px"}}>₹ 8,800</small>
                              </div>
                           </Col>
                           <Col md={3} className="pt-2">
                             <Button className="px-3 " style={{border:"1px solid #F36B25", color:"#F36B25", background:"none",fontSize:"14px",fontWeight:"500"}} >Book For ₹ 7,200</Button>
                           </Col>
                         </Row>

                         <Row className="my-2" style={{borderBottom:"1px solid #EBEBEB"}}>
                           <Col md={5} className="pt-2"><span style={{fontSize:"14px",fontWeight:"600"}}>Room and Breakfast</span></Col>
                           <Col md={2}>
                              <div className="mb-1">
                                <span className="mt-0 text-muted" style={{fontSize:"12px"}}>
                                  Hotel Rack Rate
                                </span>
                                <br />
                                <small className="text-muted" style={{fontSize:"12px"}}>₹ 7,200</small>
                              </div>
                           </Col>
                           <Col md={2}>
                           <div className="mb-1">
                                <span className="mt-0 text-muted" style={{fontSize:"12px"}}>
                                  Net Payable
                                </span>
                                <br />
                                <small className="text-muted" style={{fontSize:"12px"}}>₹ 8,800</small>
                              </div>
                           </Col>
                           <Col md={3} className="pt-2">
                             <Button className="px-3 " style={{border:"1px solid #F36B25", color:"#F36B25", background:"none",fontSize:"14px",fontWeight:"500"}} >Book For ₹ 7,200</Button>
                           </Col>
                         </Row>

                         <Row className="my-2" style={{borderBottom:"1px solid #EBEBEB"}}>
                           <Col md={5} className="pt-2"><span style={{fontSize:"14px",fontWeight:"600"}}>Room, Breakfast and Dinner</span></Col>
                           <Col md={2}>
                              <div className="mb-1">
                                <span className="mt-0 text-muted" style={{fontSize:"12px"}}>
                                  Hotel Rack Rate
                                </span>
                                <br />
                                <small className="text-muted" style={{fontSize:"12px"}}>₹ 7,200</small>
                              </div>
                           </Col>
                           <Col md={2}>
                           <div className="mb-1">
                                <span className="mt-0 text-muted" style={{fontSize:"12px"}}>
                                  Net Payable
                                </span>
                                <br />
                                <small className="text-muted" style={{fontSize:"12px"}}>₹ 8,800</small>
                              </div>
                           </Col>
                           <Col md={3} className="pt-2">
                             <Button className="px-3 " style={{border:"1px solid #F36B25", color:"#F36B25", background:"none",fontSize:"14px",fontWeight:"500"}} >Book For ₹ 7,200</Button>
                           </Col>
                         </Row>
                       </div>
                     </Card.Body>
                 </Accordion.Collapse>
             </Card>
  
             <Card className="my-3">
                 <Accordion.Toggle as={Card.Header} eventKey="1">
                      <div className="d-flex justify-content-between">
                       <div><RiRadioButtonFill color="#EBEBEB" size="1.5rem"/> <span className="text-bold">Junior Suite</span></div>
                       <div>
                         <p className="text-muted">Starting from <b style={{color:"black"}}>₹ 5,200</b></p>
                       </div>
                     </div>
                 </Accordion.Toggle>
                 <Accordion.Collapse eventKey="1">
                     <Card.Body>
                     <div>
                         <Row className="pb-3" style={{borderBottom:"1px solid #EBEBEB"}}>
                           <Col className="text-muted">
                            <span><FaBed size="1.25rem" /> 1 large double bed</span>
                            <br /><br />
                            <span><FaRegSnowflake size="1rem"/> Air conditioned room</span>
                           </Col>
                           <Col className="text-muted " style={{textAlign:"center"}}>
                            <span><IoIosArrowRoundBack size="1.5rem"/>31 m<sup>2</sup> living space </span>
                           </Col>
                           <Col className="m-0 p-0">
                           <div className="p-2 mt-0" style={{background:"#EDF8FC",borderRadius:"8px"}}>
                            <div className="mb-1">
                                <span style={{fontWeight:"600"}}>
                                  Free Cancellation
                                </span>
                                <br />
                                <small className="text-muted">unitl 23:59 on 6 December 2022</small>
                              </div>
                              <div className="mb-1">
                                <span style={{fontWeight:"600"}}>
                                  Pre Payment
                                </span>
                                <br />
                                <small className="text-muted">Not Required</small>
                              </div>
                           </div>
                            
                           </Col>
                         </Row>

                         <Row className="my-2" style={{borderBottom:"1px solid #EBEBEB"}}>
                           <Col md={5} className="pt-2"><span style={{fontSize:"14px",fontWeight:"600"}}>Room Only</span></Col>
                           <Col md={2}>
                              <div className="mb-1">
                                <span className="mt-0 text-muted" style={{fontSize:"12px"}}>
                                  Hotel Rack Rate
                                </span>
                                <br />
                                <small className="text-muted" style={{fontSize:"12px"}}>₹ 7,200</small>
                              </div>
                           </Col>
                           <Col md={2}>
                           <div className="mb-1">
                                <span className="mt-0 text-muted" style={{fontSize:"12px"}}>
                                  Net Payable
                                </span>
                                <br />
                                <small className="text-muted" style={{fontSize:"12px"}}>₹ 8,800</small>
                              </div>
                           </Col>
                           <Col md={3} className="pt-2">
                             <Button className="px-3 " style={{border:"1px solid #F36B25", color:"#F36B25", background:"none",fontSize:"14px",fontWeight:"500"}} >Book For ₹ 7,200</Button>
                           </Col>
                         </Row>

                         <Row className="my-2" style={{borderBottom:"1px solid #EBEBEB"}}>
                           <Col md={5} className="pt-2"><span style={{fontSize:"14px",fontWeight:"600"}}>Room and Breakfast</span></Col>
                           <Col md={2}>
                              <div className="mb-1">
                                <span className="mt-0 text-muted" style={{fontSize:"12px"}}>
                                  Hotel Rack Rate
                                </span>
                                <br />
                                <small className="text-muted" style={{fontSize:"12px"}}>₹ 7,200</small>
                              </div>
                           </Col>
                           <Col md={2}>
                           <div className="mb-1">
                                <span className="mt-0 text-muted" style={{fontSize:"12px"}}>
                                  Net Payable
                                </span>
                                <br />
                                <small className="text-muted" style={{fontSize:"12px"}}>₹ 8,800</small>
                              </div>
                           </Col>
                           <Col md={3} className="pt-2">
                             <Button className="px-3 " style={{border:"1px solid #F36B25", color:"#F36B25", background:"none",fontSize:"14px",fontWeight:"500"}} >Book For ₹ 7,200</Button>
                           </Col>
                         </Row>

                         <Row className="my-2" style={{borderBottom:"1px solid #EBEBEB"}}>
                           <Col md={5} className="pt-2"><span style={{fontSize:"14px",fontWeight:"600"}}>Room, Breakfast and Dinner</span></Col>
                           <Col md={2}>
                              <div className="mb-1">
                                <span className="mt-0 text-muted" style={{fontSize:"12px"}}>
                                  Hotel Rack Rate
                                </span>
                                <br />
                                <small className="text-muted" style={{fontSize:"12px"}}>₹ 7,200</small>
                              </div>
                           </Col>
                           <Col md={2}>
                           <div className="mb-1">
                                <span className="mt-0 text-muted" style={{fontSize:"12px"}}>
                                  Net Payable
                                </span>
                                <br />
                                <small className="text-muted" style={{fontSize:"12px"}}>₹ 8,800</small>
                              </div>
                           </Col>
                           <Col md={3} className="pt-2">
                             <Button className="px-3 " style={{border:"1px solid #F36B25", color:"#F36B25", background:"none",fontSize:"14px",fontWeight:"500"}} >Book For ₹ 7,200</Button>
                           </Col>
                         </Row>
                       </div>
                     </Card.Body>
                 </Accordion.Collapse>
             </Card>
   
             <Card className="my-3">
                 <Accordion.Toggle as={Card.Header} eventKey="2">
                     <div className="d-flex justify-content-between">
                       <div><span className="text-bold"><RiRadioButtonFill color="#EBEBEB" size="1.5rem"/> Queen or Two Double Beds Room</span></div>
                       <div>
                         <p className="text-muted">Starting from <b style={{color:"black"}}>₹ 7,200</b></p>
                       </div>
                     </div>
                 </Accordion.Toggle>
                 <Accordion.Collapse eventKey="2">
                     <Card.Body>
                        <div>
                         <Row>
                           <Col className="text-muted">
                            <span><FaBed size="1.25rem" /> 1 large double bed</span>
                            <br /><br />
                            <span><FaRegSnowflake size="1rem"/> Air conditioned room</span>
                           </Col>
                           <Col className="text-muted " style={{textAlign:"center"}}>
                            <span><IoIosArrowRoundBack size="1.5rem"/>31 m<sup>2</sup> living space </span>
                           </Col>
                           <Col className="m-0 p-0">
                           <div className="p-2 mt-0" style={{background:"#EDF8FC",borderRadius:"8px"}}>
                            <div className="mb-1">
                                <span style={{fontWeight:"600"}}>
                                  Free Cancellation
                                </span>
                                <br />
                                <small className="text-muted">unitl 23:59 on 6 December 2022</small>
                              </div>
                              <div className="mb-1">
                                <span style={{fontWeight:"600"}}>
                                  Pre Payment
                                </span>
                                <br />
                                <small className="text-muted">Not Required</small>
                              </div>
                           </div>
                            
                           </Col>
                         </Row>
                       </div>
                     </Card.Body>
                 </Accordion.Collapse>
             </Card>
         </Accordion>
         <hr />
      </section>
      
      {/* About */}
      <section id="about" className="my-3">
        <h5 className="m-2">About</h5>
        
        <Row className="m-2">
          <span style={{color:"#808080"}}>
          This attractive hotel is perfect for a weekend getaway or longer holiday. A key collection service is available. The hotel boasts of a team of well-trained, professional staff who ensure prompt service.The hotel is uniquely designed to offer a delectable experience to all its guests. It is unarguably one of the finest in luxury business hotels in Bangalore. It is very close to the outer ring road, offering great connectivity with the International Airport and all the important business and entertainment hubs in the city                                                                               
          </span>         
          <img src="https://s1.cdn.autoevolution.com/images/news/the-latest-google-maps-update-comes-with-an-unpleasant-surprise-for-some-users-147113-7.jpg" alt="map image" style={{width:"100%", height:"200px", objectFit:"stretch"}} />                                                  
        </Row>
        <hr />
      </section>

      <section id="surroundings" className="my-3">
        <h5 >Surroundings</h5>
        <div className="mt-4">
          <ReadMoreReact text={surroundingText} 
            min={5}
            ideal={13}
          />

          
          
        </div>
        
      </section>

      <section id="r&p">
        <h5 >Rules and Policies</h5>
        
        <Row>
          <Col md={4} xs={6}>wifi</Col>
          <Col md={4} xs={6}>wifi</Col>
          <Col md={4} xs={6}>wifi</Col>
        </Row>
      </section>

      <section id="reviews">
        <h5 >Reviews</h5>
        
        <Row>
          <Col md={4} xs={6}>wifi</Col>
          <Col md={4} xs={6}>wifi</Col>
          <Col md={4} xs={6}>wifi</Col>
        </Row>
      </section>
            
        
      </Container>
      </Col>


      <Col md={4} className="m-0 p-0"></Col>
      </Row>
      {/* End of page */}
{/*       
      <Container className="mb-5  mb-lg-7" id="about">
        <Row className="mb-5">
          <Col xs={12}>
            <h4 className="font-weight-bold mb-3">About the Hotel</h4>
            <LargeText className="text-muted text-md" limit="300">
              {hotel_data.description || ''}
            </LargeText>
          </Col>
        </Row>

        <Row className="d-none d-lg-flex">
          <Col xs={12}>
            <h5 className="font-weight-bold mb-3">Amenities</h5>
            {hotel_data.type != "hg" ?
            hotel_data.amenities
              .slice(0, !amenitiesShowMore ? 2 : undefined)
              .map((amenitie, i) => (
                <div key={`amenitie.${i}`} className="mb-2">
                  <div className="font-weight-bold text-md mb-1 text-muted">
                    {amenitie.group}
                  </div>
                  <div className="d-flex flex-wrap">
                    {amenitie.list.map((list, i) => (
                      <div
                        className="d-flex align-items-center justify-content-center mb-2"
                        key={`list.${i}`}
                      >
                        <span className="d-flex">
                          <FiCheckCircle className="text-primary mr-2" />
                        </span>
                        <p className="text-md text-muted mb-0 text-nowrap mr-3">
                          {list}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )) : <div className="mb-2">
              <div className="d-flex flex-wrap">
                {hotel_data.amenities.map((list, i) => (
                  <div
                    className="d-flex align-items-center justify-content-center mb-2"
                    key={`list.${i}`}
                  >
                    <span className="d-flex">
                      <FiCheckCircle className="text-primary mr-2" />
                    </span>
                    <p className="text-md text-muted mb-0 text-nowrap mr-3">
                      {list}
                    </p>
                  </div>
                ))}
              </div>
            </div>  
            }
          </Col>
        </Row>

        {hotel_data.type != "hg" && hotel_data.amenities.length > 2 && (
          <Row className="d-none d-lg-block">
            <Container>
              <Button
                variant="link"
                className="p-0"
                size="sm"
                onClick={() => setAmenitiesShowMore(!amenitiesShowMore)}
              >
                {amenitiesShowMore ? "Show less" : "...Show more"}
              </Button>
            </Container>
          </Row>
        )}
      </Container>

      <Container className="mb-4  mb-lg-7">
        <Row>
          <Col md={3} xs={3}>
            <p className="text-md mb-0 font-weight-bold">Room type</p>
          </Col>

          <Col md={3} xs={3}>
            <p className="text-md mb-0 font-weight-bold">Room Facilities</p>
          </Col>
          <Col md={2} xs={3}>
            <p className="text-md mb-0 font-weight-bold">Options</p>
          </Col>
          <Col md={2} xs={3}>
            <p className="text-md mb-0 font-weight-bold">Price</p>
          </Col>
          <Col md={2} xs={3}></Col>
        </Row>

        <hr />

        {hotel_data.rooms.slice(0, !showMore ? 3 : undefined).map((room, i) => (
          <DetailViewOptions key={`roomtype_${i}`} room={room} />
        ))}

        {hotel_data.rooms.length > 3 && (
          <Row className="text-center">
            <Container>
              <Button
                variant="outline-secondary"
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? "Show less" : "Show more"}
              </Button>
            </Container>
          </Row>
        )}
      </Container>

      // {/* <Container className="mb-5  mb-lg-7">
      //   <Row className="mb-4">
      //     <Col md={12}>
      //       <p className="lead font-weight-bold text-muted">
      //         Reviews and Ratings
      //       </p>
      //     </Col>
      //   </Row>
      //   <HotelReview />
      // </Container> */} 

<Container className="mb-4  mb-lg-7">
        <Row>
          <Col md={3} xs={3}>
            <p className="text-md mb-0 font-weight-bold">Room type</p>
          </Col>

          <Col md={3} xs={3}>
            <p className="text-md mb-0 font-weight-bold">Room Facilities</p>
          </Col>
          <Col md={2} xs={3}>
            <p className="text-md mb-0 font-weight-bold">Options</p>
          </Col>
          <Col md={2} xs={3}>
            <p className="text-md mb-0 font-weight-bold">Price</p>
          </Col>
          <Col md={2} xs={3}></Col>
        </Row>

        <hr />

        {hotel_data.rooms.slice(0, !showMore ? 3 : undefined).map((room, i) => (
          <DetailViewOptions key={`roomtype_${i}`} room={room} />
        ))}

        {hotel_data.rooms.length > 3 && (
          <Row className="text-center">
            <Container>
              <Button
                variant="outline-secondary"
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? "Show less" : "Show more"}
              </Button>
            </Container>
          </Row>
        )}
      </Container>

      <section className="bg-white py-5">
        <Container className="mb-4">
          <Row>
            <Col xs={12}>
              <h4 className="font-weight-bold">Similar Hotels</h4>
            </Col>
          </Row>
          <Row>
            <div className="d-flex flex-row flex-nowrap is-x-scrollable w-100">
              {similarHotelsContent}
            </div>
          </Row>
        </Container>
      </section>

      <Footer />
    </>
  );
};

export default HotelDetails;