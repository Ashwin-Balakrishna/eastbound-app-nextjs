import { React, useState, useEffect } from 'react';
import { Form, FormControl } from "react-bootstrap";
import { fetchFormDataWithAuth  } from '../../../utils/apiHelper';
import { getSessionToken,NODE_API_URL, API_URL } from '../../../utils/helper';
import { useRouter } from 'next/router';
import Select from "react-select";
import { useWindowSize } from '../../../hooks/useWindowSize';
import {toast} from 'react-toastify';
import * as Yup from 'yup';
import { Formik } from 'formik'; 
import 'react-toastify/dist/ReactToastify.css';
import { error } from 'jquery';
import Cookies from "js-cookie";


const editStaffForm = (props) => {
  const screenSize = useWindowSize();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => setIsMobile(screenSize.width <= 991), [screenSize]);
  const router = useRouter();
   var url = new URL(API_URL + router.asPath);
  var params = new URLSearchParams(url.search);
  const [id, setId] = useState(+params.get("id") || "NA");
    

  const schema = Yup.object().shape({
    // agentName: values.sname,
    // email: values.email,
    // mobile: +values.mno,
    // designation: values.designation,
    // branch: values.branch,
    // reportManager: values.rmanager,
    // group_id: values.group

    sname: Yup.string().required(" * Please enter this field"),
    email: Yup.string().required(" * Please enther the email"),
    mno: Yup.string()
      .required(" * Eneter your mobile number")
      .min(10,'* Mobile Number has to be 10 numbers')
      .max(10,'* Mobile Number can only be 10 numbers')
      .matches(/^[0-9]+$/, '*Mobile Number should only be numbers'),
    designation: Yup.string().required("*Please enter the Designation"),
    branch: Yup.string().required("* Please select a valid option"),
    rmanager: Yup.string().required("* Please select a valid option"),
    group: Yup.string().required("* Please select a valid option")    

  })


  // toast.configure()
  const [cities,setCities]=useState([]);
  const [branch,setBranch]=useState([]);
  const [rmanager, setRmanager] = useState([]);
  const [group, setGroup] = useState([]);
  const [staff, setStaff] = useState([]);
  const [initialValues, setInitialValues] = useState({});
  


  const getCities = async () => {
    const payload={market:"city"}
    const city = await fetchFormDataWithAuth(
          `${NODE_API_URL}/user/admin/destination?market=city`,
          "GET",
          null,
          null
          
    );
    setCities(city["data"]);     
  }  

  
  const getRmanager = async () => {
    
    const rmanagers = await fetchFormDataWithAuth(
          `${NODE_API_URL}/user/agent/reportManagers`,
          "GET",
          null,
          null,
          
    );    setRmanager(rmanagers["data"]);
  }

  const getBranch = async () => {
    
    const branches = await fetchFormDataWithAuth(
          `${NODE_API_URL}/user/agent/branchList`,
          "GET",
          null,
          null,
          
    );    setBranch(branches["data"]) 
  }

  const getGroup = async () => {
    
    const groups = await fetchFormDataWithAuth(
          `${NODE_API_URL}/user/agent/fetchGroups`,
          "GET",
          null,
          null,
          
    );    setGroup(groups["data"]) ;
    
  }

  const getStaff = async () => {
    
    const staffs = await fetchFormDataWithAuth(
          `${NODE_API_URL}/user/agent/agentUser?userId=${id}`,
          "GET",
          null,
          null,
          
    );
     setInitialValues(
       {
                    sname: staffs["data"]?.name || null,
                    email: staffs["data"]?.email || null,
                    // city:'',
                    mno: staffs["data"]?.mobile || null,
                    designation:staffs["data"]?.designation || null,
                    branch: staffs["data"]?.branch || null,
                    rmanager: staffs["data"]?.manager || null,
                    group: staffs["data"]?.group_id || null
        }
     )

    

  }

  useEffect(() => {
    
    getCities();
    getRmanager();
    getBranch();
    getGroup();
    getStaff();                                                                                                                                                        
  },[])


  const branchopt = branch.map((i) => ({ label: i.branch_name, value: i.branch_name }))

  const cityOptions=cities.map((i) => ({ label: i.value, value: i.value }))

  const rmanagerOptions= rmanager.map((i) => ({ label: i.name, value: i.name }))

  const groupOptions= group.map((i) => ({ label: i.role_name, value: i.role_id }))
  
  // onchange
  const values = {}

  const handleselect=(name,value)=>{
    values[name]=value.value;

  }
  const handleChange = (e) => {
    values[e.target.name]=e.target.value;
    
  }

  
