import { useState, useEffect } from "react";
import Link from "next/dist/client/link";
import { AiFillStar } from "react-icons/ai";

// Remove the last 2

const prices = [
  { id: 1, label: "< ₹5,000", count: 500, value: [1, 5000], checked: false },
  {
    id: 2,
    label: "₹5,000 - ₹10,000",
    count: 500,
    value: [5000, 10001],
    checked: false,
  },
  {
    id: 3,
    label: "₹10,000 - ₹20,000",
    count: 500,
    value: [10000, 20001],
    checked: false,
  },
  {
    id: 4,
    label: "> ₹20,000",
    count: 500,
    value: [20001, 20000000],
    checked: false,
  },
];

const starRating = [
  {
    id: 6,
    label: (
      <>
        {" "}
        <span>0, 1</span> <span style={{ color: "#f2bd0d" }}>★</span>
      </>
    ),
    value: 1,
    count: 10,
    checked: false,
  },
  {
    id: 7,
    label: (
      <>
        2 <span style={{ color: "#f2bd0d" }}>★★</span>
      </>
    ),
    value: 2,
    count: 10,
    checked: false,
  },
  {
    id: 8,
    label: (
      <>
        3 <span style={{ color: "#f2bd0d" }}>★★★</span>
      </>
    ),
    value: 3,
    count: 10,
    checked: false,
  },
  {
    id: 9,
    label: (
      <>
        4 <span style={{ color: "#f2bd0d" }}>★★★★</span>
      </>
    ),
    value: 4,
    count: 10,
    checked: false,
  },
  {
    id: 10,
    label: (
      <>
        5 <span style={{ color: "#f2bd0d" }}>★★★★★</span>
      </>
    ),
    value: 5,
    count: 10,
    checked: false,
  },
];

const brand = [
  { id: 11, label: "ITC Hotels", value: "ITC", count: 10, checked: false },
  {
    id: 12,
    label: "Marriott International Hotels",
    value: "Marriott",
    count: 10,
    checked: false,
  },
  { id: 13, label: "OYO", value: "OYO", count: 10, checked: false },
  {
    id: 14,
    label: "ROTANA HOTELS",
    value: "ROTANA HOTELS",
    count: 10,
    checked: false,
  },
  {
    id: 15,
    label: "MINOR INTERNATIONAL GROUP",
    value: "MINOR INTERNATIONAL GROUP",
    count: 10,
    checked: false,
  },
];

const amenities = [
  {
    id: 49,
    label: "Room service",
    value: "Room service",
    count: 10,
    checked: false,
  },
  //{ id: 50, label: "Conference Room", value: "Conference Room", count: 10, checked: false },
  {
    id: 51,
    label: "Restaurant",
    value: "Restaurant",
    count: 10,
    checked: false,
  },
  {
    id: 52,
    label: "Parking Facility",
    value: "Parking Facility",
    count: 10,
    checked: false,
  },
  { id: 53, label: "Wi-Fi", value: "Wi-fi", count: 10, checked: false },
  //{ id: 54, label: "Swimming Pool", value: "Swimming Pool", count: 10, checked: false },
  // { id: 55, label: "Air Conditioning", value: "Air Conditioning", count: 10, checked: false },
  // { id: 56, label: "Travel Assistance", value: "Travel Assistance", count: 10, checked: false },
  // { id: 57, label: "Concierge Service", value: "Concierge Service", count: 10, checked: false },
  // { id: 58, label: "Doctor on call", value: "Doctor on call", count: 10, checked: false },
  { id: 59, label: "Bar", value: "Bar", count: 10, checked: false },
  {
    id: 60,
    label: "Laundry service",
    value: "Laundry service",
    count: 10,
    checked: false,
  },
  // { id: 61, label: "Smoking Rooms available", value: "Smoking Rooms available", count: 10, checked: false },
  // { id: 62, label: "Indoor Entertainment", value: "Indoor Entertainment", count: 10, checked: false },
  // { id: 63, label: "Wheelchair", value: "Wheelchair-accessible", count: 10, checked: false },
  // { id: 64, label: "Free internet", value: "Free internet", count: 10, checked: false },
  //  { id: 65, label: "24x7 Check-in Check-out", value: "24x7 Check-in Check-out", count: 10, checked: false },
];

