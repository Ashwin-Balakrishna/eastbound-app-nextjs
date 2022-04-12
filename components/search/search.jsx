import { Card, Tab, Tabs } from "react-bootstrap";
import HotelSearch from "./hotel/hotelSearch";
import { searchTabs, pathToTabs, tabs } from "../../shared/searchTabs";
import TravelSearch from "./travelPackages/travelSearch";
import { useRouter } from "next/router";
import { IconContext } from "react-icons/lib";
import ModalComponent from "../elements/modal";
import { getSessionToken } from "../../utils/helper";
import Login from "../pageComponents/login";
import { useState } from "react";

const Search = ({
  hotelSearchData,
  onHotelSearch,
  onTravelPackageSearch,
  travelPackageData,
}) => {
  const router = useRouter();
  const activeTab = pathToTabs(router.pathname);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const token = getSessionToken();

  const handleOnClick = () => {
    if (!token) {
      setShowLoginModal(true);
    }
  };

  const getContentForCurrentTab = (tab) => {
    let content = null;
    switch (tab) {
      case tabs.HOTEL:
        content = (
          <HotelSearch
            query_data={hotelSearchData}
            onSearch={(data) => onHotelSearch(data)}
          />
        );
        break;
      case tabs.TRAVEL_PACKAGE:
        content = (
          <TravelSearch
            onTravelPackageSearch={(data) => onTravelPackageSearch(data)}
            travelPackageData={travelPackageData}
          />
        );
        break;
    }

    return (
      <Card className="border-0 shadow-sm">
        <Card.Body>{content}</Card.Body>
      </Card>
    );
  };

  return (
    <>
      <Tabs
        activeKey={activeTab}
        onSelect={(tabName) => {
          const tab = searchTabs.filter((t) => t.tabName === tabName);
          router.push(tab[0].path);
        }}
        transition={false}
        className="no-border-bottom"
      >
        {searchTabs.map(({ title, icon, tabName }) => (
          <Tab
            key={tabName}
            eventKey={tabName}
            tabClassName={`px-3 py-2 search-tab ${
              activeTab === tabName
                ? "active-search-tab"
                : "not-active-search-tab"
            }`}
            title={
              <div className="d-flex align-items-center justify-content-center flex-column">
                <IconContext.Provider value={{ className: "search-tab-icon" }}>
                  {icon}
                </IconContext.Provider>
                <div className="text-xs">{title}</div>
              </div>
            }
          >
            <div
              className="search-tab-content position-relative"
              onClick={handleOnClick}
            >
              {getContentForCurrentTab(tabName)}
              {!token && <div className="invisible-wrapper" />}
            </div>
          </Tab>
        ))}
      </Tabs>
      <ModalComponent
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
        bodyClassName="p-5 mb-3"
        body={
          <Login
            loggedIn={() => {
              setShowLoginModal(false);
              router.reload();
            }}
          />
        }
      />
    </>
  );
};

export default Search;
