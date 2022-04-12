import {React,useState, useEffect} from "react";
import { useRouter } from "next/router";
import PageLayout from "../../components/layouts/pageLayout";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { Container } from "react-bootstrap";
import ViewStaff from "../../components/pageComponents/staff/viewStaff";
import CircularChart from "../../components/elements/circularChart";
import {API_URL, NODE_API_URL} from '../../utils/helper';
import { fetchFormDataWithAuth } from '../../utils/apiHelper';
import withAuth from "../../utils/withAuth";

import { useWindowSize } from '../../hooks/useWindowSize';


const index = () => {
  const router = useRouter();
  const screenSize = useWindowSize();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => setIsMobile(screenSize.width <= 991), [screenSize]);


  var url = new URL(API_URL + router.asPath);
  var params = new URLSearchParams(url.search);
  const [id, setId] = useState(+params.get("id") || "NA");
  const [staff,setStaff]=useState([]);
  const [completion,setCompletion]=useState(0); //completion sattus of profile



  const completeStatus=(staff)=>{
    console.log("check staff=>",staff.name, completion)
    let temp =0;
    if(staff.name) temp+=20;
    if(staff.email) temp+=20;
    if(staff.mobile) temp+=20;
    if(staff.branch) temp+=10;
    if(staff.designation) temp+=10;
    if(staff.group_name) temp+=10;
    if(staff.manager)temp+=10;
    setCompletion(temp);


  }


  const getstaff = async() =>{
    try
    {
      const staffs = await fetchFormDataWithAuth(
          `${NODE_API_URL}/user/agent/agentUser?userId=${id}`,
          "GET",
          null,
          null,
          null
    );
      setStaff(staffs["data"])
      completeStatus(staffs.data);
    }

   catch(error)
   {
     throw new Error(error);
   } 

   
  }


  useEffect(()=>{
    setCompletion(0)
    getstaff();
    console.log("getstaff")
  }, [])


  return (
    <>
      <PageLayout title="2hub | Hotels">
        <div className="pageLayout">
          <Container>
            <br />
            <br />
            <div className="breadcrumb-wrapper">
              <Breadcrumb>
                <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
                <Breadcrumb.Item
                  onClick={() => {
                    router.push("/stafflisting");
                  }}
                >
                  User Management
                </Breadcrumb.Item>

                <Breadcrumb.Item active>Staff Profile</Breadcrumb.Item>
              </Breadcrumb>
            </div>

            <section className="addbranch__titlebranch my-2">
              <div className="d-flex ">
                  <div style={{width:"78%"}}><h5>Staff Profile</h5></div>

                  <div  onClick={()=>{router.back()}}><button style={{background:"none"}}>Back</button></div>
              </div>
            </section>
            <section className="mt-2 d-flex justify-content-center">
              {!isMobile ? (
                <div className="d-flex justify-content-between profile-card-wrapper">
                <div classname="mt-3 align-self-center">
                  <h5 className="ml-3" style={{ marginTop: "25%" }}>
                    COMPLETION STATUS
                  </h5>
                </div>
                <div>
                  <div className="single-chart">
                    <CircularChart percent={completion} />
                  </div>
                </div>
              </div>
              ): ""}
                
            </section>
            <section className="mt-2 d-flex justify-content-center">
              {/* ViewStaffForm */}
              <ViewStaff id={id} name={staff.name} mobile={staff.mobile} email={staff.email} designation={staff.designation} branch={staff.branch} group_name={staff.group_name} manager={staff.manager} />
            </section>
          </Container>
        </div>
      </PageLayout>
    </>
  );
};

export default withAuth(index);
