import React from "react";
import { useState , useEffect} from "react";
import PageLayout from "../../components/layouts/pageLayout";
import StaffCard from "../../components/pageComponents/staff/staffListingCard";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { Container, InputGroup, Form, Table } from "react-bootstrap";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useRouter } from "next/router";
import { BiPlusMedical } from "react-icons/bi";
import { useWindowSize } from "../../hooks/useWindowSize";
import Cookies from "js-cookie";
import BaseLayout from '../../components/layouts/baseLayout';
import { fetchFormDataWithAuth  } from '../../utils/apiHelper';
import { getSessionToken,NODE_API_URL } from '../../utils/helper';
import withAuth from "../../utils/withAuth";

const index = () => {
  const screenSize = useWindowSize();

  const [isMobile, setIsMobile] = useState(false);
  const [name,setName]=useState("");



useEffect(() => setIsMobile(screenSize.width <= 991), [screenSize]);
  const [staff,setStaff]=useState([])

  const getstaff = async (names) => {
    
    const staffs = await fetchFormDataWithAuth(
          `${NODE_API_URL}/user/agent/list?name=${names || ""}`,
          "GET",
          null,
          null,
          null
    );
  
    setStaff(staffs["data"]);

      
  }

    const searchlist=()=>{

    getstaff(name);

  }

  useEffect(() => {
    getstaff();
  },[])
  const router = useRouter();
  return (
    <>
      <PageLayout title="2hub | Hotels">
        <BaseLayout title="2hub | Hotels">
        <div className="pageLayout">
          <Container>
            <br />
            <br />
            <div className="breadcrumb-wrapper">
              <Breadcrumb>
                <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
                <Breadcrumb.Item active> Staff </Breadcrumb.Item>

              </Breadcrumb>
            </div>

            <section className="addbranch__titlebranch my-2">
              <h4>Staff List</h4>
            </section>
          <section style={{ border:"1px solid #ebebeb", borderRadius:"15px"}} className="px-1">
            <div>
              <div className="mt-3">
                {/* Search */}
                <div  className={!isMobile?"d-flex":"Row"}>
                  
                    <div className={!isMobile?"":"Row"}>
                      {/* <SearchField classNames="test-class" onChange={(e)=>{setName(e)}} onSearchClick={searchlist} placeholder="Search by name"  />         */}
                      <div className="search-fields d-flex justify-content-between my-2" >
                        <div>
                          <Form.Control type="text" style={{border:"none"}} onChange={(e)=>{setName(e.target.value);}}  value={name} placeholder="Search by name..." />
                        </div>
                        <div className="search-holder px-2 py-2 d-flex">
                          <div className="px-1" style={{background:"none"}}>
                             <FaTimes  color={name.length<1?"#FFFFFF":"#295569"} size="1rem" onClick={()=>{setName("");getstaff("")}}/>  
                          </div> 
                          <div className="px-1" style={{background:"none"}}>
                            <FaSearch  color="#f26c3f" size="1rem" onClick={searchlist} style={{ cursor:"pointer",background:"#FFFFFF"}} />  
                          </div> 
                          
                        </div>
                        
                      </div>
                    </div>
                    
                   {Cookies.get('accesses')&&JSON.parse(Cookies.get('accesses')).includes(4)&& <div className={!isMobile?"":"Row mt-2 ml-0"}>
                      <button className={!isMobile?"btn btn-primary mx-4 pr-4 my-2":"btn btn-primary mx-0 my-2"} onClick={(e)=>{router.push('/staffadd')}}>
                        Add &nbsp;&nbsp; <BiPlusMedical fill={"white"} size={"0.80rem"} />
                      </button>
                    </div>}

                  {/* <div className="align-content-end">
                    <button className="btn btn-outline-secondary">Back</button>
                  </div> */}
                </div>
              </div>
            </div>
            <section className="mt-4 pt-3 mx-0" >
              <div className="my-2">
                <Table className="m-0 p-0" responsive>
                  <thead style={{background:"#f5f5f5"}}>
                    <tr style={{color:"#295569",fontSize:"13px"}}>
                      <th>Sno</th>
                      <th>Name </th>
                      <th>Designation</th>
                      <th>Email</th>
                      <th>Phone</th>
                      {/* <th>Dept</th> */}
                      <th>Branch</th>
                      <th>Reportingto</th>
                      <th>Group</th>
                      {Cookies.get('accesses')
        && 
        (JSON.parse(Cookies.get('accesses')).includes(5) || JSON.parse(Cookies.get('accesses')).includes(6)||JSON.parse(Cookies.get('accesses')).includes(7))
        &&  <th>Action</th>}
                    </tr>
                  </thead>
                  <tbody style={{fontSize:"12px"}}>
                    {staff?.map((staffs,i)=>{
                      return(
                    <StaffCard
                      Sno={i+1}
                      name={staffs.name}
                      id={staffs.agent_id ? staffs.agent_id : "00000"}
                      agency_id={staffs.agency_id?staffs.agency_id:"00000"}
                      designation={staffs.designation}
                      email={staffs.email}
                      mno={staffs.mobile}
                      // dept={"Bookings"}
                      city={staffs.branch}
                      rmanager={staffs.manager}
                      group={staffs.group_name}
                    />
                    )})}
                    

                    {/* <StaffCard
                      Sno={2}
                      name={"User 2 Staff"}
                      id={"ID-XXXXXXXXXX"}
                      designation={"Manager"}
                      email={"Managerstaff1@gamil.com"}
                      mno={9999000011}
                      dept={"Bookings"}
                      city={"Abu Dabhi"}
                      rmanager={"Mohit Jain"}
                      group={"Sales"}
                    />

                    <StaffCard
                      Sno={3}
                      name={"User 3 Staff"}
                      id={"ID-XXXXXXXXXX"}
                      designation={"Manager"}
                      email={"Managerstaff1@gamil.com"}
                      mno={9999000011}
                      dept={"Bookings"}
                      city={"Madhya Pradesh"}
                      rmanager={"Mohit Jain"}
                      group={"Sales"}
                    /> */}
                  </tbody>
                </Table>
              </div>
            </section>
          </section>
            {/* Table */}
          </Container>
          </div>
        </BaseLayout>
      </PageLayout>
    </>
  );
};

export default withAuth(index);
