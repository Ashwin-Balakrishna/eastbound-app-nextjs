import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row, Button } from "react-bootstrap";
import { BsDot } from "react-icons/bs";
import PageLayout from "../../../components/layouts/pageLayout";
import Footer from "../../../components/pageComponents/footer/footer";
import PackageCards from "../../../components/pageComponents/cards/packageCards";
import { fetchDataWithAuth } from "../../../utils/apiHelper";
import { useWindowSize } from "../../../hooks/useWindowSize";
import TravelSearch from "../../../components/search/travelPackages/travelSearch";
import TravelSearchFilter from "../../../components/pageComponents/travelPackage/travelSearchFilter";
import ModalComponent from "../../../components/elements/modal";
import { RiCloseLine } from "react-icons/ri";
import { urls } from "../../../shared/urls";
import SelectField from "../../../components/elements/selectField";
import { reloadPageWithUrl, API_URL } from "../../../utils/helper";
import withAuth from "../../../utils/withAuth";
import { useRouter } from "next/router";

const sortingOptions = [
  { value: "priceAscending", label: "Price: Lowest first" },
  { value: "priceDescending", label: "Price: Highest first" },
];

const LISTING_STEP = {
  LOADING: "loading",
  LOADED: "loaded",
  FAILED: "failed",
};

