const { Form, Formik } = require("formik");
const { Row, Button, Col, Badge } = require("react-bootstrap");
import AsyncSelect from "../../elements/asyncSelect";
import { fetchFormDataWithAuth } from "../../../utils/apiHelper";
import { components } from "react-select";
import SelectField from "../../elements/selectField";
import moment from "moment";
import * as Yup from "yup";

const searchSchema = Yup.object({
  searchKey: Yup.string(),
  searchValue: Yup.string().required("Please select a destination"),
  travelMonth: Yup.string().when("searchKey", {
    is: (val) => val === "destination" || val === "city",
    then: Yup.string().required(`Please select when you want to travel`),
    otherwise: Yup.string().notRequired(),
  }),
});

const CustomOption = (props) => {
  const { data } = props;
  return (
    <components.Option
      {...props}
      className="d-flex justify-content-between align-items-center"
    >
      <div>{data.label}</div>
      <Badge variant="primary" className="text-capitalize">
        {data.type}
      </Badge>
    </components.Option>
  );
};

const getDestinationNameOptions = async (inputValue) => {
  const data = await fetchFormDataWithAuth(
    `${process.env.global_url}/api/travelPackages/searchBar?searchTerm=${inputValue}`,
    "GET"
  );

  const city_results = data.city_results.map((result) => {
    return {
      label: result.name,
      value: result.name,
      type: "city",
      slug: result.name_slug,
    };
  });

  const result = data.result.map((result) => {
    return {
      label: result.name,
      value: result.name,
      type: "trip",
      slug: result.name_slug,
    };
  });

  const dest_result = data.dest_result.map((result) => {
    return {
      label: result.name,
      value: result.name,
      type: "destination",
      slug: result.name_slug,
    };
  });

  return [...dest_result, ...city_results, ...result];
};

const travelMonths = () => {
  const result = [];

  for (let i = 0; i < 12; i++) {
    const today = moment();
    const nextDate = today.add(i, "month");
    const month = nextDate.format("MMM");
    const year = nextDate.format("YYYY");
    result.push({
      label: `${month} ${year}`,
      value: `${month},${year}`,
    });
  }
  return result;
};

const getInitialDestinationNameOption = (travelPackageData) => {
  if (!travelPackageData) return "";
  return [
    {
      label: travelPackageData.searchValue,
      value: travelPackageData.searchValue,
      type: travelPackageData.searchKey,
    },
  ];
};

const TravelSearch = ({ onTravelPackageSearch, travelPackageData }) => {
  const initialDestinationNameOption = getInitialDestinationNameOption(
    travelPackageData
  );

  return (
    <Formik
      key="travel_search_key"
      enableReinitialize={true}
      validationSchema={searchSchema}
      onSubmit={(data) => {
        const [month, year] = data.travelMonth.split(",");

        onTravelPackageSearch({
          searchValue: data.searchValue,
          searchKey: data.searchKey,
          month: month,
          year: year,
          slug: data.slug,
        });
      }}
      initialValues={{
        searchValue: travelPackageData?.searchValue,
        searchKey: travelPackageData?.searchKey,
        travelMonth:
          travelPackageData && travelPackageData.month && travelPackageData.year
            ? `${travelPackageData.month},${travelPackageData.year}`
            : "",
        slug: travelPackageData?.slug,
      }}
    >
      {({ handleSubmit, values, setFieldValue }) => (
        <Form className="position-relative" onSubmit={handleSubmit}>
          <Row className="px-2">
            <Col xs={12} md={5} className="px-1">
              <AsyncSelect
                label=""
                id="destinationSearch"
                formGroupClassName="mb-md-0"
                name="searchValue"
                classNamePrefix="search"
                placeholder="Where would you like to go"
                value={values.searchValue}
                components={{ Option: CustomOption }}
                defaultOptions={initialDestinationNameOption}
                loadOptions={getDestinationNameOptions}
                onOptionChanged={(option) => {
                  setFieldValue("searchKey", option.type);
                  setFieldValue("slug", option.slug);
                }}
              />
            </Col>
            <Col xs={12} md={4} className="px-1">
              <SelectField
                id="travel-month"
                classNamePrefix="search"
                placeholder="When"
                name={"travelMonth"}
                formGroupClassName="mb-md-0"
                value={values.travelMonth}
                options={travelMonths()}
              />
            </Col>
            <Col xs={12} md={3} className="px-1">
              <Button variant="primary" type="submit" size="lg" block>
                Search
              </Button>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default TravelSearch;