console.log(group)
  const editStaff = async (values) => {
    try {
      console.log("api is being called")
     
    // e.preventDefault();
   
    const body =
    {
    agentName: values.sname,
    email: values.email,
    mobile: +values.mno,
    designation: values.designation,
    branch: values.branch,
    reportManager: values.rmanager,
    group_id: values.group,
    user_Id: id
  }

    const editstaff = await fetchFormDataWithAuth(
          `${NODE_API_URL}/user/agent/update`,
          "POST",
          null,
          { "Content-Type": "application/json" },
          JSON.stringify(body)
    );

   
 
    }
     catch(error) {
      toast.warning(error,{autoClose:3000},{position: toast.POSITION.TOP_RIGHT})
    }



    router.push('/stafflisting')
  }



  
  return (
    <>
      <div className="profile-card-wrapper">
        <div className="profile-overview-top">
          <div className="profile-overview-heading">
            <img src="/images/guest.svg" />
            <h4>&nbsp;&nbsp; Personal Information</h4>
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
          <div className="profile-form">
            <div className="profile-divider">
              <div className="width-90">
                
                <Formik
                  enableReinitialize={true}
                  validationSchema={schema}
                  onSubmit={values => {
                    editStaff(values)
                  }}
                  initialValues={initialValues}
                  
                >
                  {({ values, handleChange, setFieldValue, touched, handleBlur, errors, handleSubmit, reset }) => (
                    
                    <Form onSubmit={handleSubmit}>
                      <Form.Group>
                        <Form.Label>Name</Form.Label>
                       
                        <input className="form-control" type="text" name="sname" value={values.sname} onChange={(e) => { handleChange(e) }} placeholder="Enter Staff Name" />
                        {
                         errors['sname'] && touched['sname'] &&  <span className="text-danger">{errors['sname']}</span>
                        }
                      </Form.Group>

                      <Form.Group>
                        <Form.Label>Email ID</Form.Label>
                        <input className="form-control" type="email" name="email" value={values.email}  placeholder="Enter your email id" />
                        {
                          errors['email'] && touched['email'] && <span className="text-danger">{errors['email']}</span>
                        }
                      </Form.Group>

                      <Form.Group>
                        <Form.Label>Phone Number</Form.Label>
                        <input className="form-control" type="text" name="mno" value={values.mno} onChange={(e)=>{handleChange(e)}} placeholder="Phone Number" />
                        {
                          errors['mno'] && touched['mno'] && <span className="text-danger">{errors['mno']}</span>
                        }
                      </Form.Group>
{/* 
                      <Form.Group>
                        <Form.Label>City</Form.Label>
                        <div className="py-2" style={{ border: "1px solid #e5e5ea", borderRadius: "10px" }}>
                          <Select options={cityOptions} onChange={(e)=>setFieldValue("city",e.value)} />
                        </div>
                     
                      </Form.Group> */}

                      <Form.Group>
                        <Form.Label>Designation</Form.Label>
                        <input readOnly={!(Cookies.get('accesses') && JSON.parse(Cookies.get('accesses')).includes(1))} className="form-control" type="text" placeholder="Enter Designation" value={values.designation} name="designation"  onChange={(e)=>{handleChange(e)}}/>
                        {
                          errors['designation'] && touched['designation'] && <span className="text-danger">{errors['designation']}</span>
                        }
                      </Form.Group>

                      <Form.Group>
                        <Form.Label>Branch</Form.Label>
                        <div className="py-2" style={{ border: "1px solid #e5e5ea", borderRadius: "10px" }}>
                          <Select options={branchopt} value={values.branch ? branchopt.filter((value) => { return value.label === values.branch ? value : "" }):""} onChange={(e)=>setFieldValue("branch",e.value)}/>
                        </div>
                        {
                          errors['branch'] && touched['branch'] && <span className="text-danger">{errors['branch']}</span>
                        }
                      </Form.Group>

                      <Form.Group>
                        <Form.Label>Group</Form.Label>
                        <div className="py-2" style={{ border: "1px solid #e5e5ea", borderRadius: "10px" }}>
                          <Select options={groupOptions} value={values.group ? groupOptions.filter((value) => { return value.value === values.group ? value : "" }):""} onChange={(e)=>setFieldValue("group",e.value)} />
                        </div>
                        {
                          errors['group'] && touched['group'] && <span className="text-danger">{errors['group']}</span>
                        }
                      </Form.Group>

                      <Form.Group hidden={values.group===1}>
                        <Form.Label>Reporting Manager</Form.Label>
                        <div className="py-2" style={{ border: "1px solid #e5e5ea", borderRadius: "10px" }}>
                          <Select options={rmanagerOptions} value={values.rmanager ? rmanagerOptions.filter((value) => { return value.label === values.rmanager ? value : "" }):""} onChange={(e)=>setFieldValue("rmanager",e.value)} />
                        </div>
                        {
                          errors['rmanager'] && touched['rmanager'] && <span className="text-danger">{errors['rmanager']}</span>
                        }
                      </Form.Group>
    {/* 
                      <Form.Group>
                        <Form.Label>Address</Form.Label>
                        <input as="textarea" row={3} placeholder="Enter your Address" />
                      </Form.Group> */}
    
                      <div className="d-flex">
                        <div>
                          <button className={!isMobile?"btn btn-block btn__primary":"btn btn__primary"} type="submit" >
                            {!isMobile?<>&nbsp;&nbsp;</>:""} Update {!isMobile?<>&nbsp;&nbsp;</>:""}
                          </button>
                        </div>
                        <div>&nbsp;&nbsp;&nbsp;</div>
                        <div>
                          <button className={!isMobile?"btn btn-block btn-outline-primary":"btn btn-outline-primary"} type="reset" onClick={(e)=>{e.preventDefault(); router.push("/stafflisting")}}>
                            {!isMobile?(<>&nbsp;&nbsp;&nbsp;</>):""} Cancel {!isMobile?<>&nbsp;&nbsp;</>:""}
                          </button>
                        </div>
                      </div>
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
}

export default editStaffForm