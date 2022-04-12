import { Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
const API_URL = process.env.global_url;
import { fetchFormDataWithAuth } from "../../../utils/apiHelper";

const Payments = ({ payments }) => {

  const paginationOptions = {
    rowsPerPageText: "Items per page",
    rangeSeparatorText: "of",
  };
  
  const columns = [
    {
      name: "DETAILS",
      selector: "payment_detail",
      cell: (payments) => (
        <div
          style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}
          className="py-3"
        >
          {payments.payment_detail}
        </div>
      ),
      grow: 3,
    },
    {
      name: "AMOUNT",
      selector: "payment_amount",
      cell: (payments) => (
        <div>&#x20B9; {Math.trunc(payments.payment_amount)}</div>
      ),
    },
    {
      name: "DUE DATE",
      selector: "payment_due_date",
      cell: (payments) => (
        <div>
          {new Date(payments.payment_due_date)
            .toLocaleDateString("en-GB")
            .split("/")
            .join("-")}
        </div>
      ),
    },
    {
      name: "PAYMENT LINK",
      cell: (payments) => (
        <Button variant="link" className="text-success" size="sm" onClick={() => handlePayment(payments.booking_id, payments.payment_id)}>
          Pay Now
        </Button>
      ),
    },
  ];

  const handlePayment = async(paymentBookingId, paymentId) => {
    const payload = JSON.stringify({
      "booking_id": paymentBookingId,
      "payment_id": paymentId,
      "redirect_url":`${API_URL}/payment/success`,
      "cancel_url": `${API_URL}/payment/cancel`
    });
    try {
      const resp = await fetchFormDataWithAuth(
        `${API_URL}/api/agent/payment/checkout`,
        "POST",
        null,
        null,
        payload
      );
      if (resp.Error) {
      } else {
        location.href=`${resp.redirect_url}`;
      }
    } catch (err) {
      console.error(`Something went wrong! Error: ${JSON.stringify(err)}`);
    }
  }

  return (
		<>
			<DataTable
				noHeader={true}
				columns={columns}
				data={payments}
				pagination
				paginationComponentOptions={paginationOptions}
			/> 
		</>
  );
};

export default Payments;
