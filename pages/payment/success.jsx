import React,{ useState, useEffect } from "react";
import Link from "next/link";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import parse from 'urlencoded-body-parser';
import { fetchDataWithAuth, fetchFormDataWithAuth, getBookingFile } from "../../utils/apiHelper";
import { reloadPageWithUrl } from "../../utils/helper";
import { useRouter } from "next/router";
import { FiDownload } from "react-icons/fi";
import ErrorText from "../../components/elements/errorText";
import moment from "moment";
const API_URL = process.env.global_url;

const PaymentSuccess = ({data}) => {
  // console.log(data)
  const [response, setResponse] = useState(null);
  const [documents,setDocuments] = useState({})
  const [gdate,setgdate] = useState('')
  const [invoiceId,setInvoiceId] = useState('')
    const [generated,setGenerated] = useState(true);
    const [loading , setLoading ] =useState(false);
  const [id,setId] = useState('')
  const [downloadErrorMessage, setDownloadErrorMessage] = useState("");
  const router = useRouter();
  const downloadDocument = async (id, type) => {
    try {
      const res = await getBookingFile(id, type);
      const file = await res.blob();
      const url = window.URL.createObjectURL(
        new Blob([file], { type: "application/pdf" })
      );

      const link = document.createElement("a");
      link.href = url;
      // link.setAttribute("download", `${type}_${id}.pdf`);
      link.setAttribute("target", "_blank");

      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
            setDownloadErrorMessage(`Something went wrong! Please try again later.`);
      console.error(`Something went wrong! Error: ${JSON.stringify(err)}`);
    } 
  };
  async function getDocuments (){
    if (id){
      const response = await fetchDataWithAuth(`${API_URL}/api/agent/bookings/documents_listing/${id}/`,"GET",null,{'Content-Type':'application/json'},null);
      setDocuments(response)
      setInvoiceId(response?.invoices?.[0]?.invoice_id);
      setGenerated(response?.invoices?.[0]?.generated)
      setgdate(response?.invoices?.[0]?.generated_date)
    }
  }
  async function getInvoice(){
    setLoading(true)
    try {
        if(id && invoiceId && !generated){
            const response = await fetchDataWithAuth(`${API_URL}/api/dashboard/crm/booking/agentemails/`,"GET",`booking_id=${id}&action=${'Booking Confirmed'}&invoice_id=${invoiceId}`,{},null);
            // console.log(response)
            getDocuments()
        }
        setLoading(false);
    } catch (error) {
        console.log(error)
        setLoading(false);
    } 
}
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
        setId(resp.merchant_param2)
      }
    } catch (err) {
      console.error(`Something went wrong! Error: ${JSON.stringify(err)}`);
    }
	}
  useEffect(() => {
		checkoutCallback(data);
  },[])
  useEffect(()=>{
    getDocuments()
  },[id])
//   console.log(id);
  useEffect(()=>{
    getInvoice()
},[invoiceId,generated,id])
// useEffect(()=>{

