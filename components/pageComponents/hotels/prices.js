export const getNetPrice = (contracted_hotel, room, minRate) => {
  if (contracted_hotel) {
    return room.price?.contracted_price;
  } else {
    return minRate;
  }
};

export const getBasePrice = (netPrice, query_data) => {
  let basePrice = 0;
  query_data.rooms.forEach(() => {
    basePrice += netPrice;
  });

  return parseFloat(basePrice);
};

export const getTaxes = (contracted_hotel, room) => {
  if (contracted_hotel) {
    return room.price?.contracted_gst_applied;
  } else {
    return 0.0;
  }
};
