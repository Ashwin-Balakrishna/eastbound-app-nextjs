import {React , useState, useEffect} from "react";
import { Form } from "react-bootstrap";
import { S3_URL } from "../../../utils/helper";
import Select from "react-select";
import { fetchFormDataWithAuth  } from '../../../utils/apiHelper';
import { getSessionToken,NODE_API_URL, getUrlParameter } from '../../../utils/helper';
import { useRouter } from 'next/router';
import ErrorText from '../../elements/errorText';
import UploadImage from "../../elements/uploadImage";
import NewRadioBtn from "../../elements/newRadioBtn";
import RadioGroup from "../../elements/radioGroup";
import { Formik } from "formik";
import * as Yup from 'yup'
import { useWindowSize } from '../../../hooks/useWindowSize';
const addBranch = (props) => {
  
   const screenSize = useWindowSize();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => setIsMobile(screenSize.width <= 991), [screenSize]);
  
  const schema = Yup.object().shape({
    branch_name:Yup.string()
      .required('* This is a required field'),
    email:Yup.string()
      .required('* This is a required field'),
    state_id:Yup.string()
      .required('* This is a required field'),
    gst_no:Yup.string()
      .required('* This is a required field')
      .min(15,'* Billing GST should be 15 characters')
      .max(15,'* Billing GST should be 15 characters')
      .matches(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/,'*Billing GST should be alphanumeric'),
    // gst_document:Yup.mixed()
    //   // .required('* This is a required field')
    //   .test(1024*1024*5, "* Uploaded file is too big , Max Size 5 MB", 
    //   value =>!value || ( value && value?.size <= 1024*1024*5))
    //   .test(".jpg,.jpeg,.png,.pdf", "* Uploaded file has unsupported format. (ONLY PNG,JPG,JPEG,PDF)", 
    //   value => !value || (value && ['image/jpg','image/png','image/jpeg','application/pdf'].includes(value?.type))),
    city:Yup.string()
      .required('* This is a required field'),
    address:Yup.string()
      .required('* This is a required field'),
    branch_head:Yup.string()
      // .matches(/^[a-z A-Z]$/,'* Only Alphabets')
  })
  const router=useRouter();
  const [states,setStates]= useState([]);
  const [cities, setCities] = useState([]);
  const [values, setValues] = useState([]);

  const [staff, setStaff] = useState([]);
  const [isGst, setIsGst] = useState(false);
  const [gst_no, setGstNo] = useState();
  const [gstImage, setGstImage] = useState([]);
  const [errorText, setErrorText] = useState('');
  const [gstRadio, setGstRadio] = useState(false);
  const [gst,setGST] = useState(false)
  const [initialValues, setInitialValues] = useState({});
   const getStates = async () => {
    const state = await fetchFormDataWithAuth(
          `${NODE_API_URL}/user/admin/destination?market=state`,
          "GET",
          null,
          null
          
    );
    
    setStates(state["data"]);     
  }



  const getCities = async (state_name,state_id,setFieldValue, agencyRes) => {
    console.log("agency",agencyRes)
    // console.log("STATE=>", state_name);
    const city = await fetchFormDataWithAuth(
      
          `${NODE_API_URL}/user/admin/destination?market=city&state=${state_name}`,
          "GET",
          null,
          null
          
    );
    setCities(city["data"]);     
    try {
        const gst = await fetchFormDataWithAuth(
          `${NODE_API_URL}/user/agent/branchStateCheck?state_id=${state_id}`,
          "GET",
          null,
          null,
          null
        );
      console.log(gst["status"])
      setIsGst(gst["status"])

      if (gst["status"])
      {
        
    
          gst["status"] && gst["data"]?.gst_no && setGstNo(gst["data"]?.gst_no)
        
          if (setFieldValue) {
            setFieldValue('gst_no', gst["data"]?.gst_no)
            setFieldValue('gst_id', gst["data"]?.gst_id)
            
            
        }
        if(agencyRes){

                  let image={
                    
              preview:S3_URL+ 'documents/GST/agency/'+ gst["data"].document_file,
                name:gst["data"].document_file||'',
                size: props?.values?.gst_file_size||'',

            }
            setGstImage([image])
            
          }



          else{
            let image={
              preview:S3_URL+ 'documents/GST/agency/'+ gst["data"].document_file,
                name:gst["data"].document_file||'',
                size: props?.values?.gst_file_size||'',

            }
            setGstImage([image])
        }
        if(agencyRes){
            setInitialValues(
            {
            branch_name:agencyRes?.branch_name,
            email:agencyRes?.email,
            state_id:agencyRes?.state_id,
            gst_no: gst["data"]?.gst_no,
            gst_document: gst["data"]?.document_file,
            city:agencyRes?.city,
            address:agencyRes?.address,
            branch_head: agencyRes?.branch_head,
            gst_id:gst["data"]?.gst_id,
          })
        }
          
      }


         else {
           setGstNo(null)
           setGstImage([])
          if (setFieldValue) {
            setFieldValue('gst_id','')
            setFieldValue('gst_no','')
          }

          if(agencyRes){
            
  setInitialValues(
  {
  branch_name:agencyRes.branch_name,
  email:agencyRes.email,
  state_id:agencyRes.state_id,
  city:agencyRes.city,
  address:agencyRes.address,
  branch_head: agencyRes.branch_head,
  
})
          }
        
        
        
            
          }
        }
       

        
        catch (error) {
          throw new Error(error);
        }
       
        
      }
        
        
        
     

  

   const getstaff = async () => {
    
    const staffs = await fetchFormDataWithAuth(
          `${NODE_API_URL}/user/agent/list`,
          "GET",
          null,
          null,
          null
    );
  
    setStaff(staffs["data"]);

      
  }

  
  
  // const getBheads = async () => {
  //   const bheadss = await fetchFormDataWithAuth(
  //         `${NODE_API_URL}/user/admin/destination`,
  //         "GET",
  //         null,
  //         null
          
  //   );
  //   setBheads(bheadss["data"]);     
  // }


