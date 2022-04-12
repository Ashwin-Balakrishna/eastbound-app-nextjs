import moment from 'moment';
import router, { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import {useReactToPrint} from 'react-to-print';
import VoucherPDF from '../components/pageComponents/pdf/VoucherPDF'
import { fetchDataWithAuth } from '../utils/apiHelper';
import { NODE_API_URL } from '../utils/helper';
export default function Invoices(){
    const router = useRouter()
    const [id,setId] = useState('')
    const [bId,setBId] = useState('')
    const [voucherData,setVoucherData] = useState({})
    const componentRef = useRef();
    const PrintVoucher = useReactToPrint({
        content: () => componentRef.current
      });
    const [loading , setLoading] = useState(false);
    async function getVouchers(){
        setLoading(true);
        try {
            const response = await fetchDataWithAuth(`${NODE_API_URL}/get-voucher-details?booking_id=${bId}`,'GET',null,null,null,null);
            setVoucherData(response.data)
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }
    useEffect(()=>{
        const location = window.location
        const query = new URLSearchParams(location.search)
        setId(query.get('id')?query.get('id'):'')
        setBId(query.get('bid')?query.get('bid'):'')
    })
    useEffect(()=>{
        if(id)
        getVouchers();
    },[id,bId])
    return (
        <div className='container font-styles  my-0' style={{width:'65% !important'}} ref={componentRef}>
            {
                loading 
                ?
                <div className="d-flex mt-5 position-relative justify-content-center">
                    <div class="position-absolute mt-5 translate-middle">
                        <Spinner variant='primary' animation='border'/>
                    </div>
                </div>
                :
                <>
                    <div className='row mt-5'>
                        <div className='col-10'><img src={voucherData?.agency_logo} width={'100px'} alt='company_logo' /></div>
                        <div className='col-2 float-right'>
                            <h6>Voucher No</h6>
                            <p>{voucherData?.voucher_no}</p>
                        </div>
                    </div>
                    <hr />
                    <div className='row'>
                        <div className="col-10">
                            <b>Billed To:</b>
                            <p>{voucherData?.agency_name}</p>
                            {voucherData?.agency_address}
                            <p>{voucherData?.agency_city} - {voucherData?.agency_pin_code}</p>
                            <div className="row mt-3">
                                <div className="col-2">Date</div>
                                <div className="col-4 mx-4">{moment(voucherData?.date).format('DD MMM YYYY')}</div>
                            </div>
                        </div>
                        <div className='col-2'>
                           
                                <b>Client Name</b>
                                <p>{voucherData?.guest_name}</p>
                        </div>
                        </div>
                        <hr />
                        <div className='row'>
                        <div className="col-9">
                            <div className="row mt-2">
                                <div className="col-3">Room</div>
                                <div className="col-4">{voucherData?.no_of_rooms} {voucherData?.room_type}</div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-3">Check-in</div>
                                <div className="col-4">{moment(voucherData?.check_in).format('DD MMM YYYY')}</div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-3">Check-out</div>
                                <div className="col-4">{moment(voucherData?.check_out).format('DD MMM YYYY')}</div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-3">Room Night</div>
                                <div className="col-4">{voucherData?.room_night}</div>
                            </div>
                        </div>
                        <div className='col-3'>
                            
                            <div > Confirmation No</div>
                            <div className='mt-2'>{voucherData?.confirmation_no}</div>
                            {/* <div className='mt-4'> Confirmed by</div>
                            <div className='mt-2'>{voucherData?.confirmed_by}</div>
                             */}
                        </div>
                        </div>
                        <hr />
                        <table class="table">
                            <thead>
                                <tr>
                                <td scope="col">Arrival On</td>
                                <td scope="col">Departure On</td>
                                {/* <td scope="col">From</td>
                                <td scope="col">To</td>
                                <td scope="col">By</td>
                                <td scope="col">By</td>
                                <td scope="col">At</td>
                                <td scope="col">At</td> */}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{moment(voucherData?.arrival_on).format('DD MMM YYYY')}</td>
                                    <td>{moment(voucherData?.departure_on).format('DD MMM YYYY')}</td>
                                    {/* <td>{voucherData.from?voucherData.from:'-'}</td>
                                    <td>{voucherData.to?voucherData.to:'-'}</td>
                                    <td>{voucherData.by?voucherData.by:'-'}</td>
                                    <td>{voucherData.by?voucherData.by:'-'}</td>
                                    <td>{voucherData.at?voucherData.at:'-'}</td>
                                    <td>{voucherData.at?voucherData.at:'-'}</td> */}
                                </tr>
                            </tbody>
                        </table>
                        <hr />
                        <div className='mt-2 mb-4'>
                            {/* Please apply general contracted rates */}
                            <p>Voucher includes above mentioned services only. All extras to be paid directly.</p>
                            Hotel Instruction: All meals are on fixed menu basis.
                        </div>
                        <hr />
                        {/* <p>Satyananranyan Sahoo</p> */}
                        <hr />
                        {/* <div className='row mb-4'>
                            <div className="col-6">
                                 <p>Please send bill to</p>
                                <b>2HUB Pvt. Ltd.</b>
                                <p>898, Udyog Vihar, Phase 1, Gurgaon - 122-16</p>
                                Haranya, India 
                            </div> 
                            <div className="col-6">
                                <p>GST Address</p>
                                <b>2HUB Pvt. Ltd.</b>
                                <p>898, Udyog Vihar, Phase 1, Gurgaon - 122-16</p>
                                Haranya, India
                            </div>
                        </div> */}
                        <div hidden={true}>
                            <VoucherPDF ref={componentRef} voucherData={voucherData} />
                        </div>
                        <div className='mt-3 mb-4 d-flex'>
                            <button className='btn btn-primary' style={{ width: '225px', height: '41px' }} onClick={() => { PrintVoucher(); } }>Download Voucher</button>
                            <button className='mx-3 btn btn-outline-primary' style={{ width: '180px', height: '41px' }} onClick={() => { router.push('/home') } }>Go to Home</button>
                        </div>
                </>
            }
        </div>
    )
}