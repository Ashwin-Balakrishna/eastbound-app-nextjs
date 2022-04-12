import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "react-bootstrap";
import parse from 'urlencoded-body-parser';
import { fetchFormDataWithAuth } from "../../utils/apiHelper";
import { reloadPageWithUrl } from "../../utils/helper";
import router from "next/router";
const API_URL = process.env.global_url;

const PaymentCancel = ({data}) => {
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
      }
    } catch (err) {
      console.error(`Something went wrong! Error: ${JSON.stringify(err)}`);
    }
	}
	function goBack(){
		for(let i =0 ;i< 2;i++)
		router.back();
	}
	if(response !== null) {
		if(response.msg !== undefined) {
			return(
				<section className="mt-5">
					<div className="container pt-5">
						<div className="row justify-content-center">
							<div className="col-12 col-md-6">
								<h3 className="text-center">{response.msg}</h3>
								<p className="lead text-center">{response.title}</p>
								<div className="text-center">
									<Button variant="link" onClick={() => goBack()}>Go Back</Button>
								</div>
							</div>
						</div>
					</div>
				</section>
			)
		}
		else {
			return(
				<section className="mt-5">
					<div className="container pt-5">
						<div className="row justify-content-center">
							<div className="col-12 col-md-6">
							<p className="lead text-center">Your payment is cancelled successfully</p>
							<div className="text-center">
								<Button variant="link" onClick={() => goBack()}>Go Back</Button>
							</div>
						</div>
					</div>
				</div>
			</section>
		)}
  }
  else {
    return null;
  }
};

PaymentCancel.getInitialProps = async(context) => {
	let data = "";
	if (context.req.method === "POST") {
		data = await parse(context.req);
	}
	return {data};
}

export default PaymentCancel;