// },[gdate])
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
                  <Button variant="link" onClick={() => reloadPageWithUrl(`${API_URL}/profile`)}>Go Back</Button>
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
          <div className="container px-5">
          {/* <div className='text-center m-0 mb-4 p-0'>
                <h6>Please do not refresh the page as Invoice and Vouchers are getting generated.</h6>
            </div> */}
            <div className="row justify-content-center">
              <div className="col-12 col-md-6">
                <div className="text-center">
                {downloadErrorMessage && <ErrorText error={downloadErrorMessage} />}
                  {(response.order_status === "Failure" || !response ||response.error || response['booking response']?.error !== undefined ) ? (
                    <FaTimesCircle color="#ff0000" size="2.5rem" className="mb-3" />
                  ) : (
                    <FaCheckCircle color="#218838" size="2.5rem" className="mb-3" />
                  )}
                </div>
                <h3 className="text-center">{(response.order_status === "Failure" || response['booking response']?.error !== undefined ) ? "Sorry" : "Thank You"}</h3>
                {/* <p className="lead text-center">{response.status_message}</p> */}
                {
                  response['booking response']?.error || !response.status || !response || response.error
                  ?
                  <div className="mt-1">
                    Message : <b>{response['booking response']?.error?response['booking response']?.error?.message:response.message||'Something went wrong'}</b>
                  </div>
                  : 
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
                    <td>&#8377; {response.amount}</td>
                  </tr>
                  
                </table>
                }
                { 
                  id && ( response &&response.order_status !== "Failure" && response['booking response']?.error === undefined ) && (
                    <>
                    <div className="mt-4 row justify-content-center">
                          <div className="col-12 col-md-12 col-lg-12">
                          <h6 className="text-center mb-5">Booking Invoices & Vouchers</h6>
                            <Row className="mb-4">
                              <Col md={6}>
                                <span className="font-weight-bold text-muted">Booking Id:</span>
                                <span className="text-muted">{documents?.booking_id}</span>
                              </Col>
                              <Col md={6}>
                                <span className="float-right">
                                  <span className="font-weight-bold text-muted">Checkin:</span>
                                  <span className="text-muted">{moment(documents?.check_in).format("DD-MM-YYYY")}</span>
                                </span>
                              </Col>
                            </Row>
                            <Row className="mb-4">
                              <Col md={6}>
                                <span className="font-weight-bold text-muted">Hotel Name:</span>
                                <span className="text-muted">{documents?.hotel_name}</span>
                              </Col>
                              <Col md={6}>
                                <span className="float-right">
                                  <span className="font-weight-bold text-muted">Checkout:</span>
                                  <span className="text-muted">{moment(documents?.check_out).format("DD-MM-YYYY")}</span>
                                </span>
                              </Col>
                            </Row>
                            </div>
                            </div>
                            <table className='table'>
                                    <tbody>
                                        {
                                            documents?.vouchers?.map((voucher,i) => (
												<tr key={i}>
													<td align="center">Voucher</td>
													<td align="center">
														{voucher.voucher_no}
													</td>
													<td align="center">
                                                        {/* {
                                                            loading 
                                                            ?
                                                                <Spinner variant='primary' animation='border' size="sm"/>
                                                            :
                                                            !generated && Math.abs(moment(new Date()).diff(moment(gdate),'minute')) < 1
															?
															()=>{
																setLoading(true)
																return (
																	<>
																		{loading && <Spinner variant='primary' animation='border' size="sm" />}
																		{
																			setTimeout(()=>{
																				setLoading(false)
																				return (
																					<Button variant="link" className="p-0" onClick={() => downloadDocument(voucher.voucher_id,"voucher")}>
																						Download
																						<FiDownload className="ml-2" />
																					</Button>
																				)
																			},60000 - moment(new Date()).diff(moment(gdate),'milliseconds'))
																		}
																	</>
																)
															} */}
															{/* : */}
															<Button variant="link" className="p-0" onClick={() => router.push(`/vouchers?id=${voucher.voucher_id}&bid=${id}`)}>
																Download
																<FiDownload className="ml-2" />
															</Button>
                                                        {/* } */}
														
													</td>
												</tr>
											))
                                        }
                                        {
                                            documents?.invoices?.map((invoice,i) => (
                                                <tr key={i}>
                                                    <td align="center">Invoice</td>
                                                    <td align="center">
                                                        {invoice.invoice_no}
                                                    </td>
                                                    <td align="center">
                                                        {
                              //                               loading 
                              //                               ?
                              //                                   <Spinner variant='primary' animation='border' size="sm"/>
                              //                               :
                              //                               !generated && Math.abs(moment(new Date()).diff(moment(gdate),'minute')) < 1
															// ?
															// ()=>{
															// 	setLoading(true)
															// 	return (
															// 		<>
															// 			{loading && <Spinner variant='primary' animation='border' size="sm" />}
															// 			{
															// 				setTimeout(()=>{
															// 					setLoading(false)
															// 					return (
															// 						<Button variant="link" className="p-0" onClick={() => downloadDocument(invoice.invoice_id,"invoice")}>
															// 							Download
															// 							<FiDownload className="ml-2" />
															// 						</Button>
															// 					)
															// 				},60000 - moment(new Date()).diff(moment(gdate),'milliseconds'))
															// 			}
															// 		</>
															// 	)
															// }
															// :
															<Button variant="link" className="p-0" onClick={() => router.push(`/invoices?id=${invoice.invoice_id}&bid=${id}`)}>
																Download
																<FiDownload className="ml-2" />
															</Button>
                                                        }
                                                    </td>
                                                </tr>
                                            ))
                                        }
										{   
                                            documents?.receipts?.map((receipt,i) => (
												<tr key={i}>
													<td align="center">Receipt</td>
													<td align="center">
														{receipt.receipt_no}
													</td>
													<td align="center">
                                                        {
                              //                               loading 
                              //                               ?
                              //                                   <Spinner variant='primary' animation='border' size="sm"/>
                              //                               :
                              //                               moment(gdate)?.diff(moment(new Date()),'minute') < 1
															// ?
															// ()=>{
															// 	setLoading(true)
															// 	return (
															// 		<>
															// 			{loading && <Spinner variant='primary' animation='border' size="sm" />}
															// 			{
															// 				setTimeout(()=>{
															// 					setLoading(false)
															// 					return (
															// 						<Button variant="link" className="p-0" onClick={() => downloadDocument(receipt.receipt_id,"receipt")}>
															// 							Download
															// 							<FiDownload className="ml-2" />
															// 						</Button>
															// 					)
															// 				},60000 - moment(new Date()).diff(moment(gdate),'milliseconds'))
															// 			}
															// 		</>
															// 	)
															// }
															// :
															<Button variant="link" className="p-0" onClick={() => downloadDocument(receipt.receipt_id,"receipt")}>
																Download
																<FiDownload className="ml-2" />
															</Button>
                                                        }
													</td>
												</tr>
											))
                                        }
                                    </tbody>
                                </table>
                      </>
                  )
                }
                <div className="mt-4 mb-3 justify-content-center align-items-center d-flex">
                  <Button className="btn btn-outline-primary" variant="outline-primary" onClick={() => router.push('/profile')}>Go Back</Button>
                
                {/* <div className="text-center mb-4"> */}
                  {response.merchant_param5 == "instant_booking" ? (
                      <Button 
                        variant="primary" 
                        className="mx-3 btn btn-primary btn-cus cus-btn"
                        onClick={() =>
                          router.push(
                            {
                              pathname: "/bookings",
                              // query: {
                              //   paymentId: response.order_id,
                              // },
                            }
                          )
                        }
                      >
                        Show Booking Details
                      </Button>
                    ) : null}
                {/* </div> */}
                </div>
              </div>
            </div>
          </div>
        </section>
      )
    }

  }
  else {
    return (
      <div class="w-100 mt-5 h-100">
        <div class="text-center mt-5 d-flex align-items-center justify-content-center">
          <div className="mt-5 top-50">
            <Spinner animation="border" variant="primary" />
          </div>
        </div>
      </div>
    );
  }
};

PaymentSuccess.getInitialProps = async(context) => {
	let data = "";
	if (context.req.method === "POST") {
		data = await parse(context.req);
	}
	return {data};
}

export default PaymentSuccess;