const property = [
  { id: 23, label: "Hotels", value: "Hotel", count: 10, checked: false },
  {
    id: 24,
    label: "Apartments",
    value: "Apartment",
    count: 10,
    checked: false,
  },
  {
    id: 25,
    label: "Guest House",
    value: "Guest House",
    count: 10,
    checked: false,
  },
  { id: 26, label: "Private Villa", value: "Villa", count: 10, checked: false },
  { id: 27, label: "Resorts", value: "Resort", count: 10, checked: false },
  {
    id: 28,
    label: "Holiday Homes",
    value: "Holiday home",
    count: 10,
    checked: false,
  },
  { id: 29, label: "Farm Stay", value: "Farm Stay", count: 10, checked: false },
];

const userRating = [
  { id: 30, label: "1", value: 1, count: 10, checked: false },
  { id: 31, label: "2", value: 2, count: 10, checked: false },
  { id: 32, label: "3", value: 3, count: 10, checked: false },
  { id: 33, label: "4", value: 4, count: 10, checked: false },
  { id: 34, label: "5", value: 5, count: 10, checked: false },
];

const HotelFilter = ({
  setCheckboxFilters,
  setCallhotel,
  setData,
  setFilterStatus,
  clearAllFunc,
}) => {
  const [cost, setCost] = useState(prices);

  const [star, setStar] = useState(starRating);

  const [rating, setRating] = useState(userRating);

  const [facilities, setFacilities] = useState(amenities);

  const [chains, setChains] = useState(brand);

  const [propertyTypes, setPropertyTypes] = useState(property);

  const [neighbourhood, setNeighbourhood] = useState([]);
  const [meals, setMeals] = useState([]);
  const [cp, setCp] = useState([]);

  const [filters, setFilters] = useState({
    cost: [],
    rating: null,
    stars: [],
    facilities: [],
    chains: [],
    propertytypes: [],
  });

  useEffect(() => {
    const co = cost.filter((c) => c.checked).map((c) => c.value);
    const st = star.filter((c) => c.checked).map((c) => c.value);
    const fa = facilities.filter((c) => c.checked).map((c) => c.value);
    const ch = chains.filter((c) => c.checked).map((c) => c.value);
    const pr = propertyTypes.filter((c) => c.checked).map((c) => c.value);
    const ra = rating.filter((c) => c.checked).map((c) => c.value)[0] || null;
    console.log("rating", ra);
    const obj = {
      cost: co,
      stars: st,
      facilities: fa,
      chains: ch,
      propertytypes: pr,
      rating: ra,
    };
    setFilters(obj);
  }, [cost, star, chains, facilities, propertyTypes, rating]);

  useEffect(() => {
    // console.log("filters =>", filters);
    setCheckboxFilters((prev) => ({
      updated: true,
      ...filters,
    }));
    // setData([])
  }, [filters]);
  const setUpdatedData = (setState, params) => {
    const { idx, key, value, override } = params;

    setState((prevState) => {
      const prev = [...prevState];
      const temp = { ...prev[idx] };
      if (override != undefined) {
        prev.forEach((a) => {
          a.checked = override;
        });
      }
      temp[key] = value;
      prev[idx] = temp;
      return prev;
    });
  };

  const updateFilterData = (state, idx, key, value, override) => {
    const params = { idx, key, value: value, override };
    if (state === "cost") {
      setUpdatedData(setCost, params);
    } else if (state === "star") {
      console.log("star state updation");
      setUpdatedData(setStar, params);
    } else if (state === "chains") {
      setUpdatedData(setChains, params);
    } else if (state === "facilities") {
      setUpdatedData(setFacilities, params);
    } else if (state === "propertyTypes") {
      setUpdatedData(setPropertyTypes, params);
    } else if (state === "rating") {
      setUpdatedData(setRating, params);
    }
  };

  const clearAll = () => {
    setFilterStatus(false);
    setCheckboxFilters({ updated: false });
    // setData([]);

    setCost(prices);

    setStar(starRating);

    setRating(userRating);

    setFacilities(amenities);

    setChains(brand);

    setPropertyTypes(property);
  };

  useEffect(() => {
    clearAll();
    console.log("Clear All Calling");
  }, [clearAllFunc]);

  return (
    <div className="filter__wrapper">
      <div className="filter__header">
        <h6
          onClick={() => {
            setFilterStatus(false);
          }}
        >
          {" "}
          <span className="m_arrow">
            <img src="/images/leftarrowindication.png" />
          </span>
          Filters
        </h6>
        <a
          onClick={() => {
            setFilterStatus(false);
            setCheckboxFilters({ updated: false });
            // setData([]);

            setCost(prices);

            setStar(starRating);

            setRating(userRating);

            setFacilities(amenities);

            setChains(brand);

            setPropertyTypes(property);
          }}
        >
          { 
            (filters.cost.length>0 || filters.rating || filters.stars.length>0 || filters.facilities.length>0)
          && <>
              <span style={{ fontWeight: 400 }}>Clear all</span>
          </>           
          }
        </a>
      </div>
      <div className="filter__body" style={{ background: "none" }}>
        {/* Price Range */}
        <div className="filter__card">
          <h4>Price Range</h4>
          {cost.map((price, idx) => {
            return (
              <div key={idx} className="filter__checkboxwrapper">
                <div className="custom-checkbox">
                  <input
                    type="checkbox"
                    name="price"
                    checked={price.checked}
                    id={price.id}
                    onClick={(e) => {
                      updateFilterData(
                        "cost",
                        idx,
                        "checked",
                        e.currentTarget.checked,
                        false
                      );

                      // setCost((prev) => {
                      //   return prev.map(data => {
                      //     if(data.id === price.id){
                      //       return {
                      //         ...data,
                      //         checked: !price.checked
                      //       }
                      //     }
                      //     return data
                      //   })
                      // })
                    }}
                  />
                  <label htmlFor={price.id}> {price.label}</label>
                </div>
                {/* <span>{price.count}</span> */}
              </div>
            );
          })}
        </div>

        {/* Star Category */}
        <div className="filter__card">
          <h4>Star Category</h4>
          {star.map((stars, idx) => {
            return (
              <div className="filter__checkboxwrapper">
                <div className="custom-checkbox">
                  <input
                    type="checkbox"
                    checked={stars.checked}
                    id={stars.id}
                    onClick={(e) => {
                      updateFilterData("star", idx, "checked", !stars.checked);

                      // setStar((prev) => {
                      //   return prev.map(data => {
                      //     if(data.id === stars.id){
                      //       return {
                      //         ...data,
                      //         checked: !stars.checked
                      //       }
                      //     }
                      //     return data
                      //   })
                      // })
                    }}
                  />
                  <label htmlFor={stars.id}> {stars.label}</label>
                </div>
                {/* <span>{stars.count}</span> */}
              </div>
            );
          })}
        </div>

        {/* Neighbourhood */}
        {/* <div className="filter__card">
          <h4>Neighbourhood</h4>
          
          <div className="filter__checkboxwrapper">
            <div className="custom-checkbox">
              <input type="checkbox" id="nghood1" />
              <label htmlFor="nghood1">Kalyan Nagar</label>
            </div>
            <span>500</span>
          </div>


          <div className="filter__checkboxwrapper">
            <div className="custom-checkbox">
              <input type="checkbox" id="nghood2" />
              <label htmlFor="nghood2">MG Road</label>
            </div>
            <span>500</span>
          </div>
          <div className="filter__checkboxwrapper">
            <div className="custom-checkbox">
              <input type="checkbox" id="nghood3" />
              <label htmlFor="nghood3">Silk Board</label>
            </div>
            <span>500</span>
          </div>
        </div> */}

        {/* Meals */}
        {/* <div className="filter__card"> */}
        {/* <h4>Meals</h4>
          <div className="filter__checkboxwrapper">
            <div className="custom-checkbox">
              <input type="checkbox" id="meals1" />
              <label htmlFor="meals1">Breakfast included</label>
            </div> */}
        {/* <span>500</span> */}
        {/* </div>
          <div className="filter__checkboxwrapper">
            <div className="custom-checkbox">
              <input type="checkbox" id="meals2" />
              <label htmlFor="meals2">All meals included</label>
            </div> */}
        {/* <span>500</span> */}
        {/* </div>
          <div className="filter__checkboxwrapper">
            <div className="custom-checkbox">
              <input type="checkbox" id="meals3" />
              <label htmlFor="meals3">No prepayment</label>
            </div> */}
        {/* <span>500</span> */}
        {/* </div>
        </div> */}

        {/* cancellation Policy */}
        {/* <div className="filter__card">
          <h4>Cancellation policy</h4>
          <div className="filter__checkboxwrapper">
            <div className="custom-checkbox">
              <input type="checkbox" id="cancel1" />
              <label htmlFor="cancel1">Free cancellation</label>
            </div>
            <span>500</span>
          </div>
          <div className="filter__checkboxwrapper">
            <div className="custom-checkbox">
              <input type="checkbox" id="cancel2" />
              <label htmlFor="cancel2">Book without credit card</label>
            </div>
            <span>500</span>
          </div>
          <div className="filter__checkboxwrapper">
            <div className="custom-checkbox">
              <input type="checkbox" id="cancel3" />
              <label htmlFor="cancel3">No prepayment</label>
            </div>
            <span>500</span>
          </div>
        </div> */}

        {/* Chains */}
        {/* <div className="filter__card">
          <h4>Chains</h4>
          {chains.map((brand, idx) => {
            return (
              <div className="filter__checkboxwrapper">
                <div className="custom-checkbox">
                  <input
                    type="checkbox"
                    checked={brand.checked}
                    id={brand.id}
                    onClick={(e) => {
                      updateFilterData("chains", idx, "checked", !brand.checked);

                      //   setChains((prev) => {
                      //     return prev.map(data => {
                      //       if(data.id === brand.id){
                      //         return {
                      //           ...data,
                      //           checked: !brand.checked
                      //         }
                      //       }
                      //       return data
                      //     })
                      //   })
                    }}
                  />
                  <label htmlFor={brand.id}> {brand.label}</label>
                </div>
                // <span>{brand.count}</span> 
              </div>
            );
          })}
        </div> */}

        {/* Amenities */}
        <div className="filter__card">
          <h4>Amenities</h4>
          {facilities.map((amenities, idx) => {
            return (
              <div className="filter__checkboxwrapper">
                <div className="custom-checkbox">
                  <input
                    type="checkbox"
                    checked={amenities.checked}
                    id={amenities.id}
                    onClick={(e) => {
                      updateFilterData(
                        "facilities",
                        idx,
                        "checked",
                        !amenities.checked
                      );
                    }}
                  />
                  <label htmlFor={amenities.id}> {amenities.label}</label>
                </div>
                {/* <span>{amenities.count}</span> */}
              </div>
            );
          })}
        </div>

        {/* property type */}
        {/* <div className="filter__card">
          <h4>Property type</h4>
          {propertyTypes.map((property, idx) => {
            return (
              <div className="filter__checkboxwrapper">
                <div className="custom-checkbox">
                  <input
                    type="checkbox"
                    checked={property.checked}
                    id={property.id}
                    onClick={(e) => {
                      updateFilterData("propertyTypes", idx, "checked", !property.checked);

                   
                    }}
                  />
                  <label htmlFor={property.id}> {property.label}</label>
                </div>
                
              </div>
            );
          })}
        </div> */}

        {/* User Rating */}
        <div className="filter__card">
          <h4>User Rating</h4>

          {rating.map((rate, idx) => {
            return (
              <div className="filter__checkboxwrapper">
                <div className="custom-checkbox">
                  <input
                    type="checkbox"
                    checked={rate.checked}
                    id={rate.id}
                    onClick={(e) => {
                      updateFilterData(
                        "rating",
                        idx,
                        "checked",
                        e.currentTarget.checked,
                        false
                      );
                    }}
                  />
                  <label htmlFor={rate.id}>
                    <span
                      className={
                        rate.value < 2
                          ? "rating bad"
                          : rate.value > 1 && rate.value < 4
                          ? "rating avg"
                          : "rating good"
                      }
                    >
                      {rate.label}
                    </span>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
        {/* <div className="filter__card">
          <h4>Health & safety</h4>
          <div className="filter__checkboxwrapper">
            <div className="custom-checkbox">
              <input type="checkbox" id="health1" />
              <label htmlFor="health1">Properties that take health & safety measures</label>
            </div>
            <span>500</span>
          </div>
        </div> */}
        <div className="filter__card">
          {/* <h4>Sustainability</h4>
          <div className="filter__checkboxwrapper">
            <div className="custom-checkbox">
              <input type="checkbox" id="sybs1" />
              <label htmlFor="sybs1">Travel Sustainable properties</label>
            </div>
            <span>500</span>
          </div> */}

          <button
            className="btn btn__primary apply_filter"
            onClick={(e) => {
              setFilterStatus(false);
            }}
          >
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelFilter;
