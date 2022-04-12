import {React, useState , useEffect} from "react";
import { useRouter } from "next/router";
import PageLayout from "../../components/layouts/pageLayout";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { API_URL } from "../../utils/helper";
import { Container } from "react-bootstrap";
import EditStaff from "../../components/pageComponents/staff/editStaffForm";
import withAuth from "../../utils/withAuth";

const index = () => {
  const router = useRouter();
    var url = window.location.search;
    var params = new URLSearchParams(url);
  const [id,setId]=useState(+params.get("id")||"NA")
  console.log("ID is=>", id);
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

                <Breadcrumb.Item active>Edit Staff</Breadcrumb.Item>
              </Breadcrumb>
            </div>

            <section className="addbranch__titlebranch my-2">
              
               <div className="d-flex ">
                  <div style={{width:"78%"}}><h5>Edit Staff</h5></div>

                  <div  onClick={()=>{router.back()}}><button style={{background:"none"}}>Back</button></div>
              </div>
            </section>
            <section className="mt-2 d-flex justify-content-center">
              {/* EditStaffForm */}
              <EditStaff id={id}/>
            </section>
          </Container>
        </div>
      </PageLayout>
    </>
  );
};

export default withAuth(index);
