import React, { useCallback, useEffect, useState } from "react";
import { Col, Container, Row, Card, Image, Button } from "react-bootstrap";
import { BsDot, BsMap } from "react-icons/bs";
import {BiFilterAlt,BiSort, BiArrowToTop } from "react-icons/bi";
import { FaListAlt } from "react-icons/fa";
import PageLayout from "../../components/layouts/pageLayout";
import Footer from "../../components/pageComponents/footer/footer";
import { fetchDataWithAuth } from "../../utils/apiHelper";
import HotelCards from "../../components/pageComponents/cards/hotelCards";
import moment from "moment";
import { API_URL, reloadPageWithUrl } from "../../utils/helper";
import { urls } from "../../shared/urls";
import HotelSearch from "../../components/search/hotel/hotelSearch";
import SelectField from "../../components/elements/selectField";
import { RiCloseLine } from "react-icons/ri";
import { useWindowSize } from "../../hooks/useWindowSize";
import HotelSearchFilter from "../../components/pageComponents/hotels/hotelSearchFilter";
import ModalComponent from "../../components/elements/modal";
import styles from "./listing.module.scss";

const PAGE_STEPS = {
  LOADING: "loading",
  LOADED: "loaded",
  FAILED: "failed",
};

const sortingOptions = [
  { value: "priceAscending", label: "Price - low to high" },
  { value: "priceDescending", label: "Price - high to low" },
];

