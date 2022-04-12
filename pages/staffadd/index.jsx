import React from "react";
import PageLayout from "../../components/layouts/pageLayout";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { Container } from "react-bootstrap";
import {useRouter} from 'next/router';
import AddStaff from "../../components/pageComponents/staff/addStaffForm";
import BaseLayout from '../../components/layouts/baseLayout';
import withAuth from "../../utils/withAuth";
const index = () => {
  const router=useRouter();
  return (
    <>
      <PageLayout title="2hub | Hotels">
        <BaseLayout>
        <div className="pageLayout">
          <Container>
            <br />
            <br />
            <div className="breadcrumb-wrapper">
              <Breadcrumb>
                <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
                <Breadcrumb.Item
                  onClick={() => {
                    router.back();
                  }}
                >
                  User Management
                </Breadcrumb.Item>

                <Breadcrumb.Item active>Add Staff</Breadcrumb.Item>
              </Breadcrumb>
            </div>

            <section className="addbranch__titlebranch my-2">
                <div className="d-flex ">
                  <div style={{width:"80%"}}><h5>Add Staff</h5></div>

                  <div  onClick={()=>{router.push(`/stafflisting`)}}><button style={{background:"none"}}>Back</button></div>
              </div>
            </section>
            <section className="mt-2 d-flex justify-content-center">
              {/* AddStaffForm */}
              <AddStaff />
            </section>
          </Container>
          </div>
          </BaseLayout>
      </PageLayout>
    </>
  );
};

export default withAuth(index);
