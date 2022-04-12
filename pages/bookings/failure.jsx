import React , { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Row , Col, Card } from 'react-bootstrap';
import PageLayout from '../../components/layouts/pageLayout';
import Footer from '../../components/pageComponents/footer/footer';
import withAuth from '../../utils/withAuth';
function FailedTransaction (){
    const router = useRouter()
    const [msg,setMsg] = useState('')
    useEffect(()=>{
        const location = window.location;
        const query = new URLSearchParams(location.search)
        setMsg(query.get('message')?query.get('message'):'')
    })
    return (
        <PageLayout title="2Hub | Wallet">
            <Card className='w-75'style={{marginTop:'8%',marginLeft:'12.5%',marginRight:'12.5%'}}>
                <Card.Body>
                    <div className='mt-5 justify-content-center text-center'>
                        <div className='mt-5 align-items-center justify-content-center text-center'>
                            <img className='mt-5' src='/images/false.svg' alt='failure' width={'50px'} height={'50px'} />
                            <h5 className='mt-4' style={{color:'red'}}>Transaction Failed !</h5>
                            <p className='mt-2'>We apologize for the inconvenience</p>
                            {
                                msg && (
                                    <p className='mt-2'>
                                        Message : <b>{msg}</b>
                                    </p>
                                )
                            }
                            {/* <p className='mt-2'>Transaction ID: <span><b>XXXXXXXXXXX</b></span></p> */}
                            <p className='mt-2'>We request you to try once again</p>
                        </div>
                        <Row  className='m-0 p-0 jd-flex justify-content-center '>
                            <Col sm={12} xs={12} md={6} lg={6} className='mt-5 justify-content-center text-center' style={{marginLeft:'2vw',display:'flex'}}>
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
                            <Col lg={6} className='mt-5' >
                                
                            </Col>
                        </Row>
                    </div>
                </Card.Body>
            </Card>
            {/* <Footer id="footer"/> */}
        </PageLayout>
    )
}
export default withAuth(FailedTransaction)