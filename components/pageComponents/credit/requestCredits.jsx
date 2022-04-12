import React , { useState } from 'react';
import { Row , Col, Card, Container } from 'react-bootstrap';
import { fetchDataWithAuth } from '../../../utils/apiHelper';
import { API_URL, NODE_API_URL, reloadPageWithUrl } from '../../../utils/helper';
import * as Yup from 'yup'
import { Formik } from 'formik';
import { toast } from "react-toastify";

function RequestCredits (){
    const [amount,setAmount]=useState('')
    const Schema = Yup.object().shape({
       amount:Yup.number()
        .min(1,'* Amount must be greater than or equal to 1')
        .required('* This is a required field')
      });
    async function Submit(values,resetForm){
        if (values.amount && Number(values.amount) > 0){
            // setAmount(values.amount)
            let body = {"extra_credit_rq":Number(values.amount)}
            const response = await fetchDataWithAuth(`${NODE_API_URL}/requestExtraCredit`,"POST","",{'Content-Type':'application/json'},body);
            // if(data.status){
                // reloadPageWithUrl(data.data);
                // resetForm()
                // console.log(data)
            // }
            if(response.status){
                resetForm()
                toast.success("Your credit request is under processing")
            }
            else{
                toast.error(response.message)
            }
        }
    }
    return (
       
            <div className='mt-3 m-4' style={{fontFamily:'Poppins',fontSize:'14px',color:'#264653'}}>
               
                <Row>
                    <Col sm={8} lg={8}>
                    <p className='text-muted' style={{fontFamily:'Poppins',fontSize:'14px',color:'#264653'}}>
                    <b>Enter Credit Amount</b>
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
                                    <div className='d-flex'>
                                    <button 
                                            className='mt-5 btn btn-primary py-2'
                                            type='submit'
                                            style={{width:'170px',height:'40px',fontFamily:'poppins',fontSize:'14px'}}
                                            // style={{backgroundColor:'#E76F51'}}
                                        >
                                            Request Credits
                                        </button>
                                    {/* </Col>
                                    <Col> */}
                                        <button
                                            className='btn mt-5 mx-3 btn-outline-primary outline'
                                            getDocumentTypes               onClick={()=>{resetForm()}}
                                            type='reset'
                                            style={{width:'170px',height:'40px',fontFamily:'poppins',fontSize:'14px'}}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                        
                                    
                            </form>
                            )}
                        </Formik>
                    </Col>
                   
                </Row>
                {/* <Footer id="footer"/> */}
            </div>
        // </PageLayout>
    )
}

export default RequestCredits;