console.log("gstImage",gstImage[0])
  


  useEffect(() => {
    setInitialValues({
      branch_name:'',
      email:'',
      state_id:'',
      gst_no:gst_no || '',
      gst_document:null,
      city:'',
      address:'',
      branch_head:''
    })
    getData();
   
  },[])


  const getData=async()=>{
    if(props.operation!='add'){
    getstaff();
    getStatesAndBranch();
    }
    else{
      getStates();
      getstaff();
  }
  }

  const getStatesAndBranch=async()=>{
    const state = await fetchFormDataWithAuth(
      `${NODE_API_URL}/user/admin/destination?market=state`,
      "GET",
      null,
      null
      
);
setStates(state["data"]);     
    let id = getUrlParameter('id')
    try{
    const response = await fetchFormDataWithAuth(
      `${NODE_API_URL}/user/agent/getAgencyBranch`,
      "GET",
      `id=${id}`,
      null,
      null
);
if(response&&!response.status){
console.log(response.message)
}
else{
  var stateValues = state["data"].filter((value)=>{
    return value.id === response.data[0].state_id
  })
  // console.log("test",stateValues[0].value, response.data[0].state_id)
  getCities(stateValues[0].value,response.data[0].state_id,null, response.data[0]);
  // if(response.data[0].gst_document){
    // let image={
    //   preview:S3_URL+ 'documents/GST/agency/' +response.data[0].document_file,
    //     name:props?.values?.gst_file_name||'',
    //     size: props?.values?.gst_file_size||'',

    // }
    // setGstImage([image])
    
  // }
//   setInitialValues(
//   {
//   branch_name:response.data[0].branch_name,
//   email:response.data[0].email,
//   state_id:response.data[0].state_id,
//   gst_no: response.data[0].gst_no,
//   gst_document: response.data[0].document_file,
//   city:response.data[0].city,
//   address:response.data[0].address,
//   branch_head: response.data[0].branch_head,
//   gst_id:response.data[0].gst_id,
// })
}
    } catch(err){
      console.log(err)
    }
// console.log("res", response)
  }

  const stateOptions=states?.map((i) => ({ label: i.value, value: i.id }))
  const cityOptions=cities?.map((i) => ({ label: i.value, value: i.value }))
  const bheadOptions=staff?.map((i) => ({ label: i.name, value: i.name }))


   const branchopt = [
    { value: "HSR", label: "HSR" },
    { value: "HBR", label: "HBR" },
    { value: "WhiteField", label: "WhiteField" },
  ];


  // onchange
  const handleSelect = async (name, value) => {
    setValues({...values,[name]:value.value})
    // values[name] = value.value;
   
    if (name == "state") {
      
      getCities(value.label);
      try {
        const gst = await fetchFormDataWithAuth(
          `${NODE_API_URL}/user/agent/branchStateCheck?state_id=${value.value}`,
          "GET",
          null,
          null,
          null
        );
        if(gst["status"])
        {gst["status"] && gst["data"]?.gst_no && setGstNo(gst["data"]?.gst_no)
        
        gst["status"] && gst["data"]?.document_file.length>0 && 
          setGstImage([{
            preview: S3_URL + 'documents/GST/agency/' + gst["data"].document_file,
            name: gst["data"]?.document_file || '',
            size: gst["data"]?.document_size || '',
            existing: true,
            data: gst["data"]?.document_file || undefined
          }])}
        
        }

        
        catch (error) {
          throw new Error(error);
        }
     


    }
  }
  const handleChange = (e) => {
     console.log(e.target.name,e.target.value)
    setValues({...values,[e.target.name]:e.target.value})
     // values[e.target.name]=e.target.value;
   
    

  }
  const addBranches = async (values) => {

  try   { 
    const payload = new FormData();
    if(props.operation==='edit'){
      let q=router.query;
    payload.append("branch_id",q.id);
    }
    payload.append("branch_name",values.branch_name);
    payload.append("branch_head",values.branch_head);
    payload.append("email",values.email);
    payload.append("state_id",values.state_id);
    payload.append("city",values.city);
    payload.append("address", values.address);
    console.log("gst_type_doc=>",typeof(gstImage), typeof({}), gstImage[0]?.lastModified,payload);

    if((props.operation == "add" && isGst) || (props.operation== "edit" && !gstImage[0].lastModified)){
    payload.append("gst_id", values.gst_id);
    }
    else{
      payload.append("gst_no", values.gst_no);
      payload.append("gst_document", gstImage[0]);

    }
    
    

    let url = props.operation=='add'?'/user/agent/addBranch':'/user/agent/editBranch';

    const addbranch = await fetchFormDataWithAuth(
          `${NODE_API_URL}${url}`,
          "POST",
          null,
          null,
          payload
    );
     if(addbranch){
      router.push('/branchdetails')
    }
    else{
      toast.error(response.message);
    }
    
  }
  catch(error){
  console.log(error);
  }
  }
  return (
    <>
      <div className="profile-card-wrapper">
        <div className="profile-overview-top">
          <div className="profile-overview-heading">
            <img src="/images/profile-status.png" />
            <h4>Branch Details</h4>
          </div>
          {/* <div className="profile-overview-action">
            <ul>
              <li>
                <img src="/images/edit.png" />
              </li>
              <li>
                <img src="/images/collapse.png" />
              </li>
            </ul>
          </div> */}
        </div>
        <div className="profile-overview-bottom">
          <div className={props.operation=='view'?"profile-form pointer-events-none":"profile-form"}>
            <div className="profile-divider">
              <div className="width-60">
                <Formik
                enableReinitialize={true}
                initialValues={initialValues}
                // enableReinitialize={true}
                validationSchema={schema}
                onSubmit={async (data, { setSubmitting, resetForm }) => {
                  console.log(data);
                  addBranches(data)
                  
                }}
                >
                  {({values,handleChange,touched,resetForm,handleBlur,errors,setFieldValue,handleSubmit}) => (
                    <Form onSubmit={handleSubmit}>
                    <Form.Group>
                      <Form.Label>Branch Name</Form.Label>
                      <input class="form-control" type="text" onBlur={handleBlur} value={values.branch_name} name="branch_name" onChange={(e) => { handleChange(e) }} placeholder="Enter agency name" />
                      {
                        errors['branch_name'] && touched['branch_name'] && <span className="text-danger">
                          {errors['branch_name']}
                        </span>                     
                      }
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Branch Head</Form.Label>
                      <div className="py-2" style={{ border: "1px solid #e5e5ea", borderRadius: "10px" }}>
                        <Select value={values.branch_head?bheadOptions.filter((value)=>{
                          return value.value === values.branch_head
                        }):''} options={bheadOptions}  onChange={(e)=>setFieldValue('branch_head',e.value)} />
                      </div>
                      {
                        errors['branch_head'] && touched['branch_head'] && <span className="text-danger">
                          {errors['branch_head']}
                        </span>                     
                      }
                    </Form.Group>
  
                    <Form.Group>
                      <Form.Label>Branch Email ID</Form.Label>
                      <input class="form-control" value={values.email} type="email" name="email" onChange={(e)=>handleChange(e)} placeholder="Enter your email id" />
                      {
                        errors['email'] && touched['email'] && <span className="text-danger">
                          {errors['email']}
                        </span>                     
                      }
                    </Form.Group>
  
                    <div>
                      <Form.Group>
                        <Form.Label>State</Form.Label>
                        <div className="py-2" style={{ border: "1px solid #e5e5ea", borderRadius: "10px" }}>
                        <Select name={'state_id'} value={values.state_id?stateOptions.filter((value)=>{
                          return value.value === values.state_id?value:""
                        }):''} options={stateOptions}  onChange={(e)=>{setFieldValue('state_id',e.value);getCities(e.label,e.value,setFieldValue)}}/>
                      </div>
                      {
                        errors['state_id'] && touched['state_id'] && <span className="text-danger">
                          {errors['state_id']}
                        </span>                     
                      }
                      </Form.Group>
                    </div>
  
  
                    <div>
                      <Form.Group>
                        <Form.Label>City</Form.Label>
                        <div className="py-2" style={{ border: "1px solid #e5e5ea", borderRadius: "10px" }}>
                        <Select options={cityOptions} value={values.state_id?cityOptions.filter((value)=>{
                          return value.label === values.city?value:""
                        }):''} onChange={(e)=>setFieldValue('city',e.value)}/>
                        
                      </div>
                      {
                        errors['city'] && touched['city'] && <span className="text-danger">
                          {errors['city']}
                        </span>                     
                      }
                      </Form.Group>
                    </div>
                <div className="my-3" hidden={gst}>  
                  <div>
                    <Form.Group>
                      <Form.Label>Enter GST No:</Form.Label>
                          <input disabled={props.operation=="add" && isGst} class="form-control"  type="gst_no" name="gst_no" value={values.gst_no} onChange={(e)=>handleChange(e)} placeholder="Enter your GST NO" />
                       {
                        errors['gst_no'] && touched['gst_no'] && <span className="text-danger">
                          {errors['gst_no']}
                        </span>                     
                      }
                    </Form.Group>
                  </div>
                  <div className={gstImage.length > 0 ? "upload-wrapper no-border h-140" : "upload-wrapper h-140"}>
                    <UploadImage setError={setErrorText} image={gstImage} setImage={setGstImage} docName="Upload Supporting Document" viewChange={((props.operation==="view")|| (props.operation=="add" && isGst))?false:true } sizeText="Drag & drop pdf, jpg or png file here (Max size 5mb)" maxSize='5mb' />
                    {/* {
                        errors['gst_document'] && touched['gst_document'] && <span className="text-danger"><br />
                          {errors['gst_document']}
                        </span>                     
                      } */}
                  </div>
                </div>
                    
                    
  
                    
                    {/* <Form.Group>
                      <Form.Label>Reporting Manager</Form.Label>
                      <div className="py-2" style={{ border: "1px solid #e5e5ea", borderRadius: "10px" }}>
                        <Select options={staffcount} />
                      </div>
                    </Form.Group> */}
  
                    <div classNmae="mt-3">
                      <Form.Group>
                        <Form.Label>Address</Form.Label>
                        <textarea class="form-control" value={values.address} onChange={(e)=>handleChange(e)} name="address" type="textarea" row={10} coloumn={25} placeholder="Enter your Address" />
                        {
                        errors['address'] && touched['address'] && <span className="text-danger">
                          {errors['address']}
                        </span>                     
                      }
                      </Form.Group>
                    </div>
  
  
  
  
                   {props.operation!='view' &&
                   <div className="d-flex">
                      <div>
                        <button className="btn btn-block btn__primary" type="submit">
                          {!isMobile?<>&nbsp;&nbsp;&nbsp;&nbsp;</>:""}{props.operation=='add'?'Add':'Update'} {!isMobile?<>&nbsp;&nbsp;&nbsp;&nbsp;</>:""}
                        </button>
                      </div>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                      <div>
                            <button className="btn btn-block btn-outline-primary" onClick={(e) => {  e.preventDefault(); router.push("/branchdetails") } }>
                          {!isMobile?<>&nbsp;&nbsp;&nbsp;</>:""} Cancel {!isMobile?<>&nbsp;&nbsp;</>:""}
                        </button>
                      </div>
                    </div>}
                  </Form>

                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default addBranch;
