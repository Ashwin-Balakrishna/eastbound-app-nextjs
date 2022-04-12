import React, { useState, useEffect } from "react";
import withAuth from "../../utils/withAuth";
import { Col, Row, Card, Button,Spinner } from "react-bootstrap";
import { FiDownload } from "react-icons/fi";
import BaseLayout from "../../components/layouts/baseLayout";
import PageLayout from "../../components/layouts/pageLayout";
import ErrorText from "../../components/elements/errorText";
import { fetchgetServerSidePropsWithAuth, getBookingFile } from "../../utils/apiHelper";
import moment from "moment";
import { reloadPage } from "../../utils/helper";
import router from "next/router";

const API_URL = process.env.global_url;

const Documents = ({documents}) => {
	const [downloadErrorMessage, setDownloadErrorMessage] = useState("");
	const [loading,setLoading] = useState(true);
	const generated_date = documents?.invoices?.[0]?.generated_date
	console.log(moment(new Date()).diff(moment(generated_date),'milliseconds'))
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
 
	return (
		<PageLayout title="2Hub | Bookings">
			<BaseLayout>
			{downloadErrorMessage && <ErrorText error={downloadErrorMessage} />}
				<Card>
					<section className="mt-5">
						<div className="container">
							<div className="row justify-content-center">
								<div className="col-12 col-md-8">
								<h3 className="text-center mb-5">Booking Invoices & Vouchers</h3>
									<Row className="mb-4">
										<Col md={6}>
											<span className="font-weight-bold text-muted mr-2">Booking Id:</span>
											<span className="text-muted">{documents.booking_id}</span>
										</Col>
										<Col md={6}>
											<span className="float-right">
												<span className="font-weight-bold text-muted mr-2">Checkin:</span>
												<span className="text-muted">{moment(documents.check_in).format("DD-MM-YYYY")}</span>
											</span>
										</Col>
									</Row>
									<Row className="mb-4">
										<Col md={6}>
											<span className="font-weight-bold text-muted mr-2">Hotel Name:</span>
											<span className="text-muted">{documents.hotel_name}</span>
										</Col>
										<Col md={6}>
											<span className="float-right">
												<span className="font-weight-bold text-muted mr-2">Checkout:</span>
												<span className="text-muted">{moment(documents.check_out).format("DD-MM-YYYY")}</span>
											</span>
										</Col>
									</Row>
									<table className="table mt-5">
										<tbody>
											<tr>
												<td align="center" className="text-muted">Type</td>
												<td align="center" className="text-muted">Id</td>
												<td align="center" className="text-muted">Option</td>
											</tr>
											{documents.vouchers.map((voucher,i) => (
												<tr key={i}>
													<td align="center">Voucher</td>
													<td align="center">
														{voucher.voucher_no}
													</td>
													<td align="center">
														{
															// Math.abs(moment(new Date()).diff(moment(generated_date),'milliseconds')) < 60000
															// ?
															// <>
															// 	<Spinner variant='primary' animation='border' size="sm" />
															// 	<div hidden={true}>
															// 	{
															// 		setTimeout((function() {
															// 			reloadPage()
															// 		 }), 60000 - moment(new Date()).diff(moment(generated_date),'milliseconds'))
															// 	}
															// 	</div>
															// </>
															// :
															<Button variant="link" className="p-0" onClick={() =>router.push(`/vouchers?id=${voucher.voucher_id}&bid=${documents.booking_id}`) }>
																Download
																<FiDownload className="ml-2" />
															</Button>
														}
														
													</td>
												</tr>
											))}
											{documents.invoices.map((invoice,i) => (
												<tr key={i}>
													<td align="center">Invoice</td>
													<td align="center">
														{invoice.invoice_no}
													</td>
													<td align="center">
													{
															// Math.abs(moment(new Date()).diff(moment(generated_date),'milliseconds')) < 60000
															// ?
															// <>
															// 	<Spinner variant='primary' animation='border' size="sm" />
															// 	{/* {delay(invoice.invoice_id,"invoice")} */}
														
															// 	{/* {delay()}
															// 	<Spinner variant='primary' animation='border' size="sm" /> */}
															// </>
															// :
															// <Button variant="link" className="p-0" onClick={() => downloadDocument(invoice.invoice_id,"invoice")}>
															// 	Download
															// 	<FiDownload className="ml-2" />
															// </Button>
															<Button variant="link" className="p-0" onClick={() => router.push(`/invoices?id=${invoice.invoice_id}&bid=${documents.booking_id}`)}>
																Download
																<FiDownload className="ml-2" />
															</Button>
														}
													</td>
												</tr>
											))}
											{documents.receipts.map((receipt,i) => (
												<tr key={i}>
													<td align="center">Receipt</td>
													<td align="center">
														{receipt.receipt_no}
													</td>
													<td align="center">
														{
															// Math.abs(moment(new Date())?.diff(moment(generated_date),'milliseconds')) < 60000
															// ?
															// <>
															// 	{/* {delay()} */}
															// 	{/* <Spinner variant='primary' animation='border' size="sm" /> */}
															// 	<Spinner variant='primary' animation='border' size="sm" />
															// 	{/* {delay(receipt.receipt_id,"receipt")} */}
															// </>
															// :
															<Button variant="link" className="p-0" onClick={() => downloadDocument(receipt.receipt_id,"receipt")}>
																Download
																<FiDownload className="ml-2" />
															</Button>
													}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</section>
				</Card>
			</BaseLayout>
		</PageLayout>
    
  );
}

export async function getServerSideProps(context) {
	const { id } = context.params;

  const documents = await fetchgetServerSidePropsWithAuth(
    `${API_URL}/api/agent/bookings/documents_listing/${id}/`,
    "GET",
    null,
    null,
    null,
    context
  );

  return { props: { documents } };
}

export default Documents;