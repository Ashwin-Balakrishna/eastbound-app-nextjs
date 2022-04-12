import { useEffect, useState } from "react";
import { Accordion, Button, Card, Form } from "react-bootstrap";
import { GoX } from "react-icons/go";
import AccordionHeader from "../accordionHeader/accordionHeader";
import NavPillItem from "../../../components/pageComponents/navPillItem";
import moment from "moment";

const getDepartureMonth = () => {
  const result = [];

  for (let i = 0; i < 12; i++) {
    const today = moment();
    const nextDate = today.add(i, "month");
    const month = nextDate.format("MMM");
    const year = nextDate.format("YYYY");
    result.push({
      key: i + 1,
      name: `${month} ${year}`,
      month: month,
      year: year,
    });
  }
  return result;
};

const prices = [
  {
    key: 1,
    name: "Show All",
    value: [],
  },
  {
    key: 2,
    name: "₹5000 to ₹50000",
    value: [5000, 50000],
  },
  {
    key: 3,
    name: "₹50000 to ₹100000",
    value: [50000, 100000],
  },
  {
    key: 4,
    name: "₹100000 to ₹150000",
    value: [100000, 150000],
  },
  {
    key: 5,
    name: "₹150000 to ₹200000",
    value: [150000, 200000],
  },
  {
    key: 6,
    name: "+ ₹200000",
    value: [200000, 2000000],
  },
];

const durations = [
  {
    key: 1,
    name: "1-2 Days",
    value: "1-2",
  },
  {
    key: 2,
    name: "5-7 Days",
    value: "5-7",
  },
  {
    key: 3,
    name: "8-9 Days",
    value: "8-9",
  },
  {
    key: 4,
    name: "10-12 Days",
    value: "10-12",
  },
  {
    key: 5,
    name: ">12 Days",
    value: ">12",
  },
];

