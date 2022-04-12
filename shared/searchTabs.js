import { MdCardTravel } from "react-icons/md";
import { BiHotel } from "react-icons/bi";
import { urls } from "./urls";

export const tabs = {
  HOTEL: "hotel",
  TRAVEL_PACKAGE: "travelPackage",
};

export const searchTabs = [
  {
    title: "Hotels",
    icon: <BiHotel />,
    disabled: false,
    path: urls.hotels,
    tabName: tabs.HOTEL,
  },
  // {
  //   title: "Travel Packages",
  //   icon: <MdCardTravel />,
  //   disabled: false,
  //   path: urls.travelPackages,
  //   tabName: tabs.TRAVEL_PACKAGE,
  // },
];

export const pathToTabs = (path) => {
  switch (true) {
    case new RegExp(`^${urls.travelPackages}(/.*)?$`).test(path):
      return tabs.TRAVEL_PACKAGE;
    case new RegExp(`^(/.*)?$`).test(path):
    case new RegExp(`^${urls.home}(/.*)?$`).test(path):
    case new RegExp(`^${urls.hotels}(/.*)?$`).test(path):
      return tabs.HOTEL;
    default:
      return;
  }
};