const Trips = ({
  selectedSearchValue,
  selectedSearchKey,
  selectedMonth,
  selectedYear,
  categories,
}) => {
  const router = useRouter();
  const screenSize = useWindowSize();
  const [filterString, setFilterString] = useState("");
  const [searchValue, setSearchValue] = useState(selectedSearchValue);
  const [searchKey, setSearchKey] = useState(selectedSearchKey);
  const [month, setMonth] = useState(selectedMonth);
  const [year, setYear] = useState(selectedYear);
  const [types, setTypes] = useState("");
  const [filterQuery, setFilterQuery] = useState({
    departureMonth: [],
    price: [],
    duration: [],
    cities: [],
    travelStyle: [],
  });
  const [pageStep, setPageStep] = useState(LISTING_STEP.LOADING);
  const [travelPackages, setTravelPackages] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [filterSet, setFilterSet] = useState([]);
  const [sortingValue, setSortingValue] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [filterDisable, setFilterDisable] = useState(false);

  useEffect(() => setIsMobile(screenSize.width <= 991), [screenSize]);

  useEffect(() => {
    getPackages();
  }, [filterString]);

  useEffect(() => {
    let query = "";

    if (filterQuery.departureMonth.length > 0) {
      const [month, year] = filterQuery.departureMonth[0].split(" ");
      query += `&month=${month}`;
      query += `&year=${year}`;
      setSearchValue(searchValue);
      setSearchKey(searchKey);
      setMonth(month);
      setYear(year);
      router.push(
        `${urls.travelPackages_trips}?searchValue=${searchValue}&searchKey=${searchKey}&month=${month}&year=${year}`
      );
    }

    if (filterQuery.price.length > 0) {
      query += `&price=${filterQuery.price.join(",")}`;
    }

    if (filterQuery.duration.length > 0) {
      query += `&duration=${filterQuery.duration.join(",")}`;
    }

    if (filterQuery.cities.length > 0) {
      query += `&cities=${filterQuery.cities.join(",")}`;
    }

    if (filterQuery.travelStyle.length > 0) {
      query += `&style=${filterQuery.travelStyle.join(",")}`;
    }

    if (types) {
      query += `&types=${types}`;
    }

    setFilterString(query);
  }, [filterQuery, types]);

  const getPackages = async () => {
    setPageStep(LISTING_STEP.LOADING);
    setFilterDisable(true);
    try {
      let url = "";
      if (categories) {
        url = `${API_URL}/api/travelPackages/search?categories=${categories}&searchKey=${searchKey}`;
      } else {
        const query = month && year ? `&month=${month}&year=${year}` : "";
        url = `${API_URL}/api/travelPackages/search?searchValue=${searchValue}&searchKey=${searchKey}${query}${filterString}`;
      }
      const data = await fetchDataWithAuth(url, "GET");

      if (data.Error || data.error) {
        setErrorMessage(data.Error || data.error);
        setPageStep(LISTING_STEP.FAILED);
      } else {
        setPageStep(LISTING_STEP.LOADED);
        setTravelPackages(data.search_result);
        setFilterSet(data.filter_set);
      }
    } catch (err) {
      setErrorMessage(`Something went wrong! Please try again later.`);
      console.error(`Something went wrong! Error: ${JSON.stringify(err)}`);
      setPageStep(LISTING_STEP.FAILED);
    } finally {
      setFilterDisable(false);
    }
  };

  const handleSortingValue = (e) => {
    setPageStep(LISTING_STEP.LOADING);
    setSortingValue(e.value);
    let sorted = travelPackages;
    if (e.value === "priceAscending") {
      sorted.sort((a, b) => a.start_price - b.start_price);
    } else if (e.value === "priceDescending") {
      sorted.sort((a, b) => b.start_price - a.start_price);
    } else {
      sorted.sort((a, b) => a.start_price - b.start_price);
    }
    setTravelPackages(sorted);
    setPageStep(LISTING_STEP.LOADED);
  };

  let content = null;
  switch (pageStep) {
    case LISTING_STEP.LOADING:
      content = (
        <Col lg={9} className="hid-sm">
          {[1, 2, 3].map((i) => (
            <PackageCards.Loading key={i} />
          ))}
        </Col>
      );
      break;
    case LISTING_STEP.LOADED:
      content = (
        <>
          <Col lg={9} className="hid-sm">
            <Row>
              <>
                <PackageCards
                  packages={travelPackages}
                  sliced={travelPackages.slice(0, 10)}
                  searchQuery={{ searchValue, searchKey, month, year }}
                />
              </>
            </Row>
          </Col>
          {isMobile ? (
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
          ) : null}
        </>
      );
      break;

    case LISTING_STEP.FAILED:
    default:
      content = (
        <div>
          <div>Something went wrong! </div>
          <p>{errorMessage}</p>
        </div>
      );
      break;
  }

  const categoryOptions =
    filterSet?.types !== undefined
      ? filterSet.types.map((item) => {
          return {
            value: item,
            label: item,
          };
        })
      : null;

  return (
    <PageLayout title="2hub | Trips">
      <Card
        className={`d-md-none bg-info text-white rounded-0 mb-3 sticky-search ${
          showSearch ? "d-none" : "d-block"
        }`}
      >
        <Card.Body className="d-flex justify-content-between align-items-center py-2">
          <p className="mb-0 text-xs">
            <span>{searchValue}</span>
            <BsDot />
            <span>
              {month} {year}
            </span>
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
        className={`my-md-5 bg-info pt-md-4 mb-4 sticky-search ${
          !showSearch ? "d-none" : "d-block"
        } d-lg-block`}
        style={{ top: "-10px" }}
      >
        <Container className="pb-3">
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
              <TravelSearch
                travelPackageData={{
                  searchValue: searchValue || "",
                  searchKey: searchKey || "",
                  month: month || "",
                  year: year || "",
                }}
                onTravelPackageSearch={({
                  searchValue,
                  searchKey,
                  month,
                  year,
                  slug,
                }) => {
                  {
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
                  }
                }}
              />
            </Col>
          </Row>
        </Container>
      </section>
      <Container className="mb-5 mb-lg-7">
        <Row>
          <Col md={{ span: 4, offset: 3 }}>
            <div className="d-flex">
              <p className="text-right mt-2 mr-2">Type:</p>
              <SelectField.WithoutFormik
                options={categoryOptions}
                isSearchable="false"
                formGroupClassName="flex-fill"
                onOptionChanged={(options) => setTypes(options.value)}
              />
            </div>
          </Col>
          <Col md={{ span: 4, offset: 1 }}>
            <div className="d-flex">
              <p className="text-right mt-2 mr-2">Sort By:</p>
              <SelectField.WithoutFormik
                value={sortingOptions.find((obj) => obj.value === sortingValue)}
                options={sortingOptions}
                isSearchable="false"
                formGroupClassName="flex-fill"
                onOptionChanged={handleSortingValue}
              />
            </div>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3} className="d-none d-lg-block">
            <TravelSearchFilter
              filterSet={filterSet}
              filterDisable={filterDisable}
              departureMonth={`${month} ${year}`}
              onFilterClose={() => {}}
              onFilterChange={(filter) => setFilterQuery(filter)}
            />
          </Col>
          {content}
        </Row>
      </Container>
      <Footer />
      <ModalComponent
        show={showFilterOptions}
        scrollable={true}
        body={
          <TravelSearchFilter
            filterSet={filterSet}
            filterDisable={filterDisable}
            departureMonth={`${month} ${year}`}
            onFilterClose={() => setShowFilterOptions(false)}
            onFilterChange={(filter) => setFilterQuery(filter)}
          />
        }
        footer={
          <Button block onClick={() => setShowFilterOptions(false)}>
            Apply
          </Button>
        }
      />
    </PageLayout>
  );
};

export const getServerSideProps = async (context) => {
  const { searchValue, searchKey, month, year, categories } = context.query;

  return {
    props: {
      selectedSearchValue: searchValue || "",
      selectedSearchKey: searchKey || "",
      selectedMonth: month || "",
      selectedYear: year || "",
      categories: categories || "",
    },
  };
};

export default withAuth(Trips);
