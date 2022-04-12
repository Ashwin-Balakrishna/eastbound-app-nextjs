import React , { useState } from 'react';
import { Row , Col, Card, Container } from 'react-bootstrap';
import PageLayout from '../../../layouts/pageLayout';
import Footer from '../../footer/footer';
import { fetchDataWithAuth } from '../../../../utils/apiHelper';
import { API_URL, NODE_API_URL, reloadPageWithUrl } from '../../../../utils/helper';
import * as Yup from 'yup'
import { Formik } from 'formik';
export default function AddBalance (){
    const [amount,setAmount]=useState('')
    const Schema = Yup.object().shape({
       amount:Yup.number()
        .min(1,'* Amount must be greater than or equal to 1')
        .required('* This is a required field')
      });
    async function Submit(values,resetForm){
        if (values.amount && Number(values.amount) > 0){
            setAmount(values.amount)
            let body = {"amount":Number(values.amount)}
            const data = await fetchDataWithAuth(`${NODE_API_URL}/wallet/addBalance`,"PUT","",{'Content-Type':'application/json'},body);
            if(data.status){
                reloadPageWithUrl(data.data);
                // resetForm()
                // console.log(data)
            }
        }
    }
    return (
        // <PageLayout title="2Hub | Wallet">
            <div className='mt-3 m-4' style={{fontFamily:'Poppins',fontSize:'14px',color:'#264653'}}>
                {/* <Card.Header>
                    <Row>
                        <Col lg={2}>
                            <img src='/images/wallet1.svg' alt='wallet' /> 
                        </Col>
                        <Col>
                            <h5 className=''>Add Balance</h5>
                        </Col>
                    </Row>
                </Card.Header> */}
                <Row>
                    <Col sm={6} lg={6}>
                    <p className='text-muted' style={{fontFamily:'Poppins',fontSize:'14px',color:'#264653'}}>
                    <b>Enter Amount</b>
                </p>
                        <Formik
                            initialValues={{amount:""}}
                            validationSchema={Schema}
                            onSubmit={async (values,{resetForm}) => {
                               await Submit(values,resetForm)
                            }}
                        >
                            {({values,errors,touched,handleSubmit,handleChange,resetForm}) => (
                                <form onSubmit={handleSubmit}>
                                <input
                                    className='mt-2 form-control' 
                                    type='number' 
                                    placeholder='Rs 5000' 
                                    value={values.amount}
                                    name='amount'
                                    onChange={handleChange}
                                    style={{maxWidth:'70%'}}
                                />
                                {
                                    errors['amount'] && (<span className='text-danger'>{errors['amount']}</span>)
                                }
                                {/* <Row className='mt-5'>
                                    <Col lg={5}> */}
                                    <d className='row'>
                                    <button 
                                            className='col-xs-12 col-md-8 col-lg-5 mt-5 btn btn-primary py-2 btn-common btn-custom'
                                            type='submit'
                                            style={{maxWidth:'170px',height:'40px',fontFamily:'poppins',fontSize:'14px'}}
                                            // style={{backgroundColor:'#E76F51'}}
                                        >
                                            Add Money
                                        </button>
                                    {/* </Col>
                                    <Col> */}
                                        <button
                                            className='btn mt-5 mx-3 btn-outline-primary outline'
                                            onClick={()=>{resetForm()}}
                                            type='reset'
                                            style={{width:'170px',height:'40px',fontFamily:'poppins',fontSize:'14px'}}
                                        >
                                            Cancel
                                        </button>
                                    </d>
                                        
                                    {/* </Col>
                                </Row> */}
                            </form>
                            )}
                        </Formik>
                    </Col>
                    <Col sm={5} lg={3}>
                    <Container className='custom-top justify-content-center' style={{fontFamily:'Poppins',fontSize:'14px',color:'#EBEBEB'}}>
                    <Card>
                        <Card.Header>
                            <b style={{fontFamily:'Poppins',fontSize:'14px',color:'#264653',width:'250px',height:'62px'}}>Summary</b>
                        </Card.Header>
                        <Card.Body>
                            <h6 className='mt-2 text-muted' style={{fontFamily:'Poppins',fontSize:'14px',color:'#264653'}}>Amount Added</h6>
                            <b className='m-0' style={{fontFamily:'Poppins',fontSize:'14px',color:'#264653'}}>Rs.{amount}</b>
                        </Card.Body>
                    </Card>
                </Container>
                    </Col>
                </Row>
                {/* <Footer id="footer"/> */}
            </div>
        // </PageLayout>
    )
}