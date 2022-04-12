import React,{ useState, useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import parse from 'urlencoded-body-parser';
import { fetchFormDataWithAuth } from "../utils/apiHelper";
const API_URL = process.env.global_url;

const PaymentSuccess = ({data}) => {
  const [response, setResponse] = useState(null);
	useEffect(() => {
		checkoutCallback(data);
	},[])
	const checkoutCallback = async(data) => {
    try {
      const resp = await fetchFormDataWithAuth(
        `${API_URL}/api/agent/payment/encResp/nonCreditProvisionalBooking/`,
        "POST",
        null,
        null,
        JSON.stringify({
					encResp: data.encResp,
					orderNo: data.orderNo
				})
      );
      if (resp.Error) {
				console.log("error");
      } else {
        setResponse(resp);
        console.log("responseeee", resp);
      }
    } catch (err) {
      console.error(`Something went wrong! Error: ${JSON.stringify(err)}`);
    }
	}

    if(response !== null) {
      return(
        <section className="mt-5">
        <div className="container pt-5">
          <div className="row justify-content-center">
            <div className="col-12 col-md-6">
              <div className="text-center">
                <FaCheckCircle color="#218838" size="2.5rem" className="mb-3" />
              </div>
              <h3 className="text-center">Thank You</h3>
              <p className="lead text-center">Your payment is successfull!</p>
              <table className="table table-striped">
                <tr>
                  <td><strong>Tracking Id:</strong></td>
                  <td>
                    {response.tracking_id}
                  </td>
                </tr>
                <tr>
                  <td><strong>Bank Ref Number:</strong></td>
                  <td>{response.bank_ref_no}</td>
                </tr>
                <tr>
                  <td><strong>Order Id:</strong></td>
                  <td>{response.order_id}</td>
                </tr>
                <tr>
                  <td><strong>Amount:</strong></td>
                  <td>{response.amount}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </section>
      )
    }
    else {
      return null;
    }
};

PaymentSuccess.getInitialProps = async(context) => {
	let data = "";
	if (context.req.method === "POST") {
		data = await parse(context.req);
		console.log("request data: ", data);
	}
	return {data};
}

export default PaymentSuccess;
