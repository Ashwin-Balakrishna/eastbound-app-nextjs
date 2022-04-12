import React , { useEffect, useState } from 'react';
import { Row , Col, Card } from 'react-bootstrap';
import PageLayout from '../../components/layouts/pageLayout';
import Select from 'react-select' 
import Footer from '../../components/pageComponents/footer/footer';
import TransactionHistory from '../../components/pageComponents/wallet/TransactionHistory';
import moment from 'moment';
import { fetchDataWithAuth} from '../../utils/apiHelper';
import {NODE_API_URL} from '../../utils/helper'
import BaseLayout from '../../components/layouts/baseLayout';
import router from 'next/router';
import withAuth from "../../utils/withAuth";
function SuccessfulTransaction (){
    const [flg,setFlg] = useState(0)
    const [statusFilter,setStatusFilter] = useState('') 
    const [transactionFilter,setTransactionFilter] = useState('')
    const [dateFilter,setDateFilter] = useState('')
    const [data,setData] = useState([])
    const [amount,setAmount] = useState('')
    const [loading,setLoading] = useState(false);
    const status = [
        {value:'Success',label:'Successful'},
        {value:'Failure',label:'Failure'},
        {value:'Pending',label:'Pending'},
        {value:'Corrected',label:'Corrected'},
    ]
    const transaction = [
        {value:'Online',label:'Online'},
        {value:'Offline',label:'Offline'},
        {value:'Booking',label:'Booking'},
        {value:'Cancellation Refund',label:'Cancellation'},
    ]
    async function getTransactionHistory(){
        if (flg === 1){
            setLoading(true)
            let query=''
            if(statusFilter)
            query+=`status=${statusFilter}`
            if(transactionFilter)
            query+=`${query !=='' ? '&':'' }transaction_type=${transactionFilter}`
            if(dateFilter)
            query+=`${query !=='' ? '&':'' }transaction_date=${moment(dateFilter).format().split('T')[0]}`;
            try {
                const Transaction = await fetchDataWithAuth(`${NODE_API_URL}/txnHistory/list`,"GET",query,[],"");
                setData(Transaction?.data)
            } catch (error) {
                console.log(error)   
            }
            setLoading(false);
        }
    } 
    async function getBalance(){
        const data = await fetchDataWithAuth(`${NODE_API_URL}/wallet/info`, 'GET','',[],null)
        setAmount(data?.data?.amount||'')
    }
    useEffect(()=>{
        const location = window.location
        const query = new URLSearchParams(location.search)
        setStatusFilter(query.get('status')?query.get('status'):'') 
        setDateFilter(query.get('date')?new Date(query.get('date')).toLocaleDateString('en-CA'):'')
        setTransactionFilter(query.get('transaction')?query.get('transaction'):'')
        setFlg(1)
    },[])
    useEffect(()=>{
        let query = ''
        if (statusFilter)
        query='status='+statusFilter+'&'
        if(transactionFilter)
        query=query+'transaction='+transactionFilter+'&'
        if(dateFilter)
        query=query+'date='+dateFilter+'&'
        router.push({pathname:'/wallet/transaction-history',search:query.toString()})
        getTransactionHistory();
    },[statusFilter,transactionFilter,dateFilter,flg])
    useEffect(()=>{
        getBalance();
    },[])
    return (
        <PageLayout title="2Hub | Wallet">
            <BaseLayout >
            <Card className='w-100 mb-5 custom-top'style={{marginTop:'7px',fontFamily:'Poppins',fontSize:'14px',color:'#264653'}}>
                <Card.Header>
                    <Row className='mx-2 custom-top'>
                        <Col lg={1} md={1} className='mt-2' >
                            <img src='/images/wallet1.svg' alt='wallet' /> 
                        </Col>
                        <Col xl={8} lg={6} md={5} className='mt-2'>
                            <h5 className='' style={{fontFamily:'Poppins',fontSize:'20px'}}>Transaction History</h5>
                        </Col>
                        <Col className='px-4' xl={3}  lg={4} md={6}>
                            <div className=" mx-3 header__price justify-content-center" style={{backgroundColor:'#fff'}}>
                                <img src="/images/wallet.svg" alt="wallet" />
                                <span style={{color:'#0C3E55',fontSize:'14px',fontFamily:'poppins'}}>₹ {Number(amount).toLocaleString('en-IN')}</span>
                            </div>
                        </Col>
                    </Row>
                </Card.Header>
                <Card.Body >
                    {/* <Row className='mt-4 row-cols-lg-6'> */}
                        <div class="d-flex custom-display bd-highlight mb-3">
                            <p className='mt-2 mr-4 bd-highlight' style={{fontFamily:'poppins',fontSize:'14px'}}>
                                Status
                            </p>
                            <Select 
                                // styles={}
                                isClearable
                                placeholder='All' 
                                className="form-control mb-1 mr-4 p-0 m-0 h-auto transaction"
                                options={status}
                                value={statusFilter?status.filter((val,index)=>{
                                    return val.value === statusFilter?val:''
                                }):''} 
                                onChange={(e)=>{setStatusFilter(e?e.value:'')}}
                            />
                            <p className='mt-2 d-flex-inline mr-4 bd-highlight' style={{minWidth:'115px',fontFamily:'poppins',fontSize:'14px'}}>
                                Transaction Type
                            </p>
                            <Select 
                                isClearable
                                placeholder='All' 
                                className="form-control mb-1 mr-4 p-0 m-0 transaction h-auto"
                                options={transaction}
                                value={transactionFilter?transaction.filter((val,index)=>{
                                    return val.value === transactionFilter?val:''
                                }):''} 
                                onChange={(e)=>{setTransactionFilter(e?e.value:'')}}
                            />
                            <p className='mt-2 mr-4 bd-highlight'  style={{fontFamily:'poppins',fontSize:'14px'}}>
                                Date
                            </p>
                            <input 
                                type="date" 
                                value={dateFilter}
                                className="form-control transaction mr-4" 
                                onChange={(e)=>{setDateFilter(e.target.value?new Date(e.target.value).toLocaleDateString('en-CA'):'')}}
                            />
                        </div>
                        {/* <Col  className='mt-2' >
                            
                        </Col> */}
                        {/* <Col className='p-0'> 
                           
                        </Col> */}
                        {/* <Col lg={2} className='mt-2 m-0 mx-2 p-0'>
                            
                        </Col> */}
                        {/* <Col className='p-0' style={{marginLeft:'-52px'}}>
                            
                        </Col> */}
                        {/* <Col className='mt-2' >
                            Date
                        </Col>
                        <Col> */}
                            
                        {/* </Col> */}
                    {/* </Row> */}
                    <div className='mt-5'>
                        <TransactionHistory loading={loading} data={data}/>
                    </div>
                </Card.Body>
            </Card>
            </BaseLayout>
            {/* <Footer id="footer"/> */}
        </PageLayout>
    )
}

export default withAuth(SuccessfulTransaction);
