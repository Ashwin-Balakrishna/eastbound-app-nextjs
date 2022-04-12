import React , { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Row , Col, Card } from 'react-bootstrap';
import PageLayout from '../../components/layouts/pageLayout';
import Footer from '../../components/pageComponents/footer/footer';
import { fetchDataWithAuth } from '../../utils/apiHelper';
import moment from 'moment';
import BaseLayout from '../../components/layouts/baseLayout';
import withAuth from "../../utils/withAuth";
import { NODE_API_URL, S3_URL } from '../../utils/helper';

function TransactionDetails (){
    const router = useRouter()
    const [amount,setAmount] = useState('')
    const [mode,setMode] = useState('')
    const [type,setType] = useState('')
    const [data,setData] = useState({})
    async function getBalance(){
        const data = await fetchDataWithAuth(`${NODE_API_URL}/wallet/info`, 'GET','',[],null)
        setAmount(data?.data?.amount||'')
    }
    async function getDetailsWithID(rid){
        // if (type == "Offline")
        // {
            const data = await fetchDataWithAuth(`${NODE_API_URL}/offlineTxn/${rid}/info`,'GET','',[],'')
            // console.log(data?.data)
            setData(data?.data)
        // }
        // else{
        //     const data = await fetchDataWithAuth(`https://nodems.2hubdev.link/txnHistory/${rid}/info`,'GET','',[],'')
        //     setData(data?.data)
        // }
    }
    useEffect(()=>{
        var url = window.location.search;
        var params = new URLSearchParams(url);
        getDetailsWithID(params.get('id'))
        setMode(params.get('mode'))
        setType(params.get('type'))
        getBalance();
    },[])
    return (
        <PageLayout title="2Hub | Wallet">
            <BaseLayout>
            <Card className='w-100 mb-5 custom-top'style={{marginTop:'5px',fontFamily:'Poppins',fontSize:'14px',color:'#264653'}}>
                <Card.Header>
                    <Row>
                        <Col lg={1} className='mt-2'>
                            <img src='/images/wallet1.svg' alt='wallet' /> 
                        </Col>
                        <Col lg={8} className='mt-2'>
                            <h5 className='' style={{fontFamily:'Poppins',fontSize:'20px'}}>Transaction Details</h5>
                        </Col>
                        <Col className='px-5' lg={3}>
                            <div className="header__price justify-content-center" style={{backgroundColor:'#fff'}}>
                                <img src="/images/wallet.svg" alt="wallet" />
                                <span style={{color:'#0C3E55',fontSize:'14px',fontFamily:'poppins'}}>₹ {Number(amount).toLocaleString('en-IN')}</span>
                            </div>
                        </Col>
                    </Row>
                </Card.Header>
                <Card.Body>
                    <Row className='mt-5'>
                        <Col lg={8} className="">
                            <b style={{fontFamily:'Poppins',fontSize:'20px'}}>{data?.account_holder}</b>
                        </Col>
                        <Col lg={4} >
                            <b style={{fontFamily:'Poppins',fontSize:'14px'}}>Transaction ID -  {data.id}</b>
                            <p className='mt-1' style={{fontFamily:'Poppins',fontSize:'14px'}}>Date: {moment(data?.transaction_date).format('ll')}</p>
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <Col lg={6} style={{fontFamily:'Poppins',fontSize:'14px'}}>
                            Account No: {data?.account_no}
                        </Col>
                        <Col lg={6} style={{fontFamily:'Poppins',fontSize:'14px'}}>
                            Bank : {data?.bank_name}
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <Col lg={6} style={{fontFamily:'Poppins',fontSize:'14px'}}>
                            Account Type: {data?.account_type}
                        </Col>
                        <Col lg={6} style={{fontFamily:'Poppins',fontSize:'14px'}}>
                            Amount deposited :  {data?.status==='Corrected'?data?.corrected_amount:data?.status === 'Success'?data?.amount:'Status Pending'}
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        {/* <Col lg={6} style={{fontFamily:'Poppins',fontSize:'14px'}}>
                            Account withdrawn: XXXXXXXXX
                        </Col> */}
                        <Col lg={6} style={{fontFamily:'Poppins',fontSize:'14px'}}>
                            UTR : {data?.utr}
                        </Col>
                        <Col lg={6} style={{fontFamily:'Poppins',fontSize:'14px'}}>
                             Mode of Transaction: {data?.transaction_mode}
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                       
                        <Col lg={6}>
                            {/* <div className='card w-50' > */}
                               <a className='card w-50' style={{minHeight:'100px'}} href={S3_URL+'documents/offlineTransaction/'+data?.document_url} target='_blank'> 
                                    {
                                        data?.document_url?.includes('.pdf')
                                        ?
                                        <img width={'100%'} height={'90%'} src={'/images/pdf-preview.png'} alt='document' />
                                        :
                                        <img width={'100%'} style={{maxHeight:'120px', width:'100%',height:'100%',objectFit:'fill'}} src={S3_URL+'documents/offlineTransaction/'+data?.document_url} alt='document' />

                                    }
                               </a>
                            {/* </div> */}
                        </Col>
                    </Row>
                    <Row  className='m-0 mt-4 p-0 justify-content-center '>
                            <Col lg={6} className='mt-5 justify-content-center text-center' style={{marginLeft:'2vw',display:'flex'}}>
                                <button 
                                    className='btn btn-primary py-2 px-5'
                                    style={{width:'170px',height:'40px',fontFamily:'poppins',fontSize:'14px'}}
                                >
                                    Print
                                </button>
                                <button
                                    className='mx-5 btn btn-outline-primary py-2 outline'
                                    onClick={()=>{router.push('/wallet/home')}}
                                    style={{fontFamily:'poppins',fontSize:'14px'}}
                                >
                                    Back to Home Page
                                </button>
                            </Col>
                            <Col lg={6} className='mt-5' >
                                
                            </Col>
                        </Row>
                </Card.Body>
            </Card>
            </BaseLayout>
            {/* <Footer id="footer"/> */}
        </PageLayout>
    )
}

export default withAuth(TransactionDetails);
