import { useCallback, useEffect, useState } from "react";
import { Accordion, Button, Card, Form, Table, Row, Col } from "react-bootstrap";
import { GoX } from "react-icons/go";
import {IoIosArrowRoundBack} from "react-icons/io";
import AccordionHeader from "../accordionHeader/accordionHeader";
import styles from "./hotelSearchFilter.module.scss";

const HotelSearchFilter = ({
  onFilterChange,
  onFilterClose,
  filterDisable,
}) => {
  const [starCategoryFilter, setStarCategoryFilter] = useState([]);
  const [tripAdvisorFilter, setTripAdvisorFilter] = useState(null);
  const [amenitiesFilter, setAmenitiesFilter] = useState([]);
  const [priceFilter, setPriceFilter] = useState([]);

  const updateStarCategoryState = useCallback((value) => {
    if (starCategoryFilter.includes(value)) {
      const copy = [...starCategoryFilter];
      let index = copy.indexOf(value);
      if (index !== -1) {
        copy.splice(index, 1);
      }
      setStarCategoryFilter(copy);
    } else {
      setStarCategoryFilter((prevStar) => [...prevStar, value]);
    }
  });

  const updateAminitiesFilterState = useCallback((value) => {
    if (amenitiesFilter.includes(value)) {
      const copy = [...amenitiesFilter];
      let index = copy.indexOf(value);
      if (index !== -1) {
        copy.splice(index, 1);
      }
      setAmenitiesFilter(copy);
    } else {
      setAmenitiesFilter((prevAmenities) => [...prevAmenities, value]);
    }
  });

  const filterSearch = async () => {
    if (tripAdvisorFilter !== undefined) {
      const filter = {
        cost: priceFilter,
        stars: starCategoryFilter,
        rating: tripAdvisorFilter,
        amenities: amenitiesFilter,
      };
      onFilterChange(filter);
    } else {
      const filter = {
        cost: priceFilter,
        stars: starCategoryFilter,
        amenities: amenitiesFilter,
      };
      onFilterChange(filter);
    }
  };

  const clearFilter = async () => {
    setPriceFilter([]);
    setStarCategoryFilter([]);
    setTripAdvisorFilter([]);
    setAmenitiesFilter([]);
    onFilterChange({});
  };

  useEffect(() => {
    filterSearch();
  }, [tripAdvisorFilter, priceFilter, starCategoryFilter, amenitiesFilter]);

  return (
    <div style={{ pointerEvents: filterDisable ? "none" : "" }}>
      {/* <Card className="bg-info text-white mb-2 p-3">
        <div className="d-flex justify-content-between align-items-center">
          <p className="mb-0 font-weight-500" style={{fontSize:"15px"}}>Filter by</p>

          
          <Button
            style={{fontSize:"10"}}
            variant="info"
            size="sm"
            onClick={() => clearFilter()}
          >
            reset
          </Button>

          <Button
            variant="info"
            className="d-lg-none d-block"
            onClick={() => {
              clearFilter();
              onFilterClose();
            }}
          >
            <GoX />
          </Button>
        </div>
      </Card> */}
      <div className={`${styles.mobfilter}`}>
        <div className="d-flex justify-content-between">
          <div  onClick={() => {
              clearFilter();
              onFilterClose();
            }}>
            <span style={{fontSize:"12px"}}><IoIosArrowRoundBack size="1.5rem" />Filters</span>
          </div>
          <div >
            <span className={`${styles.mobheadfilter} `} onClick={() => clearFilter()}>Clear all</span>
          </div>

        </div>
      </div>
     

      <Accordion className="mb-2" defaultActiveKey="0">
        <Card>
          <Card.Header className="bg-white border-0 p-0">
            <AccordionHeader eventKey="0" className="p-3">
              <p className="mb-0 font-weight-500" style={{fontSize:"15px"}}>Price Range</p>
            </AccordionHeader>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body className="pt-0 ml-0 pl-0">
              {/* <Form.Check
                id="price-filter-show-all"
                type="checkbox"
                label="Show All"
                name="priceRange"
                className="small text-muted py-2"
                checked={priceFilter.length === 0}
                onChange={() => setPriceFilter([])}
              /> */}
              <Form.Check
                id="price-filter-upto-5000"
                type="checkbox"
                label="< ₹5,000"
                name="priceRange"
                className="small text-muted py-2"
                checked={priceFilter.includes(0) && priceFilter.includes(5000)}
                onChange={() => setPriceFilter([0, 5000])}
              />
              <Form.Check
                id="price-filter-5001-10000"
                type="checkbox"
                label="₹5,001 - ₹10,000"
                name="priceRange"
                className="small text-muted py-2"
                checked={
                  priceFilter.includes(5001) && priceFilter.includes(10000)
                }
                onChange={() => setPriceFilter([5001, 10000])}
              />
              <Form.Check
                id="price-filter-10001-15000"
                type="checkbox"
                label="₹10,001 - ₹20,000"
                name="priceRange"
                className="small text-muted py-2"
                checked={
                  priceFilter.includes(10001) && priceFilter.includes(15000)
                }
                onChange={() => setPriceFilter([10001, 20000])}
              />
              {/* <Form.Check
                id="price-filter-15001-20000"
                type="checkbox"
                label="₹15001 to ₹20000"
                name="priceRange"
                className="small text-muted py-2"
                checked={
                  priceFilter.includes(15001) && priceFilter.includes(20000)
                }
                onChange={() => setPriceFilter([15001, 20000])}
              /> */}
              <Form.Check
                id="price-filter-20000"
                type="checkbox"
                label="> ₹20,000" 
                name="priceRange"
                className="small text-muted py-2"
                checked={
                  priceFilter.includes(20001) && priceFilter.includes(200000)
                }
                onChange={() => setPriceFilter([20001, 200000])}
              />
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>

      {/* Star Category */}
      <Accordion className="mb-2" >
        <Card>
          <Card.Header className="bg-white border-0 p-0">
            <AccordionHeader eventKey="0" className="p-3">
              <p className="mb-0 font-weight-500" style={{fontSize:"15px"}}>Star Category</p>
            </AccordionHeader>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body className="pt-0">
            <Form.Check
                type="checkbox"
                label="5 ⭐⭐⭐⭐⭐"
                id="star-catg-5"
                className="small text-muted py-2 ml-n3"
                checked={starCategoryFilter.includes(5)}
                onChange={() => updateStarCategoryState(5)}
              />
              <Form.Check
                type="checkbox"
                label="4 ⭐⭐⭐⭐"
                id="star-catg-4"
                className="small text-muted py-2 ml-n3"
                checked={starCategoryFilter.includes(4)}
                onChange={() => updateStarCategoryState(4)}
              />
              <Form.Check
                type="checkbox"
                label="3 ⭐⭐⭐"
                id="star-catg-3"
                className="small text-muted py-2 ml-n3"
                checked={starCategoryFilter.includes(3)}
                onChange={() => updateStarCategoryState(3)}
              />
              <Form.Check
                type="checkbox"
                label="2 ⭐⭐"
                id="star-catg-2"
                className="small text-muted py-2 ml-n3"
                checked={starCategoryFilter.includes(2)}
                onChange={() => updateStarCategoryState(2)}
              />
              <Form.Check
                type="checkbox"
                label="1 ⭐"
                id="star-catg-1"
                className="small text-muted py-2 ml-n3"
                checked={starCategoryFilter.includes(1)}
                onChange={() => updateStarCategoryState(1)}
              />

            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>

      {/* Distance From Center of {state} */}

      <Accordion className="mb-2" >
        <Card>
          <Card.Header className="bg-white border-0 p-0">
            <AccordionHeader eventKey="0" className="p-3">
              <p className="mb-0 font-weight-500" style={{fontSize:"15px"}}>Neighbourhood</p>
            </AccordionHeader>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body className="pt-0">
              <Form.Check
                type="checkbox"
                label="Kalyan Nagar"
                id="star-catg-5"
                className="small text-muted py-2 ml-n3"
                checked={starCategoryFilter.includes(5)}
                onChange={() => updateStarCategoryState(5)}
              />
              <Form.Check
                type="checkbox"
                label="MG Rod"
                id="star-catg-4"
                className="small text-muted py-2 ml-n3"
                checked={starCategoryFilter.includes(4)}
                onChange={() => updateStarCategoryState(4)}
              />
              <Form.Check
                type="checkbox"
                label="Silk Board"
                id="star-catg-3"
                className="small text-muted py-2 ml-n3"
                checked={starCategoryFilter.includes(3)}
                onChange={() => updateStarCategoryState(3)}
              />
              
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>

      {/* Meals */}

      <Accordion className="mb-2" >
        <Card>
          <Card.Header className="bg-white border-0 p-0">
            <AccordionHeader eventKey="0" className="p-3">
              <p className="mb-0 font-weight-500" style={{fontSize:"15px"}}>Meals</p>
            </AccordionHeader>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body className="pt-0">
              <Form.Check
                type="checkbox"
                label="Breakfast Included"
                id="breakfast_included"
                className="small text-muted py-2 ml-n3"
                checked={starCategoryFilter.includes(5)}
                onChange={() => updateStarCategoryState(5)}
              />
              <Form.Check
                type="checkbox"
                label="All meals Included"
                id="all_meals"
                className="small text-muted py-2 ml-n3"
                checked={starCategoryFilter.includes(4)}
                onChange={() => updateStarCategoryState(4)}
              />
              <Form.Check
                type="checkbox"
                label="No prepayment"
                id="no_payment"
                className="small text-muted py-2 ml-n3"
                checked={starCategoryFilter.includes(3)}
                onChange={() => updateStarCategoryState(3)}
              />
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>


      {/* Cancellation Policy */}

      <Accordion className="mb-2" >
        <Card>
          <Card.Header className="bg-white border-0 p-0">
            <AccordionHeader eventKey="0" className="p-3">
              <p className="mb-0 font-weight-500" style={{fontSize:"15px"}}>Cancellation Policy</p>
            </AccordionHeader>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body className="pt-0">
              <Form.Check
                type="checkbox"
                label="Free cancellation"
                id="star-catg-5"
                className="small text-muted py-2 ml-n3"
                checked={starCategoryFilter.includes(5)}
                onChange={() => updateStarCategoryState(5)}
              />
              <Form.Check
                type="checkbox"
                label="Book without credit card"
                id="star-catg-4"
                className="small text-muted py-2 ml-n3"
                checked={starCategoryFilter.includes(4)}
                onChange={() => updateStarCategoryState(4)}
              />
              <Form.Check
                type="checkbox"
                label="No Prepayment"
                id="star-catg-3"
                className="small text-muted py-2 ml-n3"
                checked={starCategoryFilter.includes(3)}
                onChange={() => updateStarCategoryState(3)}
              />
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>

      {/* Chains */}

      <Accordion className="mb-2" >
        <Card>
          <Card.Header className="bg-white border-0 p-0">
            <AccordionHeader eventKey="0" className="p-3">
              <p className="mb-0 font-weight-500" style={{fontSize:"15px"}}>Chains</p>
            </AccordionHeader>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body className="pt-0">
              <Form.Check
                type="checkbox"
                label="ITC"
                id="star-catg-5"
                className="small text-muted py-2 ml-n3"
                checked={starCategoryFilter.includes(5)}
                onChange={() => updateStarCategoryState(5)}
              />
              <Form.Check
                type="checkbox"
                label="Taj Hotels"
                id="star-catg-4"
                className="small text-muted py-2 ml-n3"
                checked={starCategoryFilter.includes(4)}
                onChange={() => updateStarCategoryState(4)}
              />
              <Form.Check
                type="checkbox"
                label="Marriot International"
                id="star-catg-3"
                className="small text-muted py-2 ml-n3"
                checked={starCategoryFilter.includes(3)}
                onChange={() => updateStarCategoryState(3)}
              />
              <Form.Check
                type="checkbox"
                label="OYO"
                id="star-catg-2"
                className="small text-muted py-2 ml-n3"
                checked={starCategoryFilter.includes(2)}
                onChange={() => updateStarCategoryState(2)}
              />
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>

      {/* Amenities */}
      <Accordion className="mb-2">
        <Card>
          <Card.Header className="bg-white border-0 p-0">
            <AccordionHeader eventKey="0" className="p-3">
              <p className="mb-0 font-weight-500" style={{fontSize:"15px"}} style={{fontSize:"15px"}}> Amenities</p>
            </AccordionHeader>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body className="pt-0">
              <Form.Check
                type="checkbox"
                label="Spa"
                name="amenity"
                id="amenity1"
                className="small text-muted py-2 ml-n3"
                checked={amenitiesFilter.includes("Spa")}
                onChange={() => {
                  updateAminitiesFilterState("Spa");
                }}
              />
              <Form.Check
                type="checkbox"
                label="Gym"
                id="amenity2"
                className="small text-muted py-2 ml-n3"
                checked={amenitiesFilter.includes("Gym")}
                onChange={() => {
                  updateAminitiesFilterState("Gym");
                }}
              />
              <Form.Check
                type="checkbox"
                label="Wi-fi"
                id="amenity3"
                className="small text-muted py-2 ml-n3"
                checked={amenitiesFilter.includes("Wi-fi")}
                onChange={() => {
                  updateAminitiesFilterState("Wi-fi");
                }}
              />
              <Form.Check
                type="checkbox"
                label="TV"
                id="amenity4"
                className="small text-muted py-2 ml-n3"
                checked={amenitiesFilter.includes("TV")}
                onChange={() => {
                  updateAminitiesFilterState("TV");
                }}
              />
              <Form.Check
                type="checkbox"
                label="Laundry Service"
                id="amenity5"
                className="small text-muted py-2 ml-n3"
                checked={amenitiesFilter.includes("Laundry Service")}
                onChange={() => {
                  updateAminitiesFilterState("Laundry Service");
                }}
              />
              <Form.Check
                type="checkbox"
                label="Fridge"
                id="amenity6"
                className="small text-muted py-2 ml-n3"
                checked={amenitiesFilter.includes("Fridge")}
                onChange={() => {
                  updateAminitiesFilterState("Fridge");
                }}
              />
              <Form.Check
                type="checkbox"
                label="Lift"
                id="amenity7"
                className="small text-muted py-2 ml-n3"
                checked={amenitiesFilter.includes("Lift")}
                onChange={() => {
                  updateAminitiesFilterState("Lift");
                }}
              />
              <Form.Check
                type="checkbox"
                label="Cafe"
                id="amenity8"
                className="small text-muted py-2 ml-n3"
                checked={amenitiesFilter.includes("Cafe")}
                onChange={() => {
                  updateAminitiesFilterState("Cafe");
                }}
              />
              <Form.Check
                type="checkbox"
                label="Car Park"
                id="amenity9"
                className="small text-muted py-2 ml-n3"
                checked={amenitiesFilter.includes("Car Park")}
                onChange={() => {
                  updateAminitiesFilterState("Car Park");
                }}
              />
              <Form.Check
                type="checkbox"
                label="Ironing set"
                id="amenity10"
                className="small text-muted py-2 ml-n3"
                checked={amenitiesFilter.includes("Ironing set")}
                onChange={() => {
                  updateAminitiesFilterState("Ironing set");
                }}
              />
              <Form.Check
                type="checkbox"
                label="Meeting room"
                id="amenity11"
                className="small text-muted py-2 ml-n3"
                checked={amenitiesFilter.includes("Meeting room")}
                onChange={() => {
                  updateAminitiesFilterState("Meeting room");
                }}
              />
              <Form.Check
                type="checkbox"
                label="Restaurant"
                id="amenity12"
                className="small text-muted py-2 ml-n3"
                checked={amenitiesFilter.includes("Restaurant")}
                onChange={() => {
                  updateAminitiesFilterState("Restaurant");
                }}
              />
              <Form.Check
                type="checkbox"
                label="Plug adaptor"
                id="amenity13"
                className="small text-muted py-2 ml-n3"
                checked={amenitiesFilter.includes("Plug adaptor")}
                onChange={() => {
                  updateAminitiesFilterState("Plug adaptor");
                }}
              />
              <Form.Check
                type="checkbox"
                label="Medical service"
                id="amenity14"
                className="small text-muted py-2 ml-n3"
                checked={amenitiesFilter.includes("Medical service")}
                onChange={() => {
                  updateAminitiesFilterState("Medical service");
                }}
              />
              <Form.Check
                type="checkbox"
                label="Multilingual staff"
                id="amenity15"
                className="small text-muted py-2 ml-n3"
                checked={amenitiesFilter.includes("Multilingual staff")}
                onChange={() => {
                  updateAminitiesFilterState("Multilingual staff");
                }}
              />
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>


      {/* Property Type  */}
      <Accordion className="mb-2" >
        <Card>
          <Card.Header className="bg-white border-0 p-0">
            <AccordionHeader eventKey="0" className="p-3">
              <p className="mb-0 font-weight-500" style={{fontSize:"15px"}}>Property type</p>
            </AccordionHeader>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body className="pt-0">
              <Form.Check
                type="checkbox"
                label="Hotels"
                id="star-catg-5"
                className="small text-muted py-2 ml-n3"
                checked={starCategoryFilter.includes(5)}
                onChange={() => updateStarCategoryState(5)}
              />
              <Form.Check
                type="checkbox"
                label="Appartments"
                id="star-catg-4"
                className="small text-muted py-2 ml-n3"
                checked={starCategoryFilter.includes(4)}
                onChange={() => updateStarCategoryState(4)}
              />
              <Form.Check
                type="checkbox"
                label="Guest House"
                id="star-catg-3"
                className="small text-muted py-2 ml-n3"
                checked={starCategoryFilter.includes(3)}
                onChange={() => updateStarCategoryState(3)}
              />
              <Form.Check
                type="checkbox"
                label="Private Villa"
                id="star-catg-2"
                className="small text-muted py-2 ml-n3"
                checked={starCategoryFilter.includes(2)}
                onChange={() => updateStarCategoryState(2)}
              />
              <Form.Check
                type="checkbox"
                label="Resorts"
                id="star-catg-1"
                className="small text-muted py-2 ml-n3"
                checked={starCategoryFilter.includes(1)}
                onChange={() => updateStarCategoryState(1)}
              />

              <Form.Check
                type="checkbox"
                label="Holiday homes"
                id="star-catg-1"
                className="small text-muted py-2 ml-n3"
                checked={starCategoryFilter.includes(1)}
                onChange={() => updateStarCategoryState(1)}
              />
              <Form.Check
                type="checkbox"
                label="Farm Stay"
                id="star-catg-1"
                className="small text-muted py-2 ml-n3"
                checked={starCategoryFilter.includes(1)}
                onChange={() => updateStarCategoryState(1)}
              />
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>

      {/* Trip advisor rating */}
      <Accordion className="mb-2 " >
        <Card>
          <Card.Header className="bg-white border-0 p-0">
            <AccordionHeader eventKey="0" className="p-3">
              <p className="mb-0 font-weight-500" style={{fontSize:"15px"}}>User Rating</p>
            </AccordionHeader>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body className="pt-0">
              {/* <Row className="mb-3" style={{textAlign:"center"}}>
                <Col md={2} className="mx-1 p-1" style={{background:"#F34F4F",color:"#FFF",borderRadius:"4px", fontSize:"12px"}}><span>0,1</span> </Col>
                <Col md={2} className="mx-1 p-1" style={{background:"#EE6A3A",color:"#FFF",borderRadius:"4px", fontSize:"12px"}}><span >2</span> </Col>
                <Col md={2} className="mx-1 p-1" style={{background:"#EE903A",color:"#FFF",borderRadius:"4px", fontSize:"12px"}}><span >3</span> </Col>
                <Col md={2} className="mx-1 p-1" style={{background:"#2AC084",color:"#FFF",borderRadius:"4px", fontSize:"12px"}}><span >4</span> </Col>
                <Col md={2} className="mx-1 p-1" style={{background:"#219768",color:"#FFF",borderRadius:"4px", fontSize:"12px"}}><span >5</span> </Col>
                
              </Row>
               */}
              
              <Form.Check
                type="checkbox"
                label=""
                id="star-catg-5"
                className={`${styles.rating5} small text-muted py-2 ml-n3`}
                checked={starCategoryFilter.includes(5)}
                onChange={() => updateStarCategoryState(5)}
              />
              <Form.Check
                type="checkbox"
                label="4 "
                id="star-catg-4"
                className={`${styles.rating4} small text-muted py-2 ml-n3`}
                checked={starCategoryFilter.includes(4)}
                onChange={() => updateStarCategoryState(4)}
              />
              <Form.Check
                type="checkbox"
                label="3 "
                id="star-catg-3"
                className={`${styles.rating3} small text-muted py-2 ml-n3`}
                checked={starCategoryFilter.includes(3)}
                onChange={() => updateStarCategoryState(3)}
              />
              <Form.Check
                type="checkbox"
                label="2"
                id="star-catg-2"
                className={`${styles.rating2} small text-muted py-2 ml-n3`}
                checked={starCategoryFilter.includes(2)}
                onChange={() => updateStarCategoryState(2)}
              />
              <Form.Check
                type="checkbox"
                label="0,1 "
                id="star-catg-1"
                className={`${styles.rating1} small text-muted py-2 ml-n3`}
                checked={starCategoryFilter.includes(1)}
                onChange={() => updateStarCategoryState(1)}
              />

              
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>


      {/* Health and Safety*/}

      <Accordion className="mb-2" >
        <Card>
          <Card.Header className="bg-white border-0 p-0">
            <AccordionHeader eventKey="0" className="p-3">
              <p className="mb-0 font-weight-500" style={{fontSize:"15px"}}>Health & Safety</p>
            </AccordionHeader>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body className="pt-0">
              <Form.Check
                type="checkbox"
                label="Properties that take health & safety measures"
                id="star-catg-5"
                className="small text-muted py-2 ml-n3"
                checked={starCategoryFilter.includes(5)}
                onChange={() => updateStarCategoryState(5)}
              />
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>

      {/* Sustainability                        */}

      <Accordion className="mb-2" >
        <Card>
          <Card.Header className="bg-white border-0 p-0">
            <AccordionHeader eventKey="0" className="p-3">
              <p className="mb-0 font-weight-500" style={{fontSize:"15px"}}>Sustainability</p>
            </AccordionHeader>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body className="pt-0">
              <Form.Check
                type="checkbox"
                label="Travel Sustainable properties"
                id="star-catg-5"
                className="small text-muted py-2 ml-n3"
                checked={starCategoryFilter.includes(5)}
                onChange={() => updateStarCategoryState(5)}
              />
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>

          </div>
  );
};

export default HotelSearchFilter;
