import { Button, Card, Table } from "react-bootstrap";
import ErrorText from "../../elements/errorText";
import { getCurrency } from "../../../utils/helper";
import Styles from "./paymentCard.module.scss";
import { useHotelState } from "../../../context/hotelCodeContext";

const PaymentCard = ({ contracted, onClick, onBookNow, errorMessage, getGuestList }) => {
  const { priceStructure } = useHotelState();
  const {
    pureAgent,
    basePrice,
    commissionCharges,
    taxAndServices,
    tax,
    totalAmount,
  } = priceStructure;

  if (!totalAmount || pureAgent === null) return null;
  return (
    <Card
      className={`border-0 custom-shadow sticky-card ${Styles.noShadow}`}
      style={{ top: "10px" }}
    >
      <Card.Body className="p-0 p-md-3">
        <Table className="mb-4">
          <tbody>
            <tr>
              <td className="border-top-0">
                <p className="text-md font-weight-bold text-muted mb-1">
                  Base Price
                </p>
                <p className="text-xs text-muted mb-1">{getGuestList}</p>
              </td>
              <td className="border-top-0 text-right">
                <p className="text-md text-muted mb-1">
                  {getCurrency(basePrice, { maximumFractionDigits: 2 })}
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <span className="text-md text-muted">Price after discount</span>
              </td>
              <td className="text-right">
                <p className="text-md mb-0 text-muted">
                  {getCurrency(basePrice, { maximumFractionDigits: 2 })}
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <span className="text-md text-muted">Other charges</span>
              </td>
              <td className="text-right">
                <p className="text-md mb-0 text-muted">
                  {getCurrency(commissionCharges, { maximumFractionDigits: 2 })}
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <span className="text-md text-muted ">{`Tax & Services (${tax}% GST)`}</span>
              </td>
              <td className="text-right">
                <p className="text-muted mb-0 text-md">
                  {getCurrency(taxAndServices, { maximumFractionDigits: 2 })}
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <span className="text-md text-muted font-weight-bold">
                  Total Payable
                </span>
              </td>
              <td className="text-right">
                <p className="mb-0 text-primary font-18 font-weight-bold">
                  {getCurrency(totalAmount, { maximumFractionDigits: 2 })}
                </p>
              </td>
            </tr>
          </tbody>
        </Table>

        <Button className="mb-4" block onClick={(e) => onClick(e)}>
          Request Booking
        </Button>
        {contracted == "Hotelbeds" ? (
          <Button 
            className="mb-5 mb-md-0" 
            block 
            onClick={(e) => {
              onClick(e);
              onBookNow();
            }}
          >
            Book Now
          </Button>
        ) : null}
        <ErrorText error={errorMessage} />
      </Card.Body>
    </Card>
  );
};

export default PaymentCard;
