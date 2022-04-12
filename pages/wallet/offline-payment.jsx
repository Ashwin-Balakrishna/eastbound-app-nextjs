import { Formik } from 'formik';
import { useRouter } from 'next/router';
import React , { useState } from 'react';
import { useEffect } from 'react';
import { Row , Col, Card } from 'react-bootstrap';
import BaseLayout from '../../components/layouts/baseLayout';
import PageLayout from '../../components/layouts/pageLayout';
import Footer from '../../components/pageComponents/footer/footer';
import { fetchDataWithAuth } from '../../utils/apiHelper';
import { NODE_API_URL } from '../../utils/helper';
import withAuth from "../../utils/withAuth";

function OfflinePayment (){
    const router = useRouter()
    const [data,setData]=useState({
        account_holder: '',
        account_no: '',
        account_type: '',
        bank_name: '',
        branch: '',
        ifsc: '',
    })
    async function getPaymentDetails(){
        try {
            const response = await fetchDataWithAuth(`${NODE_API_URL}/paymentDetail/list`,'GET',null,{},null); 
            setData(response?.data?.[0]);
        }   catch (error) {
            console.log(error);
        }
    }
    useEffect(()=>{
        getPaymentDetails()
    },[])
    return (
        <PageLayout title="2Hub | Wallet">
            <BaseLayout>
            <Card className='w-100 mb-5'style={{marginTop:'5px',fontFamily:'Poppins',fontSize:'14px',color:'#264653'}}>
                <Card.Header>
                <Row className='mt-2 mb-2 custom-top'>
                        <Col xl={1} md={2} xs={12}>
                            <img src='/images/wallet1.svg' alt='wallet' /> 
                        </Col>
                        <Col xl={9} md={6} xs={12}>
                            <h5 className=''  style={{fontFamily:'poppins',fontSize:'20px'}}>Offline Payment</h5>
                        </Col>
                        <Col xl={2} md={4} xs={12} style={{fontFamily:'poppins',fontSize:'14px'}}>
                            2HUB Account Info.
                        </Col>
                    </Row>
                </Card.Header>
                   
                    
                <Card.Body>
                    <Formik
                        initialValues={data}
                        enableReinitialize={true}
                    >
                        {({values}) => (
                                <form className='mt-4'>
                                    <Row className='mt-2 container-fluid'>
                        <Col lg={6} className="container-fluid">
                            <Row>
                                <Col lg={2}  style={{fontFamily:'poppins',fontSize:'14px'}} className='mt-2 p-0 m-0'>
                                    Account No
                                </Col>
                                <Col lg={9}>
                                    <input className='form-control' value={values?.account_no} disabled placeholder={'XXXXXXXXXXX'}/>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg={6}>
                            <Row>
                                <Col lg={2}  style={{fontFamily:'poppins',fontSize:'14px'}} className='mt-2 p-0 m-0'>
                                    Bank Name
                                </Col>
                                <Col lg={9}>
                                    <input className='form-control' value={values?.bank_name} disabled placeholder={'ICICI Bank'}/>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg={6} className='mt-4'>
                            <Row>
                                <Col lg={2}  style={{fontFamily:'poppins',fontSize:'14px'}} className='mt-2 p-0 m-0'>
                                    Account Name
                                </Col>
                                <Col lg={9}>
                                    <input className='form-control' value={values?.account_holder} disabled placeholder={'XXXXXXXXXXX'}/>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg={6} className='mt-4'>
                            <Row>
                                <Col lg={2}  style={{fontFamily:'poppins',fontSize:'14px'}} className='mt-2 p-0 m-0'>
                                    Account Type
                                </Col>
                                <Col lg={9}>
                                    <input className='form-control' value={values?.account_type} disabled placeholder={'ICICI Bank'}/>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg={6} className='mt-4'>
                            <Row>
                                <Col lg={2}  style={{fontFamily:'poppins',fontSize:'14px'}} className='mt-2 p-0 m-0'>
                                    IFSC Code
                                </Col>
                                <Col lg={9}>
                                    <input className='form-control' value={values?.ifsc} disabled placeholder={'XXXXXXXXXXX'}/>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg={6} className='mt-4'>
                            <Row>
                                <Col lg={2}  style={{fontFamily:'poppins',fontSize:'14px'}}className='mt-2 p-0 m-0'>
                                    Branch
                                </Col>
                                <Col lg={9}>
                                    <input className='form-control' value={values?.branch} disabled placeholder={'XXXXXXXXXXX'}/>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg={6} className='mt-4 p-0 m-0 container'>
                            <p className='text-muted mr-4 '  style={{fontFamily:'poppins',fontSize:'14px'}}>
                                Dear Agents , Please use the above account details for offline payments and update the transactions
                            </p>
                        </Col>
                    </Row>
                    <button 
                        className='mt-5 mb-3 btn btn-outline-primary py-2 outline'
                        onClick={()=>{router.push('/wallet/home')}}
                        style={{fontFamily:'poppins',fontSize:'14px'}}
                    >
                        Back to Home Page
                    </button>
                                </form>
                        )}
                    </Formik>
                    
                </Card.Body>
            </Card>
            </BaseLayout>
            {/* <Footer id="footer"/> */}
        </PageLayout>
    )
}

export default withAuth(OfflinePayment);
