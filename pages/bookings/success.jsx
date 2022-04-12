import React , { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Row , Col, Card,Button,Spinner } from 'react-bootstrap';
import PageLayout from '../../components/layouts/pageLayout';
import Footer from '../../components/pageComponents/footer/footer';
import { fetchDataWithAuth, getBookingFile } from '../../utils/apiHelper';
import { ADMIN_API_URL, API_URL } from '../../utils/helper';
import { FiDownload } from 'react-icons/fi';
import ErrorText from '../../components/elements/errorText';
import moment from 'moment'
import withAuth from '../../utils/withAuth';
function SuccessfulTransaction (){
    const [reference,setReference] = useState('')
    const [downloadErrorMessage, setDownloadErrorMessage] = useState("");
    const [id,setId] = useState('')
    const [invoiceId,setInvoiceId] = useState('')
    const [documents,setDocuments] = useState({});
    const [gdate,setgdate] = useState('')
    const [generated,setGenerated] = useState(true);
    const [loading , setLoading ] =useState(false);
    const router = useRouter()
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
        const response = await fetchDataWithAuth(`${API_URL}/api/agent/bookings/documents_listing/${id}/`,"GET",null,{'Content-Type':'application/json'},null);
        setDocuments(response)
        setInvoiceId(response?.invoices?.[0]?.invoice_id);
        setGenerated(response?.invoices?.[0]?.generated)
        setgdate(response?.invoices?.[0]?.generated_date)
    }
    async function getInvoice(){
        setLoading(true)
        try {
            if(id && invoiceId && !generated){
                const response = await fetchDataWithAuth(`${ADMIN_API_URL}/api/dashboard/crm/booking/agentemails/`,"GET",`booking_id=${id}&action=${'Booking Confirmed'}&invoice_id=${invoiceId}`,{},null);
                // console.log(response)
                getDocuments()
            }
            setLoading(false);
        } catch (error) {
            console.log(error)
            setLoading(false);
        } 
    }
    console.log(moment(new Date()).diff(moment(gdate),'minutes'),60000 - moment(new Date()).diff(moment(gdate),'milliseconds'))
    useEffect(()=>{
        var location = window.location.search;
        var query = new URLSearchParams(location);
        setReference(query.get('reference')?query.get('reference'):'')
        setId(query.get('id')?query.get('id'):'')
    },[])

    useEffect(()=>{
        if(id)
        getDocuments()
    },[id])
    useEffect(()=>{
        getInvoice()
    },[invoiceId,generated,id])
    useEffect(()=>{

    },[gdate])
    return (
        <PageLayout title="2Hub | Wallet">
            {downloadErrorMessage && <ErrorText error={downloadErrorMessage} />}
            <br />
            {/* <div className='text-center m-0 mt-4 py-5'>
                <h6>Please do not refresh the page as Invoice and Vouchers are getting generated.</h6>
            </div> */}
            <Card className='mb-2 container w-75'style={{marginTop:'0%',marginLeft:'12.5%',marginRight:'12.5%'}}>
                <Card.Body>
                    <div className='justify-content-center text-center'>
                        <div className='align-items-center justify-content-center text-center'>
                            <img className='mt-2' src='/images/approved.svg' alt='success' width={'50px'} height={'50px'}/>
                            <h5 className='mt-4' style={{color:'#218406'}}>Transaction Successful</h5>
                            <p className='mt-2'>Your Transaction has been successfully completed</p>
                            {(reference === 'undefined' || reference === undefined) ?<p>Error: <span><b>{"Gateway Timeout on generating PDF's"}</b></span></p>:<p>Reference: <span><b>{reference}</b></span></p>}
                        </div>
                        {
                            id && (
                                <>
                                <div className="mt-4 row justify-content-center">
								<div className="col-sm-12 col-md-8">
								<h6 className="text-center mb-5">Booking Invoices & Vouchers</h6>
									<Row >
										<Col className="mb-2" xs={12} sm={12}  md={6}>
											<span className="font-weight-bold text-muted">Booking Id:</span>
											<span className="text-muted">{documents?.booking_id}</span>
										</Col>
										<Col className="mb-2" xs={12} sm={12} md={6}>
											{/* <span className="float-right"> */}
												<span className="font-weight-bold text-muted">Checkin:</span>
												<span className="text-muted">{moment(documents?.check_in).format("DD-MM-YYYY")}</span>
											{/* </span> */}
										</Col>
									</Row>
									<Row className="">
										<Col className="mb-2" xs={12} sm={12} md={6}>
											<span className="font-weight-bold text-muted">Hotel Name:</span>
											<span className="text-muted">{documents?.hotel_name}</span>
										</Col>
										<Col className="mb-2"  xs={12} sm={12} md={6}>
											{/* <span className="float-right"> */}
												<span className="font-weight-bold text-muted">Checkout:</span>
												<span className="text-muted">{moment(documents?.check_out).format("DD-MM-YYYY")}</span>
											{/* </span> */}
										</Col>
									</Row>
                                    </div>
                                    </div>
                                <table className='table table-responsive-sm'>
                                    <tbody>
                                        {
                                            documents?.vouchers?.map((voucher,i) => (
												<tr key={i}>
													<td align="center">Voucher</td>
													<td align="center">
														{voucher.voucher_no}
													</td>
													<td align="center">
                                                        {
                                                            // loading 
                                                            // ?
                                                            //     <Spinner variant='primary' animation='border' size="sm"/>
                                                            // :
                                                            // !generated && Math.abs(moment(new Date()).diff(moment(gdate),'minute')) < 1
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
															// 						<Button variant="link" className="p-0" onClick={() => downloadDocument(voucher.voucher_id,"voucher")}>
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
															<Button variant="link" className="p-0" onClick={() => router.push(`/vouchers?id=${voucher.voucher_id}&bid=${id}`)}>
																Download
																<FiDownload className="ml-2" />
															</Button>
                                                        }
														
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
                                                            // loading 
                                                            // ?
                                                            //     <Spinner variant='primary' animation='border' size="sm"/>
                                                            // :
                                                            // !generated && Math.abs(moment(new Date()).diff(moment(gdate),'minute')) < 1
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
															<Button variant="link" className="p-0" onClick={() =>router.push(`/invoices?id=${invoice.invoice_id}&bid=${id}`)}>
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
                                                            // loading 
                                                            // ?
                                                            //     <Spinner variant='primary' animation='border' size="sm"/>
                                                            // :
                                                            // moment(gdate)?.diff(moment(new Date()),'minute') < 1
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
                        <Row  className='m-0 p-0 d-flex justify-content-center '> 
                            <Col xs={12} sm={12} lg={6} className='mt-5 justify-content-center' style={{marginLeft:'2vw',display:'flex'}}>
                                {/* <button 
                                    className='btn btn-primary py-2'
                                >
                                    View Report
                                </button> */}
                                <button
                                    className='btn btn-outline-primary py-2 outline btn-cus cus-btn'
                                    onClick={()=>{router.push('/bookings')}}
                                >
                                    Go to Booking Page
                                </button>
                            </Col>
                            <Col lg={6} className='mt-5'>
                                
                            </Col>
                        </Row> 
                    </div>
                </Card.Body>
            </Card>
            {/* <Footer id="footer"/> */}
        </PageLayout>
    )
}
export default withAuth(SuccessfulTransaction)