import moment from "moment";
import React from "react";
const InvoicePDF = React.forwardRef((props, ref) => {
    const invoiceData = props.invoiceData
    return (
        <div className='container font-styles my-0' style={{width:'65% !important'}} ref={ref}>
        {/* {
            loading 
            ?
            <div className="d-flex mt-5 position-relative justify-content-center">
                <div class="position-absolute mt-5 translate-middle">
                    <Spinner variant='primary' animation='border'/>
                </div>
            </div>
            :
            <> */}
                <div className='row mt-5'>
                        <div className='col-9'><img src={invoiceData?.agency_logo} width={'100px'} alt='company_logo' /></div>
                        <div className='col-2 float-right'>
                            <h6>Invoices No:</h6>
                            <p>{invoiceData?.invoice_no}</p>
                        </div>
                    </div>
                    <hr />
                    <div className='row'>
                        <div className="col-9">
                            <b>Billed To:</b>
                            <p>{invoiceData?.agency_name}</p>
                            {invoiceData?.agency_address}
                            <p>{invoiceData?.agency_city} - {invoiceData?.agency_pin_code}</p>
                            <div className="row mt-5">
                                <div className="col-2">Date</div>
                                <div className="col-4">{moment(invoiceData?.invoice_date).format('DD MMM YYYY')}</div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-2">Booking ID</div>
                                <div className="col">{invoiceData?.file_code}</div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-2">Currency</div>
                                <div className="col">{invoiceData?.currency}</div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-2">Hotel Address</div>
                                <div className="col">{invoiceData?.hotel_address}</div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-2">File Pax</div>
                                <div className="col">{invoiceData?.pax}</div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-2">Check-in</div>
                                <div className="col">{moment(invoiceData?.check_in).format('DD MMM YYYY')}</div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-2">Check-out</div>
                                <div className="col">{moment(invoiceData?.check_out).format('DD MMM YYYY')}</div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-2">GSTIN</div>
                                <div className="col">{invoiceData?.billing_gst_in}</div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-2">Billing State</div>
                                <div className="col">{invoiceData?.state}</div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-2">No of Pax</div>
                                <div className="col">{invoiceData?.pax}</div>
                            </div>
                        </div>
                        <div className='col-3 m-0 p-0'>
                            <div className='row'>
                                <div className="col-6 m-0 p-0"> <p>Agent Country</p></div>
                                <div className="col-6">{invoiceData?.agency_country}</div>
                            </div>
                            <div className='row mt-2'>
                                <div className="col-3 m-0 p-0"> <p>GSTIN</p></div>
                                <div className="col-6">{invoiceData?.agency_gst_in}</div>
                            </div>
                            <div className='row mt-2'>
                                <div className="col-4 m-0 p-0"> <p>Place of supply</p></div>
                                <div className="col-6">{invoiceData?.place_of_supply}</div>
                            </div>
                        </div>
                        </div>
                        <hr />
                        <b className='mt-4'>Guest</b><p>{invoiceData?.guest}</p>
                        <table className='mt-3 table table-responive'>
                            <thead>
                                <tr>
                                    <th>S No.</th>
                                    <th style={{width:"220px"}}>Particulars</th>
                                    <th>HSN/SC</th>
                                    <th>Net Value</th>
                                    <th>Taxable</th>
                                    <th>GST%</th>
                                    <th>Tax Value</th>
                                    <th>Gross</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{1}</td>
                                    <td>{invoiceData?.particulars}</td>
                                    <td>{invoiceData?.hsn_sac}</td>
                                    <td>{invoiceData?.net}</td>
                                    <td>{invoiceData?.taxable}</td>
                                    <td>{invoiceData?.gst}</td>
                                    <td>{invoiceData?.tax_value}</td>
                                    <td>{invoiceData?.gross}</td>
                                </tr>
                            </tbody>
                        </table>
                        <hr />
                        <div className='d-flex justify-content-end me-5'>
                            <b>Total</b>
                            <b className='mx-3'>{Number(invoiceData?.gross)?.toLocaleString('en-IN')}</b>
                        </div>
                        <hr />
                        <div className='d-flex row g-2 flex-row'>
                            {/* // tax_co  */}
                            {/* <div className='d-flex row g-2 flex-row'> */}
                                <div className='col-2'>Tax Component :
                                </div>
                            {
                                
                                invoiceData?.tax_component?.map((data,index)=>{
                                    return (
                                    <div className="col-4" key={index} style={{fontFamily:'poppins'}}>
                                        {data}
                                    </div>
                                    )
                                })
                            }
                            {/* <p className='mt-2'>Tax Component: CGST Tour Package {invoiceData?.cgst?invoiceData?.cgst:'9%'}</p>
                            <p className='mx-5'>SGST Tour Package {invoiceData?.sgst?invoiceData?.sgst:'9%'}</p> */}
                        {/* </div> */}
                            {/* <p className='mt-2'>Tax Component: CGST Tour Package {invoiceData?.cgst?invoiceData?.cgst:'9%'}</p>
                            <p className='mx-5'>SGST Tour Package {invoiceData?.sgst?invoiceData?.sgst:'9%'}</p> */}
                        </div>
                        <hr />
                        <div className='mt-3 mb-2'>
                            <b>
                                Remittance INR Bank Details
                            </b>
                            <div className="row mt-3">
                                <div className="col-3">Beneficiary Account</div>
                                <div className="col-8">{'2HUB PVT. LTD.'}</div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-3">Beneficiary Address</div>
                                <div className="col-8">{'898, Udyog Vihar, Phase 1, Gurgaon - 122016, Haranya, India'}</div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-3">Bank Name</div>
                                <div className="col-8">{'HDFC INR 2HUB'}</div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-3">Bank Address</div>
                                <div className="col-8">{'First India place, Mehrauli Road'}</div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-3">Swift Code</div>
                                <div className="col-8">{'HDFCCINBBDEL'}</div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-3">IFSC Code</div>
                                <div className="col-8">{'HDFC0000280'}</div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-3">MICR Code</div>
                                <div className="col-8">{'110240037'}</div>
                            </div>
                        </div>
                        <hr />
                        <div className='mt-2 mb-4'>
                            This is a system generated invoice does not required signature
                        </div>
                        {/* <div hidden={true}>
                            <InvoicePDF ref={componentRef} invoiceData={invoiceData} />
                        </div>
                        <div className='mb-4 d-flex'>
                            <button className='btn btn-primary' style={{ width: '225px', height: '41px' }} onClick={() => { PrintInvoice(); } }>Download Invoice</button>
                            <button className='mx-3 btn btn-outline-primary' style={{ width: '180px', height: '41px' }} onClick={() => { router.push('/home') } }>Go to Home</button>
                        </div> */}
            {/* </>
        } */}
    </div>
    )
})
export default InvoicePDF