const HotelsListing = ({ queryData }) => {
  const screenSize = useWindowSize();
  const [hotels, setHotels] = useState({});
  const [pageStep, setPageStep] = useState(PAGE_STEPS.LOADING);
  const [errorMessage, setErrorMessage] = useState("");
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [filterChanged, setFilterChanged] = useState(true);
  const [sortingValue, setSortingValue] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [payload, setPayload] = useState({
    ...queryData,
    ...queryData["hotels"],
  });
  const [showSearch, setShowSearch] = useState(false);
  const [filterDisable, setFilterDisable] = useState(false);

  useEffect(() => setIsMobile(screenSize.width <= 991), [screenSize]);

  useEffect(() => {
    if (filterChanged) {
      setFilterDisable(true);
      const getHotels = async () => {
        try {
          const data = await fetchDataWithAuth(
            `${API_URL}/api/agent/hotel/search`,
            "POST",
            null,
            null,
            payload
          );

          if (data.Error || data.error) {
            setErrorMessage(data.Error || data.error);
            setPageStep(PAGE_STEPS.FAILED);
          } else {
            setHotels(data.response);
            setPageStep(PAGE_STEPS.LOADED);
            setFilterDisable(false);
          }
        } catch (err) {
          setErrorMessage(`Something went wrong! Please try again later.`);
          console.error(`Something went wrong! Error: ${JSON.stringify(err)}`);
          setPageStep(PAGE_STEPS.FAILED);
        } finally {
          setFilterChanged(false);
        }
      };

      setPageStep(PAGE_STEPS.LOADING);
      setErrorMessage("");

      getHotels();
    }
  }, [filterChanged]);

  const handleSortingValue = useCallback((e) => {
    setSortingValue(e.value);
    let sorted = hotels;
    if (e.value === "priceAscending") {
      sorted.sort((a, b) => a.minRate - b.minRate);
    } else if (e.value === "priceDescending") {
      sorted.sort((a, b) => b.minRate - a.minRate);
    } else {
      let temp = sorted.filter((v) => v.reviews !== undefined);
      let newTemp = sorted.filter((v) => v.reviews == undefined);
      temp.sort((a, b) => b.reviews[0].rate - a.reviews[0].rate);
      sorted = [...temp, ...newTemp];
    }
    setHotels(sorted);
  });

  let content = null;
  switch (pageStep) {
    case PAGE_STEPS.LOADING:
      content = (
        <Row>
          {[1, 2, 3].map((i) => (
            <Col lg={12} key={i}>
              <HotelCards.Loading />
            </Col>
          ))}
        </Row>
      );
      break;
    case PAGE_STEPS.LOADED:
      content = (
        <>
          <Row>
            {hotels.length == 0 ? (
              <Col>
                <p className="text-center">No Results found </p>
              </Col>
            ) : (
              <>
                <HotelCards hotels={hotels} query_data={queryData} />
              </>
            )}
          </Row>

          {/* {isMobile ? (
            <div
              className="position-sticky bg-beige px-4 py-2 w-100 d-lg-none"
              style={{ position: "fixed", bottom: 0 }}
            >
              <button
                type="button"
                className="btn btn-primary font-weight-bold btn-block btn-lg"
                onClick={() => setShowFilterOptions(true)}
                id="filter-button"
              >
                Filter
              </button>
            </div>
          ) : null} */}
        </>
      );
      break;
    case PAGE_STEPS.FAILED:
      content = (
        <div className="d-flex align-items-center justify-content-center flex-column">
          <Image
            src="/images/svg/error.svg"
            width="400"
            className="mb-3 mt-md-5"
          ></Image>
          <h3 className="text-jetblack">Something went wrong</h3>
          <p>{errorMessage}</p>
        </div>
      );
      break;
  }

  return (
    <>
      <PageLayout title="2hub | Hotels">
        <Card
          className={`d-md-none bg-info text-white rounded-0 mb-3 sticky-search ${
            showSearch ? "d-none" : "d-block"
          }`}
        >
          <Card.Body className="d-flex justify-content-between align-items-center py-2">
            <p className="mb-0 text-xs">
              <span>
                {queryData.hotels.city}
                {queryData.hotels.hotelName}
              </span>
              <BsDot />
              <span>{moment(queryData.checkin).format("MMM Do YY")}</span>
              <BsDot />
              <span>{moment(queryData.checkout).format("MMM Do YY")}</span>
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
          className={`my-md-3 bg-info pt-md-4 pb-md-3 mb-2 sticky-search ${
            !showSearch ? "d-none" : "d-block"
          } d-lg-block`}
          style={{ top: "-10px" }}
        >
          <>
            <Row className={!isMobile?"mx-5":"mx-1"}>
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
                  query_data={queryData}
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
          </>
        </section>

        <section className={!isMobile?"mx-5 mb-5 mb-lg-7 pl-2":"mx-1 mb-5 mb-lg-7"}>
          {hotels?.length !== 0 ? (
            <>
            <Row id="hotel-sort" className={`${styles.headweb} mr-2`}>
              

              
                <Col md={3}>
                  <div className="d-flex justify-content-between">
                  <p className="mt-2 text-muted text-sm">Filters</p>
                  <p className="mt-2 text-primary text-sm">Clear all</p>
                  </div>
                </Col>
                <Col>
                  <p className="mt-2 text-muted text-sm">
                    {`Showing `}
                    <span >
                      {/* {queryData.hotels.city}
                      {queryData.hotels.hotelName} */}
                      98
                    </span>
                    {` results`}
                  </p>
                </Col>
                
                <Col md={3}>
                  <div className="d-flex justify-content-end">
                    <p className="text-right mt-2 mr-2text-muted text-sm">Sort By :</p>
                    <select className="ml-0 pl-0" id="" style={{border:"none", background:"none", marginTop:"-10px",color:"#F36B25",fontSize:"14px", textAlign : "left"}}>
                      <option  value="">Lowest price</option>
                      <option value="">Highestprice</option>
                    </select>

                    <div className="d-flex">
                      <div><span className="mt-1 ml-5"><FaListAlt color="#F36B25" size="1rem" /></span></div>
                      <div><span className="mt-1 ml-3 text-muted"><BsMap color="#808080" size="0.75rem" /></span></div>
                    </div>
                    

                    
                    {/* <SelectField.WithoutFormik
                      value={sortingOptions.find(
                        (obj) => obj.value === sortingValue
                      )}
                      style={{border:"none"}}
                      options={sortingOptions}
                      isSearchable="false"
                      formGroupClassName="flex-fill"
                      onOptionChanged={(e) => handleSortingValue(e)}
                      placeholder="Select order"
                    /> */}
                  </div>
                </Col>
              
              
              
            </Row>
            
            <Row id="hotel-sort" className={`${styles.headmobile} mb-2 mr-1`}>
                            
                <Col xs="auto">
                    <button
                    type="button"
                    style={{border:"0.5px solid #EBEBEB",borderRadius:"2px"}}
                    className={`${styles.mobbtnsrp}`}
                    onClick={() => setShowFilterOptions(true)}
                    id="filter-button"
                  >
                    <BiFilterAlt size="0.75rem" color="#F36B25" style={{ marginTop:"-4px"}} /> <span >Filter (98 results)</span> 
                  </button>
                </Col>
                
                <Col xs="auto">
                <button
                    type="button"
                    style={{border:"0.5px solid #EBEBEB",borderRadius:"2px"}}
                    className={`${styles.mobbtnsrp}`}
                    onClick={() => setShowFilterOptions(true)}
                    id="filter-button"
                  >
                    <BiSort size="0.75rem" color="#F36B25" style={{ marginTop:"-4px"}} /> <span >Sort</span> 
                  </button>
                </Col>
                
                <Col className="pl-3 pr-0 mr-0" xs="auto">
                  <div className="d-flex pl-2 pr-0 mr-0">
                    <div className="d-flex pr-0 mr-0" style={{border:"0.5px solid #EBEBEB"}}>
                      <div><span className="mt-1 pl-2 mr-2"><FaListAlt color="#F36B25" size="1rem" /></span></div>
                      <div><span className="mt-1 pl-2 text-muted p-1 mr-2 "><BsMap size="1rem" /></span></div>
                    </div>
                    

                    
                    {/* <SelectField.WithoutFormik
                      value={sortingOptions.find(
                        (obj) => obj.value === sortingValue
                      )}
                      style={{border:"none"}}
                      options={sortingOptions}
                      isSearchable="false"
                      formGroupClassName="flex-fill"
                      onOptionChanged={(e) => handleSortingValue(e)}
                      placeholder="Select order"
                    /> */}
                  </div>
                </Col>
                              
              
            </Row>
            <Row className={`${styles.headmobile} mb-2 ml-2`}>
                   <p className="mt-2 text-muted text-sm">
                    {`Showing `}
                    <span >
                      {/* {queryData.hotels.city}
                      {queryData.hotels.hotelName} */}
                      98
                    </span>
                    {` results`}
                  </p>
                </Row>
              

            </>

         
          ) : null}
          <Row className="mb-4">
            <Col lg={3} className="d-lg-block d-none" id="filter-div">
              {!isMobile ? (
                <HotelSearchFilter
                  onFilterChange={(filter) => {
                    setPayload({
                      ...filter,
                      ...queryData,
                      ...queryData["hotels"],
                    });
                    setFilterChanged(true);
                  }}
                  filterDisable={filterDisable}
                />
              ) : null}
            </Col>
            <Col lg={9}>{content}</Col>
          </Row>
        </section>

        <Footer />

        <ModalComponent
          show={showFilterOptions}
          scrollable={true}
          body={
            <HotelSearchFilter
              onFilterClose={() => {
                setPayload({});
                setShowFilterOptions(false);
              }}
              onFilterChange={(filter) =>
                setPayload({
                  ...filter,
                  ...queryData,
                  ...queryData["hotels"],
                })
              }
            />
          }
          footer={
            <Button
              block
              onClick={() => {
                setFilterChanged(true);
                setShowFilterOptions(false);
              }}
            >
              Apply Filter
            </Button>
          }
        />
      </PageLayout>
      <div id="scroll-here"></div>
      <a  href="#" >
        <BiArrowToTop className={`${styles.backtotop}`} color="#fff"  />
      </a>
    </>
  );
};

export const getServerSideProps = async (context) => {
  const { search } = context.query;

  return { props: { queryData: JSON.parse(search) } };
};

export default HotelsListing;
