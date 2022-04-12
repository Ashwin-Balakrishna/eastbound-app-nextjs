import React , { useState } from 'react';
import { useRouter } from 'next/router';
import { Row , Col, Card } from 'react-bootstrap';
import PageLayout from '../../components/layouts/pageLayout';
import Footer from '../../components/pageComponents/footer/footer';
import withAuth from "../../utils/withAuth";

function TransactionUpdation (){
    const router = useRouter()
    return (
        <PageLayout title="2Hub | Wallet">
            <Card className='w-75'style={{marginTop:'8%',marginLeft:'12.5%',marginRight:'12.5%',fontFamily:'Poppins',fontSize:'14px',color:'#264653'}}>
                <Card.Body>
                    <div className='mt-5 justify-content-center text-center'>
                        <div className='mt-5 align-items-center justify-content-center text-center'>
                            <img className='mt-5' src='/images/approved.svg' alt='Sucess' width={'45px'} height={'45px'} />
                            <h5 className='mt-4' style={{color:'#2A9D8F',fontFamily:'poppins',fontSize:'20px'}}>Thank  you for updating the transactions</h5>
                            <p className='mt-2' style={{fontFamily:'poppins',fontSize:'14px'}}>Amount will be updated in your wallet on receipt of credit in your account</p>
                        </div>
                        <Row  className='m-0 p-0 justify-content-center '>
                            <Col lg={6} className='mt-5 justify-content-center text-center' style={{marginLeft:'2vw',display:'flex'}}>
                                <button 
                                    className='btn btn-primary py-2'
                                    onClick={()=>{router.push('/wallet/transaction-history')}}
                                    style={{width:'170px',height:'40px',fontFamily:'poppins',fontSize:'14px'}}
                                >
                                    View Report
                                </button>
                                <button
                                    className='mx-3 btn btn-outline-primary py-2 outline btn-cus'
                                    onClick={()=>{router.push('/wallet/home')}}
                                    style={{fontFamily:'poppins',fontSize:'14px'}}
                                >
                                    Back to Home Page
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

export default withAuth(TransactionUpdation);
