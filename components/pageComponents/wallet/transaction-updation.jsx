import React , { useState } from 'react';
import { Row , Col, Card, Container, Nav, Tabs, Tab } from 'react-bootstrap';
import Select from 'react-select';
import PageLayout from '../../layouts/pageLayout';
import Footer from '../footer/footer';
import { fetchDataWithAuth, fetchFormDataWithAuth } from '../../../utils/apiHelper';
import router, { useRouter } from 'next/router';
import { useEffect } from 'react';
import * as Yup from 'yup'
import { Formik } from 'formik';
import { values } from 'lodash';
import { NODE_API_URL, S3_URL } from '../../../utils/helper';
export default function TransactionUpdation (){
    const [id,setId] = useState('')
    const router = useRouter()
    const [updateValues,setUpdateValues] = useState({})
    const [submitted,setSubmitted] = useState(false)
    const [image,setImage] = useState('')
    const [reponseMessage,setResposeMessage]=useState('');
    const Schema = Yup.object().shape({
        bank_name: Yup.string()
            .min(5,'* Bank Name should be minimum 5 characters')
            .matches(/^[A-Z a-z]+$/i,'* Bank name can only be alphabets')
            .required('* This is required field'),
        utr:Yup.string()
            .required('* This is required field')
            .min(16,'* UTR should be 16 characters')
            .max(16,'* UTR should be 16 characters')
            .matches(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/,'*UTR should be alphanumeric'),
        ifsc:Yup.string()
            .required('* This is required field')
            .min(11,'* IFSC should be 11 characters')
            .max(11,'* IFSC should be 11 characters')
            .matches(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/,'*IFSC should be alphanumeric'),
        account_holder:Yup.string()
            .required('* This is required field')
            .min(3,'*Account Holder`s Name should be minimum 3 characters')
            .matches(/^[A-Z a-z 0-9]+$/i,'*Account Holder name can only be alphabets and numbers'),
        amount:Yup.number()
            .required('* This is required field')
            .min(1,'* Amount must be greater than one'),
        account_no:Yup.string()
            .required('* This is required field')
            .min(9,'* Account No should be minimum 9 digits')
            .max(17,'* Account No should be maximum 17 digits')
            .matches(/^[0-9]+$/i,'* Account No should be only numbers'),
        account_type:Yup.string()
            .required('* This is required field'),
        transaction_date:Yup.string()
            .required('* This is required field'),
        transaction_mode:Yup.string()
            .required('* This is required field'),
        image_size:Yup.string(),
      });
    const EditSchema = Yup.object().shape({
            bank_name: Yup.string()
                .min(5,'* Bank Name should be minimum 5 characters')
                .matches(/^[A-Z a-z]+$/i,'* Bank name can only be alphabets')
                .required('* This is required field'),
            utr:Yup.string()
                .required('* This is required field')
                .min(16,'* UTR should be 16 characters')
                .max(16,'* UTR should be 16 characters')
                .matches(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/,'*UTR should be alphanumeric'),
            ifsc:Yup.string()
                .required('* This is required field')
                .min(11,'* IFSC should be 11 characters')
                .max(11,'* IFSC should be 11 characters')
                .matches(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/,'*IFSC should be alphanumeric'),
            account_holder:Yup.string()
                .required('* This is required field')
                .min(3,'*Account Holder`s Name should be minimum 3 characters')
                .matches(/^[A-Z a-z 0-9]+$/i,'*Account Holder name can only be alphabets and numbers'),
            amount:Yup.number()
                .required('* This is required field')
                .min(1,'* Amount must be greater than one'),
            account_no:Yup.string()
                .required('* This is required field')
                .min(9,'* Account No should be minimum 9 digits')
                .max(17,'* Account No should be maximum 17 digits')
                .matches(/^[0-9]+$/i,'* Account No should be only numbers'),
            account_type:Yup.string()
                .required('* This is required field'),
            transaction_date:Yup.string()
                .required('* This is required field'),
            transaction_mode:Yup.string()
                .required('* This is required field'),
            document_edit: Yup.mixed()
            // .required('* This is a required field')
            .test(1024 * 1024 * 5, "* Uploaded file is too big ",
                value => !value || (value && value?.size <= 1024 * 1024 * 5))
            .test(".jpg,.jpeg,.png,.pdf", "* Uploaded file has unsupported format. (ONLY PNG,JPG,JPEG,PDF)",
                value => !value || (value && ['image/jpg', 'image/png', 'image/jpeg', 'application/pdf'].includes(value?.type)))
          });
    const onSubmit = async (data) =>{
        setSubmitted(true);
        // data['image_size'] = undefined
        var body = new FormData()
        body.append('amount',data.amount)
        body.append('account_no',data.account_no)
        body.append('bank_name',data.bank_name)
        body.append('ifsc',data.ifsc)
        body.append('account_holder',data.account_holder)
        body.append('account_type',data.account_type)
        body.append('transaction_mode',data.transaction_mode)
        body.append('utr',data.utr)
        body.append('transaction_date',data.transaction_date)
        // body.append('document_name',image.name)
        body.append('document',image)
        console.log(body)
        const response = await fetchFormDataWithAuth(`${NODE_API_URL}/offlineTxn/create`, 'POST','',null,body)
        // const response = await fetchDataWithAuth('https://nodems.2hubdev.link/offlineTxn/create', 'POST','',{'Content-Type':'application/json'},data)
        if(response.status){
            router.push('/wallet/transaction-updation-success')
        }
    }
    const onSubmitUpdate = async (data) =>{
        setSubmitted(true);
        var body = new FormData()
        body.append('amount',data.amount)
        body.append('account_no',data.account_no)
        body.append('bank_name',data.bank_name)
        body.append('ifsc',data.ifsc)
        body.append('account_holder',data.account_holder)
        body.append('account_type',data.account_type)
        body.append('transaction_mode',data.transaction_mode)
        body.append('utr',data.utr)
        body.append('transaction_date',data.transaction_date)
        body.append('document_url',updateValues.document_url)
        // body.append('document_name',image.name)
        if (data.document_edit){
            // data.document = data.document_edit
            body.append('document',data.document_edit)
            // data.document_edit = undefined
        }
        const response = await fetchFormDataWithAuth(`${NODE_API_URL}/offlineTxn/${id}/update`, 'PUT','',null,body)
        if(response.status){
            router.push('/wallet/transaction-updation-success')
        }
        else{
            setResposeMessage(response.message)
        }
    } 
    const accountTypeOptions = [
        {label:'Savings Account',value:'Savings'},
        {label:'Current Account',value:'Current'},
    ]
    const modeOptions = [
        {label:'IMPS',value:'IMPS'},
        {label:'NEFT',value:'NEFT'},
        {label:'RTGS',value:'RTGS'},
    ]
    async function getHistoryDeatilsWithID(){
        const response = await fetchDataWithAuth(`${NODE_API_URL}/offlineTxn/${id}/info`, 'GET','',{'Content-Type':'application/json'},null)
        if(response.status){
            setUpdateValues(response.data)
        }
    }
    useEffect(()=>{
        const location = window.location.search
        const query = new URLSearchParams(location)
        setId(query.get('id')?query.get('id'):'') 
    },[])
    useEffect(()=>{
        if (id)
        {
            getHistoryDeatilsWithID();
        }
    },[id])
    return (
            <div className='mt-2 mb-5' style={{fontFamily:'Poppins',fontSize:'14px',color:'#264653'}}>
                {
                    id 
                    ?
                    (
                        <Formik
                            initialValues={updateValues}
                            enableReinitialize={true}
                            validationSchema={id?EditSchema:Schema}
                            onSubmit={values => {
                               onSubmitUpdate(values)
                            }}
                            >
                            {({values,errors,resetForm,handleChange,handleSubmit,setFieldError,setFieldValue,touched,setErrors}) => (
                                <form className='mt-4' onSubmit={handleSubmit}>
                                <Row className=' mt-2 mx-0 p-0 m-0'>
                                    <Col className='mt-2'lg={6}>
                                                <p className='text-muted'>
                                                    <p style={{color:'#264653',fontFamily:'poppins',fontSize:'14px'}}>Account No</p>
                                                </p>
                                                <input
                                                    className='mt-2 mb-3 form-control transaction-input' 
                                                    type='text' 
                                                    placeholder='XXXXXXXXXXX'
                                                    name='account_no' 
                                                    value={values.account_no}
                                                    onChange={(e)=>handleChange(e)}
                                                />
                                                {errors['account_no'] && touched['account_no'] && (
                                                    <span className="text-danger">
                                                        {errors['account_no']}
                                                    </span>
                                                )}
                                                <div className='mt-3 text-muted'>
                                                    <p style={{color:'#264653',fontFamily:'poppins',fontSize:'14px'}}>Account Type</p>
                                                </div>
                                                <Select
                                                    className='form-control m-0 p-0 h-auto mt-1 transaction-input mb-3'
                                                    options={accountTypeOptions}
                                                    value={values.account_type?accountTypeOptions.filter((val,index)=>{
                                                        return val.value === values.account_type?val:''
                                                    }):''} 
                                                    onChange={(e)=>{setFieldValue('account_type',e.value)}}
                                                />
                                                {errors['account_type'] &&touched['account_type'] && (
                                                    <span className="text-danger">
                                                        {errors['account_type']}
                                                    </span>
                                                )}
                                                <div className='mt-3 text-muted'>
                                                    <p style={{color:'#264653',fontFamily:'poppins',fontSize:'14px'}}>Date of Transaction</p>
                                                </div>
                                                <input
                                                    className='mt-2 mb-3 form-control transaction-input' 
                                                    type='date' 
                                                    name='transaction_date'
                                                    // {...register(('transaction_date'),{required:true})}
                                                    value={new Date(values.transaction_date).toLocaleDateString('en-CA')}
                                                    onChange={(e)=>handleChange(e)}
                                                    // onChange={(e)=>setDate(e.target.value)}
                                                />
                                                {errors['transaction_date'] && touched['transaction_date'] && (
                                                    <span className="text-danger">
                                                        {errors['transaction_date']}
                                                    </span>
                                                )}
                                                <div className='mt-3 text-muted'>
                                                    <p style={{color:'#264653',fontFamily:'poppins',fontSize:'14px'}}>Mode of Transaction</p>
                                                </div>
                                                <Select
                                                    className='form-control m-0 p-0 h-auto mt-1 transaction-input mb-3'
                                                    options={modeOptions}
                                                    value={values.transaction_mode?modeOptions.filter((val,index)=>{
                                                        return val.value === values.transaction_mode?val:''
                                                    }):''} 
                                                    onChange={(e)=>{setFieldValue('transaction_mode',e.value)}}
                                                />
                                                {errors['transaction_mode'] && touched['transaction_mode'] && (
                                                    <span className="text-danger">
                                                        {errors['transaction_mode']}
                                                    </span>
                                                )}
                                                 <div className='mt-3 text-muted'>
                                                    <p style={{color:'#264653',fontFamily:'poppins',fontSize:'14px'}}>Account Holder Name</p>
                                                </div>
                                                <input
                                                    className='mt-2 mb-3 form-control transaction-input' 
                                                    type='text' 
                                                    placeholder='XXXXXXXXXXX'
                                                    // {...register(('account_holder'),{required:true})}
                                                    name='account_holder' 
                                                    value={values.account_holder}
                                                    onChange={(e)=>handleChange(e)}
                                                    // onChange={(e)=>setAccountNo(e.target.value)}
                                                />
                                                {errors['account_holder'] && touched['account_holder'] &&(
                                                    <span className="text-danger">
                                                       {errors['account_holder']}
                                                    </span>
                                                )}
                                                 <div className='mt-3 text-muted'>
                                                    <p style={{color:'#264653',fontFamily:'poppins',fontSize:'14px'}}>Amount</p>
                                                </div>
                                                <input
                                                    className='mt-2 mb-3 form-control transaction-input' 
                                                    type='number' 
                                                    placeholder='Rs.5000'
                                                    // {...register(('amount'),{required:true,min:1})}
                                                    name='amount' 
                                                    value={values.amount}
                                                    onChange={(e)=>handleChange(e)}
                                                    // onChange={(e)=>setAccountNo(e.target.value)}
                                                />
                                                {errors['amount'] && touched['amount'] &&(
                                                    <span className="text-danger">
                                                        {errors['amount']}
                                                    </span>
                                                )}
                                            
                                    </Col>
                                    <Col className='' lg={4}>
                                        
                                            
                                                <div className='mt-2'>
                                                <p className='text-muted'><p style={{color:'#264653',fontFamily:'poppins',fontSize:'14px'}}>Bank Name</p></p>
                                                    <input
                                                        type='text'
                                                        className='mt-2 mb-3 form-control transaction-input' 
                                                        placeholder='ICICI Bank' 
                                                        name='bank_name'
                                                        // {...register(('bank_name'),{required:true})}
                                                        value={values.bank_name}
                                                        onChange={(e)=>handleChange(e)}
                                                        // onChange={(e)=>{setBankName(e.target.value)}}
                                                    />
                                                    {errors['bank_name'] && touched['bank_name'] &&(
                                                        <p className="text-danger">
                                                           {errors['bank_name']}
                                                        </p>
                                                    )}
                                                    <p className='text-muted'><p style={{color:'#264653',fontFamily:'poppins',fontSize:'14px'}}>IFSC Code</p></p>
                                                    <input
                                                        type='text'
                                                        className='mt-2 mb-3 form-control transaction-input' 
                                                        placeholder='XXXXXXXXX' 
                                                        name='ifsc'
                                                        // {...register(('ifsc'),{required:true})}
                                                        value={values.ifsc}
                                                        onChange={(e)=>handleChange(e)}
                                                        // onChange={(e)=>{setIfsc(e.target.value)}}
                                                    />
                                                    {errors['ifsc'] && touched['ifsc'] &&(
                                                        <p className="text-danger">
                                                            {errors['ifsc']}
                                                        </p>
                                                    )}
                                                    <p className='text-muted'><p style={{color:'#264653',fontFamily:'poppins',fontSize:'14px'}}>UTR</p></p>
                                                    <input
                                                        type='text'
                                                        placeholder='XXXXXXXXXXXX' 
                                                        className='mt-2 mb-3 form-control transaction-input' 
                                                        name='utr'
                                                        // {...register(('utr'),{required:true})}
                                                        value={values.utr}
                                                        onChange={(e)=>handleChange(e)}
                                                        // onChange={(e)=>{setUtr(e.target.value)}}
                                                    />
                                                    {errors['utr'] && touched['ure'] &&(
                                                        <p className="text-danger">
                                                            {errors['utr']}
                                                        </p>
                                                    )}
                                                    <div className='text-muted'><p style={{color:'#264653',fontFamily:'poppins',fontSize:'14px'}}>Document Image</p></div>
                                                <div className='d-flex flex-row'>
                                                    {
                                                        id && <div><div style={{border:'1px dashed #000000',borderRadius:'5px',width:'185px',height:'169px'}}>
                                                        <a target="_blank" rel="noopener noreferrer" href={!values.document_edit?S3_URL+'documents/offlineTransaction/'+values.document_url:URL.createObjectURL(values?.document_edit)} >
                                                            {
                                                                values?.document_edit?.type  === 'application/pdf' || ( !values.document_edit && values?.document_url?.includes('.pdf'))
                                                                ?
                                                                <img  className='w-100 h-75 mt-0' src={'/images/pdf-preview.png'} />
                                                                :
                                                                <img  className='d-flex w-100 h-100' src={values?.document_edit?URL.createObjectURL(values?.document_edit):S3_URL+'documents/offlineTransaction/'+values.document_url}  />
                                                            }
                                                        </a>
                                                        </div>
                                                        <p className=''>{
                                                                values?.document_edit?.name
                                                            }</p>   
                                                        </div>
                                                    
                                                }
                                                
                                                <div className='mx-1'>{' '}&nbsp;</div>
                                {
                                    id && <label class="btn btn-file" style={{width:'138px',height:'41px',fontSize:'14px',fontFamily:'poppins',backgroundColor:'#F36B25',color:'#fff'}}>
                                    <p className='mt-1 mx-4'>Change</p>
                                    <input type="file" style={{display:'none'}}  accept='.png,.jpeg,.jpg,.pdf' size={''+(1024*1024*5)}  onChange={(e)=>{
                                          setFieldValue('document_edit',e?.target?.files[0])
                                        }}
                                    />
                                    </label>
                                }    
                                {
                                    errors['document_edit'] && touched['document_edit'] && <span className='mx-1 text-danger'>{errors['document_edit']}</span>
                                }
                                
                                </div>
                        </div>
                                {/* </div> */}
                                </Col>
                                </Row>
                                <Row className='mt-5 g-2'>
                                                    <Col  xs={12} md={12} lg={3} xl={2}>
                                                        <button 
                                                            type='submit'
                                                            className='btn btn-primary'
                                                            // disabled={submitted}
                                                            style={{width: '170px',height:'40px'}}
                                                        >
                                                            Update
                                                        </button>
                                                        
                                                    </Col>
                                                    <Col lg={5}>
                                                        <button
                                                            className='btn btn-outline-primary mx-4 outline'
                                                            style={{width: '170px',height:'40px'}}
                                                           
                                                            onClick={()=>{resetForm();router.push('/home')}}
                                                            type='reset'
                                                        >
                                                            Cancel
                                                        </button>
                                                    </Col>
                                                    {
                                                        <p className='mt-2 text-danger'>{reponseMessage}</p>
                                                    }
                                                </Row>
                                </form>
                            
                            )}
                        </Formik>
                    )
                    :
                    (
                        <Formik
                            initialValues={{
                                bank_name: '',
                                utr:'',
                                ifsc:'',
                                account_holder:'',
                                amount:'',
                                account_no:'',
                                account_type:'',
                                transaction_date:'',
                                transaction_mode:'',
                                image_size:''
                            }}
                            validationSchema={Schema}
                            onSubmit={values => {
                                onSubmit(values)
                            }}
                        >
                        
                        {({values,errors,resetForm,handleChange,handleSubmit,handleBlur,setFieldError,setFieldValue,touched}) => (
                            <form className='mt-4' onSubmit={handleSubmit}>
                            <Row className=' mt-2 mx-0 p-0 m-0'>
                                <Col className='mt-2'lg={6}>
                                            <p className='text-muted'>
                                                <p style={{color:'#264653',fontFamily:'poppins',fontSize:'14px'}}>Account No</p>
                                            </p>
                                            <input
                                                className='mt-2 mb-3 form-control transaction-input' 
                                                type='text' 
                                                placeholder='XXXXXXXXXXX'
                                                name='account_no' 
                                                onBlur={handleBlur}
                                                value={values.account_no}
                                                onChange={(e)=>handleChange(e)}
                                            />
                                            {errors['account_no'] && touched['account_no'] &&(
                                                <span className="text-danger">
                                                    {errors['account_no']}
                                                </span>
                                            )}
                                            <div className='mt-3 text-muted'>
                                                <p style={{color:'#264653',fontFamily:'poppins',fontSize:'14px'}}>Account Type</p>
                                            </div>
                                            <Select
                                                className='form-control m-0 p-0 h-auto mt-1 transaction-input mb-3'
                                                options={accountTypeOptions}
                                                onBlur={handleBlur}
                                                value={values.account_type?accountTypeOptions.filter((val,index)=>{
                                                    return val.value === values.account_type?val:''
                                                }):''} 
                                                onChange={(e)=>{setFieldValue('account_type',e.value)}}
                                            />
                                            {errors['account_type'] && touched['account_type'] &&(
                                                <span className="text-danger">
                                                    {errors['account_type']}
                                                </span>
                                            )}
                                            <div className='mt-3 text-muted'>
                                                <p style={{color:'#264653',fontFamily:'poppins',fontSize:'14px'}}>Date of Transaction</p>
                                            </div>
                                            <input
                                                className='mt-2 mb-3 form-control transaction-input' 
                                                type='date' 
                                                onBlur={handleBlur}
                                                name='transaction_date'
                                                placeholder='mm-dd-yyyy'
                                                // {...register(('transaction_date'),{required:true})}
                                                // value={new Date(values.transaction_date).toLocaleDateString('en-CA')}
                                                onChange={(e)=>handleChange(e)}
                                                // onChange={(e)=>setDate(e.target.value)}
                                            />
                                            {errors['transaction_date'] && touched['transaction_date'] &&(
                                                <span className="text-danger">
                                                    {errors['transaction_date']}
                                                </span>
                                            )}
                                            <div className='mt-3 text-muted'>
                                                <p style={{color:'#264653',fontFamily:'poppins',fontSize:'14px'}}>Mode of Transaction</p>
                                            </div>
                                            <Select
                                                className='form-control m-0 p-0 h-auto mt-1 transaction-input mb-3'
                                                options={modeOptions}
                                                onBlur={handleBlur}
                                                value={values.transaction_mode?modeOptions.filter((val,index)=>{
                                                    return val.value === values.transaction_mode?val:''
                                                }):''} 
                                                onChange={(e)=>{setFieldValue('transaction_mode',e.value)}}
                                            />
                                            {errors['transaction_mode'] && touched['transaction_mode'] &&(
                                                <span className="text-danger">
                                                    {errors['transaction_mode']}
                                                </span>
                                            )}
                                             <div className='mt-3 text-muted'>
                                                <p style={{color:'#264653',fontFamily:'poppins',fontSize:'14px'}}>Account Holder Name</p>
                                            </div>
                                            <input
                                                className='mt-2 mb-3 form-control transaction-input' 
                                                type='text' 
                                                onBlur={handleBlur}
                                                placeholder='XXXXXXXXXXX'
                                                // {...register(('account_holder'),{required:true})}
                                                name='account_holder' 
                                                value={values.account_holder}
                                                onChange={(e)=>handleChange(e)}
                                                // onChange={(e)=>setAccountNo(e.target.value)}
                                            />
                                            {errors['account_holder'] && touched['account_holder'] && (
                                                <span className="text-danger">
                                                   {errors['account_holder']}
                                                </span>
                                            )}
                                             <div className='mt-3 text-muted'>
                                                <p style={{color:'#264653',fontFamily:'poppins',fontSize:'14px'}}>Amount</p>
                                            </div>
                                            <input
                                                className='mt-2 mb-3 form-control transaction-input' 
                                                type='number' 
                                                onBlur={handleBlur}
                                                placeholder='Rs.5000'
                                                // {...register(('amount'),{required:true,min:1})}
                                                name='amount' 
                                                value={values.amount}
                                                onChange={(e)=>handleChange(e)}
                                                // onChange={(e)=>setAccountNo(e.target.value)}
                                            />
                                            {errors['amount'] && touched['amount'] &&(
                                                <span className="text-danger">
                                                    {errors['amount']}
                                                </span>
                                            )}
                                           
                                       
                                </Col>
                                <Col className='' lg={4}>
                                    
                                        
                                            <div className='mt-2'>
                                            <p className='text-muted'><p style={{color:'#264653',fontFamily:'poppins',fontSize:'14px'}}>Bank Name</p></p>
                                                <input
                                                    type='text'
                                                    className='mt-2 mb-3 form-control transaction-input' 
                                                    placeholder='ICICI Bank' 
                                                    name='bank_name'
                                                    onBlur={handleBlur}
                                                    // {...register(('bank_name'),{required:true})}
                                                    value={values.bank_name}
                                                    onChange={(e)=>handleChange(e)}
                                                    // onChange={(e)=>{setBankName(e.target.value)}}
                                                />
                                                {errors['bank_name'] && touched['bank_name'] &&(
                                                    <p className="text-danger">
                                                       {errors['bank_name']}
                                                    </p>
                                                )}
                                                <p className='text-muted'><p style={{color:'#264653',fontFamily:'poppins',fontSize:'14px'}}>IFSC Code</p></p>
                                                <input
                                                    type='text'
                                                    className='mt-2 mb-3 form-control transaction-input' 
                                                    placeholder='XXXXXXXXX' 
                                                    name='ifsc'
                                                    onBlur={handleBlur}
                                                    // {...register(('ifsc'),{required:true})}
                                                    value={values.ifsc}
                                                    onChange={(e)=>setFieldValue('ifsc',e.target.value)}
                                                    // onChange={(e)=>{setIfsc(e.target.value)}}
                                                />
                                                {errors['ifsc'] && touched['ifsc'] &&(
                                                    <p className="text-danger">
                                                        {errors['ifsc']}
                                                    </p>
                                                )}
                                                <p className='text-muted'><p style={{color:'#264653',fontFamily:'poppins',fontSize:'14px'}}>UTR</p></p>
                                                <input
                                                    type='text'
                                                    placeholder='XXXXXXXXXXXX' 
                                                    className='mt-2 mb-3 form-control transaction-input' 
                                                    name='utr'
                                                    onBlur={handleBlur}
                                                    // {...register(('utr'),{required:true})}
                                                    value={values.utr}
                                                    onChange={(e)=>handleChange(e)}
                                                    // onChange={(e)=>{setUtr(e.target.value)}}
                                                />
                                                {errors['utr'] && touched['utr'] &&(
                                                    <p className="text-danger">
                                                        {errors['utr']}
                                                    </p>
                                                )}
                                                <p className='text-muted'><p style={{color:'#264653',fontFamily:'poppins',fontSize:'14px'}}>Upload Image</p></p>
                                                <div className="profile-form mb-20 mt-3">
                                                
                                                <div className="upload-btn-wrapper">
                                                    <button className="btn upload-btn" style={{width:'400px',fontFamily:'poppins',fontSize:'14px',cursor:'pointer'}}>
                                                    <Row className='p-0 w-100 d-flex'>
                                                    <Col lg={1} hidden={image} className=''>
                                                        <img src="/images/upload.png" />
                                                    </Col>
                                                    <Col lg={6} hidden={image} className=''>
                                                        <p style={{color:'#264653',fontFamily:'poppins',fontSize:'14px'}}>Upload Receipt</p>
                                                        <p className='mt-1 text-muted'>(Max size 2mb)</p>
                                                    </Col>
                                                    <Col lg={6} hidden={!image} className='m-0'>
                                                    {
                                                        image?.type  === 'application/pdf'
                                                        ?
                                                        <img  className='w-100 h-75 mt-0' src={'/images/pdf-preview.png'} />
                                                        :
                                                        <img className='d-flex w-100 h-100' src={image?URL.createObjectURL(image):''}  />
                                                    }
                                                    </Col>
                                                    {
                                                        image && <Col lg={6}>{image.name}</Col>
                                                    }
                                                </Row>
                                                    </button>
                                                    <input type="file" name="myfile" accept='' onBlur={handleBlur} size={'1024'} onChange={(e)=>{
                                                            if(e.target.files[0]?.size > 2e6){
                                                                setFieldError('image_size','* Image size should be less than 2MB')
                                                            }
                                                            else{
                                                                setImage(e.target.files[0])
                                                                // setFieldValue('document',e.target.files[0])
                                                            }
                                                        }}
                                                    />
                                                    {
                                                        errors['image_size'] &&  <p className="text-danger">
                                                            {errors['image_size']}
                                                    </p>

                                                    }
                                                    <p>
                                                        {values.document}
                                                    </p>
                                                </div>
                                                    {/* <div className="upload-wrapper-modified h-25">
                                                        <input type='file' name='receipt' className='custom-file-input' width={'100%'}/>
                                                        
                                                        <Row className='p-0'>
                                                            <Col lg={2} className='m-0 mx-5 p-0'>
                                                                <img src="/images/upload.png" />
                                                            </Col>
                                                            <Col lg={6} className='m-0 mb-3 p-0'>
                                                                <p style={{color:'#264653',fontFamily:'poppins',fontSize:'14px'}}>Upload Receipt</p>
                                                                <p className='mt-2 text-muted'>(Max size 2mb)</p>
                                                            </Col>
                                                        </Row>
                                                    </div> */}
                                                </div>
                                            </div>
                                       
                                </Col>
                            </Row>
                            <Row className='mt-5 g-2'>
                                                <Col xs={12} md={12} lg={3} xl={2}>
                                                    <button 
                                                        type='submit'
                                                        className='btn btn-primary'
                                                        // disabled={submitted}
                                                        style={{width: '170px',height:'40px'}}
                                                    >
                                                        Update
                                                    </button>
                                                    
                                                </Col>
                                                <Col lg={5}>
                                                    <button
                                                        className='btn btn-outline-primary mx-4 outline'
                                                        style={{width: '170px',height:'40px'}}
                                                        onClick={()=>{resetForm();setImage('');router.push('/home')}}
                                                         type='reset'
                                                    >
                                                        Cancel
                                                    </button>
                                                </Col>
                                               
                                            </Row>
                            </form>
                        
                        )}
                    </Formik>
                    )
                }
                {/* <Footer id="footer"/> */}
            </div>
        // </PageLayout>
    )
}