import React,{ useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import parse from 'urlencoded-body-parser';
import { fetchFormDataWithAuth } from "../../utils/apiHelper";
const API_URL = process.env.global_url;

const PaymentFailure= () => {
  return (
    <div className="text-center">
      {/* <FaHeart color="#ff0000" size="2.5rem" className="mb-3" /> */}
      <h2 className="font-weight-bold">Success</h2>
      <p className="lead"></p>
    </div>
  );
};

// PaymentFailure.getInitialProps = async(context) => {
// 	let data = "";
// 	if (context.req.method === "POST") {
// 		data = await parse(context.req);
// 		console.log("request data: ", data);
// 	}
// 	return {data};
// }

export default PaymentFailure;