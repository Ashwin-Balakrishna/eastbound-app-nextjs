import {React,useState,useEffect} from "react";
import PageLayout from "../../components/layouts/pageLayout";
import { useRouter } from "next/router";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { Container, Card, Row, Col, Table } from "react-bootstrap";
import { BiPlusMedical } from "react-icons/bi";
import BranchDetails from "../../components/pageComponents/branch/branchDetails";

import BaseLayout from '../../components/layouts/baseLayout';
import { fetchFormDataWithAuth } from '../../utils/apiHelper';
import { NODE_API_URL } from "../../utils/helper";
import { useWindowSize } from "../../hooks/useWindowSize";
import Cookies from "js-cookie";
const index = () => {
  const screenSize = useWindowSize();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => setIsMobile(screenSize.width <= 991), [screenSize]);
  const router = useRouter();
  const [branch,setBranch]= useState([])
  
  const getBranches = async() =>{
    const branches = await fetchFormDataWithAuth(
          `${NODE_API_URL}/user/agent/branchList`,
          "GET",
          null,
          null,
          null
    );
      setBranch(branches["data"]?.reverse())

    
  }

  useEffect(() => {
    getBranches();
    console.log(branch)
    },[])
  return (
    <>
      <PageLayout title="2hub | Branch Details">
        <BaseLayout title="2hub | Branch Details">
        <div className="pageLayout">
          <Container>
            <br />
            <br />
            <div className="breadcrumb-wrapper">
              <Breadcrumb>
                <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
                

                <Breadcrumb.Item active>Branch Details</Breadcrumb.Item>
              </Breadcrumb>
            </div>

            <section className="d-flex justify-content-between ">
              <div className="align-self-end">
                <h4>Branch List</h4>
              </div>

              <div className="d-flex">
              {Cookies.get('accesses')&&JSON.parse(Cookies.get('accesses')).includes(4)&&<div className="mx-2">
                  <button className="btn btn-primary" onClick={(e) => { router.push(`/branchdetails/add`) }}>
                    Add &nbsp;&nbsp;&nbsp; <BiPlusMedical fill={"white"} size={"0.80rem"} />{" "}
                  </button>
                </div>}
                
              </div>
              </section>
              <section className="mt-4 pt-3 mx-0" >
              <div className="my-2">
                <Table className="m-0 p-0" responsive>
                  <thead style={{background:"#f5f5f5"}}>
                    <tr style={{color:"#295569",fontSize:"14px"}}>
                      <th>Sno </th>
                      <th>Branch Name </th>
                      <th>Branch head</th>
                      <th>City </th>
                      <th>Address</th>
                      
                      {Cookies.get('accesses')
        && 
        (JSON.parse(Cookies.get('accesses')).includes(5) || JSON.parse(Cookies.get('accesses')).includes(6)||JSON.parse(Cookies.get('accesses')).includes(7))
        &&  <th>Action</th>}
                    </tr>
                  </thead>
                    <tbody style={{ fontSize: "12px" }}>
                      { branch?.map((branchs,i)=>{
                          return(
                          <BranchDetails
                            Sno={i+1}
                            name={branchs.branch_name?branchs.branch_name:"NA"}
                            head={branchs.branch_head?branchs.branch_head:"NA"}
                            city={branchs.city?branchs.city:"NA"}
                            // staff={"1 - 10"}
                            address={branchs.address ? branchs.address : "NA"}
                            id={branchs.branch_name?branchs.id:"NA"}
                            />
                          )
                        })}

                      
                  </tbody>
                </Table>
              </div>
            </section>
           
          </Container>
        </div>
        </BaseLayout>
      </PageLayout>
    </>
  );
};

export default index;
