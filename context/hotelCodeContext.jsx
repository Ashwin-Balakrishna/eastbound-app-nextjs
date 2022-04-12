import { createContext, useContext, useState } from "react";

const HotelCodeContext = createContext();

const HotelState = (page) => {
  const HOTEL_STEP = {
    HOTEL_DETAIL: "hotel_detail",
    HOTEL_BOOKING: "hotel_booking",
    HOTEL_THANKYOU: "hotel_thankyou",
    DEFAULT: "default",
  };

  const step =
    page.toLowerCase() === "booking"
      ? HOTEL_STEP.HOTEL_BOOKING
      : HOTEL_STEP.HOTEL_DETAIL;

  const [hotelStep, setHotelStep] = useState(step);
  const [room, setRoom] = useState({});
  const [roomPlan, setRoomPlan] = useState({});
  const [priceStructure, setPriceStructure] = useState({});

  const updateHotelStep = (step) => {
    setHotelStep(step);
  };

  const calculatePriceStructure = (pureAgent) => {
    const roomPrice = pureAgent ? roomPlan.pure_agent_net : roomPlan.net;
    const commissionCharges = roomPlan.net * roomPlan.commission * 0.01;
    const taxAndServices = pureAgent
      ? commissionCharges * roomPlan.tax * 0.01
      : (roomPrice + commissionCharges) * roomPlan.tax * 0.01;

    const totalAmount =
      parseFloat(parseFloat(roomPrice).toFixed(0)) +
      parseFloat(parseFloat(commissionCharges).toFixed(0)) +
      parseFloat(parseFloat(taxAndServices).toFixed(0));

    return setPriceStructure({
      pureAgent,
      basePrice: roomPrice,
      commissionCharges,
      tax: roomPlan.tax,
      taxAndServices,
      totalAmount,
    });
  };

  return {
    HOTEL_STEP,
    hotelStep,
    updateHotelStep,
    room,
    setRoom,
    roomPlan,
    setRoomPlan,
    priceStructure,
    calculatePriceStructure,
  };
};

export const useHotelState = () => {
  return useContext(HotelCodeContext);
};

export const HotelCodeProvider = ({ children, page }) => {
  const hotel = HotelState(page);
  return (
    <HotelCodeContext.Provider value={hotel}>
      {children}
    </HotelCodeContext.Provider>
  );
};