const TravelSearchFilter = ({
  filterSet,
  filterDisable,
  onFilterClose,
  onFilterChange,
  departureMonth,
}) => {
  const [showCities, setShowCities] = useState(false);

  const [departureMonthFilter, setDepartureMonthFilter] = useState([
    departureMonth,
  ]);
  const [priceFilter, setPriceFilter] = useState([]);
  const [durationFilter, setDurationFilter] = useState([]);
  const [citiesFilter, setCitiesFilter] = useState([]);
  const [travelStyleFilter, setTravelStyleFilter] = useState([]);

  const departureMonthOption = getDepartureMonth();

  const searchOperator = (searchId, listId) => {
    let input, filter, ul, li, a, i, txtValue;
    input = document.getElementById(searchId);
    filter = input.value.toUpperCase();
    ul = document.getElementById(listId);
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("a")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  };

  const filterSearch = async () => {
    const filter = {
      departureMonth: departureMonthFilter,
      price: priceFilter,
      duration: durationFilter,
      cities: citiesFilter,
      travelStyle: travelStyleFilter,
    };
    onFilterChange(filter);
  };

  const updateFilterState = (state, setterFunction, value) => {
    if (state.includes(value)) {
      const copy = [...state];
      let index = copy.indexOf(value);
      if (index !== -1) {
        copy.splice(index, 1);
      }
      setterFunction(copy);
    } else {
      setterFunction((prev) => [...prev, value]);
    }
  };

  const clearFilter = () => {
    setDepartureMonthFilter([...departureMonthFilter]);
    setPriceFilter([]);
    setDurationFilter([]);
    setCitiesFilter([]);
    setTravelStyleFilter([]);
    onFilterChange({
      departureMonth: [...departureMonthFilter],
      price: [],
      duration: [],
      cities: [],
      travelStyle: [],
    });
  };

  useEffect(() => {
    filterSearch();
  }, [
    departureMonthFilter,
    priceFilter,
    durationFilter,
    citiesFilter,
    travelStyleFilter,
  ]);

  return (
    <div style={{ pointerEvents: filterDisable ? "none" : "" }}>
      <Card body className="bg-info text-white mb-2">
        <div className="d-flex justify-content-between align-items-center">
          <p className="mb-0">Filter by</p>
          <Button
            variant="info"
            className="d-lg-none d-block"
            onClick={() => {
              onFilterClose();
            }}
          >
            <GoX />
          </Button>
        </div>
      </Card>
      <Card className="mb-2">
        <Card.Body>
          <Button
            className="font-weight-bold"
            variant="outline-info"
            size="sm"
            onClick={() => clearFilter()}
          >
            Clear All
          </Button>
        </Card.Body>
      </Card>
      <Accordion className="mb-2" defaultActiveKey="0">
        <Card>
          <Card.Header className="bg-white border-0 p-0">
            <AccordionHeader eventKey="0" className="p-3">
              <p className="mb-0 font-weight-bold">Departure Month</p>
            </AccordionHeader>
          </Card.Header>

          <Accordion.Collapse eventKey="0">
            <Card.Body className="pt-0">
              <ul className="nav nav-pills">
                {departureMonthOption.map((month, i) => (
                  <NavPillItem
                    key={i}
                    itemName={month.name}
                    checked={departureMonthFilter.includes(month.name)}
                    onCLick={() => setDepartureMonthFilter([month.name])}
                  />
                ))}
              </ul>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
      <Accordion className="mb-2" defaultActiveKey="0">
        <Card>
          <Card.Header className="bg-white border-0 p-0">
            <AccordionHeader eventKey="0" className="p-3">
              <p className="mb-0 font-weight-bold">Price</p>
            </AccordionHeader>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body className="pt-0">
              {prices.map((price) => (
                <Form.Check
                  key={price.key}
                  type="radio"
                  label={price.name}
                  name="priceRange"
                  checked={
                    price.key === 1
                      ? priceFilter.length === 0
                      : priceFilter.includes(price.value[0]) &&
                        priceFilter.includes(price.value[1])
                  }
                  className="small text-muted py-2 d-flex align-items-center"
                  onChange={() => setPriceFilter([...price.value])}
                />
              ))}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
      <Accordion className="mb-2" defaultActiveKey="0">
        <Card>
          <Card.Header className="bg-white border-0 p-0">
            <AccordionHeader eventKey="0" className="p-3">
              <p className="mb-0 font-weight-bold">Duration</p>
            </AccordionHeader>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body className="pt-0">
              <ul className="nav nav-pills">
                {durations.map((duration, i) => (
                  <NavPillItem
                    key={i}
                    itemName={duration.name}
                    checked={durationFilter.includes(duration.value)}
                    onCLick={() =>
                      updateFilterState(
                        durationFilter,
                        setDurationFilter,
                        duration.value
                      )
                    }
                  />
                ))}
              </ul>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
      <Accordion className="mb-2">
        <Card>
          <Card.Header className="bg-white border-0 p-0">
            <AccordionHeader eventKey="0" className="p-3">
              <p className="mb-0 font-weight-bold">Cities</p>
            </AccordionHeader>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body className="pt-0">
              <Form.Group
                style={{
                  maxHeight: 370 + "px",
                  overflowY: "scroll",
                  overflowX: "hidden",
                }}
              >
                <Form.Control
                  type="text"
                  className="mb-4 sticky-top"
                  autoComplete="off"
                  id="search-city"
                  onClick={() => setShowCities(true)}
                  onKeyUp={() => searchOperator("search-city", "city-list")}
                  placeholder="Search"
                />
                <ul
                  className={showCities ? "nav nav-pills" : "d-none"}
                  id="city-list"
                >
                  {filterSet?.cities?.map((item, i) => (
                    <NavPillItem
                      key={i}
                      itemName={item}
                      checked={citiesFilter.includes(item)}
                      onCLick={() =>
                        updateFilterState(citiesFilter, setCitiesFilter, item)
                      }
                    />
                  ))}
                </ul>
              </Form.Group>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>

      <Accordion className="mb-2">
        <Card>
          <Card.Header className="bg-white border-0 p-0">
            <AccordionHeader eventKey="0" className="p-3">
              <p className="mb-0 font-weight-bold">Travel Style</p>
            </AccordionHeader>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body className="pt-0">
              <ul className="nav nav-pills">
                {filterSet?.styles?.map((item, i) => (
                  <NavPillItem
                    key={i}
                    itemName={item}
                    checked={travelStyleFilter.includes(item)}
                    onCLick={() =>
                      updateFilterState(
                        travelStyleFilter,
                        setTravelStyleFilter,
                        item
                      )
                    }
                  />
                ))}
              </ul>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  );
};

export default TravelSearchFilter;
