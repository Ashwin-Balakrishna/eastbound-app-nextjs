import React, { useState } from 'react'
import { useEffect } from 'react';
import { Tabs, Tab, Nav, Row, Col } from 'react-bootstrap';
import BaseLayout from '../../components/layouts/baseLayout';
import PageLayout from '../../components/layouts/pageLayout';
import AddBalance from '../../components/pageComponents/wallet/add-balance';
import TransactionUpdation from '../../components/pageComponents/wallet/transaction-updation';
import Cookies from "js-cookie";
import withAuth from "../../utils/withAuth";
function Wallet(){
    const [key,setKey] = useState('')
    useEffect(()=>{
        const location = window.location.search
        const query = new URLSearchParams(location)
        setKey(query.get('tab')?query.get('tab'):'addBalance') 
    },[])
    useEffect(()=>{
        
    },[key])
    console.log(key)
    return(
        <PageLayout >
                <BaseLayout title="2Hub | Wallet">
                
                {/* <Tab> */}
                    <Tab.Container activeKey={key} onSelect={(skey)=>{setKey(skey)}}>
                        <Nav className='mt-3 custom-nav d-flex' variant="tabs"  style={{fontFamily:'Poppins',fontSize:'14px',color:'#264653'}}>
                        {Cookies.get('accesses')&&JSON.parse(Cookies.get('accesses')).includes(10)&&<Nav.Item className='flex-fill'>
                                <Nav.Link className='custom-link d-flex align-items-center'  eventKey="addBalance" style={{height:'60px'}}>
                                    <Row className='mx-2 mt-2'>
                                    <Col xs={1} lg={2} className='mt-1'>
                                        {
                                            key === 'addBalance'
                                            ?
                                            <img src='/images/wallet1.svg' alt='wallet' /> 
                                            :
                                            <img src='/images/wallet2.svg' alt='wallet' /> 
                                        }
                                        
                                    </Col>
                                    <Col>
                                        <p className='mx-3' style={{fontWeight:'normal',fontFamily:'Poppins',fontSize:'20px',color:'#264653'}}>Add Balance</p>
                                    </Col>
                                    </Row>
                                </Nav.Link>
                            </Nav.Item>}
                            {Cookies.get('accesses')&&JSON.parse(Cookies.get('accesses')).includes(11)&& <Nav.Item className='flex-fill'>
                                <Nav.Link className='custom-link d-flex align-items-center' eventKey="updateOffline" style={{height:'60px'}}>
                                   <Row className='mx-2 mt-2'>
                                   <Col xs={1} lg={2} className='mt-1'>
                                        {
                                            key === 'updateOffline'
                                            ?
                                            <img src='/images/wallet1.svg' alt='wallet' /> 
                                            :
                                            <img src='/images/wallet2.svg' alt='wallet' /> 
                                        }
                                            </Col>
                                            <Col>
                                                <p className='mx-3' style={{fontWeight:'normal',fontFamily:'Poppins',fontSize:'20px',color:'#264653'}}>Update Offline</p>
                                            </Col>
                                   </Row>
                                </Nav.Link>
                            </Nav.Item>}
                        </Nav>
                        <Tab.Content >
                            <Tab.Pane className={key !== 'addBalance'?'custom-tabpane':''} eventKey="addBalance">
                                <AddBalance />
                            </Tab.Pane>
                            <Tab.Pane className={key !== 'updateOffline'?'custom-tabpane':''} eventKey="updateOffline">
                                <TransactionUpdation />
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                    </BaseLayout>
        </PageLayout>
    )
}

export default withAuth(Wallet);
