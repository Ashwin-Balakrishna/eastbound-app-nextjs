import React , { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Row , Col, Card, Spinner } from 'react-bootstrap';
import PageLayout from '../../components/layouts/pageLayout';
import Footer from '../../components/pageComponents/footer/footer';
import { fetchDataWithAuth } from '../../utils/apiHelper';
import parse from 'urlencoded-body-parser';
import withAuth from "../../utils/withAuth";
import { NODE_API_URL } from '../../utils/helper';
function SuccessfulTransaction ({data}){
    const router = useRouter()
    const [values,setValues]=useState({})
    const [loading,setLoading] = useState(true);
    const [refetch,setRefetch] = useState(true);
    async function fetchData (){
        let body={}
        body['encResp']= data?.encResp
        body['orderNo']= data?.orderNo
        try {
            const response = await fetchDataWithAuth(`${NODE_API_URL}/wallet/customEncResp`,'POST','',{'Content-Type':'application/json'},body);    
            setValues(response)
            setRefetch(!refetch)
            setLoading(false)  
        } catch (error) {
            console.log(error);
            setLoading(false) 
        }
    }
    useEffect(()=>{
       fetchData();
    },[])
    return (
        <PageLayout title="2Hub | Wallet" changed={refetch}>
            <Card className='w-75'style={{marginTop:'8%',marginLeft:'12.5%',marginRight:'12.5%',fontFamily:'Poppins',fontSize:'14px',color:'#264653'}}>
                <Card.Body>
                    {
                        loading 
                        ?
                        <div className='mt-5 d-flex justify-content-center text-center align-items-center'>
                         <Spinner variant='primary' animation='border' />
                        </div>
                        :
                        values?.data?.order_status === 'Success' ?
                        (
                            <div className='mt-5 justify-content-center text-center'>
                        <div className='mt-5 align-items-center justify-content-center text-center'>
                        <img className='mt-5' src='/images/approved.svg' alt='success' width={'45px'} height={'45px'}/>
                            <h5 className='mt-4' style={{color:'#2A9D8F',fontFamily:'poppins',fontSize:'20px'}}>Transaction Successful</h5>
                            <p className='mt-2' style={{fontFamily:'poppins',fontSize:'14px'}}>Your Transaction has been successfully completed</p>
                            <p style={{fontFamily:'poppins',fontSize:'14px'}}>Amount : <span style={{fontFamily:'poppins',fontSize:'14px'}}><b style={{fontFamily:'poppins',fontSize:'14px'}}>{values?.data?.amount}</b></span></p>
                            <p style={{fontFamily:'poppins',fontSize:'14px'}}>Transaction ID: <span><b style={{fontFamily:'poppins',fontSize:'14px'}}>{values?.data?.merchant_param2}</b></span></p>
                        </div>
                        <Row  className='m-0 p-0 justify-content-center '>
                            <Col lg={6} className='mt-5 justify-content-center text-center' style={{marginLeft:'2vw',display:'flex'}}>
                                <button 
                                    className='btn btn-primary py-2 btn-cus'
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
                        )
                        :
                        (
                            <div className='mt-5 justify-content-center text-center'>
                        <div className='mt-5 align-items-center justify-content-center text-center'>
                            <img className='mt-5' src='/images/false.svg' alt='failure' />
                            <h5 className='mt-4' style={{color:'#E76F51',fontFamily:'poppins',fontSize:'20px'}}>Transaction Failed !</h5>
                            <p className='mt-2' style={{fontFamily:'poppins',fontSize:'14px'}}>We apologize for the inconvenience</p>
                            
                            {
                                values.status === false ?(
                                    <p className='mt-2' style={{fontFamily:'poppins',fontSize:'14px'}}>Message :  <span><b>{values.message}</b></span></p>
                                ):
                                (
                                    <div>
                                        
                                        <p className='mt-2' style={{fontFamily:'poppins',fontSize:'14px'}}>Amount : <span><b>{values?.data?.amount}</b></span></p>
                                        <p className='mt-2' style={{fontFamily:'poppins',fontSize:'14px'}}>Transaction ID: <span><b>{values?.data?.merchant_param2}</b></span></p>
                                        {/* <p className='mt-2' style={{fontFamily:'poppins',fontSize:'14px'}}>Message : <span><b>{values?.data?.status_message}</b></span></p> */}
                                    </div>
                                )
                            }
                            
                            <p className='mt-2' style={{fontFamily:'poppins',fontSize:'14px'}}>We request you to try once again</p>
                        </div>
                        <Row  className='m-0 p-0 justify-content-center '>
                            <Col lg={6} className='mt-5 justify-content-center text-center' style={{marginLeft:'2vw',display:'flex'}}>
                                <button 
                                    className='btn btn-primary py-2 btn-cus'
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
                        ) 
                    }
                </Card.Body>
            </Card>
            {/* <Footer id="footer"/> */}
        </PageLayout>
    )
}
SuccessfulTransaction.getInitialProps = async(context) => {
    let data = "";
    if (context.req.method === "POST") {
        data = await parse(context.req);
    }
    return {data};
}
export default SuccessfulTransaction;
